import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { authUser, requireAdmin } from '../middleware/auth.js'
import { requireUUID } from '../middleware/validate.js'

const router = Router()

const tables = {
  services: ['title','description','icon','image_url','category_label','sort_order','published'],
  testimonials: ['author','role','company','avatar_url','quote','rating','sort_order','published'],
  gallery: ['title','url','category','sort_order'],
  partners: ['name','logo_url','sort_order','published'],
  contact_requests: [],
  newsletter_subscribers: [],
}

// Generic admin listing
router.get('/:resource', authUser, requireAdmin, async (req, res, next) => {
  try {
    const resource = req.params.resource
    if (!(resource in tables)) return res.status(404).json({ error: 'unknown resource' })
    const order = ['services','testimonials','partners','gallery'].includes(resource) ? 'sort_order' : 'created_at'
    const ascending = true
    const { data, error } = await supabaseAdmin.from(resource).select('*').order(order, { ascending })
    if (error) throw error
    res.json({ [resource]: data })
  } catch (e) { next(e) }
})

router.post('/:resource', authUser, requireAdmin, async (req, res, next) => {
  try {
    const resource = req.params.resource
    if (!(resource in tables)) return res.status(404).json({ error: 'unknown resource' })
    const allowed = tables[resource]
    const payload = allowed.length ? stripFields(req.body, allowed) : req.body
    const { data, error } = await supabaseAdmin.from(resource).insert(payload).select().single()
    if (error) throw error
    res.json({ row: data })
  } catch (e) { next(e) }
})

router.patch('/:resource/:id', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const resource = req.params.resource
    if (!(resource in tables)) return res.status(404).json({ error: 'unknown resource' })
    const allowed = tables[resource]
    const payload = allowed.length ? stripFields(req.body, allowed) : req.body
    const { data, error } = await supabaseAdmin.from(resource).update(payload).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ row: data })
  } catch (e) { next(e) }
})

router.delete('/:resource/:id', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const resource = req.params.resource
    if (!(resource in tables)) return res.status(404).json({ error: 'unknown resource' })
    const { error } = await supabaseAdmin.from(resource).delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { next(e) }
})

// Site settings
router.get('/settings/site', authUser, async (_req, res, next) => { // public-read settings also acceptable here
  try {
    const { data, error } = await supabaseAdmin.from('site_settings').select('*').eq('id', 1).single()
    if (error) throw error
    res.json({ settings: data })
  } catch (e) { next(e) }
})

router.patch('/settings/site', authUser, requireAdmin, async (req, res, next) => {
  try {
    const allowed = [
      'site_name','tagline','hero_headline','hero_subheadline','hero_bullets',
      'contact_email','contact_phone','contact_address','business_hours',
      'social_facebook','social_twitter','social_linkedin','social_instagram','social_youtube',
      'usdt_trc20_address','ach_account_holder','ach_bank','ach_account_number','ach_routing_number','ach_account_type','ach_bank_address',
      'seo_title','seo_description','seo_keywords',
    ]
    const payload = stripFields(req.body, allowed)
    const { data, error } = await supabaseAdmin.from('site_settings').update(payload).eq('id', 1).select().single()
    if (error) throw error
    res.json({ settings: data })
  } catch (e) { next(e) }
})

// Analytics (admin overview)
router.get('/analytics/overview', authUser, requireAdmin, async (_req, res, next) => {
  try {
    const [shipments, payments, fees] = await Promise.all([
      supabaseAdmin.from('shipments').select('id, status, created_at'),
      supabaseAdmin.from('payments').select('id, amount, currency, status, created_at'),
      supabaseAdmin.from('shipment_fees').select('id, amount, status'),
    ])
    const errs = [shipments.error, payments.error, fees.error].filter(Boolean)
    if (errs.length) throw errs[0]
    const totalRevenue   = payments.data.filter(p => p.status === 'verified').reduce((s, p) => s + Number(p.amount || 0), 0)
    const outstandingFees = fees.data.filter(f => f.status !== 'paid' && f.status !== 'waived').reduce((s, f) => s + Number(f.amount || 0), 0)
    const statusCounts = {}
    for (const s of shipments.data) statusCounts[s.status] = (statusCounts[s.status] || 0) + 1
    res.json({
      totals: {
        shipments: shipments.data.length,
        payments: payments.data.length,
        pendingPayments: payments.data.filter(p => p.status === 'pending').length,
      },
      totalRevenue,
      outstandingFees,
      statusCounts,
      recentShipments: shipments.data.slice(-10).reverse(),
    })
  } catch (e) { next(e) }
})

function stripFields(obj, allowed) {
  const out = {}
  for (const k of allowed) if (k in obj) out[k] = obj[k]
  return out
}

export default router
