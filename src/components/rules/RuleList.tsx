import type { RuleBox } from "../../types/Rules"

export function RuleList({ rules }: { rules: RuleBox['rules'] }) {
  if (rules.length === 0) return null

  return (
    <ul className="mt-4 space-y-1 text-sm text-yellow-200">
      {rules.map(rule => (
        <li key={rule.id} className="pl-3 border-l-2 border-pink-500">
          <span className="text-blue-300 font-mono">{rule.trigger}</span>: {rule.text}
        </li>
      ))}
    </ul>
  )
}