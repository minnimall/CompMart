interface AuthInputProps {
    label: string
    name: string
    type?: string
    required?: boolean
    minLength?: number
    autoComplete?: string
    defaultValue?: string
    icon?: React.ReactNode
}

export function AuthInput({
    label,
    name,
    type = 'text',
    required,
    minLength,
    autoComplete,
    defaultValue,
    icon,
}: AuthInputProps) {
    return (
        <div>
        <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-text">
            {label}
        </label>
        <div className="relative">
            {icon && (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/70">
                    {icon}
                </span>
            )}
            <input
            id={name}
            name={name}
            type={type}
            required={required}
            minLength={minLength}
            autoComplete={autoComplete}
            defaultValue={defaultValue}
            className="h-[42px] w-full rounded-xl border-0 bg-surface-2 px-3.5 text-sm text-text outline-none transition shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:ring-2 focus:ring-primary/25 dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
            style={icon ? { paddingLeft: '2.75rem' } : {}}
            />
        </div>
        </div>
    )
}