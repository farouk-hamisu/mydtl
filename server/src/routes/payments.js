import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { authUser, requireAdmin } from '../middleware/auth.js'
import { requireUUID } from '../middleware/validate.js'

const router = Router()

router.get('/', authUser, requireAdmin, async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('payments')
      .select('*, shipments(tracking_number), shipment_fees(name), customer:profiles!customer_id(full_name, email), verifier:profiles!verified_by(full_name, email)')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ payments: data })
  } catch (e) { next(e) }
})

router.patch('/:id/verify', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const { status, note } = req.body || {}
    if (!['verified','rejected','pending'].includes(status)) return res.status(400).json({ error: 'invalid status' })
    const patch = {
      status,
      verified_by: req.user.id,
      verified_at: status === 'verified' ? new Date().toISOString() : null,
    }
    if (note) patch.notes = note
    const { data, error } = await supabaseAdmin.from('payments').update(patch).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ payment: data })
  } catch (e) { next(e) }
})

export default router
