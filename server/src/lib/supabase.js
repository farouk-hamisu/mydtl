import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.SUPABASE_ANON_KEY

if (!url || !serviceKey || !anonKey) {
  console.warn('[supabase] Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY in env. API will not function until these are set.')
}

// Service-role client — bypasses RLS. SERVER ONLY. Never expose to browser.
export const supabaseAdmin = createClient(url ?? 'http://localhost:54321', serviceKey ?? 'dummy', {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Anon client used to validate the user's JWT
export const supabaseAnon = createClient(url ?? 'http://localhost:54321', anonKey ?? 'dummy', {
  auth: { persistSession: false, autoRefreshToken: false },
})
