import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import shipmentsRouter from './routes/shipments.js'
import paymentsRouter from './routes/payments.js'
import contentRouter from './routes/content.js'
import authRouter from './routes/auth.js'
import publicRouter from './routes/public.js'
import uploadsRouter from './routes/uploads.js'

const app = express()

const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const allowedOrigins = new Set([
  'https://diamondthrivelogistics.com',
  'https://www.diamondthrivelogistics.com',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  ...envOrigins,
])

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.has(origin)) return true
  // local dev: Vite auto-increments the port when 5173 is taken
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true
  // Vercel preview deployments of this project
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true
  // production domain, with or without a subdomain (www, staging, ...)
  if (/^https:\/\/([a-z0-9-]+\.)*diamondthrivelogistics\.com$/.test(origin)) return true
  return false
}

// cors requires the origin option (when a function) to call cb(err, allow);
// returning a value instead would never call next() and every request would hang.
function originCallback(origin, cb) {
  cb(null, isAllowedOrigin(origin) ? origin : false)
}

app.use(cors({
  origin: originCallback,
  credentials: true,
}))
app.use(express.json({ limit: '12mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

app.use('/api/auth', authRouter)
app.use('/api/public', publicRouter)
app.use('/api/shipments', shipmentsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/content', contentRouter)
app.use('/api/uploads', uploadsRouter)

app.use((err, _req, res, _next) => {
  console.error('[api:error]', err.message)
  res.status(err.status ?? 500).json({ error: err.message ?? 'server error' })
})

const port = Number(process.env.PORT || 8787)
app.listen(port, () => console.log(`DiamondThriveLogistics API on :${port}`))
