import { motion } from 'framer-motion'
import { fadeUp, staggerParent, viewport } from '../lib/motion'
import { SectionLabel } from './_section'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { initials } from '../lib/utils'

export function Testimonials() {
  const { testimonials } = useSiteSettings()
  const items = testimonials.length ? testimonials : [
    { id: '1', author: 'Marcus Holloway', role: 'Head of Procurement', company: 'NorthBrew Imports', avatar_url: null, quote: 'SpeedFlightz moved our cold-chain containers across three borders with full visibility. The live map alone won them a permanent place on our vendor list.', rating: 5 },
    { id: '2', author: 'Adaeze Okeke', role: 'Logistics Director', company: 'Sahara Distributors', avatar_url: null, quote: 'They cleared customs faster than any partner we have used, and the dashboard made our finance team happy.', rating: 5 },
    { id: '3', author: 'Tomás Reyes', role: 'Founder', company: 'Reyes Textiles', avatar_url: null, quote: 'I could see exactly where my container was at all times. The payment flow for duties turned a usually painful process into a few clicks.', rating: 5 },
  ] as any

  return (
    <section className="relative bg-teal-950 text-white py-28 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-25" />

      <div className="relative mx-auto max-w-[1320px] px-6">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel className="mx-auto">Client voices</SectionLabel>
          <h2 className="mt-4 text-4xl lg:text-[3rem] font-bold leading-[1.08] text-balance">Shipping teams that switched to SpeedFlightz.</h2>
        </div>

        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport}
          className="mt-16 grid lg:grid-cols-3 gap-6">
          {items.map((t: any, i: number) => (
            <motion.article key={t.id ?? i} variants={fadeUp} custom={i}
              className="relative rounded-card bg-white/5 ring-1 ring-white/10 p-7 flex flex-col">
              <div className="absolute right-6 top-5 text-flame-500/40 text-7xl font-serif leading-none">“</div>
              <div className="flex gap-0.5 mb-4 text-flame-400">
                {Array.from({ length: 5 }).map((_, k) => (
                  <svg key={k} viewBox="0 0 24 24" className="size-4" fill={k < (t.rating ?? 5) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 17.3l-6.1 3.7 1.6-7L2 9.6l7-.6L12 2l3 7 4.5.6-4.5 4.4 1.5 7zM12 14h.01" />
                  </svg>
                ))}
              </div>
              <p className="text-base leading-relaxed text-teal-50/90">“{t.quote}”</p>
              <footer className="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="grid size-11 place-items-center rounded-full bg-flame-500 text-white font-bold text-sm">
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.author} className="size-11 rounded-full object-cover" /> : initials(t.author)}
                </div>
                <div>
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-xs text-teal-200/80">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                </div>
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
