import { supabase } from '../lib/supabaseClient'

export type Character = {
  id: string
  guild_id: string
  name: string
  level: number
  power: string
  strength: number
  defense: number
  agi: number
  dex: number
  magic: number
  wisdom: number
  created_at?: string
  updated_at?: string
}

// Fetch all characters for a guild
export async function fetchCharacters(guildId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('guild_id', guildId)

  if (error) {
    console.error('[fetchCharacters] Error:', error.message)
    return []
  }

  return data
}

// Create a new character if guild has fewer than 10
export async function createCharacter(
  guildId: string,
  character: Omit<Character, 'id' | 'created_at' | 'updated_at'>
): Promise<boolean> {
  const { count } = await supabase
    .from('characters')
    .select('*', { count: 'exact', head: true })
    .eq('guild_id', guildId)

  if ((count ?? 0) >= 10) {
    console.warn('[createCharacter] Max character limit reached.')
    return false
  }

  const { error } = await supabase
    .from('characters')
    .insert([
      {
        ...character,
        guild_id: guildId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

  if (error) {
    console.error('[createCharacter] Insert error:', error.message)
    return false
  }

  return true
}

// Update a character by ID
export async function updateCharacter(
  characterId: string,
  updates: Partial<Character>
): Promise<boolean> {
  const { error } = await supabase
    .from('characters')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', characterId)

  if (error) {
    console.error('[updateCharacter] Update error:', error.message)
    return false
  }

  return true
}

// Delete a character by ID
export async function deleteCharacter(characterId: string): Promise<boolean> {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', characterId)

  if (error) {
    console.error('[deleteCharacter] Delete error:', error.message)
    return false
  }

  return true
}
