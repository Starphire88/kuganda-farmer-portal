'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Alert = {
  id: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', message: 'Payment of UGX 700,000 due in 19 days', type: 'warning', is_read: false, created_at: '' },
    { id: '2', message: 'Your loan was disbursed on 1 Jan 2026', type: 'info', is_read: false, created_at: '' },
  ])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      // Load existing alerts from Supabase
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false })
      if (data && data.length > 0) setAlerts(data)

      // Subscribe to new alerts in real time
      const channel = supabase
        .channel('alerts-channel')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `farmer_id=eq.${user.id}`,
        }, (payload) => {
          setAlerts((prev) => [payload.new as Alert, ...prev])
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
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
        <p className="text-green-900 font-medium">Welcome back 👋</p>
        <p className="text-sm text-gray-500 -mt-2">{user.email}</p>

        {/* Loan Summary */}
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

        {/* Alerts — real-time */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Alerts {alerts.filter(a => !a.is_read).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {alerts.filter(a => !a.is_read).length} new
              </span>
            )}
          </h2>
          {alerts.length === 0 && <p className="text-sm text-gray-400">No alerts yet.</p>}
          {alerts.map((a) => (
            <div key={a.id} className={`flex gap-3 p-3 rounded-lg mb-2 ${a.type === 'warning' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              <span>{a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <p className="text-sm text-gray-700">{a.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
