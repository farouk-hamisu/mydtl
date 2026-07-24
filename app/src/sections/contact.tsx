import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { fadeUp, staggerParent, viewport } from '../lib/motion'
import { SectionLabel } from './_section'
import { PublicApi } from '../lib/api'
import { useSiteSettings } from '../hooks/useSiteSettings'

export function Contact() {
  const { settings } = useSiteSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await PublicApi.contact({ ...form, kind: 'general' })
      setStatus('ok')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left info card */}
          <motion.div
            initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp}
            className="lg:col-span-5"
          >
            <SectionLabel>Get in touch</SectionLabel>
            <h2 className="mt-4 text-4xl lg:text-[3rem] font-bold text-teal-950 leading-[1.08] text-balance">
              Let’s move your cargo with precision.
            </h2>
            <p className="mt-5 text-base text-ink-600 leading-relaxed max-w-md">
              Tell us about your shipment and our dispatch desk will get back within one business hour.
            </p>

            <ul className="mt-8 space-y-4">
              <ContactRow icon={<MapPin className="size-5" />} label="Visit" value={settings.contact_address || '1801 Main Street, Kansas City, MO 64108, United States'} />
              <ContactRow icon={<Phone className="size-5" />} label="Call" value={settings.contact_phone || '+1 (816) 555-0140'} href={`tel:${settings.contact_phone}`} />
              <ContactRow icon={<Mail className="size-5" />} label="Email" value={settings.contact_email || 'support@speedflightz.com'} href={`mailto:${settings.contact_email}`} />
            </ul>

            <div className="mt-8 rounded-card bg-mist p-6 ring-1 ring-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-flame-600">Business hours</p>
              <p className="mt-2 text-sm text-ink-700">{settings.business_hours || 'Mon – Fri: 08:00 – 18:00  ·  Sat: 09:00 – 14:00'}</p>
            </div>
          </motion.div>

          {/* Right form card */}
          <motion.form
            onSubmit={submit}
            initial="hidden" whileInView="show" viewport={viewport} variants={staggerParent}
            className="lg:col-span-7 rounded-card ring-1 ring-black/5 bg-white p-8 lg:p-10 shadow-[0_40px_120px_-40px_rgba(7,80,89,0.35)]"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" variants={fadeUp}>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className={inputCls} />
              </Field>
              <Field label="Email" variants={fadeUp}>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className={inputCls} />
              </Field>
              <Field label="Phone (optional)" variants={fadeUp}>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Subject" variants={fadeUp}>
                <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className={inputCls} />
              </Field>
            </div>
            <motion.div variants={fadeUp} className="mt-4">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-teal-900">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className={inputCls + ' resize-none'} />
            </motion.div>
            <motion.div variants={fadeUp} className="mt-6 flex items-center gap-4">
              <button type="submit" disabled={status === 'sending'}
                className="inline-flex items-center gap-2 rounded-[14px] bg-flame-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-teal-900 transition disabled:opacity-60 disabled:pointer-events-none">
                {status === 'sending' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Send message
              </button>
              {status === 'ok' && <span className="text-sm font-semibold text-emerald-700">Message received. Our team will be in touch.</span>}
              {status === 'error' && <span className="text-sm font-semibold text-rose-600">Could not send. Please email us instead.</span>}
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

const inputCls = "w-full mt-2 rounded-[14px] bg-mist ring-1 ring-black/5 px-4 py-3 text-base text-teal-950 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-flame-400"

function Field({ label, children, variants }: { label: string; children: React.ReactNode; variants?: any }) {
  return (
    <motion.label variants={variants} className="block">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-900">{label}</span>
      {children}
    </motion.label>
  )
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="grid size-12 place-items-center rounded-card bg-teal-950 text-flame-400">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">{label}</p>
        <p className="text-base text-ink-800 break-words">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} className="block hover:opacity-80 transition">{content}</a> : content
}
