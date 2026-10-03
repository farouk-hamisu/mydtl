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
    created: 'bg-dtl-light-gray text-dtl-charcoal ring-dtl-border',
    picked_up: 'bg-dtl-yellow/25 text-dtl-black ring-dtl-yellow/50',
    in_transit: 'bg-dtl-charcoal/10 text-dtl-charcoal ring-dtl-charcoal/20',
    out_for_delivery: 'bg-dtl-yellow/30 text-dtl-black ring-dtl-yellow/60',
    delivered: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    awaiting_customs_clearance: 'bg-dtl-yellow/25 text-dtl-black ring-dtl-yellow/50',
    awaiting_payment: 'bg-dtl-red/10 text-dtl-red ring-dtl-red/30',
    customs_hold: 'bg-dtl-red/10 text-dtl-red ring-dtl-red/30',
    payment_verification: 'bg-dtl-light-gray text-dtl-charcoal ring-dtl-border',
    cancelled: 'bg-dtl-light-gray text-dtl-charcoal ring-dtl-border',
    on_hold: 'bg-dtl-light-gray text-dtl-charcoal ring-dtl-border',
    returned: 'bg-dtl-red/10 text-dtl-red ring-dtl-red/30',
    paid: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    unpaid: 'bg-dtl-red/10 text-dtl-red ring-dtl-red/30',
    partially_paid: 'bg-dtl-yellow/25 text-dtl-black ring-dtl-yellow/50',
    waived: 'bg-dtl-light-gray text-dtl-charcoal ring-dtl-border',
    pending: 'bg-dtl-yellow/25 text-dtl-black ring-dtl-yellow/50',
    verified: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    rejected: 'bg-dtl-red/10 text-dtl-red ring-dtl-red/30',
  }[s] ?? 'bg-dtl-light-gray text-dtl-charcoal ring-dtl-border'
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
