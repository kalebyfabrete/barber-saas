import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrganization } from '@/hooks/useOrganization'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, Plus } from 'lucide-react'
import BookingFlow from '@/components/BookingFlow'

export default function DashboardPage() {
  const { organization } = useOrganization()
  const { signOut } = useAuth()
  const [showBookingFlow, setShowBookingFlow] = useState(false)

  const { data: metrics } = useQuery({
    queryKey: ['metrics', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null

      const today = new Date().toISOString().split('T')[0]

      const { data } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('date', today)
        .maybeSingle()

      return data
    },
    enabled: !!organization?.id,
  })

  const { data: bookings } = useQuery({
    queryKey: ['bookings-today', organization?.id],
    queryFn: async () => {
      if (!organization?.id) return []

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data } = await supabase
        .from('bookings')
        .select('*, clients(full_name, phone), users(full_name), services(name, price)')
        .eq('organization_id', organization.id)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at')

      return data || []
    },
    enabled: !!organization?.id,
  })

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="border-b border-dark-700 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {organization?.name || 'Dashboard'}
            </h1>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </nav>

      <div className="container-page">
        {showBookingFlow ? (
          <div className="mb-8">
            <button
              onClick={() => setShowBookingFlow(false)}
              className="text-gray-400 hover:text-white mb-4 text-sm"
            >
              ← Voltar ao Dashboard
            </button>
            <BookingFlow />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Bem-vindo</h2>
                <p className="text-gray-400">Gerencie sua barbearia em tempo real</p>
              </div>
              <button
                onClick={() => setShowBookingFlow(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo Agendamento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card">
                <p className="text-gray-400 text-sm mb-1">Agendamentos Hoje</p>
                <p className="text-3xl font-bold text-white">{bookings?.length || 0}</p>
              </div>
              <div className="card">
                <p className="text-gray-400 text-sm mb-1">Taxa de No-Show</p>
                <p className="text-3xl font-bold text-gold-500">
                  {metrics?.no_show_rate || 0}%
                </p>
              </div>
              <div className="card">
                <p className="text-gray-400 text-sm mb-1">Faturamento Hoje</p>
                <p className="text-3xl font-bold text-white">
                  R$ {(metrics?.revenue || 0).toFixed(2)}
                </p>
              </div>
              <div className="card">
                <p className="text-gray-400 text-sm mb-1">Taxa de Ocupação</p>
                <p className="text-3xl font-bold text-green-500">
                  {metrics?.occupancy_rate || 0}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-4">Agendamentos de Hoje</h2>
                  {bookings && bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.map((booking: any) => (
                        <div
                          key={booking.id}
                          className="p-4 bg-dark-800 rounded-lg border border-dark-700 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white font-semibold">
                              {booking.clients?.full_name || 'Cliente'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {booking.services?.name} • {booking.users?.full_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gold-500 font-semibold">
                              {new Date(booking.scheduled_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              booking.status === 'completed'
                                ? 'bg-green-950 text-green-400'
                                : booking.status === 'no_show'
                                ? 'bg-red-950 text-red-400'
                                : 'bg-yellow-950 text-yellow-400'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Nenhum agendamento para hoje</p>
                  )}
                </div>
              </div>

              <div>
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4">Próximos Passos</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500">✓</span>
                      <span className="text-gray-300">Agendamento online funcionando</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500">→</span>
                      <span className="text-gray-400">Integração WhatsApp</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500">→</span>
                      <span className="text-gray-400">Sistema anti-no-show</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500">→</span>
                      <span className="text-gray-400">Pagamentos integrados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500">→</span>
                      <span className="text-gray-400">Sistema de assinaturas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
