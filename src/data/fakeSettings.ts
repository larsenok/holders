export interface FakeSettingDef {
  key: string;
  label: string;
  min: number;
  max: number;
  unlockThreshold: number;
}

export const fakeDefs: FakeSettingDef[] = [
  {
    key: 'emotionalGravity',
    label: 'Emotional Gravity',
    min: 0,
    max: 10,
    unlockThreshold: 7,
  },
  {
    key: 'chanceOfRainIndoors',
    label: 'Chance of Rain Indoors',
    min: 0,
    max: 100,
    unlockThreshold: 90,
  },
  {
    key: 'fontMood',
    label: 'Font Mood',
    min: 0,
    max: 5,
    unlockThreshold: 4,
  },
  {
    key: 'quantumEcho',
    label: 'Quantum Echo',
    min: 0,
    max: 3,
    unlockThreshold: 2,
  },
  {
    key: 'sidebarFlicker',
    label: 'Sidebar Flicker Intensity',
    min: 0,
    max: 12,
    unlockThreshold: 9,
  },
];
