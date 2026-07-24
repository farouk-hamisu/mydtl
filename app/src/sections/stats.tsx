import { motion } from 'framer-motion'
import { AnimatedCounter } from '../components/ui/counter'
import { fadeUp, staggerParent, viewport } from '../lib/motion'

const stats = [
  { label: 'Countries served', value: 190, suffix: '+', decimals: 0, sub: 'Door-to-door network' },
  { label: 'Shipments delivered', value: 1.4, suffix: 'M+', decimals: 1, sub: 'Across all modes' },
  { label: 'On-time performance', value: 98.7, suffix: '%', decimals: 1, sub: 'Tracked live' },
  { label: 'Average customs time', value: 6, suffix: 'h', decimals: 0, sub: 'Per major port' },
]

export function Stats() {
  return (
    <section className="relative bg-teal-950 text-white py-32 overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-30" />

      <div className="relative mx-auto max-w-[1320px] px-6">
        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport}
          className="grid md:grid-cols-4 gap-6 -mt-40">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp} custom={i}
              className="relative rounded-card bg-white/5 ring-1 ring-white/10 pl-7 pr-5 py-9 overflow-hidden"
            >
              <span className="absolute right-0 top-0 text-flame-500/40 font-mono text-7xl px-3 leading-none opacity-50">0{i+1}</span>
              <p className="text-4xl lg:text-5xl font-bold text-white">
                <AnimatedCounter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-flame-400">{s.label}</p>
              <p className="mt-1 text-sm text-teal-200/80">{s.sub}</p>
              <div className="mt-4 h-1 w-12 rounded-full bg-flame-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
