import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { CalendarEvent } from '../types/Events';

// Replace with your method to get the logged-in user's email
const getCurrentUserEmail = () => {
  // Example: Get email from localStorage or your auth system
  return localStorage.getItem('userEmail') || 'test@example.com'; // Replace with your auth logic
};

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user's ID from users table
  const getUserId = async () => {
    const email = getCurrentUserEmail();
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Failed to fetch user ID:', error.message);
      return null;
    }
    return data?.id;
  };

  // Fetch non-hidden events for the current user
  useEffect(() => {
    (async () => {
      const userId = await getUserId();
      if (!userId) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .eq('hidden', false)
        .order('date', { ascending: true });

      if (error) {
        console.error('Failed to load events:', error.message);
      } else {
        setEvents(data);
      }

      setLoading(false);
    })();
  }, []);

  // Add a new event
  const addEvent = async (newEvent: Omit<CalendarEvent, 'id' | 'user_id' | 'hidden'>) => {
    const userId = await getUserId();
    if (!userId) {
      console.error('No user logged in');
      return;
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{ ...newEvent, user_id: userId, hidden: false }])
      .select();

    if (error) {
      console.error('Failed to add event:', error.message);
      return;
    }

    if (data) {
      setEvents([...events, data[0]]);
    }
  };

  // "Remove" an event by setting hidden: true
  const removeEvent = async (id: string) => {
    const userId = await getUserId();
    if (!userId) {
      console.error('No user logged in');
      return;
    }

    const { error } = await supabase
      .from('calendar_events')
      .update({ hidden: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to hide event:', error.message);
      return;
    }

    setEvents(events.filter(event => event.id !== id));
  };

  return { events, loading, addEvent, removeEvent };
}