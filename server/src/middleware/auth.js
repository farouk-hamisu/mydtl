import { supabaseAnon, supabaseAdmin } from '../lib/supabase.js'

export async function authUser(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header) {
      req.user = null
      return next()
    }
    const token = header.replace(/^Bearer\s+/i, '')
    if (!token) { req.user = null; return next() }

    const { data, error } = await supabaseAnon.auth.getUser(token)
    if (error || !data?.user) { req.user = null; return next() }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, role, email, full_name, is_active')
      .eq('id', data.user.id)
      .single()

    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: profile?.role ?? 'customer',
      full_name: profile?.full_name,
      is_active: profile?.is_active ?? true,
    }
    next()
  } catch (e) {
    req.user = null
    next()
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'auth required' })
  if (req.user.is_active === false) return res.status(403).json({ error: 'account suspended' })
  if (!['admin', 'manager', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ error: 'admin role required' })
  }
  next()
}
