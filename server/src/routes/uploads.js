import { Router } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'
import { authUser, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.post('/sign', authUser, requireAdmin, async (req, res, next) => {
  try {
    const { bucket, path, contentType } = req.body || {}
    const allowed = ['shipment-images','gallery','brand-logos','homepage','documents','payment-receipts']
    if (!allowed.includes(bucket)) return res.status(400).json({ error: 'unknown bucket' })

    const safePath = sanitizePath(path || `${req.user.id}/${Date.now()}`)
    const { data, error } = await supabaseAdmin.storage.from(bucket)
      .createSignedUploadUrl(safePath, { upsert: false, contentType: contentType || 'application/octet-stream' })
    if (error) throw error

    res.json({
      bucket,
      path: safePath,
      signedUrl: data.signedUrl,
      token: data.token ?? null,
      publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${safePath}`,
    })
  } catch (e) { next(e) }
})

router.post('/direct', authUser, requireAdmin, async (req, res, next) => {
  try {
    const { bucket, path, contentType, file } = req.body || {}
    const allowed = ['shipment-images','gallery','brand-logos','homepage','documents','payment-receipts']
    if (!allowed.includes(bucket)) return res.status(400).json({ error: 'unknown bucket' })

    if (!file || !file.startsWith('data:')) return res.status(400).json({ error: 'file must be a data URL' })
    const [meta, b64] = file.split(',')
    const mime = /data:(.*?);base64/.exec(meta)?.[1] || contentType || 'application/octet-stream'
    const buffer = Buffer.from(b64 ?? '', 'base64')
    const safePath = sanitizePath(path || `${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2,6)}`)
    const { error } = await supabaseAdmin.storage.from(bucket).upload(safePath, buffer, { contentType: mime, upsert: false })
    if (error) throw error

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${safePath}`
    res.json({ bucket, path: safePath, url })
  } catch (e) { next(e) }
})

router.get('/list/:bucket', authUser, requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.storage.from(req.params.bucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error) throw error
    res.json({ files: data })
  } catch (e) { next(e) }
})

router.delete('/delete/:bucket/:path', authUser, requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.storage.from(req.params.bucket).remove([decodeURIComponent(req.params.path)])
    if (error) throw error
    res.json({ ok: true })
  } catch (e) { next(e) }
})

function sanitizePath(p) {
  return String(p).replace(/[^a-zA-Z0-9_\-./]/g, '_').replace(/^\/+/, '')
}

export default router
