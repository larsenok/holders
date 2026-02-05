import { Adventurer } from "../types/Guild"

export type StatKey = keyof Adventurer['stats']

export type TrainingSpot = {
  id: string
  name: string
  options: [StatKey, StatKey]
  description: string
}

export const trainingSpots: TrainingSpot[] = [
  {
    id: 'sparring',
    name: 'Sparring Pit',
    options: ['strength', 'defense'],
    description: 'A place for focused combat training.',
  },
  {
    id: 'meditation',
    name: 'Meditation Circle',
    options: ['wisdom', 'magic'],
    description: 'A quiet space to deepen inner power.',
  },
  {
    id: 'obstacle',
    name: 'Obstacle Course',
    options: ['agility', 'dexterity'],
    description: 'Tests speed, balance, and adaptability.',
  },
]
