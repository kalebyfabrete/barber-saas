import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Service, Booking, Client } from '@/types'

export function useServices(organizationId: string) {
  return useQuery({
    queryKey: ['services', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error
      return data as Service[]
    },
    enabled: !!organizationId,
  })
}

export function useBarbersAvailability(organizationId: string, date: Date) {
  return useQuery({
    queryKey: ['barbers', organizationId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, rating, total_reviews')
        .eq('organization_id', organizationId)
        .eq('role', 'barber')
        .eq('is_active', true)

      if (error) throw error
      return data
    },
    enabled: !!organizationId,
  })
}

export function useAvailableSlots(
  _organizationId: string,
  barberId: string,
  serviceId: string,
  selectedDate: Date
) {
  return useQuery({
    queryKey: ['available-slots', barberId, serviceId, selectedDate],
    queryFn: async () => {
      const service = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('id', serviceId)
        .single()

      if (service.error) throw service.error

      const dayStart = new Date(selectedDate)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(selectedDate)
      dayEnd.setHours(23, 59, 59, 999)

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('scheduled_at, ends_at, status')
        .eq('barber_id', barberId)
        .gte('scheduled_at', dayStart.toISOString())
        .lte('scheduled_at', dayEnd.toISOString())
        .in('status', ['pending', 'confirmed', 'checked_in', 'in_progress'])

      if (error) throw error

      return generateTimeSlots(
        selectedDate,
        service.data.duration_minutes,
        bookings || []
      )
    },
    enabled: !!barberId && !!serviceId && !!selectedDate,
  })
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: {
      organizationId: string
      clientId: string
      barberId: string
      serviceId: string
      scheduledAt: string
      servicePrice: number
      prepaymentRequired: boolean
      prepaymentAmount?: number
    }) => {
      const service = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('id', data.serviceId)
        .single()

      if (service.error) throw service.error

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          organization_id: data.organizationId,
          client_id: data.clientId,
          barber_id: data.barberId,
          service_id: data.serviceId,
          scheduled_at: data.scheduledAt,
          duration_minutes: service.data.duration_minutes,
          ends_at: new Date(
            new Date(data.scheduledAt).getTime() +
              service.data.duration_minutes * 60000
          ).toISOString(),
          service_price: data.servicePrice,
          prepayment_required: data.prepaymentRequired,
          prepayment_amount: data.prepaymentAmount,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error
      return booking as Booking
    },
  })
}

export function useClients(organizationId: string) {
  return useQuery({
    queryKey: ['clients', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', organizationId)

      if (error) throw error
      return data as Client[]
    },
    enabled: !!organizationId,
  })
}

function generateTimeSlots(
  date: Date,
  durationMinutes: number,
  bookedSlots: any[]
): string[] {
  const slots: string[] = []
  const startHour = 9
  const endHour = 18
  const slotInterval = 30

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const slotTime = new Date(date)
      slotTime.setHours(hour, minute, 0, 0)
      const slotEndTime = new Date(
        slotTime.getTime() + durationMinutes * 60000
      )

      if (slotEndTime.getHours() <= endHour) {
        const isBooked = bookedSlots.some((booking) => {
          const bookingStart = new Date(booking.scheduled_at)
          const bookingEnd = new Date(booking.ends_at)
          return (
            (slotTime >= bookingStart && slotTime < bookingEnd) ||
            (slotEndTime > bookingStart && slotEndTime <= bookingEnd) ||
            (slotTime <= bookingStart && slotEndTime >= bookingEnd)
          )
        })

        if (!isBooked) {
          slots.push(slotTime.toISOString())
        }
      }
    }
  }

  return slots
}
