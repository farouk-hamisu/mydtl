import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { authUser, requireAdmin } from '../middleware/auth.js'
import { requireUUID } from '../middleware/validate.js'

const router = Router()

router.get('/profiles', authUser, requireAdmin, async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ profiles: data })
  } catch (e) { next(e) }
})

router.patch('/profiles/:id', authUser, requireAdmin, requireUUID('id'), async (req, res, next) => {
  try {
    const allowed = ['full_name','phone','company','country','address','avatar_url','role','is_active']
    const patch = {}
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k]
    const { data, error } = await supabaseAdmin
      .from('profiles').update(patch).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ profile: data })
  } catch (e) { next(e) }
})

export default router
