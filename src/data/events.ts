import type { TimeLabel, SeasonEvent } from "../types/Events";

export const defaultLabels: TimeLabel[] = [
  { time: '06:00', label: 'Waking haze' },
  { time: '09:00', label: 'Cold boot complete' },
  { time: '12:00', label: 'Core routines cycle' },
  { time: '15:00', label: 'Memory drift' },
  { time: '18:00', label: 'Passive uptime' },
  { time: '21:00', label: 'Shutoff warnings blink' },
];

export const events: SeasonEvent[] = [
  {
    id: 'spring_festival',
    name: 'Spring Festival',
    start: '2025-03-01T00:00:00Z',
    end: '2025-03-31T23:59:59Z',
    missions: [
      {
        id: 'event-spring-hunt-blossom-dragon',
        name: 'Hunt: Blossom Dragon',
        area: 'Forest',
        type: 'hunt',
        duration: 60,
        goldReward: 150,
        guildXp: 80,
        characterXp: 50,
        unique: true,
      },
    ],
    reward: { badge: 'spring_2025', cosmetic: 'main_colour_background_green' },
  },
  {
    id: 'summer_siege',
    name: 'Summer Siege',
    start: '2025-06-01T00:00:00Z',
    end: '2025-06-30T23:59:59Z',
    missions: [
      {
        id: 'event-summer-defend-citadel',
        name: 'Defend: Sunlit Citadel',
        area: 'Desert',
        type: 'explore',
        duration: 75,
        goldReward: 170,
        guildXp: 90,
        characterXp: 60,
        unique: true,
      },
    ],
    reward: { badge: 'summer_2025', cosmetic: 'main_colour_background_orange' },
  },
];
