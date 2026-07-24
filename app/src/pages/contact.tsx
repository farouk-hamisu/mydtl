import { useState } from 'react'
import { SectionLabel } from '../sections/_section'
import { PublicApi } from '../lib/api'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await PublicApi.contact(form)
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-teal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Let's talk freight.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-20">
        <div className="max-w-xl mx-auto">
          {done ? (
            <div className="rounded-card bg-mist p-12 text-center ring-1 ring-black/5">
              <p className="text-xl font-bold text-teal-950">Message sent!</p>
              <p className="mt-2 text-ink-600">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <div>
                <label className="block text-sm font-semibold text-teal-950 mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40 resize-y" placeholder="How can we help?" />
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button type="submit" disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-flame-500 text-white px-7 py-4 text-base font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-[0_8px_24px_-8px_rgba(249,98,22,0.55)] hover:bg-teal-900 hover:shadow-[0_10px_28px_-8px_rgba(7,80,89,0.55)]">
                {submitting ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
