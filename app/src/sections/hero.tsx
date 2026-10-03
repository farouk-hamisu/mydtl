import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Search, Truck, Plane, Anchor, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/primitives'
import { fadeUp, slideInLeft, slideInRight, staggerParent } from '../lib/motion'

export function Hero() {
  const navigate = useNavigate()
  const [tracking, setTracking] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = tracking.trim().toUpperCase()
    if (!v) return
    navigate({ to: '/track/$trackingNumber', params: { trackingNumber: v } })
  }

  return (
    <section className="relative overflow-hidden bg-dtl-charcoal text-white">
      {/* Layered backgrounds */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dtl-charcoal via-dtl-black to-dtl-charcoal" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <div className="absolute -left-32 top-20 size-[420px] rounded-full bg-dtl-yellow/15" />
        <div className="absolute right-[-100px] top-[-80px] size-[520px] rounded-full bg-dtl-red/20" />
        <img
          src="/airfright.jpg"
          alt="" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-15 [mask-image:linear-gradient(90deg,transparent,black)]"
        />
        <div className="absolute inset-0 noise opacity-30" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-6 pt-20 pb-0">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT */}
          <motion.div variants={staggerParent} initial="hidden" animate="show" className="lg:col-span-6 pt-4">
            <motion.h1 variants={slideInLeft} className="text-[2.1rem] sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-bold leading-[1.04] text-balance">
              Cargo Without Borders.<br />
              <span className="text-dtl-yellow">Delivered on Time,</span><br />
              Every Time.
            </motion.h1>
            <motion.p variants={slideInLeft} className="mt-6 text-base lg:text-lg text-dtl-white/85 leading-relaxed max-w-xl text-balance">
              Air, sea, and road freight with end-to-end visibility, live tracking, and dedicated customs handling across 190+ countries.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 px-2 py-4 hover:text-dtl-yellow transition">
                Explore services <ArrowRight className="size-4" />
              </Link>
            </motion.div>

            {/* Tracking widget */}
            <motion.form variants={slideInLeft} onSubmit={submit} className="mt-8 max-w-xl rounded-card bg-white ring-1 ring-dtl-border shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="grid size-12 place-items-center rounded-xl bg-dtl-charcoal text-dtl-yellow">
                  <Search className="size-5" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-dtl-red">Track your shipment</label>
                  <input
                    value={tracking} onChange={e => setTracking(e.target.value)}
                    placeholder="e.g. DTL-DEMO-0001"
                    className="w-full bg-transparent text-base font-semibold text-dtl-black placeholder:text-dtl-charcoal/40 focus:outline-none"
                  />
                </div>
                <Button type="submit" className="bg-dtl-black text-white hover:bg-dtl-charcoal px-7">
                  Track <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.form>
          </motion.div>

          {/* RIGHT — layered imagery */}
          <motion.div
            initial="hidden" animate="show"
            variants={slideInRight}
            className="lg:col-span-6 relative h-[480px] sm:h-[560px] lg:h-[620px]"
          >
            {/* main ship image card */}
            <div className="absolute right-0 top-0 w-[78%] h-[78%] rounded-card overflow-hidden ring-1 ring-white/15 shadow-[0_60px_160px_-40px_rgba(0,0,0,0.6)]">
              <img
                src="/oceancargoship.jpg"
                alt="Ocean cargo ship" className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dtl-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-dtl-black/80 ring-1 ring-white/15 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.16em] text-dtl-yellow font-bold">Vessel tracking</p>
                <p className="text-sm font-semibold">MV Ocean Pioneer · Indian Ocean</p>
              </div>
            </div>

            {/* floating aircraft */}
            <motion.div
              className="absolute right-[6%] top-[4%] size-28 rounded-card overflow-hidden ring-1 ring-white/15 shadow-2xl animate-float-soft"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <img src="/cargoplane.jpg" className="h-full w-full object-cover" alt="Cargo plane" />
            </motion.div>

            {/* floating stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute left-0 bottom-28 w-[58%] rounded-card bg-white ring-1 ring-dtl-border p-5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-xl bg-dtl-yellow/10 text-dtl-red"><ShieldCheck className="size-5" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-dtl-red font-bold">Live</p>
                  <p className="text-sm font-semibold text-dtl-black">End-to-end visibility</p>
                </div>
              </div>
              <p className="mt-3 text-xl font-bold text-dtl-black">190+ countries</p>
              <p className="text-xs text-dtl-charcoal">Door-to-door, digitally tracked.</p>
              <svg viewBox="0 0 100 30" className="mt-3 w-full h-7 text-dtl-red">
                <polyline points="0,22 18,18 32,12 50,14 66,6 84,10 100,2" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </motion.div>

            {/* floating mode pills */}
            <div className="absolute right-4 top-1/2 flex flex-col gap-2">
              {[<Plane key="p" className="size-4" />, <Anchor key="a" className="size-4" />, <Truck key="t" className="size-4" />].map((icon, i) => (
                <motion.span key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="grid size-10 place-items-center rounded-full bg-white/20 ring-1 ring-white/30 text-white">
                  {icon}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Overlapping truck at bottom-left */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.22,1,0.36,1] }}
          className="relative hidden lg:block -mb-[120px] left-0 w-[440px]"
        >
          <div className="rounded-card overflow-hidden ring-1 ring-white/10 shadow-[0_60px_160px_-40px_rgba(0,0,0,0.7)]">
            <img src="/roadtransport.jpg" alt="Long-haul truck" className="h-48 w-full object-cover" />
          </div>
          <div className="absolute -top-6 -left-6 grid size-12 place-items-center rounded-card bg-dtl-yellow text-dtl-black shadow-xl ring-1 ring-white/20">
            <Truck className="size-6" />
          </div>
        </motion.div>
      </div>

      {/* Curved divider */}
      <svg viewBox="0 0 1440 80" className="relative block w-full text-white -mt-8" preserveAspectRatio="none">
        <path d="M0,40 C360,80 720,0 1080,32 C1260,48 1380,32 1440,24 L1440,80 L0,80 Z" fill="currentColor" />
      </svg>
    </section>
  )
}