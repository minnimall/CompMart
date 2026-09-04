// utils/formatTime.ts
export function formatMessageTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    
    // คำนวณความห่างวันทั้งวัน
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffTime = today.getTime() - messageDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    
    const pad = (n: number) => n.toString().padStart(2, '0')
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`
    
    // ถ้าเป็นวันนี้
    if (diffDays === 0) {
        return timeStr
    }
    
    // ถ้าเป็นเมื่อวาน
    if (diffDays === 1) {
        return `เมื่อวาน ${timeStr}`
    }
    
    // ถ้านานกว่า 7 วันให้แสดงวันที่
    if (diffDays > 7) {
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
        const year = date.getFullYear() === now.getFullYear() ? '' : ` ${date.getFullYear()}`
        return `${date.getDate()} ${months[date.getMonth()]}${year}`
    }
    
    // ในช่วง 2-7 วัน
    const daysAgo = Math.floor(diffDays)
    if (daysAgo === 2) return `2 วันที่แล้ว ${timeStr}`
    return `${daysAgo} วันที่แล้ว ${timeStr}`
}

// สำหรับแสดงเวลาใหม่ (ถ้าเปลี่ยนแปลง live)
export function isNewMessage(dateString: string, thresholdMinutes = 5): boolean {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60)
    return diffMinutes < thresholdMinutes
}