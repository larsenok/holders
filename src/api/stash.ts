import { supabase } from '../lib/supabaseClient'
import type { GearItem, UniqueItem } from '../types/Guild'

export type GuildStash = {
  id: string
  guild_id: string
  wood: number
  stone: number
  iron: number
  herbs: number
  cloth: number
  gear: GearItem[]
  uniques: UniqueItem[]
}

// Fetch stash for a guild
export async function fetchGuildStash(guildId: string): Promise<GuildStash | null> {
  const { data, error } = await supabase
    .from('guild_stash')
    .select('*')
    .eq('guild_id', guildId)
    .single()

  if (error) {
    console.error('[fetchGuildStash] Error fetching stash:', error.message)
    return null
  }

  return data
}

// Upsert (create or update) stash entry
export async function upsertGuildStash(guildId: string, updates: Partial<GuildStash>): Promise<boolean> {
  const { error } = await supabase
    .from('guild_stash')
    .upsert(
      [{ guild_id: guildId, ...updates }],
      { onConflict: 'guild_id' }
    )

  if (error) {
    console.error('[upsertGuildStash] Error upserting stash:', error.message)
    return false
  }

  return true
}

// Update stash materials or items
export async function updateGuildStash(guildId: string, updates: Partial<GuildStash>): Promise<boolean> {
  const { error } = await supabase
    .from('guild_stash')
    .update(updates)
    .eq('guild_id', guildId)

  if (error) {
    console.error('[updateGuildStash] Error updating stash:', error.message)
    return false
  }

  return true
}

// Delete stash (reset)
export async function deleteGuildStash(guildId: string): Promise<void> {
  const { error } = await supabase
    .from('guild_stash')
    .delete()
    .eq('guild_id', guildId)

  if (error) {
    console.error('[deleteGuildStash] Error deleting stash:', error.message)
  }
}
