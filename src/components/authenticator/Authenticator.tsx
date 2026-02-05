import { useState } from 'react'
import { loginUser, signupUser } from '../../api/users'
import { useUser } from '../../providers/UserProvider'
import { updateCredits } from '../../api/credits'
import { fetchGuild, upsertGuild } from '../../api/guilds'
import { useGuild } from '../../providers/GuildProvider'

export default function Authenticator() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [passkey, setPasskey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const { guildStats } = useGuild()

  const initialCredits = 1000;

  const { user, setUser } = useUser()

  const handleAuth = async () => {
    setLoading(true)
    setError(null)

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedKey = passkey.trim()
    const authFn = mode === 'login' ? loginUser : signupUser
    const result = await authFn(trimmedEmail, trimmedKey)

    if (!result) {
      setError(mode === 'login' ? 'Login failed. Check your passkey.' : 'Signup failed.')
    } else {
      localStorage.setItem('userEmail', trimmedEmail)
      localStorage.setItem('userPasskey', trimmedKey)
      setUser(result)
      setOpen(false)

       // Fetch guild; create it if missing
       // isInitialized = true dersom gått via StarterPage 1 gang.
      const isInitialized = localStorage.getItem('guild_initialized') === 'true'
      const existingGuild = await fetchGuild(result.id)

      console.log(isInitialized, existingGuild, guildStats);
      if (isInitialized) {
        if (!existingGuild && guildStats?.name) {
          console.log('[AUTH] No guild found. Uploading starter guild from GuildProvider.')

          const guildOk = await upsertGuild(result.id, {
            name: guildStats.name,
            gold: guildStats.gold,
            rank: guildStats.rank,
            power: guildStats.power,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          console.log(guildOk);
        }
      } else {
        console.log('[AUTH] Guild already exists:', existingGuild)
      }

      if (mode !== 'login') {
        updateCredits(result.id, result.email, initialCredits)
      }
    }

    setLoading(false)
  }

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'))
    setError(null)
  }

  const handleLogout = () => {
    console.log('[AUTH] Logging out user')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPasskey')
    setUser(null)
  }

  return (
    <>
      <div
        className="hover:border-pink-50 h-full p-4 text-sm text-yellow-300 font-mono cursor-pointer border border-pink-800 rounded relative"
        onClick={() => setOpen(true)}
      >
        {user ? (
          <>
            <div className="text-lg">{user.email}</div>
          </>
        ) : (
          <div className="text-lg">tap to login</div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gray-900 border border-pink-700 rounded-lg p-6 w-[28rem] space-y-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-xs text-pink-500 hover:text-pink-300 underline"
              onClick={async () => {
                setLoading(true)
                const result = await loginUser('test1@example.com', 'a')
                if (result) {
                  localStorage.setItem('userEmail', 'test1@example.com')
                  localStorage.setItem('userPasskey', 'a')
                  setUser(result)
                  setOpen(false)
                } else {
                  setError('Temp login failed.')
                }
                setLoading(false)
              }}
            >
              temp login
            </button>

            {user ? (
              <>
                <h2 className="text-lg text-yellow-300 font-bold mb-2">Session</h2>
                <div className="text-sm text-pink-400">Logged in as</div>
                <div className="text-yellow-300 font-mono">{user.email}</div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white text-sm"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg text-yellow-300 font-bold mb-2">
                  {mode === 'login' ? 'Login' : 'Create Account'}
                </h2>

                <div className="space-y-1">
                  <label className="block text-pink-400 text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-gray-800 text-white border border-pink-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-pink-400 text-sm">Passkey</label>
                  <input
                    type="text"
                    value={passkey}
                    onChange={e => setPasskey(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-gray-800 text-white border border-pink-700"
                  />
                  <div className="text-xs text-gray-400">not a password. just a vibe.</div>
                </div>

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={toggleMode}
                    className="text-pink-400 hover:text-pink-300 text-sm underline"
                  >
                    {mode === 'login' ? 'Need an account?' : 'Already have one?'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAuth}
                      disabled={loading}
                      className="px-4 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white text-sm"
                    >
                      {loading
                        ? mode === 'login'
                          ? 'Logging in...'
                          : 'Signing up...'
                        : mode === 'login'
                        ? 'Login'
                        : 'Sign up'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
