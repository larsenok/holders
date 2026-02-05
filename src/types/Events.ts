export type CalendarEvent = {
  id: string;
  user_id: string;
  date: string;
  description: string;
  hidden: boolean;
};

export type TimeLabel = {
  time: string; // "HH:mm"
  label: string;
};

export type SeasonEvent = {
  id: string;
  name: string;
  start: string; // ISO date
  end: string; // ISO date
  missions: import('./Missions').Mission[];
  reward: {
    badge: string;
    cosmetic?: string;
  };
};