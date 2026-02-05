import { supabase } from '../lib/supabaseClient'

export type User = {
  id: string
  email: string
  passkey?: string
}

export async function loginUser(email: string, passkey: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, passkey')
    .eq('email', email)
    .limit(1)
    .single()

  if (error) {
    console.error('[loginUser] Supabase error:', error.message)
    return null
  }

  if (user) {
    if (user.passkey !== passkey) {
      console.warn('[loginUser] Passkey mismatch for', email)
      return null
    }
    return { id: user.id, email: user.email }
  }

  // If not found, create user with passkey
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ email, passkey })
    .select('id, email')
    .single()

  if (insertError) {
    console.error('[loginUser] Failed to create user:', insertError.message)
    return null
  }

  return newUser
}

export async function signupUser(email: string, passkey: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, passkey })
    .select('id, email')
    .single()

  if (error) {
    console.error('[signupUser] Failed to create user:', error.message)
    return null
  }

  return data
}

// Fetch user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .limit(1)
    .single()

  if (error) {
    console.error('[getUserByEmail] Error:', error.message)
    return null
  }

  return data
}

// Ensure user exists, create if not
export async function ensureUser(email: string): Promise<User | null> {
  const existing = await getUserByEmail(email)
  if (existing) return existing

  const { data, error } = await supabase
    .from('users')
    .insert({ email })
    .select('id, email')
    .single()

  if (error) {
    console.error('[ensureUser] Failed to create user:', error.message)
    return null
  }

  return data
}

// Entry point for login flow
export async function loadOrCreateUser(): Promise<User | null> {
  let email = localStorage.getItem('userEmail')

  if (!email) {
    email = 'test@example.com'
    localStorage.setItem('userEmail', email)
    console.log('[loadOrCreateUser] Set default test email:', email)
  }

  return await ensureUser(email)
}
