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
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-text">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70">
          {icon}
        </span>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border-0 bg-surface-2 py-3.5 pl-12 pr-4 text-text outline-none transition
            shadow-[inset_4px_4px_10px_rgba(20,80,143,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.85)]
            focus:shadow-[inset_2px_2px_6px_rgba(20,80,143,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.9)]
            focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  )
}