import { useState } from 'react'
import { SectionLabel } from '../sections/_section'
import { fadeUp, scaleIn, staggerParent } from '../lib/motion'
import { Button, Card, Pill, StatusBadge, Input, Textarea, Select, Label, Spinner } from '../components/ui/primitives'
import { fmtDate, fmtDateTime, fmtMoney, statusLabel, paymentStatusLabel, paymentMethodLabel, imageFileError, fileToCompressedDataUrl } from '../lib/utils'
import { PublicApi } from '../lib/api'
import { LiveMap } from '../components/tracking/live-map'
import { useParams, useNavigate, useLocation } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MapPin, Package, Truck, Search, Image as ImageIcon, Wallet, AlertCircle, CheckCircle2, Upload, Gift } from 'lucide-react'
import type { Shipment, TrackingEvent, Fee, ShipmentImage, PublicPayment } from '../lib/types'

const GIFT_CARD_BRANDS = [
  'Amazon', 'Visa', 'Mastercard', 'Google Play', 'Apple / iTunes',
  'Steam', 'Walmart', 'Target', 'eBay', 'Other',
]

function RouteRow({ icon, name, country }: { icon: React.ReactNode; name?: string | null; country?: string | null }) {
  return (
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-xl bg-dtl-light-gray flex items-center justify-center text-dtl-red shrink-0">{icon}</div>
      <div>
        <p className="font-semibold text-dtl-black">{name || '—'}</p>
        <p className="text-sm text-dtl-charcoal">{country || '—'}</p>
      </div>
    </div>
  )
}

