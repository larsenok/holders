import { useState } from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import type { CalendarEvent } from '../types/Events';

export default function Calendar() {
  const { events = [], loading, addEvent, removeEvent } = useCalendarEvents();
  const [showPast, setShowPast] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', description: '' });

  const now = new Date();

  const pastEvents = events.filter(e => new Date(e.date) < now);
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);

  const sorted = [...upcomingEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const grouped = sorted.reduce((acc, event) => {
    const day = format(parseISO(event.date), 'yyyy-MM-dd');
    acc[day] ??= [];
    acc[day].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const dayKeys = Object.keys(grouped);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.date && newEvent.description) {
      await addEvent({
        date: new Date(newEvent.date).toISOString(),
        description: newEvent.description,
      });
      setNewEvent({ date: '', description: '' });
    }
  };

  if (loading) {
    return <div className="w-64 h-full px-4 py-6 bg-gray-900 text-white">Loading...</div>;
  }

  if (!events && !loading) {
    return (
      <div className="w-64 h-full px-4 py-6 bg-gray-900 text-white">
        <p className="text-sm text-gray-400">Please log in to view events.</p>
      </div>
    );
  }

  return (
    <div className="w-64 h-full px-4 py-6 bg-gray-900 text-white space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">🗓️ Calendar</h2>
        <button
          onClick={() => setShowPast(true)}
          className="text-[10px] px-2 py-0.5 text-pink-400 border border-pink-600 rounded hover:bg-pink-700/10"
        >
          Show Past
        </button>
      </div>

      <form onSubmit={handleAddEvent} className="space-y-2">
        <input
          type="datetime-local"
          value={newEvent.date}
          onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
          className="w-full bg-gray-800 text-white text-sm p-1 rounded"
          required
        />
        <input
          type="text"
          value={newEvent.description}
          onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
          placeholder="Event description"
          className="w-full bg-gray-800 text-white text-sm p-1 rounded"
          required
        />
        <button
          type="submit"
          className="w-full text-sm px-2 py-1 bg-pink-600 hover:bg-pink-700 rounded"
        >
          Add Event
        </button>
      </form>

      {dayKeys.map((dateKey, index) => {
        const events = grouped[dateKey];
        const currentDate = parseISO(dateKey);

        let gapLabel: string | null = null;

        if (index === 0) {
          const delta = differenceInCalendarDays(currentDate, new Date());
          if (delta === 1) gapLabel = 'tomorrow';
          else if (delta > 1) gapLabel = `in ${delta} days`;
        } else {
          const prevDate = parseISO(dayKeys[index - 1]);
          const delta = differenceInCalendarDays(currentDate, prevDate);
          if (delta > 1) gapLabel = `+ ${delta} days`;
        }

        return (
          <div key={dateKey} className="relative space-y-2">
            {gapLabel && (
              <div className="text-yellow-400 font-bold text-md py-2 tracking-wide">
                {gapLabel}
              </div>
            )}

            {index !== 0 && <div className="border-t border-pink-700 my-2" />}

            <p className="text-xs text-blue-300 mb-1">
              {format(currentDate, 'eeee, MMM d')}
            </p>

            <ul className="space-y-3">
              {events.map(event => (
                <li
                  key={event.id}
                  className="pl-3 border-l-2 border-pink-400 flex justify-between items-start group"
                >
                  <div>
                    <p className="font-mono text-yellow-200">
                      {format(parseISO(event.date), 'HH:mm')}
                    </p>
                    <p className="text-sm text-gray-300">{event.description}</p>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="text-[10px] bg-pink-600 hover:bg-pink-700 text-white rounded-full w-5 h-5 flex items-center justify-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hide event"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {showPast && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPast(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-gray-900 border border-pink-700 rounded-lg p-6 w-[28rem] max-h-[80vh] overflow-auto space-y-4"
          >
            <h3 className="text-yellow-300 text-lg font-bold mb-2">📜 Past Events</h3>

            {pastEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No past events.</p>
            ) : (
              <ul className="space-y-3 text-sm text-yellow-100">
                {pastEvents
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(event => (
                    <li
                      key={event.id}
                      className="pl-3 border-l-2 border-pink-500 space-y-1 flex justify-between items-start"
                    >
                      <div>
                        <p className="font-mono text-blue-300">
                          {format(parseISO(event.date), 'eeee, MMM d — HH:mm')}
                        </p>
                        <p className="text-gray-300">{event.description}</p>
                      </div>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-[10px] bg-pink-600 hover:bg-pink-700 text-white rounded-full w-5 h-5 flex items-center justify-center ml-2"
                        title="Hide event"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
              </ul>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowPast(false)}
                className="px-4 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}