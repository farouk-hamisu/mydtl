import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

type AdminCtx = {
  session: { user: { id: string; email?: string } } | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const Ctx = createContext<AdminCtx>(null as any)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    if (data.session?.user) {
      const prof = await fetchProfile(data.session.user.id)
      setProfile(prof)
    } else {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await refresh()
      if (mounted) setLoading(false)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange(async () => { await refresh() })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [refresh])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await refresh()
  }, [refresh])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }, [])

  const isAdmin = !!profile && ['admin', 'manager', 'staff'].includes(profile.role)

  return (
    <Ctx.Provider value={{ session, profile, loading, signIn, signOut, isAdmin }}>
      {children}
    </Ctx.Provider>
  )
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return data as Profile | null
  } catch {
    return null
  }
}
