export type GuardLogEntry = {
  type: 'patrol' | 'rest'
  time: number // timestamp ms
  goldEarned: number
  message: string
}