function Timeline({ events }: { events: TrackingEvent[] }) {
  const sorted = [...events].sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dtl-black mb-6">Timeline</h3>
      <div className="space-y-0">
        {sorted.map((ev, i) => (
          <div key={ev.id} className="flex gap-4 pb-6 relative">
            <div className="flex flex-col items-center">
              <div className="size-3 rounded-full bg-dtl-yellow ring-2 ring-dtl-yellow/20 z-10" />
              {i < sorted.length - 1 && <div className="w-px flex-1 bg-dtl-border -mt-1" />}
            </div>
            <div className="flex-1 -mt-1">
              <p className="font-semibold text-dtl-black">{statusLabel(ev.status)}</p>
              {ev.location_label && <p className="text-sm text-dtl-charcoal flex items-center gap-1.5 mt-0.5"><MapPin className="size-3.5" />{ev.location_label}</p>}
              {ev.note && <p className="text-sm text-dtl-charcoal mt-1">{ev.note}</p>}
              <p className="text-xs text-dtl-charcoal/50 mt-1">{fmtDateTime(ev.occurred_at)}</p>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="text-sm text-dtl-charcoal">No events recorded yet.</p>}
      </div>
    </Card>
  )
}

function FeesCard({ fees, payments = [], trackingNumber, onPaymentSuccess }: { fees: Fee[]; payments?: PublicPayment[]; trackingNumber: string; onPaymentSuccess: () => void }) {
  const unpaidFees = fees.filter(f => f.status === 'unpaid' || f.status === 'partially_paid')
  const totalDue = unpaidFees.reduce((sum, f) => sum + Number(f.amount || 0), 0)
  const hasPendingSubmission = payments.some(p => p.status === 'pending')
  const [showPayment, setShowPayment] = useState(false)
  const [brand, setBrand] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [cardValue, setCardValue] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [imageErr, setImageErr] = useState('')
  const [submitMsg, setSubmitMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const finalBrand = brand === 'Other' ? customBrand.trim() : brand

  async function handleImage(file: File | null) {
    setSubmitMsg('')
    if (!file) { setImageDataUrl(null); setImageErr(''); return }
    const err = imageFileError(file)
    if (err) { setImageDataUrl(null); setImageErr(err); return }
    setImageErr('')
    try {
      setImageDataUrl(await fileToCompressedDataUrl(file))
    } catch {
      setImageErr('We couldn\u2019t read that image. Please try another photo.')
      setImageDataUrl(null)
    }
  }

  const submitPaymentMut = useMutation({
    mutationFn: async () => {
      if (!imageDataUrl) throw new Error('gift card image required')
      return PublicApi.submitPayment({
        tracking_number: trackingNumber,
        fee_ids: unpaidFees.map(f => f.id),
        amount: totalDue,
        currency: 'USD',
        method: 'gift_card',
        sender_name: senderName,
        sender_email: senderEmail,
        card_brand: finalBrand,
        card_number: cardNumber.trim() || undefined,
        card_value: cardValue ? Number(cardValue) : undefined,
        notes: notes.trim() || undefined,
        receipt_url: imageDataUrl,
      })
    },
    onSuccess: () => { setSubmitted(true); onPaymentSuccess() },
    onError: (err: any) => setSubmitMsg(err?.message || 'We couldn\u2019t complete your request. Please try again.'),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitMsg('')
    if (!brand) return setSubmitMsg('Please choose the gift card type.')
    if (brand === 'Other' && !customBrand.trim()) return setSubmitMsg('Please enter the gift card type.')
    if (!cardValue || Number(cardValue) <= 0) return setSubmitMsg('Please enter the gift card value.')
    if (!imageDataUrl) return setSubmitMsg('Please upload a clear photo of your gift card.')
    submitPaymentMut.mutate()
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-dtl-black mb-4 flex items-center gap-2"><Wallet className="size-5" /> Fees & charges</h3>
      {fees.length === 0 ? (
        <p className="text-sm text-dtl-charcoal">No fees recorded.</p>
      ) : (
        <div className="divide-y divide-dtl-border">
          {fees.map(fee => (
            <div key={fee.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-semibold text-dtl-black text-sm">{fee.name}</p>
                {fee.description && <p className="text-xs text-dtl-charcoal">{fee.description}</p>}
                {fee.due_date && <p className="text-xs text-dtl-charcoal/50">Due: {fmtDate(fee.due_date)}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-dtl-black">{fmtMoney(fee.amount, fee.currency)}</p>
                <StatusBadge status={fee.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-dtl-charcoal mb-2">Gift card submissions</p>
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white ring-1 ring-dtl-border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dtl-black">
                    {p.card_brand || paymentMethodLabel(p.method)}
                    {p.card_value != null && <span className="text-dtl-charcoal font-normal"> · {fmtMoney(p.card_value, p.currency)}</span>}
                  </p>
                  <p className="text-xs text-dtl-charcoal/70">Submitted {fmtDate(p.created_at)}</p>
                </div>
                <StatusBadge status={p.status} label={paymentStatusLabel(p.status)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {unpaidFees.length > 0 && !showPayment && !submitted && !hasPendingSubmission && (
        <div className="mt-6 p-4 rounded-xl bg-dtl-yellow/10 border border-dtl-yellow/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-dtl-red shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-dtl-red">Payment required</p>
              <p className="text-sm text-dtl-charcoal mt-1">Outstanding balance: <strong>{fmtMoney(totalDue)}</strong></p>
              <p className="text-sm text-dtl-charcoal/70 mt-0.5">Payment is required before customs clearance or delivery can proceed. We currently accept gift cards, which are verified by our finance team before your balance is updated.</p>
              <Button className="mt-3" size="sm" onClick={() => setShowPayment(true)}><Wallet className="size-4" /> Pay with gift card</Button>
            </div>
          </div>
        </div>
      )}

      {unpaidFees.length > 0 && !showPayment && !submitted && hasPendingSubmission && (
        <div className="mt-6 p-4 rounded-xl bg-dtl-yellow/10 border border-dtl-yellow/30 flex items-start gap-3">
          <AlertCircle className="size-5 text-dtl-red shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-dtl-red">Awaiting verification</p>
            <p className="text-sm text-dtl-charcoal mt-1">Your gift card submission is pending verification. Outstanding balance: <strong>{fmtMoney(totalDue)}</strong>.</p>
            <p className="text-sm text-dtl-charcoal/70 mt-0.5">{'We\u2019ll review it shortly \u2014 no further action is needed right now.'}</p>
          </div>
        </div>
      )}

      {showPayment && !submitted && (
        <div className="mt-6 rounded-xl bg-dtl-light-gray border border-dtl-border p-5">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-dtl-yellow/30 grid place-items-center text-dtl-black shrink-0">
              <Gift className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-dtl-black">Gift card payment</h4>
              <p className="text-sm text-dtl-charcoal mt-1">
                Submit your gift card for verification. Once our finance team confirms it, your outstanding balance of <strong className="text-dtl-black">{fmtMoney(totalDue)}</strong> is applied to the shipment.
              </p>
            </div>
          </div>

          <ol className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { n: '1', t: 'Enter card details', d: 'Type, value and code' },
              { n: '2', t: 'Upload a photo', d: 'A clear image of the card' },
              { n: '3', t: 'Await verification', d: 'We email you the result' },
            ].map(s => (
              <li key={s.n} className="rounded-xl bg-white ring-1 ring-dtl-border p-3">
                <span className="grid size-6 place-items-center rounded-full bg-dtl-black text-dtl-yellow text-xs font-bold">{s.n}</span>
                <p className="mt-2 text-xs font-bold text-dtl-black">{s.t}</p>
                <p className="text-xs text-dtl-charcoal/70">{s.d}</p>
              </li>
            ))}
          </ol>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="gc-brand">Gift card type <span className="text-dtl-red">*</span></Label>
                <Select id="gc-brand" value={brand} onChange={e => setBrand(e.target.value)} required>
                  <option value="">Select a brand</option>
                  {GIFT_CARD_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
              </div>

              {brand === 'Other' && (
                <div>
                  <Label htmlFor="gc-brand-other">Gift card type <span className="text-dtl-red">*</span></Label>
                  <Input id="gc-brand-other" placeholder="e.g. Nike" value={customBrand} onChange={e => setCustomBrand(e.target.value)} required />
                </div>
              )}

              <div>
                <Label htmlFor="gc-value">Gift card value (USD) <span className="text-dtl-red">*</span></Label>
                <Input id="gc-value" type="number" min="0" step="0.01" inputMode="decimal" placeholder="e.g. 50.00"
                  value={cardValue} onChange={e => setCardValue(e.target.value)} required />
                <p className="mt-1 text-xs text-dtl-charcoal/70">Should cover the outstanding balance of {fmtMoney(totalDue)}.</p>
              </div>

              <div>
                <Label htmlFor="gc-number">Card number or code <span className="font-normal text-dtl-charcoal/60">(optional)</span></Label>
                <Input id="gc-number" placeholder="e.g. 1234 5678 9012" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="gc-name">Your name <span className="text-dtl-red">*</span></Label>
                <Input id="gc-name" placeholder="Full name" value={senderName} onChange={e => setSenderName(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="gc-email">Your email <span className="text-dtl-red">*</span></Label>
                <Input id="gc-email" type="email" placeholder="you@example.com" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <Label htmlFor="gc-notes">Additional information <span className="font-normal text-dtl-charcoal/60">(optional)</span></Label>
              <Textarea id="gc-notes" rows={3}
                placeholder="Order ID, purchase location, expiry date — anything that helps us verify your card."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="gc-photo">Photo of the gift card <span className="text-dtl-red">*</span></Label>
              <input id="gc-photo" type="file" accept="image/*" onChange={e => handleImage(e.target.files?.[0] || null)}
                className="block w-full text-sm text-dtl-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-[14px] file:border-0 file:text-sm file:font-semibold file:bg-dtl-yellow/20 file:text-dtl-black hover:file:bg-dtl-yellow/40" />
              {imageErr && <p className="mt-1.5 text-xs text-dtl-red">{imageErr}</p>}
              {imageDataUrl && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-2 ring-1 ring-dtl-border">
                  <img src={imageDataUrl} alt="Gift card preview" className="h-20 max-w-[10rem] w-auto object-contain rounded-lg" />
                  <p className="text-xs text-dtl-charcoal">Photo attached — make sure the card type, value and code are readable.</p>
                </div>
              )}
            </div>

            {submitMsg && (
              <p className="flex items-start gap-2 text-sm text-dtl-red">
                <AlertCircle className="size-4 shrink-0 mt-0.5" /> {submitMsg}
              </p>
            )}

            <Button type="submit" disabled={submitPaymentMut.isPending} className="w-full">
              {submitPaymentMut.isPending
                ? <><Spinner className="size-4" /> Submitting…</>
                : <><Upload className="size-4" /> Submit gift card for verification</>}
            </Button>
            <p className="text-center text-xs text-dtl-charcoal/70">
              Your submission will show as <strong className="text-dtl-black">Pending verification</strong> until our team reviews it.
            </p>
          </form>
        </div>
      )}

      {submitted && (
        <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Gift card submitted successfully</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-dtl-yellow/30 px-3 py-1 text-xs font-bold text-dtl-black ring-1 ring-dtl-yellow/60">
                <span className="size-1.5 rounded-full bg-dtl-black" /> Pending verification
              </span>
              <p className="mt-2 text-sm text-emerald-800">
                Your gift card is awaiting verification. Our finance team reviews every submission before it is applied to your balance
                {senderEmail ? ` — we'll email ${senderEmail} with the result.` : '.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export function TrackPage() {
  const params = useParams({ strict: false })
  const location = useLocation()
  const match = location.pathname.match(/^\/track\/(.+)/)
  const rawTn = (params as any).trackingNumber || (match ? decodeURIComponent(match[1]) : undefined)
  const trackingNumber = rawTn ? rawTn.replace(/^#/, '') : undefined
  const navigate = useNavigate()
  const [query, setQuery] = useState(trackingNumber || '')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['track', trackingNumber],
    queryFn: () => PublicApi.track(trackingNumber!),
    enabled: !!trackingNumber,
  })

  const shipment: Shipment | null = data?.shipment ?? null
  const events: TrackingEvent[] = data?.events ?? []
  const fees: Fee[] = data?.fees ?? []
  const images: ShipmentImage[] = data?.images ?? []
  const payments: PublicPayment[] = data?.payments ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim().replace(/^#/, '')
    if (q) navigate({ to: '/track/$trackingNumber', params: { trackingNumber: q } })
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-dtl-charcoal text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Track shipment</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Real-time visibility, end to end.</h1>
          <form onSubmit={handleSearch} className="mt-8 flex gap-3 max-w-lg">
            <input value={query} onChange={e => setQuery(e.target.value)}
              className="flex-1 rounded-[14px] border border-white/20 bg-white/20 px-5 py-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-dtl-yellow/60"
              placeholder="Enter tracking number..." />
            <Button type="submit" className="shrink-0"><Search className="size-4" /> Track</Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-20">
        {!trackingNumber && (
          <div className="text-center py-20 text-dtl-charcoal">
            <Package className="size-16 mx-auto mb-4 text-dtl-border" />
            <p className="text-xl font-semibold text-dtl-black">Enter a tracking number to get started</p>
          </div>
        )}

        {isLoading && <div className="text-center py-20"><div className="size-8 border-2 border-dtl-border border-t-dtl-yellow rounded-full animate-spin mx-auto" /></div>}
        {error && (
          <div className="text-center py-20 text-dtl-red">
            {/not found|tracking number/i.test(String((error as any)?.message || ''))
              ? 'No shipment found for that tracking number. Please check and try again.'
              : 'We couldn’t complete your request. Please try again.'}
          </div>
        )}

        {shipment && (
          <motion.div variants={staggerParent} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Pill>{shipment.service || 'Standard'}</Pill>
                <h2 className="text-2xl font-bold text-dtl-black mt-2">#{shipment.tracking_number}</h2>
                <p className="text-sm text-dtl-charcoal">Created {fmtDate(shipment.created_at)}</p>
              </div>
              <StatusBadge status={shipment.status} />
            </motion.div>

            {shipment.origin_lat != null && shipment.origin_lng != null &&
             shipment.destination_lat != null && shipment.destination_lng != null &&
             shipment.current_lat != null && shipment.current_lng != null && (
              <motion.div variants={scaleIn} className="h-[360px] rounded-card overflow-hidden ring-1 ring-dtl-border">
                <LiveMap
                  origin={[shipment.origin_lat, shipment.origin_lng]}
                  destination={[shipment.destination_lat, shipment.destination_lng]}
                  current={[shipment.current_lat, shipment.current_lng]}
                  events={events}
                  originLabel={shipment.origin_name}
                  destinationLabel={shipment.destination_name}
                  currentLabel={shipment.current_location_label}
                  currentStatus={shipment.status}
                />
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-6">
              <RouteRow icon={<MapPin className="size-5" />} name={shipment.origin_name} country={shipment.origin_country} />
              <RouteRow icon={<MapPin className="size-5" />} name={shipment.destination_name} country={shipment.destination_country} />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Timeline events={events} />
            </motion.div>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-6">
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-dtl-black mb-4">Shipment details</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between"><dt className="text-dtl-charcoal">Weight</dt><dd className="font-semibold text-dtl-black">{shipment.weight_kg ? `${shipment.weight_kg} kg` : '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-dtl-charcoal">Pieces</dt><dd className="font-semibold text-dtl-black">{shipment.pieces ?? '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-dtl-charcoal">Dimensions</dt><dd className="font-semibold text-dtl-black">{shipment.dimensions || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-dtl-charcoal">Est. delivery</dt><dd className="font-semibold text-dtl-black">{fmtDate(shipment.estimated_delivery)}</dd></div>
                    {shipment.reference && <div className="flex justify-between"><dt className="text-dtl-charcoal">Reference</dt><dd className="font-semibold text-dtl-black">{shipment.reference}</dd></div>}
                    <div className="flex justify-between"><dt className="text-dtl-charcoal">Sender</dt><dd className="font-semibold text-dtl-black">{shipment.sender_name || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-dtl-charcoal">Receiver</dt><dd className="font-semibold text-dtl-black">{shipment.receiver_name || '—'}</dd></div>
                  </dl>
                </Card>
                {shipment.current_location_label && (
                  <Card className="p-6 mt-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="size-5 text-dtl-red shrink-0" />
                      <span className="text-dtl-charcoal">Current: <strong className="text-dtl-black">{shipment.current_location_label}</strong></span>
                    </div>
                  </Card>
                )}
              </div>
              <div className="space-y-6">
                <FeesCard fees={fees} payments={payments} trackingNumber={shipment.tracking_number} onPaymentSuccess={() => refetch()} />
              </div>
            </motion.div>

            {images.length > 0 && (
              <motion.div variants={fadeUp}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-dtl-black mb-4 flex items-center gap-2"><ImageIcon className="size-5" /> Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map(img => (
                      <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden ring-1 ring-dtl-border hover:ring-dtl-yellow/50 transition">
                        <img src={img.url} alt={img.caption || ''} className="w-full h-32 object-cover" />
                        {img.caption && <p className="text-xs text-dtl-charcoal p-2">{img.caption}</p>}
                      </a>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  )
}
