interface AuthInputProps {
    label: string
    name: string
    type?: string
    required?: boolean
    minLength?: number
    autoComplete?: string
    icon: React.ReactNode
}

export function AuthInput({
    label,
    name,
    type = 'text',
    required,
    minLength,
    autoComplete,
    icon,
}: AuthInputProps) {
    return (
        <div>
        <label
            htmlFor={name}
            className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted"
        >
            {label}
        </label>
        <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
            </span>
            <input
            id={name}
            name={name}
            type={type}
            required={required}
            minLength={minLength}
            autoComplete={autoComplete}
            className="w-full rounded-lg border border-border bg-surface-2 py-3 pl-11 pr-4 text-text placeholder:text-text-muted/50 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
        </div>
        </div>
    )
}