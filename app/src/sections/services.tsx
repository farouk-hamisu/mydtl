import { Link } from '@tanstack/react-router'
import { ArrowRight, Package, Anchor, Plane, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, viewport } from '../lib/motion'
import { SectionLabel } from './_section'

const items = [
  { title: 'Air Freight', desc: 'Time-critical international air cargo with daily departures and priority boarding for express shipments.', image: '/airfright.jpg', label: 'Air Cargo', icon: Plane },
  { title: 'Sea Freight', desc: 'FCL and LCL ocean freight with competitive transit times and dedicated customs handling worldwide.', image: '/seafright.jpg', label: 'Ocean Shipping', icon: Anchor },
  { title: 'Road Freight', desc: 'Cross-border trucking across North America and Europe with tracked fleet and bonded warehouses.', image: '/roadtransport.jpg', label: 'Land Transport', icon: Truck },
]

export function Services() {
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid lg:grid-cols-12 gap-6 items-end mb-12">
          <div className="lg:col-span-7">
            <SectionLabel>Our services</SectionLabel>
            <h2 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-dtl-black text-balance">
              A complete freight toolkit, built for serious shippers.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base text-dtl-charcoal leading-relaxed">
            Whatever your cargo, DTL has the routes, customs, and operational discipline to move it cleanly across borders — with visibility the whole way.
          </p>
        </div>

        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport}
          className="grid md:grid-cols-3 gap-6">
          {items.map((s, i) => {
            const Icon = s.icon ?? Package
            const tops = [0, 48, 0]
            return (
              <motion.article
                key={s.title}
                variants={fadeUp} custom={i}
                style={{ marginTop: tops[i % 3] }}
                className="group relative rounded-card bg-white ring-1 ring-dtl-border overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,0,0,0.35)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dtl-charcoal/70 via-dtl-charcoal/10 to-transparent" />
                  {s.label && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-pill bg-dtl-black/80 ring-1 ring-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                      {s.label}
                    </span>
                  )}
                  <span className="absolute -bottom-7 right-7 grid size-14 place-items-center rounded-card bg-dtl-yellow text-dtl-black shadow-xl ring-4 ring-white">
                    <Icon className="size-6" />
                  </span>
                </div>
                <div className="p-7 pt-9">
                  <h3 className="text-2xl font-bold text-dtl-black">{s.title}</h3>
                  <p className="mt-3 text-base text-dtl-charcoal leading-relaxed">{s.desc}</p>
                  <Link to="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dtl-red hover:text-dtl-black transition">
                    Read more <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}