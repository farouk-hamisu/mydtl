import { motion } from 'framer-motion'
import { BarChart3, Headset, ShieldCheck, MapPinned, Globe2, Wallet } from 'lucide-react'
import { fadeUp, staggerParent, viewport } from '../lib/motion'
import { SectionLabel } from './_section'

const reasons = [
  { icon: MapPinned, t: 'Pin-point live tracking', d: 'Live coordinates, ETA updates, and contextual checkpoints that match what your customer service team sees.' },
  { icon: ShieldCheck, t: 'Customs handled end-to-end', d: 'Bonded warehousing, brokers, and digital duty management built directly into your shipment flow.' },
  { icon: Wallet, t: 'Pay duties online', d: 'USDT (TRC20) and ACH accepted, with receipt upload and verified workflows for finance teams.' },
  { icon: BarChart3, t: 'Operational analytics', d: 'Shipment KPIs, customs time, and discount routes surfaced in one customer dashboard.' },
  { icon: Headset, t: '24/7 dispatch desk', d: 'A real human, a direct line. Anything between booking and delivery can be re-routed at any hour.' },
  { icon: Globe2, t: 'Goods everywhere', d: 'A network covering 190+ countries with the same SDK-grade tracking across air, sea, and road.' },
]

export function WhyChoose() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel className="mx-auto">Why SpeedFlightz</SectionLabel>
          <h2 className="mt-4 text-4xl lg:text-[3rem] font-bold text-teal-950 leading-[1.08] text-balance">
            Built for shippers who treat freight like craft.
          </h2>
          <p className="mt-5 text-base text-ink-600 leading-relaxed">
            We obsess over operational hygiene so you can ship with conviction — and prove it to your customers.
          </p>
        </div>

        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => {
            const Icon = r.icon
            return (
              <motion.div key={r.t} variants={fadeUp} custom={i}
                className="group relative rounded-card bg-mist ring-1 ring-black/5 px-7 py-8 hover:bg-white hover:shadow-[0_40px_120px_-40px_rgba(7,80,89,0.4)] transition-all duration-300">
                <span className="absolute right-6 top-6 text-teal-900/10 font-mono text-2xl font-bold">0{i+1}</span>
                <span className="grid size-14 place-items-center rounded-card bg-teal-950 text-flame-500 ring-4 ring-white">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-teal-950">{r.t}</h3>
                <p className="mt-2 text-base text-ink-600 leading-relaxed">{r.d}</p>
                <div className="mt-5 h-0.5 w-10 bg-flame-500 rounded-full group-hover:w-20 transition-all duration-300" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
