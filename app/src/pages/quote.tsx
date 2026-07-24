import { useState } from 'react'
import { SectionLabel } from '../sections/_section'

export function QuotePage() {
  const [form, setForm] = useState({ name: '', email: '', origin: '', destination: '', weight: '', service: 'air' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-teal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Get a quote</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Instant freight estimate.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-20">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="rounded-card bg-mist p-12 text-center ring-1 ring-black/5">
              <p className="text-xl font-bold text-teal-950">Quote requested!</p>
              <p className="mt-2 text-ink-600">We'll email you a custom rate within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-950 mb-1.5">Full name</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-teal-950 mb-1.5">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="you@company.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-950 mb-1.5">Origin</label>
                  <input required value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-teal-950 mb-1.5">Destination</label>
                  <input required value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="City, Country" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-teal-950 mb-1.5">Estimated weight (kg)</label>
                  <input required type="number" min="0" step="0.1" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="e.g. 100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-teal-950 mb-1.5">Service type</label>
                  <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                    className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 focus:outline-none focus:ring-2 focus:ring-flame-500/40">
                    <option value="air">Air Freight</option>
                    <option value="sea">Sea Freight</option>
                    <option value="road">Road Freight</option>
                    <option value="express">Express Courier</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-flame-500 text-white px-7 py-4 text-base font-semibold transition-all duration-300 active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(249,98,22,0.55)] hover:bg-teal-900 hover:shadow-[0_10px_28px_-8px_rgba(7,80,89,0.55)]">
                Get quote
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
