import { supabase } from '../lib/supabaseClient'

export async function getCredits(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_credits')
    .select('amount')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('[getCredits] Failed to fetch credits:', error.message)
    return 0
  }

  return data?.amount ?? 0
}

export async function updateCredits(
  userId: string,
  email: string,
  amount: number
): Promise<number | null> {
  const { data, error } = await supabase
    .from('user_credits')
    .upsert({ user_id: userId, email, amount }, { onConflict: 'user_id' })
    .select('amount')
    .single()

  if (error) {
    console.error('[setCredits] Failed to set credits:', error.message)
    return null
  }

  return data.amount
}

export async function addCredits(userId: string, amountToAdd: number): Promise<number | null> {
  const current = await getCredits(userId)
  return await updateCredits(userId, '', current + amountToAdd)
}
