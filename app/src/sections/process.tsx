import { motion } from 'framer-motion'
import { fadeUp, staggerParent, viewport } from '../lib/motion'
import { SectionLabel } from './_section'

const steps = [
  { n: '01', t: 'Book & Dispatch', d: 'Generate a tracking number, schedule pickup, and your containers enter our network within hours.' },
  { n: '02', t: 'Transit & Tracking', d: 'Cargo is continuously tracked by IoT — visible location, temperature, ETA and checkpoints.' },
  { n: '03', t: 'Customs & Duty', d: 'We handle documentation and notify you of any duty or fees with transparent line items.' },
  { n: '04', t: 'Last Mile Delivery', d: 'Door-to-door final leg by bonded partners with photo proof on delivery.' },
]

export function Process() {
  return (
    <section className="relative bg-dtl-light-gray py-28 overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel className="mx-auto">How it works</SectionLabel>
          <h2 className="mt-4 text-4xl lg:text-[3rem] font-bold text-dtl-black leading-[1.08] text-balance">
            From your door to their door, in four precise moves.
          </h2>
        </div>

        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport}
          className="mt-16 grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.n} variants={fadeUp} custom={i} className="relative">
              <div className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-card bg-dtl-black text-dtl-yellow text-xl font-bold ring-4 ring-dtl-light-gray">
                  {s.n}
                </span>
                {i < steps.length - 1 && (
                  <svg viewBox="0 0 80 12" className="w-full h-3 text-dtl-border" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="0" y1="6" x2="80" y2="6" strokeDasharray="6 6" />
                  </svg>
                )}
              </div>
              <h3 className="mt-5 text-xl font-bold text-dtl-black">{s.t}</h3>
              <p className="mt-2 text-base text-dtl-charcoal leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}