import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShipmentsApi, PaymentsApi, AuthApi, ContentApi, UploadsApi } from '../../lib/api'
import { Card, Button, StatusBadge, Spinner, EmptyState, Pill } from '../../components/ui/primitives'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard, Package, Wallet, FileText, Image as ImageIcon, Settings, LogOut, Plus, Trash2, ChevronRight,
  MapPin, Calendar, Truck, AlertCircle, CheckCircle2, Clock, X, Edit3, Save, Search, Upload, ExternalLink, Globe,
} from 'lucide-react'
import { fmtDate, fmtDateTime, fmtMoney, statusLabel, initials, fileToDataUrl } from '../../lib/utils'
import { LiveMap } from '../../components/tracking/live-map'
import type { Shipment, TrackingEvent, Fee, ShipmentImage, Profile, Payment, Service, Testimonial, GalleryItem, BrandPartner, SiteSettings } from '../../lib/types'

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/shipments', icon: Package, label: 'Shipments' },
  { to: '/admin/payments', icon: Wallet, label: 'Payments' },
  { to: '/admin/content', icon: FileText, label: 'Content' },
  { to: '/admin/media', icon: ImageIcon, label: 'Media' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminLayout() {
  const { profile, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!profile) navigate({ to: '/admin/login' })
    else if (!['admin', 'manager', 'staff'].includes(profile.role)) navigate({ to: '/' })
  }, [loading, profile, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  if (loading || !profile || !['admin', 'manager', 'staff'].includes(profile.role)) return null

  return (
    <div className="min-h-screen bg-dtl-light-gray flex">
      <aside className="w-64 shrink-0 bg-dtl-charcoal text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2 text-xl font-bold tracking-tight"><img src="/logo.png" alt="DTL" className="h-10 w-auto rounded-lg" /> Admin</Link>
          <p className="text-xs text-white/40 mt-1.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(link => {
            const active = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to)
            return (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active ? 'bg-dtl-yellow/15 text-dtl-yellow' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                <link.icon className="size-4" /> {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="size-8 rounded-full bg-dtl-yellow flex items-center justify-center text-xs font-bold text-dtl-black">{initials(profile?.full_name || profile?.email)}</div>
            <div className="text-sm truncate"><p className="font-semibold truncate">{profile?.full_name || 'Admin'}</p><p className="text-white/50 text-xs truncate">{profile?.email}</p></div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-dtl-border">
          <Link to="/admin" className="flex items-center gap-2 text-lg font-bold text-dtl-black"><img src="/logo.png" alt="DTL" className="h-9 w-auto rounded-lg" /> Admin</Link>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-dtl-yellow flex items-center justify-center text-xs font-bold text-dtl-black">{initials(profile?.full_name || profile?.email)}</div>
            <button onClick={handleSignOut} className="text-dtl-charcoal hover:text-dtl-red"><LogOut className="size-5" /></button>
          </div>
        </div>
        <div className="lg:hidden flex overflow-x-auto gap-1 p-2 bg-white border-b border-dtl-border">
          {sidebarLinks.map(link => {
            const active = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to)
            return (
              <Link key={link.to} to={link.to}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  active ? 'bg-dtl-yellow text-dtl-black' : 'text-dtl-charcoal hover:bg-dtl-light-gray'
                }`}>
                <link.icon className="size-3.5" /> {link.label}
              </Link>
            )
          })}
        </div>
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => ContentApi.analytics(),
  })

  const stats = (data as any) || {}

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-dtl-black">Dashboard Overview</h1>
      {isLoading ? <Spinner /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6"><p className="text-sm text-dtl-charcoal font-semibold">Total shipments</p><p className="text-3xl font-bold text-dtl-black mt-1">{stats.totals?.shipments ?? 0}</p></Card>
            <Card className="p-6"><p className="text-sm text-dtl-charcoal font-semibold">Pending payments</p><p className="text-3xl font-bold text-dtl-red mt-1">{stats.totals?.pendingPayments ?? 0}</p></Card>
            <Card className="p-6"><p className="text-sm text-dtl-charcoal font-semibold">Outstanding fees</p><p className="text-3xl font-bold text-dtl-red mt-1">{stats.outstandingFees ? fmtMoney(stats.outstandingFees) : '$0'}</p></Card>
            <Card className="p-6"><p className="text-sm text-dtl-charcoal font-semibold">Revenue</p><p className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalRevenue ? fmtMoney(stats.totalRevenue) : '$0'}</p></Card>
          </div>
          {stats.statusCounts && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-dtl-black mb-4">Shipments by status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 rounded-xl bg-dtl-light-gray">
                    <span className="text-sm text-dtl-charcoal">{statusLabel(status)}</span>
                    <span className="font-bold text-dtl-black">{count as number}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export function AdminShipments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-shipments'],
    queryFn: () => ShipmentsApi.listAll(),
  })

  const shipments: Shipment[] = (data as any)?.shipments ?? []
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<any>({})
  const [createImageFiles, setCreateImageFiles] = useState<File[]>([])
  const [createImagePreviews, setCreateImagePreviews] = useState<string[]>([])
  const queryClient = useQueryClient()

  const createMut = useMutation({
    mutationFn: async (b: any) => {
      const result = await ShipmentsApi.create(b)
      const shipmentId = (result as any)?.shipment?.id
      if (shipmentId && createImageFiles.length > 0) {
        for (const file of createImageFiles) {
          const dataUrl = await fileToDataUrl(file)
          const up = await UploadsApi.direct({ bucket: 'shipment-images', file: dataUrl, public: true })
          await ShipmentsApi.addImage(shipmentId, { url: up.url, caption: '', kind: 'progress' })
        }
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipments'] })
      setShowCreate(false)
      setForm({})
      setCreateImageFiles([])
      setCreateImagePreviews([])
    },
  })

  const set = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }))

  const handleCreateImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setCreateImageFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setCreateImagePreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
  }

  const removeCreateImage = (index: number) => {
    setCreateImageFiles(prev => prev.filter((_, i) => i !== index))
    setCreateImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-dtl-black">Shipments</h1>
        <Button onClick={() => setShowCreate(true)}><Plus className="size-4" /> New shipment</Button>
      </div>

      {showCreate && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold text-dtl-black mb-4">Create shipment</h3>
          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); createMut.mutate(form) }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input placeholder="Sender name" value={form.sender_name ?? ''} onChange={(e: any) => set('sender_name', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Sender country" value={form.sender_country ?? ''} onChange={(e: any) => set('sender_country', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Receiver name" value={form.receiver_name ?? ''} onChange={(e: any) => set('receiver_name', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Receiver email" value={form.receiver_email ?? ''} onChange={(e: any) => set('receiver_email', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Origin" value={form.origin_name ?? ''} onChange={(e: any) => set('origin_name', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Destination" value={form.destination_name ?? ''} onChange={(e: any) => set('destination_name', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Service type" value={form.service ?? ''} onChange={(e: any) => set('service', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="0.001" placeholder="Weight (kg)" value={form.weight_kg ?? ''} onChange={(e: any) => set('weight_kg', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" placeholder="Pieces" value={form.pieces ?? ''} onChange={(e: any) => set('pieces', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input placeholder="Dimensions" value={form.dimensions ?? ''} onChange={(e: any) => set('dimensions', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <select value={form.status ?? 'created'} onChange={(e: any) => set('status', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40">
              <option value="created">Created</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="awaiting_customs_clearance">Awaiting Customs</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="customs_hold">Customs Hold</option>
              <option value="on_hold">On Hold</option>
            </select>
            <input type="date" placeholder="Est. delivery" value={form.estimated_delivery ?? ''} onChange={(e: any) => set('estimated_delivery', e.target.value)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="any" placeholder="Origin latitude" value={form.origin_lat ?? ''} onChange={(e: any) => set('origin_lat', parseFloat(e.target.value) || null)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="any" placeholder="Origin longitude" value={form.origin_lng ?? ''} onChange={(e: any) => set('origin_lng', parseFloat(e.target.value) || null)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="any" placeholder="Destination latitude" value={form.destination_lat ?? ''} onChange={(e: any) => set('destination_lat', parseFloat(e.target.value) || null)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="any" placeholder="Destination longitude" value={form.destination_lng ?? ''} onChange={(e: any) => set('destination_lng', parseFloat(e.target.value) || null)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="any" placeholder="Current latitude" value={form.current_lat ?? ''} onChange={(e: any) => set('current_lat', parseFloat(e.target.value) || null)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <input type="number" step="any" placeholder="Current longitude" value={form.current_lng ?? ''} onChange={(e: any) => set('current_lng', parseFloat(e.target.value) || null)}
              className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-dtl-charcoal mb-2">Shipment images (optional)</label>
              <input multiple type="file" accept="image/*" onChange={handleCreateImageSelect}
                className="block w-full text-sm text-dtl-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-[14px] file:border-0 file:text-sm file:font-semibold file:bg-dtl-yellow/10 file:text-dtl-red hover:file:bg-dtl-yellow/20" />
              {createImagePreviews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
                  {createImagePreviews.map((preview, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden ring-1 ring-dtl-border">
                      <img src={preview} alt="" className="w-full h-20 object-cover" />
                      <button type="button" onClick={() => removeCreateImage(i)}
                        className="absolute top-1 right-1 size-6 rounded-full bg-white/90 flex items-center justify-center text-dtl-red shadow hover:bg-white">
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMut.isPending}>Create</Button>
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <Spinner />}
      {error && <p className="text-dtl-red">{(error as any).message}</p>}
      {!isLoading && !error && shipments.length === 0 && <EmptyState title="No shipments" />}
      {shipments.length > 0 && (
        <div className="overflow-x-auto rounded-card ring-1 ring-dtl-border">
          <table className="w-full text-sm">
            <thead className="bg-dtl-light-gray text-dtl-charcoal text-left">
              <tr>
                <th className="p-4 font-semibold">Tracking</th>
                <th className="p-4 font-semibold">Sender</th>
                <th className="p-4 font-semibold">Route</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-dtl-border bg-white">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-dtl-light-gray/50 transition-colors">
                  <td className="p-4 font-semibold text-dtl-black">#{s.tracking_number}</td>
                  <td className="p-4 text-dtl-charcoal">{s.sender_name || '—'}</td>
                  <td className="p-4 text-dtl-charcoal text-xs">{s.origin_name || '?'} → {s.destination_name || '?'}</td>
                  <td className="p-4"><StatusBadge status={s.status} /></td>
                  <td className="p-4 text-dtl-charcoal text-xs">{fmtDate(s.created_at)}</td>
                  <td className="p-4">
                    <Link to="/admin/shipments/$id" params={{ id: s.id }}>
                      <ChevronRight className="size-4 text-dtl-charcoal/50" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function AdminShipment() {
  const { id } = useParams({ from: '/admin/shipments/$id' })
  const queryClient = useQueryClient()
  const [newEvent, setNewEvent] = useState({ status: '', location_label: '', note: '', occurred_at: '', lat: '', lng: '' })
  const [newFee, setNewFee] = useState({ name: '', description: '', amount: 0, currency: 'USD', status: 'unpaid' as const, due_date: '', notes: '' })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageCaption, setImageCaption] = useState('')
  const [imageKind, setImageKind] = useState('progress')
  const [editingShipment, setEditingShipment] = useState(false)
  const [shipmentForm, setShipmentForm] = useState<any>({})

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-shipment', id],
    queryFn: () => ShipmentsApi.get(id),
    enabled: !!id,
  })

  const updateShipmentMut = useMutation({
    mutationFn: (b: any) => { if (!id) throw new Error('missing id'); return ShipmentsApi.update(id, b) },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] }); setEditingShipment(false) },
  })

  const addEventMut = useMutation({
    mutationFn: (b: any) => { if (!id) throw new Error('missing id'); return ShipmentsApi.addEvent(id, b) },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] }); setNewEvent({ status: '', location_label: '', note: '', occurred_at: '', lat: '', lng: '' }) },
  })

  const delEventMut = useMutation({
    mutationFn: (evId: string) => { if (!id) throw new Error('missing id'); return ShipmentsApi.delEvent(id, evId) },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] }),
  })

  const addFeeMut = useMutation({
    mutationFn: (b: any) => { if (!id) throw new Error('missing id'); return ShipmentsApi.addFee(id, b) },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] }); setNewFee({ name: '', description: '', amount: 0, currency: 'USD', status: 'unpaid', due_date: '', notes: '' }) },
  })

  const delFeeMut = useMutation({
    mutationFn: (feeId: string) => { if (!id) throw new Error('missing id'); return ShipmentsApi.delFee(id, feeId) },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] }),
  })

  const uploadImagesMut = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('missing id')
      const results = []
      for (const file of imageFiles) {
        const dataUrl = await fileToDataUrl(file)
        const up = await UploadsApi.direct({ bucket: 'shipment-images', file: dataUrl, public: true })
        const img = await ShipmentsApi.addImage(id, { url: up.url, caption: imageCaption, kind: imageKind })
        results.push(img)
      }
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] })
      setImageFiles([])
      setImagePreviews([])
      setImageCaption('')
      setImageKind('progress')
    },
  })

  const delImgMut = useMutation({
    mutationFn: (imgId: string) => { if (!id) throw new Error('missing id'); return ShipmentsApi.delImage(id, imgId) },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-shipment', id] }),
  })

  if (isLoading) return <Spinner />
  if (error) return <p className="text-dtl-red">{(error as any).message}</p>
  if (!data) return <p className="text-dtl-charcoal">Not found.</p>

  const shipment: Shipment = data.shipment || data
  const events: TrackingEvent[] = data.events ?? []
  const fees: Fee[] = data.fees ?? []
  const images: ShipmentImage[] = data.images ?? []
  const sortedEvents = [...events].sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())

  const setEvent = (k: string, v: any) => setNewEvent((prev: any) => ({ ...prev, [k]: v }))
  const setFee = (k: string, v: any) => setNewFee((prev: any) => ({ ...prev, [k]: v }))
  const setShip = (k: string, v: any) => setShipmentForm((prev: any) => ({ ...prev, [k]: v }))

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setImagePreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
  }

  const removeSelectedImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const presetFees = [
    'Customs Duty', 'Customs Clearance Fee', 'Shipping Fee', 'Storage Fee',
    'Warehouse Charges', 'Handling Fee', 'Insurance', 'Documentation Fee',
    'Inspection Fee', 'VAT', 'Government Charges',
  ]

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/shipments" className="text-dtl-charcoal hover:text-dtl-black"><ChevronRight className="size-5 rotate-180" /></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-dtl-black">#{shipment.tracking_number}</h1>
          <p className="text-sm text-dtl-charcoal">{shipment.sender_name || '—'} → {shipment.receiver_name || '—'}</p>
        </div>
        <Button variant="outline" onClick={() => { setEditingShipment(!editingShipment); setShipmentForm(shipment) }}>
          <Edit3 className="size-4" /> {editingShipment ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {editingShipment && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dtl-black mb-4">Edit shipment</h3>
          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); updateShipmentMut.mutate(shipmentForm) }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Status</label>
              <select value={shipmentForm.status ?? ''} onChange={(e: any) => setShip('status', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40">
                {['created','picked_up','in_transit','out_for_delivery','delivered','awaiting_customs_clearance','awaiting_payment','customs_hold','payment_verification','cancelled','on_hold','returned'].map(s => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Current location</label>
              <input value={shipmentForm.current_location_label ?? ''} onChange={(e: any) => setShip('current_location_label', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Est. delivery</label>
              <input type="date" value={shipmentForm.estimated_delivery ? shipmentForm.estimated_delivery.slice(0,10) : ''} onChange={(e: any) => setShip('estimated_delivery', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Origin latitude</label>
              <input type="number" step="any" value={shipmentForm.origin_lat ?? ''} onChange={(e: any) => setShip('origin_lat', parseFloat(e.target.value) || null)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Origin longitude</label>
              <input type="number" step="any" value={shipmentForm.origin_lng ?? ''} onChange={(e: any) => setShip('origin_lng', parseFloat(e.target.value) || null)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Destination latitude</label>
              <input type="number" step="any" value={shipmentForm.destination_lat ?? ''} onChange={(e: any) => setShip('destination_lat', parseFloat(e.target.value) || null)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Destination longitude</label>
              <input type="number" step="any" value={shipmentForm.destination_lng ?? ''} onChange={(e: any) => setShip('destination_lng', parseFloat(e.target.value) || null)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Current latitude</label>
              <input type="number" step="any" value={shipmentForm.current_lat ?? ''} onChange={(e: any) => setShip('current_lat', parseFloat(e.target.value) || null)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Current longitude</label>
              <input type="number" step="any" value={shipmentForm.current_lng ?? ''} onChange={(e: any) => setShip('current_lng', parseFloat(e.target.value) || null)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Notes</label>
              <input value={shipmentForm.notes ?? ''} onChange={(e: any) => setShip('notes', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div className="sm:col-span-3 flex gap-2">
              <Button type="submit" disabled={updateShipmentMut.isPending}><Save className="size-4" /> Save</Button>
            </div>
          </form>
        </Card>
      )}

      {shipment.origin_lat != null && shipment.origin_lng != null &&
       shipment.destination_lat != null && shipment.destination_lng != null &&
       shipment.current_lat != null && shipment.current_lng != null && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-dtl-black mb-4 flex items-center gap-2"><Globe className="size-5" /> Live Map</h3>
          <div className="h-[360px] rounded-xl overflow-hidden ring-1 ring-dtl-border">
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
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-bold text-dtl-black mb-4">Tracking Events</h3>
        {sortedEvents.map((ev, i) => (
          <div key={ev.id} className="flex gap-4 pb-4 relative items-start">
            <div className="size-3 rounded-full bg-dtl-yellow ring-2 ring-dtl-yellow/20 z-10 mt-1.5" />
            {i < sortedEvents.length - 1 && <div className="w-px flex-1 bg-dtl-border absolute left-1.5 top-5" />}
            <div className="flex-1 -mt-1">
              <p className="font-semibold text-dtl-black">{statusLabel(ev.status)}</p>
              {ev.location_label && <p className="text-sm text-dtl-charcoal flex items-center gap-1"><MapPin className="size-3.5" />{ev.location_label}</p>}
              {ev.note && <p className="text-sm text-dtl-charcoal">{ev.note}</p>}
              <p className="text-xs text-dtl-charcoal/50">{fmtDateTime(ev.occurred_at)}</p>
            </div>
            <button onClick={() => delEventMut.mutate(ev.id)} className="text-dtl-charcoal/50 hover:text-dtl-red transition-colors p-1"><Trash2 className="size-4" /></button>
          </div>
        ))}
        {sortedEvents.length === 0 && <p className="text-sm text-dtl-charcoal mb-4">No events yet.</p>}

        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); addEventMut.mutate({ ...newEvent, lat: parseFloat(newEvent.lat) || null, lng: parseFloat(newEvent.lng) || null }) }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-3 pt-4 border-t border-dtl-border">
          <select required value={newEvent.status} onChange={(e: any) => setEvent('status', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40">
            <option value="">Status</option>
            {['created','picked_up','in_transit','out_for_delivery','delivered','awaiting_customs_clearance','awaiting_payment','customs_hold','payment_verification','on_hold'].map(s => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
          <input placeholder="Location" value={newEvent.location_label} onChange={(e: any) => setEvent('location_label', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <input placeholder="Lat" type="number" step="any" value={newEvent.lat} onChange={(e: any) => setEvent('lat', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <input placeholder="Lng" type="number" step="any" value={newEvent.lng} onChange={(e: any) => setEvent('lng', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <input type="datetime-local" required value={newEvent.occurred_at} onChange={(e: any) => setEvent('occurred_at', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <Button type="submit" size="sm" disabled={addEventMut.isPending}><Plus className="size-4" /></Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-dtl-black mb-4">Fees & Charges</h3>
        {fees.map(fee => (
          <div key={fee.id} className="flex items-center justify-between py-3 border-b border-dtl-border last:border-0">
            <div>
              <p className="font-semibold text-dtl-black text-sm">{fee.name}</p>
              <p className="text-xs text-dtl-charcoal">{fee.description}</p>
              {fee.due_date && <p className="text-xs text-dtl-charcoal/50">Due: {fmtDate(fee.due_date)}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-dtl-black">{fmtMoney(fee.amount, fee.currency)}</span>
              <StatusBadge status={fee.status} />
              <button onClick={() => delFeeMut.mutate(fee.id)} className="text-dtl-charcoal/50 hover:text-dtl-red"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {fees.length === 0 && <p className="text-sm text-dtl-charcoal mb-4">No fees.</p>}

        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); addFeeMut.mutate(newFee) }} className="grid grid-cols-2 lg:grid-cols-7 gap-3 pt-4 border-t border-dtl-border">
          <div className="relative">
            <input required placeholder="Fee name" list="fee-presets" value={newFee.name} onChange={(e: any) => setFee('name', e.target.value)}
              className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            <datalist id="fee-presets">
              {presetFees.map((f: string) => <option key={f} value={f} />)}
            </datalist>
          </div>
          <input placeholder="Description" value={newFee.description} onChange={(e: any) => setFee('description', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <input required type="number" step="0.01" placeholder="Amount" value={newFee.amount} onChange={(e: any) => setFee('amount', parseFloat(e.target.value) || 0)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <input placeholder="Currency" value={newFee.currency} onChange={(e: any) => setFee('currency', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <input type="date" placeholder="Due date" value={newFee.due_date} onChange={(e: any) => setFee('due_date', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <select value={newFee.status} onChange={(e: any) => setFee('status', e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40">
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partial</option>
            <option value="waived">Waived</option>
          </select>
          <Button type="submit" size="sm" disabled={addFeeMut.isPending}><Plus className="size-4" /></Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-dtl-black mb-4 flex items-center gap-2"><ImageIcon className="size-5" /> Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden ring-1 ring-dtl-border">
              <img src={img.url} alt={img.caption || ''} className="w-full h-28 object-cover" />
              {img.caption && <p className="text-xs text-dtl-charcoal p-2 bg-white">{img.caption}</p>}
              <button onClick={() => delImgMut.mutate(img.id)}
                className="absolute top-2 right-2 size-7 rounded-full bg-white/90 flex items-center justify-center text-dtl-red opacity-0 group-hover:opacity-100 transition shadow">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {imagePreviews.map((preview, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden ring-1 ring-dtl-border">
                <img src={preview} alt="" className="w-full h-28 object-cover" />
                <button onClick={() => removeSelectedImage(i)}
                  className="absolute top-2 right-2 size-7 rounded-full bg-white/90 flex items-center justify-center text-dtl-red shadow">
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); uploadImagesMut.mutate() }}
          className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-dtl-charcoal mb-1">Upload images</label>
            <input multiple type="file" accept="image/*" onChange={handleImageSelect}
              className="block w-full text-sm text-dtl-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-[14px] file:border-0 file:text-sm file:font-semibold file:bg-dtl-yellow/10 file:text-dtl-red hover:file:bg-dtl-yellow/20" />
          </div>
          <input placeholder="Caption" value={imageCaption} onChange={(e: any) => setImageCaption(e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
          <select value={imageKind} onChange={(e: any) => setImageKind(e.target.value)}
            className="rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40">
            <option value="progress">Progress</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
            <option value="damage">Damage</option>
            <option value="document">Document</option>
            <option value="warehouse">Warehouse</option>
            <option value="port">Port</option>
          </select>
          <Button type="submit" size="sm" disabled={uploadImagesMut.isPending || imageFiles.length === 0}><Upload className="size-4" /> Upload{imageFiles.length > 0 ? ` (${imageFiles.length})` : ''}</Button>
        </form>
      </Card>
    </div>
  )
}

export function AdminPayments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: () => PaymentsApi.listAll(),
  })
  const queryClient = useQueryClient()
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const verifyMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'verified' | 'rejected' }) => {
      if (!id) throw new Error('missing id')
      return PaymentsApi.verify(id, status)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-payments'] }); setSelectedPayment(null) },
  })

  const payments: Payment[] = (data as any)?.payments ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-dtl-black mb-8">Payments</h1>
      {isLoading && <Spinner />}
      {error && <p className="text-dtl-red">{(error as any).message}</p>}
      {!isLoading && !error && payments.length === 0 && <EmptyState title="No payments" />}
      {payments.length > 0 && (
        <div className="overflow-x-auto rounded-card ring-1 ring-dtl-border">
          <table className="w-full text-sm">
            <thead className="bg-dtl-light-gray text-dtl-charcoal text-left">
              <tr>
                <th className="p-4 font-semibold">Tracking</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Method</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Receipt</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-dtl-border bg-white">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-dtl-light-gray/50 transition-colors">
                  <td className="p-4 font-semibold text-dtl-black">#{(p as any).shipments?.tracking_number || '—'}</td>
                  <td className="p-4 font-semibold text-dtl-black">{fmtMoney(p.amount, p.currency)}</td>
                  <td className="p-4 text-dtl-charcoal uppercase">{p.method}</td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4">
                    {p.receipt_url ? (
                      <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="text-dtl-red hover:text-dtl-red/80 inline-flex items-center gap-1">
                        <ExternalLink className="size-3.5" /> View
                      </a>
                    ) : '—'}
                  </td>
                  <td className="p-4 text-dtl-charcoal text-xs">{fmtDate(p.created_at)}</td>
                  <td className="p-4">
                    <button onClick={() => setSelectedPayment(selectedPayment?.id === p.id ? null : p)}
                      className="text-sm font-semibold text-dtl-red hover:text-dtl-red/80">
                      {selectedPayment?.id === p.id ? 'Close' : 'Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPayment && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-bold text-dtl-black mb-4">Review payment</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm"><span className="text-dtl-charcoal">Amount</span><span className="font-semibold">{fmtMoney(selectedPayment.amount, selectedPayment.currency)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-dtl-charcoal">Method</span><span className="font-semibold uppercase">{selectedPayment.method}</span></div>
            {selectedPayment.receipt_url && (
              <div className="flex justify-between text-sm"><span className="text-dtl-charcoal">Receipt</span>
                <a href={selectedPayment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-dtl-red hover:text-dtl-red/80 inline-flex items-center gap-1"><ExternalLink className="size-3.5" /> View receipt</a>
              </div>
            )}
            {selectedPayment.notes && <div className="flex justify-between text-sm"><span className="text-dtl-charcoal">Notes</span><span>{selectedPayment.notes}</span></div>}
          </div>
          <div className="flex gap-3">
            <Button onClick={() => verifyMut.mutate({ id: selectedPayment.id, status: 'verified' })} disabled={verifyMut.isPending}>
              <CheckCircle2 className="size-4" /> Approve
            </Button>
            <Button variant="danger" onClick={() => verifyMut.mutate({ id: selectedPayment.id, status: 'rejected' })} disabled={verifyMut.isPending}>
              <X className="size-4" /> Reject
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export function AdminContent() {
  const [tab, setTab] = useState<'services' | 'gallery' | 'testimonials' | 'partners'>('services')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-content', tab],
    queryFn: () => ContentApi.list(tab),
  })

  const items: any[] = Array.isArray(data) ? data : []

  const createMut = useMutation({
    mutationFn: (b: any) => ContentApi.create(tab, b),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-content', tab] }),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) => {
      if (!id) throw new Error('missing id')
      return ContentApi.update(tab, id, body)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-content', tab] }),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => {
      if (!id) throw new Error('missing id')
      return ContentApi.remove(tab, id)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-content', tab] }),
  })

  const [newItem, setNewItem] = useState<any>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  const tabs = [
    { key: 'services' as const, label: 'Services' },
    { key: 'gallery' as const, label: 'Gallery' },
    { key: 'testimonials' as const, label: 'Testimonials' },
    { key: 'partners' as const, label: 'Partners' },
  ]

  const fields: Record<string, { key: string; label: string; type?: string }[]> = {
    services: [
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'icon', label: 'Icon' },
      { key: 'image_url', label: 'Image URL' },
      { key: 'category_label', label: 'Category' },
    ],
    gallery: [
      { key: 'title', label: 'Title' },
      { key: 'url', label: 'URL' },
      { key: 'category', label: 'Category' },
    ],
    testimonials: [
      { key: 'author', label: 'Author' },
      { key: 'role', label: 'Role' },
      { key: 'company', label: 'Company' },
      { key: 'quote', label: 'Quote' },
      { key: 'rating', label: 'Rating', type: 'number' },
    ],
    partners: [
      { key: 'name', label: 'Name' },
      { key: 'logo_url', label: 'Logo URL' },
    ],
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMut.mutate(newItem, { onSuccess: () => setNewItem({}) })
  }

  const setNew = (k: string, v: any) => setNewItem((p: any) => ({ ...p, [k]: v }))
  const setEdit = (k: string, v: any) => setEditForm((p: any) => ({ ...p, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-dtl-black mb-6">Content</h1>
      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setEditingId(null) }}
            className={`px-5 py-2.5 rounded-[14px] text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-dtl-yellow text-dtl-black' : 'bg-white text-dtl-charcoal hover:bg-dtl-light-gray ring-1 ring-dtl-border'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <Spinner />}

      <div className="space-y-4 mb-8">
        {items.map((item: any) => (
          <Card key={item.id} className="p-5">
            {editingId === item.id ? (
              <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); updateMut.mutate({ id: item.id, body: editForm }); setEditingId(null) }}
                className="space-y-3">
                {fields[tab].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-dtl-charcoal mb-1">{f.label}</label>
                    {f.key === 'quote' ? (
                      <textarea value={editForm[f.key] ?? ''} onChange={(e: any) => setEdit(f.key, e.target.value)}
                        className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" rows={3} />
                    ) : (
                      <input type={f.type || 'text'} value={editForm[f.key] ?? ''} onChange={(e: any) => setEdit(f.key, e.target.value)}
                        className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={updateMut.isPending}><Save className="size-4" /> Save</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dtl-black">{item.title || item.author || item.name || item.id}</p>
                  {item.description && <p className="text-sm text-dtl-charcoal truncate">{item.description}</p>}
                  {item.quote && <p className="text-sm text-dtl-charcoal line-clamp-2">{item.quote}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditingId(item.id); setEditForm(item) }}
                    className="size-8 rounded-full bg-dtl-light-gray flex items-center justify-center text-dtl-charcoal/50 hover:text-dtl-black"><Edit3 className="size-4" /></button>
                  <button onClick={() => deleteMut.mutate(item.id)}
                    className="size-8 rounded-full bg-dtl-light-gray flex items-center justify-center text-dtl-charcoal/50 hover:text-dtl-red"><Trash2 className="size-4" /></button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-dtl-black mb-4">Add new {tab.slice(0, -1)}</h3>
        <form onSubmit={handleCreate} className="space-y-3">
          {fields[tab].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-dtl-charcoal mb-1">{f.label}</label>
              {f.key === 'quote' ? (
                <textarea value={newItem[f.key] ?? ''} onChange={(e: any) => setNew(f.key, e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" rows={3} />
              ) : (
                <input type={f.type || 'text'} value={newItem[f.key] ?? ''} onChange={(e: any) => setNew(f.key, e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              )}
            </div>
          ))}
          <Button type="submit" size="sm" disabled={createMut.isPending}><Plus className="size-4" /> Add</Button>
        </form>
      </Card>
    </div>
  )
}

export function AdminMedia() {
  const queryClient = useQueryClient()
  const buckets = ['shipment-images', 'gallery', 'brand-logos', 'homepage', 'documents', 'payment-receipts']
  const [activeBucket, setActiveBucket] = useState(buckets[0])
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-media', activeBucket],
    queryFn: () => UploadsApi.list(activeBucket),
  })

  const uploadMut = useMutation({
    mutationFn: async () => {
      if (!uploadFile) return
      const dataUrl = await fileToDataUrl(uploadFile)
      return UploadsApi.direct({ bucket: activeBucket, file: dataUrl, public: true })
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-media', activeBucket] }); setUploadFile(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (path: string) => UploadsApi.remove(activeBucket, path),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-media', activeBucket] }),
  })

  const files: any[] = Array.isArray(data) ? data : []

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  return (
    <div>
      <h1 className="text-2xl font-bold text-dtl-black mb-6">Media Library</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {buckets.map(b => (
          <button key={b} onClick={() => setActiveBucket(b)}
            className={`px-4 py-2 rounded-[14px] text-sm font-semibold transition-colors ${
              activeBucket === b ? 'bg-dtl-yellow text-dtl-black' : 'bg-white text-dtl-charcoal hover:bg-dtl-light-gray ring-1 ring-dtl-border'
            }`}>
            {b}
          </button>
        ))}
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-dtl-black mb-4">Upload file</h3>
        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); uploadMut.mutate() }} className="flex gap-3 items-end">
          <div className="flex-1">
            <input required type="file" onChange={(e: any) => setUploadFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-dtl-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-[14px] file:border-0 file:text-sm file:font-semibold file:bg-dtl-yellow/10 file:text-dtl-red hover:file:bg-dtl-yellow/20" />
          </div>
          <Button type="submit" size="sm" disabled={uploadMut.isPending || !uploadFile}><Upload className="size-4" /> Upload</Button>
        </form>
      </Card>

      {isLoading && <Spinner />}
      {!isLoading && files.length === 0 && <EmptyState title="No files" />}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file: any) => {
            const url = `${supabaseUrl}/storage/v1/object/public/${activeBucket}/${file.name}`
            const isImage = file.metadata?.mimetype?.startsWith('image/')
            return (
              <div key={file.name} className="group relative rounded-xl overflow-hidden ring-1 ring-dtl-border bg-white">
                {isImage ? (
                  <img src={url} alt={file.name} className="w-full h-28 object-cover" />
                ) : (
                  <div className="w-full h-28 flex items-center justify-center bg-dtl-light-gray text-dtl-charcoal/50 text-xs">{file.name.split('.').pop()}</div>
                )}
                <div className="p-2">
                  <p className="text-xs text-dtl-charcoal truncate">{file.name}</p>
                </div>
                <button onClick={() => deleteMut.mutate(file.name)}
                  className="absolute top-2 right-2 size-7 rounded-full bg-white/90 flex items-center justify-center text-dtl-red opacity-0 group-hover:opacity-100 transition shadow">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function AdminSettings() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => ContentApi.getSettings(),
  })

  const settings: SiteSettings = data as SiteSettings

  const [form, setForm] = useState<any>({})
  const [message, setMessage] = useState('')

  const patchMut = useMutation({
    mutationFn: (b: any) => ContentApi.patchSettings(b),
    onSuccess: () => {
      setMessage('Settings saved.')
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
    },
    onError: (err: any) => setMessage(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    patchMut.mutate(form)
  }

  if (isLoading) return <Spinner />

  const current = settings || {}
  const merged = { ...current, ...form }

  const set = (key: string, value: string) => setForm((p: any) => ({ ...p, [key]: value }))

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-dtl-black mb-8">Platform Settings</h1>
      <div className="space-y-6">
        <Card className="p-8">
          <h3 className="text-lg font-bold text-dtl-black mb-6">General</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dtl-black mb-1.5">Site name</label>
              <input value={merged.site_name ?? ''} onChange={(e: any) => set('site_name', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dtl-black mb-1.5">Tagline</label>
              <input value={merged.tagline ?? ''} onChange={(e: any) => set('tagline', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <Card className="p-6 bg-dtl-light-gray">
              <h4 className="font-bold text-dtl-black mb-4">Hero Section</h4>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-dtl-black mb-1.5">Headline</label>
                  <input value={merged.hero_headline ?? ''} onChange={(e: any) => set('hero_headline', e.target.value)}
                    className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dtl-black mb-1.5">Subheadline</label>
                  <input value={merged.hero_subheadline ?? ''} onChange={(e: any) => set('hero_subheadline', e.target.value)}
                    className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
                </div>
              </div>
            </Card>
            {message && <p className={`text-sm ${patchMut.isSuccess ? 'text-emerald-600' : 'text-dtl-red'}`}>{message}</p>}
            <Button type="submit" disabled={patchMut.isPending}>{patchMut.isPending ? 'Saving...' : 'Save settings'}</Button>
          </form>
        </Card>

        <Card className="p-8">
          <h3 className="text-lg font-bold text-dtl-black mb-6">Contact Information</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Email</label>
                <input value={merged.contact_email ?? ''} onChange={(e: any) => set('contact_email', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Phone</label>
                <input value={merged.contact_phone ?? ''} onChange={(e: any) => set('contact_phone', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dtl-black mb-1.5">Address</label>
              <input value={merged.contact_address ?? ''} onChange={(e: any) => set('contact_address', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dtl-black mb-1.5">Business hours</label>
              <input value={merged.business_hours ?? ''} onChange={(e: any) => set('business_hours', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            {message && <p className={`text-sm ${patchMut.isSuccess ? 'text-emerald-600' : 'text-dtl-red'}`}>{message}</p>}
            <Button type="submit" disabled={patchMut.isPending}>{patchMut.isPending ? 'Saving...' : 'Save settings'}</Button>
          </form>
        </Card>

        <Card className="p-8">
          <h3 className="text-lg font-bold text-dtl-black mb-6">Payment Information</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dtl-black mb-1.5">USDT TRC20 Address</label>
              <input value={merged.usdt_trc20_address ?? ''} onChange={(e: any) => set('usdt_trc20_address', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">ACH account holder</label>
                <input value={merged.ach_account_holder ?? ''} onChange={(e: any) => set('ach_account_holder', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">ACH bank</label>
                <input value={merged.ach_bank ?? ''} onChange={(e: any) => set('ach_bank', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Account number</label>
                <input value={merged.ach_account_number ?? ''} onChange={(e: any) => set('ach_account_number', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Routing number</label>
                <input value={merged.ach_routing_number ?? ''} onChange={(e: any) => set('ach_routing_number', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Account type</label>
                <input value={merged.ach_account_type ?? ''} onChange={(e: any) => set('ach_account_type', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Bank address</label>
                <input value={merged.ach_bank_address ?? ''} onChange={(e: any) => set('ach_bank_address', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
            </div>
            {message && <p className={`text-sm ${patchMut.isSuccess ? 'text-emerald-600' : 'text-dtl-red'}`}>{message}</p>}
            <Button type="submit" disabled={patchMut.isPending}>{patchMut.isPending ? 'Saving...' : 'Save settings'}</Button>
          </form>
        </Card>

        <Card className="p-8">
          <h3 className="text-lg font-bold text-dtl-black mb-6">Social Media</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Facebook</label>
                <input value={merged.social_facebook ?? ''} onChange={(e: any) => set('social_facebook', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Twitter</label>
                <input value={merged.social_twitter ?? ''} onChange={(e: any) => set('social_twitter', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">LinkedIn</label>
                <input value={merged.social_linkedin ?? ''} onChange={(e: any) => set('social_linkedin', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dtl-black mb-1.5">Instagram</label>
                <input value={merged.social_instagram ?? ''} onChange={(e: any) => set('social_instagram', e.target.value)}
                  className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dtl-black mb-1.5">YouTube</label>
              <input value={merged.social_youtube ?? ''} onChange={(e: any) => set('social_youtube', e.target.value)}
                className="w-full rounded-[14px] border border-dtl-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-dtl-yellow/40" />
            </div>
            {message && <p className={`text-sm ${patchMut.isSuccess ? 'text-emerald-600' : 'text-dtl-red'}`}>{message}</p>}
            <Button type="submit" disabled={patchMut.isPending}>{patchMut.isPending ? 'Saving...' : 'Save settings'}</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

