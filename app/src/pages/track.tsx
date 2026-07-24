import { useState } from 'react'
import { SectionLabel } from '../sections/_section'
import { fadeUp, scaleIn, staggerParent } from '../lib/motion'
import { Button, Card, Pill, StatusBadge } from '../components/ui/primitives'
import { fmtDate, fmtDateTime, fmtMoney, statusLabel, fileToDataUrl } from '../lib/utils'
import { PublicApi } from '../lib/api'
import { LiveMap } from '../components/tracking/live-map'
import { useParams, useNavigate, useLocation } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Package, Truck, Plane, Search, ChevronRight, Image as ImageIcon, Wallet, AlertCircle, CheckCircle2, Clock, Upload, ExternalLink } from 'lucide-react'
import type { Shipment, TrackingEvent, Fee, ShipmentImage } from '../lib/types'

function RouteRow({ icon, name, country }: { icon: React.ReactNode; name?: string | null; country?: string | null }) {
  return (
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">{icon}</div>
      <div>
        <p className="font-semibold text-teal-950">{name || '—'}</p>
        <p className="text-sm text-ink-600">{country || '—'}</p>
      </div>
    </div>
  )
}

function Timeline({ events }: { events: TrackingEvent[] }) {
  const sorted = [...events].sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-teal-950 mb-6">Timeline</h3>
      <div className="space-y-0">
        {sorted.map((ev, i) => (
          <div key={ev.id} className="flex gap-4 pb-6 relative">
            <div className="flex flex-col items-center">
              <div className="size-3 rounded-full bg-flame-500 ring-2 ring-flame-200 z-10" />
              {i < sorted.length - 1 && <div className="w-px flex-1 bg-black/5 -mt-1" />}
            </div>
            <div className="flex-1 -mt-1">
              <p className="font-semibold text-teal-950">{statusLabel(ev.status)}</p>
              {ev.location_label && <p className="text-sm text-ink-600 flex items-center gap-1.5 mt-0.5"><MapPin className="size-3.5" />{ev.location_label}</p>}
              {ev.note && <p className="text-sm text-ink-600 mt-1">{ev.note}</p>}
              <p className="text-xs text-ink-400 mt-1">{fmtDateTime(ev.occurred_at)}</p>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="text-sm text-ink-600">No events recorded yet.</p>}
      </div>
    </Card>
  )
}

function FeesCard({ fees, trackingNumber, onPaymentSuccess }: { fees: Fee[]; trackingNumber: string; onPaymentSuccess: () => void }) {
  const unpaidFees = fees.filter(f => f.status === 'unpaid' || f.status === 'partially_paid')
  const totalDue = unpaidFees.reduce((sum, f) => sum + Number(f.amount || 0), 0)
  const [showPayment, setShowPayment] = useState(false)
  const [method, setMethod] = useState<'usdt_trc20' | 'ach'>('usdt_trc20')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [submitMsg, setSubmitMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitPaymentMut = useMutation({
    mutationFn: async () => {
      if (!receiptFile) throw new Error('Receipt file required')
      const dataUrl = await fileToDataUrl(receiptFile)
      return PublicApi.submitPayment({
        tracking_number: trackingNumber,
        fee_ids: unpaidFees.map(f => f.id),
        amount: totalDue,
        currency: 'USD',
        method,
        sender_name: senderName,
        sender_email: senderEmail,
        receipt_url: dataUrl,
      })
    },
    onSuccess: () => { setSubmitted(true); onPaymentSuccess() },
    onError: (err: any) => setSubmitMsg(err.message),
  })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-teal-950 mb-4 flex items-center gap-2"><Wallet className="size-5" /> Fees & charges</h3>
      {fees.length === 0 ? (
        <p className="text-sm text-ink-600">No fees recorded.</p>
      ) : (
        <div className="divide-y divide-black/5">
          {fees.map(fee => (
            <div key={fee.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-semibold text-teal-950 text-sm">{fee.name}</p>
                {fee.description && <p className="text-xs text-ink-600">{fee.description}</p>}
                {fee.due_date && <p className="text-xs text-ink-400">Due: {fmtDate(fee.due_date)}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-teal-950">{fmtMoney(fee.amount, fee.currency)}</p>
                <StatusBadge status={fee.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {unpaidFees.length > 0 && !showPayment && !submitted && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Payment required</p>
              <p className="text-sm text-amber-700 mt-1">Outstanding balance: <strong>{fmtMoney(totalDue)}</strong></p>
              <p className="text-sm text-amber-600 mt-0.5">Payment is required before customs clearance or delivery can proceed.</p>
              <Button className="mt-3" size="sm" onClick={() => setShowPayment(true)}><Wallet className="size-4" /> Pay now</Button>
            </div>
          </div>
        </div>
      )}

      {showPayment && !submitted && (
        <div className="mt-6 p-4 rounded-xl bg-mist">
          <h4 className="font-bold text-teal-950 mb-4">Submit payment</h4>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setMethod('usdt_trc20')}
              className={`flex-1 rounded-[14px] border-2 p-3 text-center text-sm font-semibold transition-colors ${
                method === 'usdt_trc20' ? 'border-flame-500 bg-flame-50 text-flame-700' : 'border-black/10 text-ink-600 hover:border-black/20'
              }`}>
              <Wallet className="size-4 mx-auto mb-1" /> USDT TRC20
            </button>
            <button onClick={() => setMethod('ach')}
              className={`flex-1 rounded-[14px] border-2 p-3 text-center text-sm font-semibold transition-colors ${
                method === 'ach' ? 'border-flame-500 bg-flame-50 text-flame-700' : 'border-black/10 text-ink-600 hover:border-black/20'
              }`}>
              <Wallet className="size-4 mx-auto mb-1" /> ACH / Wire
            </button>
          </div>

          {method === 'usdt_trc20' && (
            <div className="rounded-xl bg-white p-3 mb-4 border border-black/5">
              <p className="text-xs font-semibold text-ink-600 uppercase tracking-wider mb-1">USDT TRC20 Address</p>
              <p className="font-mono text-sm font-bold text-teal-950 break-all">TXMjZ7MrfUMTFMQ96AwRTJTdsR3NmaL41u</p>
            </div>
          )}

          {method === 'ach' && (
            <div className="rounded-xl bg-white p-3 mb-4 border border-black/5 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-ink-600">Account holder</span><span className="font-semibold text-teal-950">SpeedFlightz</span></div>
              <div className="flex justify-between"><span className="text-ink-600">Bank</span><span className="font-semibold text-teal-950">Lead Bank</span></div>
              <div className="flex justify-between"><span className="text-ink-600">Account</span><span className="font-mono font-semibold text-teal-950">214144811917</span></div>
              <div className="flex justify-between"><span className="text-ink-600">Routing</span><span className="font-mono font-semibold text-teal-950">101019644</span></div>
            </div>
          )}

          <form onSubmit={e => { e.preventDefault(); submitPaymentMut.mutate() }} className="space-y-3">
            <input required placeholder="Your name" value={senderName} onChange={e => setSenderName(e.target.value)}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-flame-500/40" />
            <input required type="email" placeholder="Your email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-flame-500/40" />
            <input required type="file" accept="image/*,.pdf" onChange={e => setReceiptFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-ink-600 file:mr-4 file:py-2 file:px-4 file:rounded-[14px] file:border-0 file:text-sm file:font-semibold file:bg-flame-50 file:text-flame-700 hover:file:bg-flame-100" />
            {submitMsg && <p className="text-sm text-rose-600">{submitMsg}</p>}
            <Button type="submit" disabled={submitPaymentMut.isPending || !receiptFile} className="w-full">
              <Upload className="size-4" /> {submitPaymentMut.isPending ? 'Submitting...' : `Pay ${fmtMoney(totalDue)}`}
            </Button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800">Payment submitted</p>
            <p className="text-sm text-emerald-700">Your receipt has been uploaded. The administrator will verify it shortly.</p>
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim().replace(/^#/, '')
    if (q) navigate({ to: '/track/$trackingNumber', params: { trackingNumber: q } })
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-teal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <SectionLabel>Track shipment</SectionLabel>
          <h1 className="mt-4 text-4xl lg:text-[3.2rem] font-bold leading-[1.08] text-balance">Real-time visibility, end to end.</h1>
          <form onSubmit={handleSearch} className="mt-8 flex gap-3 max-w-lg">
            <input value={query} onChange={e => setQuery(e.target.value)}
              className="flex-1 rounded-[14px] border border-white/20 bg-white/20 px-5 py-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-flame-400/60"
              placeholder="Enter tracking number..." />
            <Button type="submit" className="shrink-0"><Search className="size-4" /> Track</Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-20">
        {!trackingNumber && (
          <div className="text-center py-20 text-ink-600">
            <Package className="size-16 mx-auto mb-4 text-teal-300" />
            <p className="text-xl font-semibold text-teal-950">Enter a tracking number to get started</p>
          </div>
        )}

        {isLoading && <div className="text-center py-20"><div className="size-8 border-2 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto" /></div>}
        {error && <div className="text-center py-20 text-rose-600">{error.message}</div>}

        {shipment && (
          <motion.div variants={staggerParent} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Pill>{shipment.service || 'Standard'}</Pill>
                <h2 className="text-2xl font-bold text-teal-950 mt-2">#{shipment.tracking_number}</h2>
                <p className="text-sm text-ink-600">Created {fmtDate(shipment.created_at)}</p>
              </div>
              <StatusBadge status={shipment.status} />
            </motion.div>

            {shipment.origin_lat != null && shipment.origin_lng != null &&
             shipment.destination_lat != null && shipment.destination_lng != null &&
             shipment.current_lat != null && shipment.current_lng != null && (
              <motion.div variants={scaleIn} className="h-[360px] rounded-card overflow-hidden ring-1 ring-black/5">
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
                  <h3 className="text-lg font-bold text-teal-950 mb-4">Shipment details</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between"><dt className="text-ink-600">Weight</dt><dd className="font-semibold text-teal-950">{shipment.weight_kg ? `${shipment.weight_kg} kg` : '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-600">Pieces</dt><dd className="font-semibold text-teal-950">{shipment.pieces ?? '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-600">Dimensions</dt><dd className="font-semibold text-teal-950">{shipment.dimensions || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-600">Est. delivery</dt><dd className="font-semibold text-teal-950">{fmtDate(shipment.estimated_delivery)}</dd></div>
                    {shipment.reference && <div className="flex justify-between"><dt className="text-ink-600">Reference</dt><dd className="font-semibold text-teal-950">{shipment.reference}</dd></div>}
                    <div className="flex justify-between"><dt className="text-ink-600">Sender</dt><dd className="font-semibold text-teal-950">{shipment.sender_name || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-600">Receiver</dt><dd className="font-semibold text-teal-950">{shipment.receiver_name || '—'}</dd></div>
                  </dl>
                </Card>
                {shipment.current_location_label && (
                  <Card className="p-6 mt-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="size-5 text-flame-600 shrink-0" />
                      <span className="text-ink-600">Current: <strong className="text-teal-950">{shipment.current_location_label}</strong></span>
                    </div>
                  </Card>
                )}
              </div>
              <div className="space-y-6">
                <FeesCard fees={fees} trackingNumber={shipment.tracking_number} onPaymentSuccess={() => refetch()} />
              </div>
            </motion.div>

            {images.length > 0 && (
              <motion.div variants={fadeUp}>
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-teal-950 mb-4 flex items-center gap-2"><ImageIcon className="size-5" /> Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map(img => (
                      <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden ring-1 ring-black/5 hover:ring-flame-400/50 transition">
                        <img src={img.url} alt={img.caption || ''} className="w-full h-32 object-cover" />
                        {img.caption && <p className="text-xs text-ink-600 p-2">{img.caption}</p>}
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

