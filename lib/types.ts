export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  category: 'viagem' | 'carro' | 'casa' | 'educacao' | 'saude' | 'outro'
  deadline: string
  createdAt: string
}

export interface GoalStats {
  totalGoals: number
  completedGoals: number
  totalSaved: number
  totalTarget: number
  progressPercentage: number
}

export const GOAL_CATEGORIES = [
  { id: 'viagem', name: '🛫 Viagem', color: '#3b82f6' },
  { id: 'carro', name: '🚗 Carro', color: '#ef4444' },
  { id: 'casa', name: '🏠 Casa', color: '#10b981' },
  { id: 'educacao', name: '📚 Educação', color: '#f59e0b' },
  { id: 'saude', name: '⚕️ Saúde', color: '#8b5cf6' },
  { id: 'outro', name: '💰 Outro', color: '#6b7280' },
]
