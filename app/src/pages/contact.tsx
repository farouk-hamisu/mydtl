import { useState } from 'react'
import { SectionLabel } from '../sections/_section'
import { PublicApi } from '../lib/api'
import { Button, Input, Textarea, Label } from '../components/ui/primitives'

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
    } catch {
      setError('We couldn’t complete your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-dtl-charcoal text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Let's talk freight.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-20">
        <div className="max-w-xl mx-auto">
          {done ? (
            <div className="rounded-card bg-dtl-light-gray p-12 text-center ring-1 ring-dtl-border">
              <p className="text-xl font-bold text-dtl-black">Message sent!</p>
              <p className="mt-2 text-dtl-charcoal">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Full name</Label>
                <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.com" />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="resize-y" placeholder="How can we help?" />
              </div>
              {error && <p className="text-sm text-dtl-red">{error}</p>}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}