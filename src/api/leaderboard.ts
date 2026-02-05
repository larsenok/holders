import { supabase } from '../lib/supabaseClient'

export type LeaderboardEntry = {
  id: string
  user_id: string
  email: string
  guild_name: string
  guild_gold: number
  guild_rank: string
  guild_power: number
}

// Create or update a leaderboard entry
export async function upsertLeaderboardEntry(userId: string, email: string, updates: Partial<LeaderboardEntry>): Promise<boolean> {
  const { error } = await supabase
    .from('leaderboard')
    .upsert(
      [{ user_id: userId, email, ...updates }],
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('[upsertLeaderboardEntry] Error upserting entry:', error.message)
    return false
  }

  return true
}

// Fetch a leaderboard entry for a specific user
export async function fetchLeaderboardEntry(userId: string): Promise<LeaderboardEntry | null> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('[fetchLeaderboardEntry] Error fetching entry:', error.message)
    return null
  }

  return data
}

// Update specific fields in the leaderboard
export async function updateLeaderboardFields(userId: string, updates: Partial<LeaderboardEntry>): Promise<boolean> {
  const { error } = await supabase
    .from('leaderboard')
    .update(updates)
    .eq('user_id', userId)

  if (error) {
    console.error('[updateLeaderboardFields] Error updating fields:', error.message)
    return false
  }

  return true
}

// Fetch top N leaderboard entries by guild_power
export async function fetchTopLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('guild_power', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[fetchTopLeaderboard] Error fetching leaderboard:', error.message)
    return []
  }

  return data
}

// Reset/delete a leaderboard entry (for testing)
export async function deleteLeaderboardEntry(userId: string): Promise<void> {
  const { error } = await supabase
    .from('leaderboard')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('[deleteLeaderboardEntry] Error deleting entry:', error.message)
  }
}
