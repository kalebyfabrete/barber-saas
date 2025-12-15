import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface WhatsAppMessage {
  organizationId: string
  phoneNumber: string
  clientName: string
  serviceName: string
  barberName: string
  scheduledTime: string
  bookingId: string
}

export function useSendWhatsAppConfirmation() {
  return useMutation({
    mutationFn: async (data: WhatsAppMessage) => {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp-confirmation`

      const response = await axios.post(apiUrl, {
        phone_number: data.phoneNumber,
        client_name: data.clientName,
        service_name: data.serviceName,
        barber_name: data.barberName,
        scheduled_time: data.scheduledTime,
        booking_id: data.bookingId,
        organization_id: data.organizationId,
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      })

      return response.data
    },
  })
}

export function useSendWhatsAppReminder() {
  return useMutation({
    mutationFn: async (data: {
      phoneNumber: string
      clientName: string
      serviceName: string
      barberName: string
      hoursUntilAppointment: number
      bookingId: string
      organizationId: string
    }) => {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-whatsapp-reminder`

      const response = await axios.post(apiUrl, {
        phone_number: data.phoneNumber,
        client_name: data.clientName,
        service_name: data.serviceName,
        barber_name: data.barberName,
        hours_until_appointment: data.hoursUntilAppointment,
        booking_id: data.bookingId,
        organization_id: data.organizationId,
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      })

      return response.data
    },
  })
}
