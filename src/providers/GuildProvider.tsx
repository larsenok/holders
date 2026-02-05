import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import type { Adventurer, GearSlot, GuildStash, GuildStats, GuildInventory, InventoryItemType } from '../types/Guild'
import type { Area } from '../types/Missions'
import type { Visitor, VisitorType } from '../types/Visitor'
import { calculateMaxAdventurers, computePower } from '../utils/calculation'
import { defaultStash } from '../data/stash'
import { defaultInventory, itemValues } from '../data/inventory'
import { upsertGuildStash } from '../api/stash'
import { useUser } from './UserProvider'
import { externalUnlock } from './AchievementsProvider'

type GuildContextType = {
  guildStats: GuildStats
  adventurers: Adventurer[]
  guildStash: GuildStash
  guildInventory: GuildInventory
  updateGuildStash: (updates: Partial<GuildStash>) => void
  updateGuildInventory: (updates: Partial<GuildInventory>) => void
  updateGuildStats: (updates: Partial<GuildStats>) => void
  updateAdventurer: (id: string, updates: Partial<Adventurer>) => void
  addAdventurer: (newAdventurer: Adventurer) => void
  removeAdventurer: (id: string) => void
  clearAdventurers: () => void
  addGold: (g: number) => void
  addInventoryItem: (item: InventoryItemType, qty: number) => void
  removeInventoryItem: (item: InventoryItemType, qty: number) => void
  sellInventoryItem: (item: InventoryItemType, qty: number) => void
  equipGear: (adventurerId: string, slot: GearSlot, itemId: string | null) => void
  increaseRank: () => void
  increasePower: () => void
  increaseXp: (n: number) => void
  addCharacterXp: (n: number) => void
  incrementMissionCount: (area: Area) => void
  incrementTrainingCount: () => void
  recordMilestone: (event: string, area?: string) => void
  maxAdventurers: number
  rankUpVisible: boolean
  setRankUpVisible: Dispatch<SetStateAction<boolean>>
  equippedTomeIds: string[]
  setEquippedTomeIds: Dispatch<SetStateAction<string[]>>
  visitor: Visitor | null
  resolveVisitor: (clicked?: boolean) => void
  maybeSpawnVisitor: (type?: VisitorType) => void
}

const GuildContext = createContext<GuildContextType | undefined>(undefined)

const STORAGE_KEY = 'adventurers'
const STATS_KEY = 'guild_stats'
const STASH_INIT_KEY = 'stash_initialized'
const INVENTORY_KEY = 'guild_inventory'
const TOME_EQUIP_KEY = 'equippedTomes'
const GUILD_CREATE_KEY = 'guild_created_at'
const GOLD_HISTORY_KEY = 'history_gold'
const XP_HISTORY_KEY = 'history_xp'
const MISSIONS_HISTORY_KEY = 'history_missions'

