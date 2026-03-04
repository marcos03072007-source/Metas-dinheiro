'use client'

import { useState, useEffect } from 'react'
import { Goal, GoalStats } from './types'

const GOALS_KEY = 'metas_dinheiro_goals'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedGoals = localStorage.getItem(GOALS_KEY)
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (error) {
        console.error('Erro ao carregar metas:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals)
    localStorage.setItem(GOALS_KEY, JSON.stringify(newGoals))
  }

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    saveGoals([...goals, newGoal])
    return newGoal
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map(g => g.id === id ? { ...g, ...updates } : g)
    saveGoals(updated)
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id))
  }

  const addContribution = (goalId: string, amount: number) => {
    updateGoal(goalId, {
      currentAmount: (goals.find(g => g.id === goalId)?.currentAmount || 0) + amount,
    })
  }

  const getStats = (): GoalStats => {
    const totalGoals = goals.length
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const progressPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

    return {
      totalGoals,
      completedGoals,
      totalSaved,
      totalTarget,
      progressPercentage,
    }
  }

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    getStats,
  }
}
