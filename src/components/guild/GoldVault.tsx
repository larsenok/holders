import { useEffect, useState } from 'react'
import { useUser } from '../../providers/UserProvider'
import { fetchGuild, setGuildGold } from '../../api/guilds'
import { useGuild } from '../../providers/GuildProvider'

export default function GoldVault() {
  const { user } = useUser()
  const [vaultGold, setVaultGold] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const { guildStats } = useGuild();
  const localGold = guildStats.gold;

  useEffect(() => {
    if (user) {
      fetchGuild(user.id).then(g => {
        if (g) setVaultGold(g.gold)
      })
    }
  }, [user])

  const handleSend = async () => {
    if (!user || vaultGold === null) return
    setSending(true)

    const newTotal = vaultGold + localGold
    const success = await setGuildGold(user.id, newTotal)

    if (success) {
      setVaultGold(newTotal)
    }

    setSending(false)
  }

  return (
    <div className="p-2 border border-yellow-400 rounded bg-gray-900 text-yellow-200 font-mono space-y-2 w-48">
      <h2 className="text-lg font-bold text-yellow-300">🏆 Vault</h2>

      <div className="flex justify-between text-sm">
        <span>Local</span>
        <span>{localGold} 🪙</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Vault</span>
        <span>{vaultGold !== null ? `${vaultGold} 🪙` : '...'}</span>
      </div>

      <button
        onClick={handleSend}
        disabled={sending || localGold === 0}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-2 py-1 rounded disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}
