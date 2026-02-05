export type Frequency = 'daily' | 'weekly' | 'monthly'

export type Rule = {
  id: string
  trigger: string
  text: string
}

export type RuleBox = {
  id: string
  frequency: Frequency
  rules: Rule[]
}