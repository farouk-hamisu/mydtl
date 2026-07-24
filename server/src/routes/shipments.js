import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { authUser, requireAdmin } from '../middleware/auth.js'
import { requireUUID, isUUID } from '../middleware/validate.js'

const router = Router()

router.get('/', authUser, requireAdmin, async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('customer_shipment_view').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ shipments: data })
  } catch (e) { next(e) }
})

router.get('/:id', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('shipments').select('*').eq('id', req.params.id).single()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'not found' })

    const [fees, events, images] = await Promise.all([
      supabaseAdmin.from('shipment_fees').select('*').eq('shipment_id', data.id).order('created_at'),
      supabaseAdmin.from('tracking_events').select('*').eq('shipment_id', data.id).order('occurred_at', { ascending: false }),
      supabaseAdmin.from('shipment_images').select('*').eq('shipment_id', data.id).order('created_at'),
    ])
    if (fees.error) throw fees.error
    if (events.error) throw events.error
    if (images.error) throw images.error

    res.json({ shipment: data, fees: fees.data, events: events.data, images: images.data })
  } catch (e) { next(e) }
})

router.post('/', authUser, requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {}
    const payload = stripFields(body, [
      'tracking_number','reference','service','category_id',
      'sender_name','sender_company','sender_address','sender_country','sender_phone',
      'receiver_name','receiver_company','receiver_address','receiver_country','receiver_phone','receiver_email',
      'origin_name','origin_country','origin_lat','origin_lng',
      'destination_name','destination_country','destination_lat','destination_lng',
      'current_lat','current_lng','current_location_label',
      'weight_kg','pieces','dimensions','status','estimated_delivery','actual_delivery','notes',
    ])
    if (!payload.tracking_number) payload.tracking_number = 'SFZ-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    if (payload.current_lat == null && payload.origin_lat != null) { payload.current_lat = payload.origin_lat; payload.current_lng = payload.origin_lng }
    if (!payload.current_location_label && payload.origin_name) payload.current_location_label = payload.origin_name

    const { data, error } = await supabaseAdmin.from('shipments').insert(payload).select().single()
    if (error) throw error
    res.json({ shipment: data })
  } catch (e) { next(e) }
})

router.patch('/:id', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const payload = stripFields(req.body || {}, [
      'reference','service','category_id',
      'sender_name','sender_company','sender_address','sender_country','sender_phone',
      'receiver_name','receiver_company','receiver_address','receiver_country','receiver_phone','receiver_email',
      'origin_name','origin_country','origin_lat','origin_lng',
      'destination_name','destination_country','destination_lat','destination_lng',
      'current_lat','current_lng','current_location_label',
      'weight_kg','pieces','dimensions','status','estimated_delivery','actual_delivery','notes',
    ])
    const { data, error } = await supabaseAdmin.from('shipments').update(payload).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ shipment: data })
  } catch (e) { next(e) }
})

router.delete('/:id', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('shipments').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { next(e) }
})

router.post('/:id/events', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const { status, location_label, lat, lng, note, occurred_at } = req.body || {}
    const { data, error } = await supabaseAdmin.from('tracking_events').insert({
      shipment_id: req.params.id,
      status,
      location_label,
      lat, lng, note,
      occurred_at: occurred_at ?? new Date().toISOString(),
      created_by: req.user.id,
    }).select().single()
    if (error) throw error
    res.json({ event: data })
  } catch (e) { next(e) }
})

router.delete('/:id/events/:eventId', authUser, requireAdmin, requireUUID('id', 'eventId'), async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('tracking_events').delete().eq('id', req.params.eventId)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { next(e) }
})

router.post('/:id/fees', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const { name, description, amount, currency, status, due_date, notes } = req.body || {}
    const { data, error } = await supabaseAdmin.from('shipment_fees').insert({
      shipment_id: req.params.id, name, description,
      amount: Number(amount) || 0,
      currency: currency ?? 'USD',
      status: status ?? 'unpaid',
      due_date, notes,
      created_by: req.user.id,
    }).select().single()
    if (error) throw error
    res.json({ fee: data })
  } catch (e) { next(e) }
})

router.patch('/:id/fees/:feeId', authUser, requireAdmin, requireUUID('id', 'feeId'), async (req, res, next) => {
  try {
    const { name, description, amount, currency, status, due_date, notes } = req.body || {}
    const { data, error } = await supabaseAdmin
      .from('shipment_fees').update({ name, description, amount, currency, status, due_date, notes })
      .eq('id', req.params.feeId).select().single()
    if (error) throw error
    res.json({ fee: data })
  } catch (e) { next(e) }
})

router.delete('/:id/fees/:feeId', authUser, requireAdmin, requireUUID('id', 'feeId'), async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('shipment_fees').delete().eq('id', req.params.feeId)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { next(e) }
})

router.post('/:id/images', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const { url, caption, kind, taken_at } = req.body || {}
    const { data, error } = await supabaseAdmin.from('shipment_images').insert({
      shipment_id: req.params.id, url, caption, kind: kind ?? 'progress', taken_at,
    }).select().single()
    if (error) throw error
    res.json({ image: data })
  } catch (e) { next(e) }
})

router.delete('/:id/images/:imageId', authUser, requireAdmin, requireUUID('id', 'imageId'), async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('shipment_images').delete().eq('id', req.params.imageId)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { next(e) }
})

function stripFields(obj, allowed) {
  const out = {}
  for (const k of allowed) if (k in obj && obj[k] !== undefined) out[k] = obj[k]
  return out
}

export default router
