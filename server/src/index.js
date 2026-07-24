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
app.use(cors({
  origin: ['https://speedflightz.vercel.app', 'http://localhost:5173'],
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
app.listen(port, () => console.log(`SpeedFlightz API on :${port}`))
