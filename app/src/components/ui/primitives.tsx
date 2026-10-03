import { cn, statusColor, statusLabel } from '../../lib/utils'

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]',
      'bg-dtl-yellow/10 text-dtl-black ring-1 ring-dtl-yellow/30',
      className,
    )}>
      <span className="size-1.5 rounded-full bg-dtl-yellow" />
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold ring-1',
      statusColor(status),
    )}>
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {statusLabel(status)}
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'; size?: 'sm' | 'md' | 'lg' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-3 text-sm', lg: 'px-7 py-4 text-base' }
  const variants = {
    primary: 'bg-dtl-yellow text-dtl-black hover:bg-[#e6b800] focus:ring-dtl-yellow/40 shadow-[0_8px_24px_-8px_rgba(255,204,0,0.45)] hover:shadow-[0_10px_28px_-8px_rgba(255,204,0,0.55)]',
    secondary: 'bg-dtl-red text-white hover:bg-[#b8040e] focus:ring-dtl-red/40 shadow-[0_8px_24px_-8px_rgba(212,5,17,0.45)] hover:shadow-[0_10px_28px_-8px_rgba(212,5,17,0.55)]',
    outline: 'bg-white text-dtl-black ring-1 ring-dtl-border hover:bg-dtl-light-gray focus:ring-dtl-yellow/40',
    ghost: 'text-dtl-black hover:bg-dtl-light-gray focus:ring-dtl-yellow/40',
    danger: 'bg-dtl-red text-white hover:bg-[#b8040e] focus:ring-dtl-red/40',
  }
  return <button className={cn(base, sizes[size], variants[variant], className)} {...props}>{children}</button>
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-card bg-white ring-1 ring-dtl-border shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]', className)}>
      {children}
    </div>
  )
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-dtl-red', className)}>
    <span className="size-1.5 rounded-full bg-dtl-red" />
    {children}
  </span>
}

export function SectionHeading({ label, title, intro, className, align = 'center' }: { label?: string; title: string; intro?: string; className?: string; align?: 'center' | 'left' }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : '', className)}>
      {label && <SectionLabel className={align === 'center' ? 'mx-auto' : ''}>{label}</SectionLabel>}
      <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.08] text-dtl-black">{title}</h2>
      {intro && <p className="mt-5 text-base md:text-lg text-dtl-charcoal leading-relaxed text-balance">{intro}</p>}
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block size-5 rounded-full border-2 border-dtl-border border-t-dtl-yellow animate-spin', className)} />
  )
}

export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-dtl-light-gray p-12 text-center ring-1 ring-dtl-border">
      {icon && <div className="mb-4 text-dtl-charcoal">{icon}</div>}
      <p className="font-semibold text-dtl-black">{title}</p>
      {hint && <p className="mt-1 text-sm text-dtl-charcoal max-w-md">{hint}</p>}
    </div>
  )
}

export function Input({
  className,
  type = 'text',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { type?: string }) {
  return (
    <input
      type={type}
      className={cn(
        'w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm text-dtl-black placeholder:text-dtl-charcoal/50',
        'focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40 focus:border-dtl-yellow',
        'disabled:bg-dtl-light-gray disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm text-dtl-black placeholder:text-dtl-charcoal/50',
        'focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40 focus:border-dtl-yellow',
        'disabled:bg-dtl-light-gray disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm text-dtl-black',
        'focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40 focus:border-dtl-yellow',
        'disabled:bg-dtl-light-gray disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('block text-xs font-semibold text-dtl-charcoal mb-1.5', className)} {...props}>
      {children}
    </label>
  )
}