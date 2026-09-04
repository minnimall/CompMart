'use client'

import { useEffect, useRef, useState, useTransition, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage, markConversationRead, deleteMessage } from '@/lib/actions/conversations'
import { formatMessageTime } from '@/lib/utils/formatTime'

interface Sender {
    username: string
    avatar_url: string | null
}

interface Message {
    id: string
    sender_id: string
    content: string
    created_at: string
    sender?: Sender | null
}

export function MessageThread({
    conversationId,
    currentUserId,
    initialMessages,
    currentUserAvatar,
}: {
    conversationId: string
    currentUserId: string
    initialMessages: Message[]
    currentUserAvatar?: string | null
}) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [isPending, startTransition] = useTransition()
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null)
    
    const bottomRef = useRef<HTMLDivElement>(null)
    const subscriptionRef = useRef<any>(null)

    useEffect(() => {
        markConversationRead(conversationId)
    }, [conversationId])

    useEffect(() => {
        const supabase = createClient()

        if (subscriptionRef.current) {
            supabase.removeChannel(subscriptionRef.current)
        }

        const channel = supabase
            .channel(`messages:${conversationId}`, {
                config: { broadcast: { self: true } }
            })
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === newMessage.id)) return prev
                        return [...prev, newMessage]
                    })
                    if (newMessage.sender_id !== currentUserId) {
                        markConversationRead(conversationId)
                    }
                }
            )
            .subscribe((status) => {
                console.log(`Channel status: ${status}`)
            })

        subscriptionRef.current = channel

        return () => {
            if (subscriptionRef.current) {
                supabase.removeChannel(subscriptionRef.current)
            }
        }
    }, [conversationId, currentUserId])

    useEffect(() => {
        const timer = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 0)
        return () => clearTimeout(timer)
    }, [messages])

    const handleSend = useCallback(() => {
        const content = input.trim()
        if (!content || isPending) return
        setInput('')
        startTransition(() => {
            sendMessage(conversationId, content).catch(err => {
                console.error('Error sending message:', err)
            })
        })
    }, [conversationId, input, isPending])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    const handleDeleteClick = useCallback((messageId: string) => {
        setMessageToDeleteId(messageId)
        setIsConfirmOpen(true)
    }, [])

    const handleConfirmDelete = useCallback(async () => {
        if (!messageToDeleteId) return

        setDeletingMessageId(messageToDeleteId)
        setIsConfirmOpen(false)
        
        try {
            await deleteMessage(messageToDeleteId)
            setMessages((prev) => prev.filter((m) => m.id !== messageToDeleteId))
            setHoveredMessageId(null)
        } catch (error) {
            console.error('Error deleting message:', error)
            alert('ลบข้อความไม่สำเร็จ')
        } finally {
            setDeletingMessageId(null)
            setMessageToDeleteId(null)
        }
    }, [messageToDeleteId])

    const handleCancelDelete = useCallback(() => {
        setIsConfirmOpen(false)
        setMessageToDeleteId(null)
    }, [])

    const shouldShowAvatar = (currentIndex: number): boolean => {
        const currentMsg = messages[currentIndex]
        const nextMsg = messages[currentIndex + 1]
        
        if (!nextMsg) return true
        if (nextMsg.sender_id !== currentMsg.sender_id) return true
        if (new Date(nextMsg.created_at).getTime() - new Date(currentMsg.created_at).getTime() > 5 * 60 * 1000) return true
        return false
    }

    interface MessageGroup {
        senderId: string
        messages: Message[]
        sender?: Sender | null
    }

    const messageGroups = messages.reduce((groups: MessageGroup[], msg: Message, index: number) => {
        const lastGroup = groups[groups.length - 1]
        const showAvatar = shouldShowAvatar(index)
        
        if (!lastGroup || lastGroup.senderId !== msg.sender_id || showAvatar) {
            groups.push({
                senderId: msg.sender_id,
                messages: [msg],
                sender: msg.sender,
            })
        } else {
            lastGroup.messages.push(msg)
        }
        return groups
    }, [])

    return (
        <>
            <div className="flex h-[70vh] flex-col rounded-2xl bg-surface shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messages.length === 0 && (
                        <p className="py-10 text-center text-sm text-text-muted">เริ่มต้นการสนทนาได้เลย</p>
                    )}

                    {/* Render message groups with avatars */}
                    {messageGroups.map((group: MessageGroup, groupIndex: number) => {
                        const isMine = group.senderId === currentUserId
                        const avatar = isMine ? currentUserAvatar : group.sender?.avatar_url
                        const username = group.sender?.username

                        return (
                            <div key={`group-${groupIndex}`} className={`flex gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                {/* Avatar for other users */}
                                {!isMine && (
                                    <div className="mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-surface-2">
                                        {avatar && (
                                            <img
                                                src={avatar}
                                                alt={username || 'user'}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Messages container */}
                                <div className={`flex max-w-[75%] flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                    {!isMine && (
                                        <p className="mb-1 text-xs font-medium text-text-muted">{username}</p>
                                    )}

                                    {/* Messages */}
                                    <div className="space-y-1">
                                        {group.messages.map((m: Message, msgIndex: number) => (
                                            <div key={m.id}>
                                                {/* Show timestamp between message groups if time gap > 5 min */}
                                                {msgIndex === 0 && groupIndex > 0 && (
                                                    (() => {
                                                        const prevGroup = messageGroups[groupIndex - 1]
                                                        const prevMsg = prevGroup.messages[prevGroup.messages.length - 1]
                                                        const timeDiff = new Date(m.created_at).getTime() - new Date(prevMsg.created_at).getTime()
                                                        
                                                        if (timeDiff > 5 * 60 * 1000) {
                                                            return (
                                                                <p className="py-2 text-center text-xs text-text-muted">
                                                                    {formatMessageTime(m.created_at)}
                                                                </p>
                                                            )
                                                        }
                                                        return null
                                                    })()
                                                )}

                                                <div
                                                    className="group/msg relative flex items-center gap-2"
                                                    onMouseEnter={() => setHoveredMessageId(m.id)}
                                                    onMouseLeave={() => setHoveredMessageId(null)}
                                                >
                                                    <div
                                                        className={`group rounded-2xl px-4 py-2 text-sm transition ${
                                                            isMine
                                                                ? 'bg-primary text-white'
                                                                : 'bg-surface-2 text-text'
                                                        }`}
                                                    >
                                                        {m.content}
                                                        <span className={`ml-2 inline-block text-[11px] opacity-70 whitespace-nowrap`}>
                                                            {new Date(m.created_at).getHours().toString().padStart(2, '0')}:
                                                            {new Date(m.created_at).getMinutes().toString().padStart(2, '0')}
                                                        </span>
                                                    </div>

                                                    {isMine && hoveredMessageId === m.id && (
                                                        <button
                                                            onClick={() => handleDeleteClick(m.id)}
                                                            disabled={deletingMessageId === m.id}
                                                            className="shrink-0 rounded-full p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-red-500 disabled:opacity-50"
                                                            title="ลบข้อความ"
                                                        >
                                                            {deletingMessageId === m.id ? (
                                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Avatar for current user (right side) */}
                                {isMine && (
                                    <div className="mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full bg-surface-2">
                                        {currentUserAvatar && (
                                            <img
                                                src={currentUserAvatar}
                                                alt="you"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <div ref={bottomRef} />
                </div>

                <div className="flex items-center gap-2 border-t border-border p-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="พิมพ์ข้อความ..."
                        className="flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isPending}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'ส่ง...' : 'ส่ง'}
                    </button>
                </div>
            </div>

            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl bg-surface p-6 dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
                        <h3 className="text-lg font-semibold text-text">ลบข้อความ</h3>
                        
                        <p className="mt-2 text-sm text-text-muted">
                            คุณต้องการลบข้อความนี้ใช่ไหม? การดำเนินการนี้ไม่สามารถเลิกทำได้
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 rounded-xl border-2 border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-surface-2"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}