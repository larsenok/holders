import { supabase } from '../lib/supabaseClient'

export type Guild = {
  id: string
  user_id: string
  name: string
  gold: number
  rank: number
  power: number
  created_at?: string
  updated_at?: string
}

// Set the user's gold to a specific value
export async function setGuildGold(userId: string, gold: number): Promise<boolean> {
  const { error } = await supabase
    .from('guilds')
    .update({ gold, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) {
    console.error('[setGuildGold] Error updating gold:', error.message)
    return false
  }

  return true
}

// Create or update a user's guild (upsert)
export async function upsertGuild(userId: string, updates: Partial<Guild>): Promise<boolean> {
  const { error } = await supabase
    .from('guilds')
    .upsert(
      [{ user_id: userId, ...updates }],
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('[upsertGuild] Error upserting guild:', error.message)
    return false
  }

  return true
}

// Fetch guild for a given user
export async function fetchGuild(userId: string): Promise<Guild | null> {
  const { data, error } = await supabase
    .from('guilds')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('[fetchGuild] Error fetching guild:', error.message)
    return null
  }

  return data
}

// Update specific fields on the user's guild
export async function updateGuildFields(userId: string, updates: Partial<Guild>): Promise<boolean> {
  const { error } = await supabase
    .from('guilds')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) {
    console.error('[updateGuildFields] Error updating guild:', error.message)
    return false
  }

  return true
}

// Reset/delete the guild (for testing)
export async function deleteGuild(userId: string): Promise<void> {
  const { error } = await supabase
    .from('guilds')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('[deleteGuild] Error deleting guild:', error.message)
  }
}

// Fetch all guilds, sorted by power (descending)
export async function fetchAllGuilds(limit: number = 50): Promise<Guild[]> {
  const { data, error } = await supabase
    .from('guilds')
    .select('*')
    .order('power', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[fetchAllGuilds] Error fetching guilds:', error.message)
    return []
  }

  return data
}
