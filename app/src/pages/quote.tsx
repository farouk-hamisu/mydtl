import { useState } from 'react'
import { SectionLabel } from '../sections/_section'
import { Button, Input, Label, Select } from '../components/ui/primitives'

export function QuotePage() {
  const [form, setForm] = useState({ name: '', email: '', origin: '', destination: '', weight: '', service: 'air' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-dtl-charcoal text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Get a quote</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Instant freight estimate.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 py-20">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="rounded-card bg-dtl-light-gray p-12 text-center ring-1 ring-dtl-border">
              <p className="text-xl font-bold text-dtl-black">Quote requested!</p>
              <p className="mt-2 text-dtl-charcoal">We'll email you a custom rate within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>Full name</Label>
                  <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>Origin</Label>
                  <Input required value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))} placeholder="City, Country" />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Input required value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} placeholder="City, Country" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>Estimated weight (kg)</Label>
                  <Input required type="number" min="0" step="0.1" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} placeholder="e.g. 100" />
                </div>
                <div>
                  <Label>Service type</Label>
                  <Select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}>
                    <option value="air">Air Freight</option>
                    <option value="sea">Sea Freight</option>
                    <option value="road">Road Freight</option>
                    <option value="express">Express Courier</option>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full !text-base !py-4">
                Get quote
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}