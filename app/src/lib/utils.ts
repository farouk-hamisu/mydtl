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

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending verification',
  verified: 'Verified',
  rejected: 'Rejected',
}

export function paymentStatusLabel(s: string): string {
  return PAYMENT_STATUS_LABELS[s] ?? statusLabel(s)
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  gift_card: 'Gift card',
  usdt_trc20: 'USDT TRC20',
  ach: 'ACH',
  wire: 'Wire',
  other: 'Other',
}

export function paymentMethodLabel(m: string): string {
  return PAYMENT_METHOD_LABELS[m] ?? statusLabel(m)
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

const MAX_IMAGE_EDGE = 1600
const IMAGE_QUALITY = 0.85
const MAX_FILE_BYTES = 8 * 1024 * 1024

export function imageFileError(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please choose an image file (JPG or PNG).'
  if (file.size > MAX_FILE_BYTES) return 'That image is too large. Please upload one under 8 MB.'
  return null
}

async function decodeBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' } as any)
  } catch {
    return await createImageBitmap(file)
  }
}

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return fileToDataUrl(file)
  try {
    const bitmap = await decodeBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return fileToDataUrl(file)
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()
    return canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
  } catch {
    return fileToDataUrl(file)
  }
}
