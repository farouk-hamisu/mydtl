export function Partners() {
  const partners = [
    'AeroGlobal', 'NorthPort', 'CargoJet', 'OceanLink', 'FedForward', 'SkyCargo', 'PacLink', 'Transeuro',
  ]
  const loop = [...partners, ...partners]
  return (
    <section className="bg-white pt-24 pb-12">
      <div className="mx-auto max-w-[1320px] px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-ink-600">Trusted by global freight networks</p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex gap-16 w-max animate-marquee">
            {loop.map((name, i) => (
              <div key={i} className="flex items-center gap-3 text-teal-900/60">
                <span className="grid size-9 place-items-center rounded-lg bg-teal-950 text-flame-500">
                  <svg viewBox="0 0 24 24" className="size-5"><path fill="currentColor" d="M14 6 L20 12 L14 18 V14 L4 14 V10 L14 10 Z" transform="rotate(180 12 12)"/></svg>
                </span>
                <span className="text-2xl font-bold tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
