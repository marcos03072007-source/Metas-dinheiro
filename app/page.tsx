'use client'

import { useState } from 'react'
import { useGoals } from '@/lib/useGoals'
import { GOAL_CATEGORIES } from '@/lib/types'

export default function Home() {
  const { goals, isLoading, addGoal, deleteGoal, addContribution } = useGoals()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    category: 'viagem' as const,
    deadline: '',
  })
  const [contributionGoalId, setContributionGoalId] = useState<string | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')

  const stats = goals.length > 0
    ? {
        totalSaved: goals.reduce((sum, g) => sum + g.currentAmount, 0),
        totalTarget: goals.reduce((sum, g) => sum + g.targetAmount, 0),
        completed: goals.filter(g => g.currentAmount >= g.targetAmount).length,
      }
    : { totalSaved: 0, totalTarget: 0, completed: 0 }

  const progressPercentage = stats.totalTarget > 0
    ? (stats.totalSaved / stats.totalTarget) * 100
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.targetAmount && formData.deadline) {
      addGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        category: formData.category,
        deadline: formData.deadline,
      })
      setFormData({ name: '', targetAmount: '', category: 'viagem', deadline: '' })
      setShowModal(false)
    }
  }

  const handleAddContribution = (goalId: string) => {
    if (contributionAmount && parseFloat(contributionAmount) > 0) {
      addContribution(goalId, parseFloat(contributionAmount))
      setContributionAmount('')
      setContributionGoalId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 pt-8">
        <h1 className="text-3xl font-bold mb-2">Metas de Dinheiro</h1>
        <p className="text-blue-100">Economize e alcance seus objetivos financeiros</p>
      </div>

      {/* Stats */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Economizado</p>
              <p className="text-2xl font-bold text-primary">R<LaTex>$ {stats.totalSaved.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Meta Total</p>
              <p className="text-2xl font-bold text-secondary">R$</LaTex> {stats.totalTarget.toFixed(2)}</p>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Progresso Geral</p>
              <p className="text-sm font-semibold text-primary">{progressPercentage.toFixed(1)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {stats.completed} de {goals.length} metas concluídas
          </p>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma meta criada ainda</p>
            <p className="text-gray-400 text-sm">Crie sua primeira meta para começar a economizar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => {
              const goalProgress = (goal.currentAmount / goal.targetAmount) * 100
              const category = GOAL_CATEGORIES.find(c => c.id === goal.category)
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )

              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-800">{goal.name}</p>
                      <p className="text-sm text-gray-600">{category?.name}</p>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold">R$ {goal.currentAmount.toFixed(2)}</span>
                      <span className="text-sm text-gray-600">R$ {goal.targetAmount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(goalProgress, 100)}%`,
                          backgroundColor: category?.color,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {goalProgress.toFixed(1)}% • {daysLeft > 0 ? `${daysLeft} dias` : 'Prazo expirado'}
                    </p>
                  </div>

                  {contributionGoalId === goal.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Valor"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => handleAddContribution(goal.id)}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setContributionGoalId(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setContributionGoalId(goal.id)}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600"
                    >
                      + Adicionar Valor
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nova Meta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome da Meta</label>
                <input
                  type="text"
                  placeholder="Ex: Viagem para Paris"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Valor da Meta (R$)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {GOAL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Data Limite</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-3xl shadow-lg hover:shadow-xl transition-shadow"
      >
        +
      </button>
    </div>
  )
}
