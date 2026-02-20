export type TaskOption = {
  id: string
  name: string
  description: string
}

export const taskOptions: TaskOption[] = [
  { id: 'research', name: 'Research', description: 'Study lore for future advantages.' },
  { id: 'guard', name: 'Camp Guard', description: 'Keep watch and gain small resources.' },
  { id: 'scout', name: 'Scouting', description: 'Explore nearby areas for clues.' },
  { id: 'forage', name: 'Foraging', description: 'Gather scraps and basic supplies.' },
  { id: 'mentor', name: 'Mentor', description: 'Coach another adventurer in training.' },
]
