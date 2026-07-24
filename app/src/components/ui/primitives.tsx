import { cn, statusColor, statusLabel } from '../../lib/utils'

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]',
      'bg-flame-500/10 text-flame-700 ring-1 ring-flame-400/30',
      className,
    )}>
      <span className="size-1.5 rounded-full bg-flame-500" />
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
  const base = 'inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none'
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-3 text-sm', lg: 'px-7 py-4 text-base' }
  const variants = {
    primary: 'bg-flame-500 text-white hover:bg-teal-900 shadow-[0_8px_24px_-8px_rgba(249,98,22,0.55)] hover:shadow-[0_10px_28px_-8px_rgba(7,80,89,0.55)]',
    secondary: 'bg-teal-900 text-white hover:bg-teal-800',
    outline: 'bg-white text-teal-900 ring-1 ring-teal-900/15 hover:bg-mist',
    ghost: 'text-teal-900 hover:bg-mist',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  }
  return <button className={cn(base, sizes[size], variants[variant], className)} {...props}>{children}</button>
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-card bg-white ring-1 ring-black/5 shadow-[0_24px_60px_-32px_rgba(7,80,89,0.18)]', className)}>
      {children}
    </div>
  )
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-flame-600', className)}>
    <span className="size-1.5 rounded-full bg-flame-500" />
    {children}
  </span>
}

export function SectionHeading({ label, title, intro, className, align = 'center' }: { label?: string; title: string; intro?: string; className?: string; align?: 'center' | 'left' }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : '', className)}>
      {label && <SectionLabel className={align === 'center' ? 'mx-auto' : ''}>{label}</SectionLabel>}
      <h2 className="mt-4 text-balance text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.08] text-teal-950">{title}</h2>
      {intro && <p className="mt-5 text-base md:text-lg text-ink-600 leading-relaxed text-balance">{intro}</p>}
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block size-5 rounded-full border-2 border-teal-200 border-t-teal-700 animate-spin', className)} />
  )
}

export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card bg-mist p-12 text-center ring-1 ring-black/5">
      {icon && <div className="mb-4 text-teal-800">{icon}</div>}
      <p className="font-semibold text-teal-950">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-600 max-w-md">{hint}</p>}
    </div>
  )
}
