import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowDownRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, slideInLeft, slideInRight, staggerParent, viewport } from '../lib/motion'
import { Button, Card } from '../components/ui/primitives'

const points = [
  'Certified IATA & FIATA freight forwarder',
  'Bonded warehousing & customs brokerage',
  'Dedicated account manager for every shipment',
  'Strongest routes across US, EU, Asia & Africa',
]

export function About() {
  return (
    <section className="relative bg-white pt-24 pb-32">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT */}
          <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport} className="lg:col-span-6 relative">
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-pill bg-dtl-yellow/10 text-dtl-black ring-1 ring-dtl-yellow/30 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
              <span className="size-1.5 rounded-full bg-dtl-yellow" /> About DTL
            </motion.span>
            <motion.h2 variants={slideInLeft} className="mt-5 text-4xl lg:text-[3rem] font-bold leading-[1.06] text-dtl-black text-balance">
              Where logistics lessons are turned into precise delivery.
            </motion.h2>
            <motion.p variants={slideInLeft} className="mt-5 text-lg text-dtl-charcoal leading-relaxed">
              We are a team of operators, customs brokerages, and engineers who have built shipping operations for Fortune 500 brands. DTL brings that level of discipline to every shipment we move — large or small.
            </motion.p>
            <ul className="mt-7 space-y-3.5">
              {points.map((p, i) => (
                <motion.li key={p} variants={fadeUp} custom={i} className="flex items-start gap-3">
                  <span className="mt-1 grid size-6 place-items-center rounded-full bg-dtl-charcoal text-dtl-yellow shrink-0">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-base text-dtl-black">{p}</span>
                </motion.li>
              ))}
            </ul>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link to="/about" className="inline-flex items-center gap-2 rounded-[14px] bg-dtl-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-dtl-charcoal transition">
                Discover our story <ArrowRight className="size-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-[14px] bg-dtl-light-gray px-6 py-3.5 text-sm font-semibold text-dtl-black hover:bg-dtl-yellow/10 transition">
                Contact an expert
              </Link>
            </motion.div>

            {/* Contact card */}
            <motion.div variants={fadeUp} className="mt-8 rounded-card bg-dtl-charcoal text-white p-6 max-w-md">
              <p className="text-xs uppercase tracking-[0.18em] text-dtl-yellow font-bold">24/7 dispatch desk</p>
              <p className="mt-2 text-lg font-semibold">+1 (816) 555-0140</p>
              <p className="text-sm text-white/80">dispatch@dtl.com</p>
            </motion.div>
          </motion.div>

          {/* RIGHT — layered images */}
          <motion.div
            initial="hidden" whileInView="show" variants={slideInRight} viewport={viewport}
            className="lg:col-span-6 relative h-[520px]"
          >
            <div className="absolute top-0 right-0 w-[80%] h-[72%] rounded-card overflow-hidden ring-1 ring-dtl-border shadow-[0_60px_160px_-40px_rgba(0,0,0,0.45)]">
              <img src="/warehouse.jpg" alt="Warehouse operations" className="h-full w-full object-cover" />
            </div>

            {/* small overlapping card */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[54%] rounded-card overflow-hidden ring-1 ring-dtl-border shadow-2xl">
              <img src="/porthandling.jpg" alt="Port handling" className="h-full w-full object-cover" />
            </div>

            {/* experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewport} transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-8 right-8 grid size-32 place-items-center rounded-full bg-dtl-yellow text-dtl-black shadow-2xl ring-4 ring-white"
            >
              <div className="text-center">
                <p className="text-3xl font-bold leading-none">15+</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] font-semibold">Years in freight</p>
              </div>
            </motion.div>

            {/* decorative arrow */}
            <svg viewBox="0 0 60 60" className="absolute top-[35%] right-[5%] text-dtl-red size-12 animate-float-soft" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 50 L52 8" />
              <polyline points="40 8 52 8 52 20" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}