export function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={className}>{children}</section>
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-pill bg-dtl-yellow/10 text-dtl-red ring-1 ring-dtl-yellow/30 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${className ?? ''}`}>
      <span className="size-1.5 rounded-full bg-dtl-red" /> {children}
    </span>
  )
}