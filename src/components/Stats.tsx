interface Stat {
  id: string
  label: string
  value: number // Value between 0 and 100 for percentage
  description?: string
}

export default function Stats() {
  // Sample data - in a real app, this would come from a hook or prop
  const stats: Stat[] = [
    { id: '1', label: 'Project Completion', value: 85, description: 'Main app development' },
    { id: '2', label: 'User Engagement', value: 62, description: 'Daily active users' },
    { id: '3', label: 'System Uptime', value: 98, description: 'Server reliability' },
  ]

  return (
    <div className="w-64 h-full px-4 py-6 bg-gray-900 text-white space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📊 Stats</h2>
      </div>

      <ul className="space-y-4">
        {stats.map(stat => (
          <li key={stat.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-300">{stat.label}</p>
              <p className="text-xs text-yellow-200 font-mono">{stat.value}%</p>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-pink-500 h-full transition-all duration-300"
                style={{ width: `${stat.value}%` }}
              />
            </div>

            {stat.description && (
              <p className="text-xs text-gray-400 pl-1">{stat.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}