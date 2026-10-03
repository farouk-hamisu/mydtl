import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { fadeUp, staggerParent, viewport } from '../lib/motion'
import { SectionLabel } from './_section'

const faqs = [
  { q: 'How do I track my shipment?', a: 'Use any tracking number from your confirmation email in the Track page. Each shipment shows a live map, timeline, photos, and customs status. You can also log in to your dashboard to see all your shipments together.' },
  { q: 'Can I pay customs duty online?', a: 'Yes. When a customs or shipment fee is applied, you will be notified and a payment notice will appear on the shipment detail page. We currently accept gift cards — submit your card details and a clear photo and our finance team verifies it before your balance is updated.' },
  { q: 'How long does customs clearance take?', a: 'For routine shipments, customs clearance at major ports averages 6 hours after duties are settled. For inspections or holds, your dispatch desk will keep you posted every step of the way.' },
  { q: 'Can I track a shipment without an account?', a: 'Absolutely. Anyone with a valid tracking number can use the public Track page. Accounts are only needed to manage multiple shipments, receive notifications, or upload payment proof.' },
  { q: 'What payment methods are supported?', a: 'We currently accept gift card payments. On the shipment page, choose Pay with gift card, enter the card type, value and code, upload a clear photo of the card, and submit — it shows as "Pending verification" until our team reviews it.' },
  { q: 'What happens if my shipment is on hold?', a: 'If your shipment is placed under "Customs Hold" or "Awaiting Payment", it remains fully trackable. You will see a clear reason and a payment notice if any outstanding fees are required to release it.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <SectionLabel>Helpful answers</SectionLabel>
            <h2 className="mt-4 text-4xl lg:text-[3rem] font-bold text-dtl-black leading-[1.08]">FAQ on tracking, customs, and payment.</h2>
            <p className="mt-5 text-base text-dtl-charcoal leading-relaxed">
              Anything else on your mind? Reach out to our dispatch desk any time.
            </p>
            <a href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-dtl-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-dtl-charcoal transition">
              Contact support →
            </a>
          </div>

          <motion.dl variants={staggerParent} initial="hidden" whileInView="show" viewport={viewport} className="lg:col-span-7 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <motion.div key={f.q} variants={fadeUp} custom={i}
                  className="rounded-card ring-1 ring-dtl-border bg-white overflow-hidden">
                  <button
                    className={`flex w-full items-center justify-between gap-4 p-6 text-left ${isOpen ? 'bg-dtl-yellow/5' : ''}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="text-lg font-semibold text-dtl-black">{f.q}</span>
                    <span className={`grid size-9 place-items-center rounded-full transition ${isOpen ? 'bg-dtl-yellow text-dtl-black' : 'bg-dtl-light-gray text-dtl-charcoal'}`}>
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <motion.div
                    initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.32, ease: [0.22,1,0.36,1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-base text-dtl-charcoal leading-relaxed">{f.a}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.dl>
        </div>
      </div>
    </section>
  )
}