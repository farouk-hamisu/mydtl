import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export function fmtMoney(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(amount) || 0)
  } catch {
    return `${Number(amount || 0).toFixed(2)} ${currency}`
  }
}

export function fmtDate(d?: string | Date | null, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-US', opts).format(date)
}

export function fmtDateTime(d?: string | Date | null) {
  return fmtDate(d, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function fmtTime(d?: string | Date | null) {
  return fmtDate(d, { hour: '2-digit', minute: '2-digit' })
}

export function initials(name?: string | null) {
  if (!name) return ''
  return name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase() ?? '').join('')
}

export function statusColor(s: string): string {
  return {
    created: 'bg-slate-100 text-slate-700 ring-slate-200',
    picked_up: 'bg-flame-100 text-flame-700 ring-flame-200',
    in_transit: 'bg-teal-100 text-teal-800 ring-teal-200',
    out_for_delivery: 'bg-flame-100 text-flame-700 ring-flame-200',
    delivered: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    awaiting_customs_clearance: 'bg-amber-100 text-amber-800 ring-amber-200',
    awaiting_payment: 'bg-flame-500/10 text-flame-700 ring-flame-400/30',
    customs_hold: 'bg-rose-100 text-rose-800 ring-rose-200',
    payment_verification: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
    cancelled: 'bg-slate-200 text-slate-700 ring-slate-300',
    on_hold: 'bg-slate-200 text-slate-700 ring-slate-300',
    returned: 'bg-rose-100 text-rose-700 ring-rose-200',
    paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    unpaid: 'bg-rose-100 text-rose-700 ring-rose-200',
    partially_paid: 'bg-amber-100 text-amber-800 ring-amber-200',
    waived: 'bg-slate-100 text-slate-700 ring-slate-200',
    pending: 'bg-amber-100 text-amber-800 ring-amber-200',
    verified: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 ring-rose-200',
  }[s] ?? 'bg-slate-100 text-slate-700 ring-slate-200'
}

export function statusLabel(s: string): string {
  return (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text)
  const t = document.createElement('textarea')
  t.value = text
  document.body.appendChild(t); t.select()
  document.execCommand('copy')
  document.body.removeChild(t)
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}
