import { useState } from 'react'
import { useServices, useBarbersAvailability, useAvailableSlots, useCreateBooking, useClients } from '@/hooks/useBooking'
import { useOrganization } from '@/hooks/useOrganization'
import { ChevronRight, Calendar, User, Clock } from 'lucide-react'

export default function BookingFlow() {
  const { organization } = useOrganization()
  const [step, setStep] = useState<'service' | 'barber' | 'date' | 'time' | 'client'>('service')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const { data: services, isLoading: servicesLoading } = useServices(organization?.id || '')
  const { data: barbers } = useBarbersAvailability(organization?.id || '', selectedDate || new Date())
  const { data: slots } = useAvailableSlots(
    organization?.id || '',
    selectedBarber || '',
    selectedService || '',
    selectedDate || new Date()
  )
  const { data: clients } = useClients(organization?.id || '')
  const createBooking = useCreateBooking()

  if (!organization) return null

  const handleCreateBooking = async () => {
    if (!selectedClientId || !selectedBarber || !selectedService || !selectedTime) return

    const service = services?.find(s => s.id === selectedService)
    if (!service) return

    try {
      await createBooking.mutateAsync({
        organizationId: organization.id,
        clientId: selectedClientId,
        barberId: selectedBarber,
        serviceId: selectedService,
        scheduledAt: selectedTime,
        servicePrice: service.price,
        prepaymentRequired: false,
        prepaymentAmount: undefined,
      })

      alert('Agendamento criado com sucesso!')
      setStep('service')
      setSelectedService(null)
      setSelectedBarber(null)
      setSelectedDate(null)
      setSelectedTime(null)
      setSelectedClientId(null)
    } catch (error) {
      alert('Erro ao criar agendamento')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Novo Agendamento</h2>
        <p className="text-gray-400">Guia passo a passo para agendar um horário</p>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-2 mb-8">
        {['service', 'barber', 'date', 'time', 'client'].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              s === step ? 'bg-gold-500' : 'bg-dark-700'
            }`}
          />
        ))}
      </div>

      {/* Serviço */}
      {step === 'service' && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-500" />
            Selecione o Serviço
          </h3>
          {servicesLoading ? (
            <p className="text-gray-400">Carregando serviços...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services?.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id)
                    setStep('barber')
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService === service.id
                      ? 'border-gold-500 bg-dark-800'
                      : 'border-dark-700 hover:border-gold-500'
                  }`}
                >
                  <p className="text-white font-semibold">{service.name}</p>
                  <p className="text-gray-400 text-sm">{service.duration_minutes}min</p>
                  <p className="text-gold-500 font-bold mt-2">R$ {service.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
          {selectedService && (
            <button
              onClick={() => setStep('barber')}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Barbeiro */}
      {step === 'barber' && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gold-500" />
            Selecione o Barbeiro
          </h3>
          <div className="space-y-3">
            {barbers?.map((barber) => (
              <div
                key={barber.id}
                onClick={() => {
                  setSelectedBarber(barber.id)
                  setStep('date')
                }}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedBarber === barber.id
                    ? 'border-gold-500 bg-dark-800'
                    : 'border-dark-700 hover:border-gold-500'
                }`}
              >
                <p className="text-white font-semibold">{barber.full_name}</p>
                <p className="text-gray-400 text-sm">⭐ {barber.rating} ({barber.total_reviews} avaliações)</p>
              </div>
            ))}
            <button
              onClick={() => {
                setSelectedBarber('any')
                setStep('date')
              }}
              className="w-full p-4 border border-dark-700 rounded-lg hover:border-gold-500 transition-colors"
            >
              <p className="text-white font-semibold">Sem preferência</p>
              <p className="text-gray-400 text-sm">Próximo disponível</p>
            </button>
          </div>
          <button
            onClick={() => setStep('service')}
            className="btn-secondary w-full mt-6"
          >
            Voltar
          </button>
        </div>
      )}

      {/* Data */}
      {step === 'date' && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            Selecione a Data
          </h3>
          <input
            type="date"
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="input-base w-full"
            min={new Date().toISOString().split('T')[0]}
          />
          {selectedDate && (
            <button
              onClick={() => setStep('time')}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setStep('barber')}
            className="btn-secondary w-full mt-3"
          >
            Voltar
          </button>
        </div>
      )}

      {/* Hora */}
      {step === 'time' && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Selecione o Horário</h3>
          <div className="grid grid-cols-3 gap-2">
            {slots?.map((slot) => {
              const time = new Date(slot)
              const timeStr = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              return (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedTime(slot)
                    setStep('client')
                  }}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedTime === slot
                      ? 'border-gold-500 bg-gold-500 text-dark-950'
                      : 'border-dark-700 hover:border-gold-500'
                  }`}
                >
                  {timeStr}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setStep('date')}
            className="btn-secondary w-full mt-6"
          >
            Voltar
          </button>
        </div>
      )}

      {/* Cliente */}
      {step === 'client' && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Selecione o Cliente</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {clients?.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClientId(client.id)
                }}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedClientId === client.id
                    ? 'border-gold-500 bg-dark-800'
                    : 'border-dark-700 hover:border-gold-500'
                }`}
              >
                <p className="text-white font-semibold">{client.full_name}</p>
                <p className="text-gray-400 text-sm">{client.phone}</p>
              </div>
            ))}
          </div>
          {selectedClientId && (
            <button
              onClick={handleCreateBooking}
              disabled={createBooking.isPending}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {createBooking.isPending ? 'Criando...' : 'Confirmar Agendamento'}
            </button>
          )}
          <button
            onClick={() => setStep('time')}
            className="btn-secondary w-full mt-3"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  )
}
