export function getCategoryIcon(slug: string) {
    const s = slug.toLowerCase()

    if (s.includes('cpu')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="6" y="6" width="12" height="12" rx="1.5" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </svg>
        )
    }
    if (s.includes('gpu') || s.includes('การ์ดจอ') || s.includes('graphic')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="7" width="18" height="10" rx="1.5" />
            <circle cx="8" cy="12" r="2" />
            <circle cx="15" cy="12" r="2" />
            <path d="M3 17v2M7 17v2" />
        </svg>
        )
    }
    if (s.includes('mouse') || s.includes('เมาส์')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="7" y="3" width="10" height="18" rx="5" />
            <path d="M12 3v6" />
        </svg>
        )
    }
    if (s.includes('keyboard') || s.includes('คีย์บอร์ด')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="6" width="20" height="12" rx="1.5" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h8" />
        </svg>
        )
    }
    if (s.includes('ram') || s.includes('แรม')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="8" width="18" height="8" rx="1" />
            <path d="M6 8v8M10 8v8M14 8v8M18 8v8" />
        </svg>
        )
    }
    if (s.includes('laptop') || s.includes('โน้ตบุ๊ค') || s.includes('notebook')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="4" width="16" height="11" rx="1.5" />
            <path d="M2 19h20" />
        </svg>
        )
    }
    if (s.includes('desktop') || s.includes('pc') || s.includes('คอมพิวเตอร์เซ็ต')) {
        return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="4" width="14" height="16" rx="1.5" />
            <circle cx="11" cy="17" r="0.5" fill="currentColor" />
        </svg>
        )
    }
    // default fallback
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
    )
}