export function GuildProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  const [guildStats, setGuildStats] = useState<GuildStats>(() => {
    const stored = localStorage.getItem(STATS_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          ...parsed,
          missionsCompleted: parsed.missionsCompleted || 0,
          trainingsCompleted: parsed.trainingsCompleted || 0,
          missionsCompletedByArea: parsed.missionsCompletedByArea || {},
          areaMilestones: parsed.areaMilestones || {},
          lifetimeGold: parsed.lifetimeGold || parsed.gold || 0,
          lifetimeMaterials: parsed.lifetimeMaterials || 0,
          lifetimeItems: parsed.lifetimeItems || 0,
          lifetimeTomes: parsed.lifetimeTomes || 0,
          lifetimeXp: parsed.lifetimeXp || 0,
          totalMissionTime: parsed.totalMissionTime || 0,
          areaHistory: parsed.areaHistory || {},
          bestMission: parsed.bestMission || {
            gold: { amount: 0, date: 0, area: '' },
            materials: { amount: 0, date: 0, area: '' },
            xp: { amount: 0, date: 0, area: '' },
            items: { amount: 0, date: 0, area: '' },
          },
          milestoneTimeline: parsed.milestoneTimeline || [],
          hallUpgrades: parsed.hallUpgrades || {},
          unlockedVisitors: parsed.unlockedVisitors || ['Burglar', 'NiceStranger', 'Bard', 'RealEstate'],
          passiveGoldBonus: parsed.passiveGoldBonus || 0,
          missionGoldMult: parsed.missionGoldMult || 1,
          missionGoldMultExpires: parsed.missionGoldMultExpires || 0,
        }
      } catch (err) {
        console.warn('[GuildProvider] Failed to parse guild stats', err)
      }
    }
    return {
      name: localStorage.getItem('guild_name') || 'Iron Sigil',
      gold: 1000,
      rank: 1,
      power: 0,
      xp: 0,
      nextRankXP: 100,
      missionsCompleted: 0,
      trainingsCompleted: 0,
      missionsCompletedByArea: {},
      areaMilestones: {},
      lifetimeGold: 1000,
      lifetimeMaterials: 0,
      lifetimeItems: 0,
      lifetimeTomes: 0,
      lifetimeXp: 0,
      totalMissionTime: 0,
      areaHistory: {},
      bestMission: {
        gold: { amount: 0, date: 0, area: '' },
        materials: { amount: 0, date: 0, area: '' },
        xp: { amount: 0, date: 0, area: '' },
        items: { amount: 0, date: 0, area: '' },
      },
      milestoneTimeline: [],
      hallUpgrades: {},
      unlockedVisitors: ['Burglar', 'NiceStranger', 'Bard', 'RealEstate'],
      passiveGoldBonus: 0,
      missionGoldMult: 1,
      missionGoldMultExpires: 0,
    }
  })

  const [guildStash, setGuildStash] = useState<GuildStash>(defaultStash)

  const [guildInventory, setGuildInventory] = useState<GuildInventory>(() => {
    const stored = localStorage.getItem(INVENTORY_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        console.warn('Failed to parse guild inventory from localStorage')
      }
    }
    return defaultInventory
  })

  const [adventurers, setAdventurers] = useState<Adventurer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved).map((a: Adventurer) => ({
          ...a,
          xp: 0,
          history: a.history || [],
        }))
      } catch (e) {
        console.warn('Failed to parse adventurers from localStorage', e)
      }
    }
    return []
  })
  const [equippedTomeIds, setEquippedTomeIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(TOME_EQUIP_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (equippedTomeIds.length > 2) {
      setEquippedTomeIds(equippedTomeIds.slice(0, 2))
      return
    }
    localStorage.setItem(TOME_EQUIP_KEY, JSON.stringify(equippedTomeIds))
  }, [equippedTomeIds])

  const [visitor, setVisitor] = useState<Visitor | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('currentVisitor') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem('currentVisitor', JSON.stringify(visitor))
  }, [visitor])

  const [rankUpVisible, setRankUpVisible] = useState(false)
  const maxAdventurers = calculateMaxAdventurers(guildStats.rank, guildStats.power)

  const increaseRank = () => {
    const newRank = guildStats.rank + 1
    setGuildStats(prev => ({
      ...prev,
      rank: newRank
    }))
    setRankUpVisible(true)
    if (newRank >= 5) externalUnlock('guildLv5')
    if (newRank >= 10) externalUnlock('guildLv10')
  }

  const increaseXp = (n: number) => {
    let newXp = guildStats.xp + n
    let tempRank = guildStats.rank
    let nextXP = guildStats.nextRankXP

    while (newXp >= nextXP) {
      newXp -= nextXP
      tempRank += 1
      increaseRank()
      nextXP = tempRank * 100
    }

    setGuildStats(prev => ({
      ...prev,
      xp: newXp,
      nextRankXP: nextXP,
      lifetimeXp: (prev.lifetimeXp || 0) + n,
    }))
  }

  const increasePower = () => {
    setGuildStats(prev => ({
      ...prev,
      power: prev.power + 1
    }))
  }

  const addCharacterXp = (n: number) => {
    const updated = adventurers.map(a => {
      if (a.status === 'training' || a.status === 'onTask') return a
      let newXp = (a.xp || 0) + n
      let newLevel = a.level
      let nextLevelXp = newLevel * 100
      while (newXp >= nextLevelXp && newLevel < 100) {
        newXp -= nextLevelXp
        newLevel += 1
        nextLevelXp = newLevel * 100
      }
      return { ...a, xp: newXp, level: newLevel }
    })
    updateLocal(updated)
  }

  const updateGuildStash = (updates: Partial<GuildStash>) => {
    setGuildStash(prev => ({
      ...prev,
      ...updates,
    }))
  }

  const updateGuildInventory = (updates: Partial<GuildInventory>) => {
    setGuildInventory(prev => ({
      ...prev,
      ...updates,
    }))
    localStorage.setItem(INVENTORY_KEY, JSON.stringify({ ...guildInventory, ...updates }))
  }

  const setAndSaveInventory = (updater: (prev: GuildInventory) => GuildInventory) => {
    setGuildInventory(prev => {
      const next = updater(prev)
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(next))
      return next
    })
  }

  const maybeSpawnVisitor = (type?: VisitorType) => {
    if (visitor) return
    const unlocked = guildStats.unlockedVisitors || []
    const pool = type ? [type] : unlocked
    if (pool.length === 0) return
    if (type || Math.random() < 0.25) {
      const chosen = pool[Math.floor(Math.random() * pool.length)] as VisitorType
      setVisitor({ id: Date.now().toString(), type: chosen })
    }
  }

  const recordMilestone = (event: string, area?: string) => {
    setGuildStats(prev => {
      const timeline = prev.milestoneTimeline || []
      if (timeline.some(m => m.event === event)) return prev
      return {
        ...prev,
        milestoneTimeline: [...timeline, { event, timestamp: Date.now(), area }],
      }
    })
    maybeSpawnVisitor()
  }

  const addInventoryItem = (item: InventoryItemType, qty: number) => {
    setAndSaveInventory(prev => ({
      ...prev,
      [item]: (prev[item] || 0) + qty,
    }))
    setGuildStats(prev => ({
      ...prev,
      lifetimeItems: (prev.lifetimeItems || 0) + qty,
      lifetimeTomes: item === 'Tome' ? (prev.lifetimeTomes || 0) + qty : prev.lifetimeTomes,
    }))
    if (item === 'Tome') recordMilestone('first_tome')
  }

  const removeInventoryItem = (item: InventoryItemType, qty: number) => {
    setAndSaveInventory(prev => ({
      ...prev,
      [item]: Math.max(0, (prev[item] || 0) - qty),
    }))
  }

  const sellInventoryItem = (item: InventoryItemType, qty: number) => {
    const value = itemValues[item] * qty
    removeInventoryItem(item, qty)
    addGold(value)
  }

  const addGold = (g: number) => {
    setGuildStats(prev => ({
      ...prev,
      gold: prev.gold + g,
      lifetimeGold: (prev.lifetimeGold || 0) + g,
    }))
  }

  const resolveVisitor = (clicked = true) => {
    if (!visitor) return
    if (visitor.type === 'Trader' && clicked) {
      addInventoryItem('Tome', 1)
    } else if (visitor.type === 'Burglar') {
      if (clicked) {
        addGold(10)
      } else {
        addGold(-30)
      }
    } else if (visitor.type === 'NiceStranger' && clicked) {
      addGold(20)
    } else if (visitor.type === 'RealEstate' && clicked) {
      updateGuildStats({ passiveGoldBonus: (guildStats.passiveGoldBonus || 0) + 5 })
    } else if (visitor.type === 'Bard' && clicked) {
      updateGuildStats({ missionGoldMult: 1.5, missionGoldMultExpires: Date.now() + 60000 })
    }
    setVisitor(null)
  }

  const incrementMissionCount = (area: Area) => {
    setGuildStats(prev => {
      const areaCount = (prev.missionsCompletedByArea?.[area] || 0) + 1
      const timeline = prev.milestoneTimeline || []
      const timelineUpdated =
        areaCount === 100 && !timeline.some(m => m.event === 'first_area_completion')
          ? [...timeline, { event: 'first_area_completion', timestamp: Date.now(), area }]
          : timeline
      const updated: GuildStats = {
        ...prev,
        missionsCompleted: (prev.missionsCompleted || 0) + 1,
        missionsCompletedByArea: {
          ...(prev.missionsCompletedByArea || {}),
          [area]: areaCount,
        },
        milestoneTimeline: timelineUpdated,
      }
      const achMap: Record<string, {30: string; 100: string}> = {
        Forest: { 30: 'forest30', 100: 'forest100' },
        Mountains: { 30: 'mountains30', 100: 'mountains100' },
        Swamp: { 30: 'swamp30', 100: 'swamp100' },
        Desert: { 30: 'desert30', 100: 'desert100' },
        Tundra: { 30: 'tundra30', 100: 'tundra100' },
        Ruins: { 30: 'ruins30', 100: 'ruins100' },
      }
      const map = achMap[area]
      if (map) {
        Object.entries(map).forEach(([threshold, id]) => {
          if (areaCount >= Number(threshold)) externalUnlock(id)
        })
      }
      return updated
    })
  }

  const incrementTrainingCount = () => {
    setGuildStats(prev => ({
      ...prev,
      trainingsCompleted: (prev.trainingsCompleted || 0) + 1,
    }))
  }

  const updateGuildStats = (updates: Partial<GuildStats>) => {
    setGuildStats(prev => ({ ...prev, ...updates }))
  }

  const updateAdventurer = (id: string, updates: Partial<Adventurer>) => {
    const updated = adventurers.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    )
    updateLocal(updated)
  }

  const addAdventurer = (newAdventurer: Adventurer) => {
    const updated = [...adventurers, newAdventurer]
    updateLocal(updated)
  }

  const removeAdventurer = (id: string) => {
    const updated = adventurers.filter(a => a.id !== id)
    updateLocal(updated)
  }

  const updateLocal = (updated: Adventurer[]) => {
    setAdventurers(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setGuildStats(prev => ({
      ...prev,
      power: computePower(updated, prev.rank),
    }))
  }

  useEffect(() => {
    const now = Date.now()
    const updated = adventurers.map(a => {
      let next = { ...a }
      if (a.status === 'training' && a.trainingEndsAt && a.trainingEndsAt <= now) {
        next = { ...next, status: 'idle', readyToAssignStat: true, trainingEndsAt: undefined }
      }
      if (a.status === 'resting' && a.restingEndsAt && a.restingEndsAt <= now) {
        next = { ...next, status: 'idle', restingEndsAt: undefined }
      }
      return next
    })
    updateLocal(updated)
  }, [])

  const equipGear = (adventurerId: string, slot: GearSlot, itemId: string | null) => {
    setAdventurers(prev => {
      const updated = prev.map(a => {
        if (a.id !== adventurerId) return a

        const current = a.gear[slot]
        let newStash = guildStash.gear

        // Return current item to stash
        if (current) {
          newStash = [...newStash, current]
        }

        // Take new item from stash
        let newItem: typeof current = null
        if (itemId) {
          const index = newStash.findIndex(g => g.id === itemId)
          if (index !== -1) {
            newItem = newStash[index]
            newStash.splice(index, 1)
          }
        }

        setGuildStash(prev => ({ ...prev, gear: newStash }))
        return { ...a, gear: { ...a.gear, [slot]: newItem } }
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearAdventurers = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAdventurers([])
    setTimeout(() => {
      window.location.href = '/'
    }, 100)
  }

  useEffect(() => {
    const stashInit = localStorage.getItem(STASH_INIT_KEY)

    if (!stashInit && user) {
      upsertGuildStash(user.id, defaultStash)
      localStorage.setItem(STASH_INIT_KEY, 'true')
    }

    if (!localStorage.getItem(GUILD_CREATE_KEY)) {
      localStorage.setItem(GUILD_CREATE_KEY, Date.now().toString())
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(guildStats))
  }, [guildStats])

  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem(GOLD_HISTORY_KEY) || '[]')
    prev.push(guildStats.gold)
    localStorage.setItem(GOLD_HISTORY_KEY, JSON.stringify(prev.slice(-100)))
  }, [guildStats.gold])

  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem(XP_HISTORY_KEY) || '[]')
    prev.push(guildStats.xp)
    localStorage.setItem(XP_HISTORY_KEY, JSON.stringify(prev.slice(-100)))
  }, [guildStats.xp])

  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem(MISSIONS_HISTORY_KEY) || '[]')
    prev.push(guildStats.missionsCompleted)
    localStorage.setItem(MISSIONS_HISTORY_KEY, JSON.stringify(prev.slice(-100)))
  }, [guildStats.missionsCompleted])

  return (
    <GuildContext.Provider
      value={{
        guildStats,
        adventurers,
        guildStash,
        guildInventory,
        updateGuildStash,
        updateGuildInventory,
        updateGuildStats,
        updateAdventurer,
        addAdventurer,
        removeAdventurer,
        clearAdventurers,
        addGold,
        equipGear,
        increaseRank,
        increasePower,
        increaseXp,
        addCharacterXp,
        incrementMissionCount,
        incrementTrainingCount,
        recordMilestone,
        addInventoryItem,
        removeInventoryItem,
        sellInventoryItem,
        maxAdventurers,
        rankUpVisible,
        setRankUpVisible,
        equippedTomeIds,
        setEquippedTomeIds,
        visitor,
        resolveVisitor,
        maybeSpawnVisitor,
      }}
    >
      {children}
    </GuildContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGuild() {
  const context = useContext(GuildContext)
  if (!context) throw new Error('useGuild must be used within GuildProvider')
  return context
}
