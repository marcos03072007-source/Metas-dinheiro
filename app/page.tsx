use client'

import { useState, useEffect } from 'react'
import { useGoals } from '@/lib/useGoals'
import { GOAL_CATEGORIES } from '@/lib/types'

export default function Home() {
  const { goals, isLoading, addGoal, deleteGoal, addContribution } = useGoals()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [category, setCategory] = useState('viagem')
  const [deadline, setDeadline] = useState('')

  const stats = {
    totalSaved: goals.reduce((sum, g) => sum + g.currentAmount, 0),
    totalTarget: goals.reduce((sum, g) => sum + g.targetAmount, 0),
    completed: goals.filter(g => g.currentAmount >= g.targetAmount).length,
  }

  const progressPercentage = stats.totalTarget > 0
    ? (stats.totalSaved / stats.totalTarget) * 100
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && targetAmount && deadline) {
      addGoal({
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        category: category as any,
        deadline,
      })
      setName('')
      setTargetAmount('')
      setCategory('viagem')
      setDeadline('')
      setShowModal(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Carregando...</p></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 pt-8">
        <h1 className="text-3xl font-bold mb-2">Metas de Dinheiro</h1>
        <p className="text-blue-100">Economize e alcance seus objetivos</p>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Economizado</p>
              <p className="text-2xl font-bold text-blue-600">R<LaTex>$ {stats.totalSaved.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Meta</p>
              <p className="text-2xl font-bold text-blue-800">R$</LaTex> {stats.totalTarget.toFixed(2)}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-4">{stats.completed} de {goals.length} metas concluídas</p>
        </div>

        {goals.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma meta criada ainda</p>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => {
              const goalProgress = (goal.currentAmount / goal.targetAmount) * 100
              const category = GOAL_CATEGORIES.find(c => c.id === goal.category)
              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{goal.name}</p>
                      <p className="text-sm text-gray-600">{category?.name}</p>
                    </div>
                    <button onClick={() => deleteGoal(goal.id)} className="text-red-500">✕</button>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">R$ {goal.currentAmount.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">R<LaTex>$ {goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `$</LaTex>{Math.min(goalProgress, 100)}%`, backgroundColor: category?.color }}
                    ></div>
                  </div>
                  <button
                    onClick={() => {
                      const amount = prompt('Quanto deseja adicionar?')
                      if (amount) addContribution(goal.id, parseFloat(amount))
                    }}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold"
                  >
                    + Adicionar Valor
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Nova Meta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome da meta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor (R$)"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                {GOAL_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-300 rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg"
      >
        +
      </button>
    </div>
  )
}