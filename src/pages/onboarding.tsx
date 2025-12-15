import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle } from 'lucide-react'

export default function OnboardingPage() {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [barberName, setBarberName] = useState('')
  const [barberEmail, setBarberEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user?.email) throw new Error('User not found')

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName,
          slug: orgSlug.toLowerCase().trim(),
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Create owner user
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          organization_id: org.id,
          role: 'owner',
          full_name: user.email.split('@')[0],
          email: user.email,
        })

      if (userError) throw userError

      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not found')

      const { data: profile } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single()

      if (!profile) throw new Error('Organization not found')

      // Create barber auth user
      const { data: { user: barberAuth }, error: authError } = await supabase.auth.admin.createUser({
        email: barberEmail,
        password: Math.random().toString(36).slice(-12),
        email_confirm: true,
      })

      if (authError) throw authError
      if (!barberAuth) throw new Error('Failed to create barber user')

      // Create barber profile
      const { error: barberError } = await supabase
        .from('users')
        .insert({
          id: barberAuth.id,
          organization_id: profile.organization_id,
          role: 'barber',
          full_name: barberName,
          email: barberEmail,
        })

      if (barberError) throw barberError

      alert('Barbeiro adicionado com sucesso!')
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add barber')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo ao BarberTech Pro</h1>
        <p className="text-gray-400 mb-8">Vamos configurar sua barbearia</p>

        {step === 1 ? (
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Informações da Barbearia</h2>

            {error && (
              <div className="bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Barbearia
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="input-base"
                  placeholder="Ex: Barber Shop Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL (slug)
                </label>
                <input
                  type="text"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  className="input-base"
                  placeholder="ex: barber-shop-premium"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  URL única para acessar sua barbearia
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !orgName || !orgSlug}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Próximo'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Adicione um Barbeiro</h2>

            {error && (
              <div className="bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleAddBarber} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Barbeiro
                </label>
                <input
                  type="text"
                  value={barberName}
                  onChange={(e) => setBarberName(e.target.value)}
                  className="input-base"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email do Barbeiro
                </label>
                <input
                  type="email"
                  value={barberEmail}
                  onChange={(e) => setBarberEmail(e.target.value)}
                  className="input-base"
                  placeholder="joao@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !barberName || !barberEmail}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Adicionando...' : 'Adicionar Barbeiro'}
              </button>
            </form>

            <p className="text-gray-400 text-sm mt-4">
              Você poderá adicionar mais barbeiros depois. Clique em "Pular" para começar.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary w-full mt-3"
            >
              Pular por enquanto
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
