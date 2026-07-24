import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { fadeUp } from '../lib/motion'
import { PublicApi } from '../lib/api'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      await PublicApi.newsletter({ email })
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800" />
      <div className="absolute inset-0 grid-overlay opacity-25" />

      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={fadeUp}
        className="relative mx-auto max-w-[1320px] px-6"
      >
        <div className="rounded-card bg-teal-900 ring-1 ring-white/10 px-6 sm:px-8 py-10 sm:py-12 grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-flame-400">Dispatch brief</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-balance">
              Get route alerts, customs updates, and freight insights in your inbox.
            </h2>
            <p className="mt-3 text-teal-200/85">No noise — just the operational intel you can act on.</p>
          </div>
          <form onSubmit={submit} className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row rounded-[14px] bg-white shadow-xl overflow-hidden">
              <input
                type="email" required placeholder="Your work email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full sm:flex-1 px-5 py-4 text-base text-teal-950 placeholder:text-teal-700/40 focus:outline-none"
              />
              <button
                type="submit" disabled={status === 'sending'}
                className="rounded-[0] sm:rounded-none bg-flame-500 px-5 py-4 sm:py-0 text-white hover:bg-flame-600 transition flex items-center justify-center gap-2 font-semibold text-sm"
              >
                Subscribe <ArrowRight className="size-4" />
              </button>
            </div>
            {status === 'ok' && (
              <p className="flex items-center gap-2 text-sm text-flame-300">
                <CheckCircle2 className="size-4 shrink-0" /> You are on the list — keep an eye on your inbox.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-rose-300">Something went wrong. Try again or contact us.</p>
            )}
            <p className="text-xs text-teal-300/70">Unsubscribe in one click. We never share your data.</p>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
