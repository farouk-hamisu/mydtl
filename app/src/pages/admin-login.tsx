import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/primitives'
import { useNavigate } from '@tanstack/react-router'

export function AdminLoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate({ to: '/admin' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-mist px-6 py-20">
      <div className="w-full max-w-md rounded-card bg-white ring-1 ring-black/5 shadow-[0_40px_120px_-40px_rgba(7,80,89,0.35)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-950">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-600">Sign in to the administration panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-teal-950 mb-1.5">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="admin@speedflightz.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-950 mb-1.5">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm text-teal-950 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-flame-500/40" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
