'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-green-50">

      {/* Header */}
      <header className="bg-green-800 text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <div>
            <p className="font-bold text-sm">Kuganda Tech</p>
            <p className="text-xs text-green-200">Farmer Portal</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="text-xs bg-green-700 hover:bg-green-600 px-3 py-1 rounded-full">
          Sign out
        </button>
      </header>

      <div className="px-4 py-6 space-y-4 max-w-lg mx-auto">

        {/* Welcome */}
        <p className="text-green-900 font-medium">Welcome back 👋</p>
        <p className="text-sm text-gray-500 -mt-2">{user.email}</p>

        {/* Loan Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Active Loan</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Total Amount</span>
            <span className="font-bold text-green-800">UGX 2,500,000</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Balance Remaining</span>
            <span className="font-bold text-orange-600">UGX 1,800,000</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 text-sm">Next Due Date</span>
            <span className="font-bold text-red-600">15 Jun 2026</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">28% repaid</p>
        </div>

        {/* Repayment Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Repayment Schedule</h2>
          {[
            { season: 'Season A 2026', due: '15 Jun 2026', amount: 'UGX 700,000', status: 'pending' },
            { season: 'Season B 2026', due: '15 Oct 2026', amount: 'UGX 700,000', status: 'upcoming' },
            { season: 'Season A 2025', due: '15 Jun 2025', amount: 'UGX 700,000', status: 'paid' },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-700">{r.season}</p>
                <p className="text-xs text-gray-400">{r.due}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{r.amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.status === 'paid' ? 'bg-green-100 text-green-700' :
                  r.status === 'pending' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-500'
                }`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Alerts</h2>
          {[
            { type: 'warning', message: 'Payment of UGX 700,000 due in 19 days' },
            { type: 'info', message: 'Your loan was disbursed on 1 Jan 2026' },
          ].map((a, i) => (
            <div key={i} className={`flex gap-3 p-3 rounded-lg mb-2 ${a.type === 'warning' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              <span>{a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <p className="text-sm text-gray-700">{a.message}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
