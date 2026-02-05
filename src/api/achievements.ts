import { supabase } from '../lib/supabaseClient';
import { achievements as localAchievements } from '../data/achievements';

export type Achievement = {
  id: string;
  key: string;
  title: string;
  description: string;
  created_at?: string;
};

export type UserAchievement = {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

// Replace this with real auth integration
export async function getCurrentUserId(): Promise<string | null> {
  let email = localStorage.getItem('userEmail');

  if (!email) {
    email = 'test@example.com';
    localStorage.setItem('userEmail', email);
    console.log('[getCurrentUserId] Set default test email:', email);
  }

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error) {
    console.error('[getCurrentUserId] Failed to fetch user ID for', email, '→', error.message);
    return null;
  }

  return data?.id || null;
}


export async function fetchAllAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase.from('achievements').select('*');
  if (error) {
    console.error('Failed to fetch achievements:', error.message);
    return [];
  }
  return data || [];
}

export async function fetchUserAchievements(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch user achievements:', error.message);
    return [];
  }

  return data.map(row => row.achievement_id);
}

export async function unlockAchievement(userId: string, key: string): Promise<boolean> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key);

  const { data: achievement, error: fetchError } = await supabase
    .from('achievements')
    .select('id')
    .eq(isUUID ? 'id' : 'key', key)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error('[unlockAchievement] Failed to fetch achievement UUID for key:', key);
    console.error('[unlockAchievement] Fetch error:', fetchError.message);
    return false;
  }
  if (!achievement) {
    console.error('[unlockAchievement] No achievement found for key:', key);
    return false;
  }

  const achievementId = achievement.id;
  const { data: existing, error: existingError } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .maybeSingle();

  if (existingError) {
    console.error('[unlockAchievement] Failed to verify existing achievement:', existingError.message);
    return false;
  }

  if (existing) {
    console.log('[unlockAchievement] Achievement already unlocked. Skipping insert.');
    return false;
  }

  const { error: insertError } = await supabase
    .from('user_achievements')
    .insert([{ user_id: userId, achievement_id: achievementId }]);

  if (insertError) {
    console.error('[unlockAchievement] Insert error:', insertError.message);
    return false;
  }

  return true;
}

export async function uploadAchievementsFromLocal(): Promise<void> {
  const { error } = await supabase
    .from('achievements')
    .upsert(
      localAchievements.map(local => ({
        key: local.id,
        title: local.title,
        description: local.description,
        unlock_after_seconds: local.unlockAfterSeconds ?? null,
      })),
      { onConflict: 'key' } // uses 'key' as unique constraint for upsert
    );

  if (error) {
    console.error('[uploadAchievementsFromLocal] Upsert error:', error.message);
  } else {
    console.log('[uploadAchievementsFromLocal] Synced all local achievements to Supabase.');
  }
}

export async function clearUserAchievements(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_achievements')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('[clearUserAchievements] Error deleting user_achievements:', error.message);
  }
}
