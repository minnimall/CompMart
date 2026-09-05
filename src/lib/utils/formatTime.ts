export function formatMessageTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    if (isYesterday) {
        return `เมื่อวาน ${date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`
    }

    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) +
        ' ' + date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// สำหรับแสดงเวลาใหม่ (ถ้าเปลี่ยนแปลง live)
export function isNewMessage(dateString: string, thresholdMinutes = 5): boolean {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60)
    return diffMinutes < thresholdMinutes
}