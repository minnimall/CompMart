'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sendMessage, markConversationRead } from '@/lib/actions/conversations'

interface Message {
    id: string
    sender_id: string
    content: string
    created_at: string
}

export function MessageThread({
    conversationId,
    currentUserId,
    initialMessages,
}: {
    conversationId: string
    currentUserId: string
    initialMessages: Message[]
}) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [isPending, startTransition] = useTransition()
    const bottomRef = useRef<HTMLDivElement>(null)

    // อ่านข้อความทั้งหมดตอนเปิดห้องแชท
    useEffect(() => {
        markConversationRead(conversationId)
    }, [conversationId])

    // Subscribe realtime — ฟังข้อความใหม่ที่เข้ามาในห้องนี้
    useEffect(() => {
        const supabase = createClient()
        const channel = supabase
        .channel(`messages:${conversationId}`)
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
        .subscribe()

        return () => {
        supabase.removeChannel(channel)
        }
    }, [conversationId, currentUserId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        const content = input.trim()
        if (!content || isPending) return
        setInput('')
        startTransition(() => {
        sendMessage(conversationId, content)
        })
    }

    return (
        <div className="flex h-[70vh] flex-col rounded-2xl bg-surface shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-text-muted">เริ่มต้นการสนทนาได้เลย</p>
            )}
            {messages.map((m) => {
            const isMine = m.sender_id === currentUserId
            return (
                <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                        ? 'bg-primary text-white'
                        : 'bg-surface-2 text-text'
                    }`}
                >
                    {m.content}
                </div>
                </div>
            )
            })}
            <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 border-t border-border p-3">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
                }
            }}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />
            <button
            onClick={handleSend}
            disabled={!input.trim() || isPending}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
            ส่ง
            </button>
        </div>
        </div>
    )
}