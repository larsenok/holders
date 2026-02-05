import type { Area } from "../data/areas"

export type MissionType = 'explore' | 'gathering' | 'hunt' | string

export type TomeSnapshot = {
  ids: string[]
  goldMult: number
  xpMult: number
}

export type MissionRun = {
  id: string
  startedAt: number
  tomeSnapshot: TomeSnapshot
  adventurerIds: string[]
}

export type Mission = {
  id: string
  name: string
  area: Area
  type: MissionType
  duration: number
  goldReward: number
  guildXp: number
  characterXp: number
  unique: boolean
}

export type UniqueMission = Mission

export type { Area }
