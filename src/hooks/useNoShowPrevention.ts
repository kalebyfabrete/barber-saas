import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { calculateTrustScore, shouldBlockClient, getNoShowFee } from '@/utils/trustScore'

export function useTrustScore(clientId: string) {
  return useQuery({
    queryKey: ['trust-score', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('trust_score, total_bookings, completed_bookings, no_show_count, cancelled_count, is_blocked, blocked_until')
        .eq('id', clientId)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const calculation = calculateTrustScore(
        data.total_bookings,
        data.completed_bookings,
        data.no_show_count,
        data.cancelled_count,
        data.trust_score
      )

      return {
        ...data,
        ...calculation,
      }
    },
    enabled: !!clientId,
  })
}

export function useUpdateClientStatus() {
  return useMutation({
    mutationFn: async ({
      clientId,
      status,
    }: {
      clientId: string
      status: 'completed' | 'no_show' | 'cancelled'
    }) => {
      // Obter cliente atual
      const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .maybeSingle()

      if (fetchError) throw fetchError
      if (!client) throw new Error('Client not found')

      // Calcular novos valores
      let updates: Record<string, any> = {
        total_bookings: client.total_bookings + 1,
      }

      if (status === 'completed') {
        updates.completed_bookings = client.completed_bookings + 1
        updates.last_visit_at = new Date().toISOString()
      } else if (status === 'no_show') {
        updates.no_show_count = client.no_show_count + 1
      } else if (status === 'cancelled') {
        updates.cancelled_count = client.cancelled_count + 1
      }

      // Recalcular trust score
      const newCalculation = calculateTrustScore(
        updates.total_bookings,
        updates.completed_bookings || client.completed_bookings,
        updates.no_show_count || client.no_show_count,
        updates.cancelled_count || client.cancelled_count
      )

      updates.trust_score = newCalculation.score
      updates.segment = newCalculation.level === 'vip' ? 'vip' : newCalculation.level === 'low' ? 'at_risk' : 'regular'

      // Verificar se deve bloquear
      const blockCheck = shouldBlockClient(
        updates.no_show_count || client.no_show_count,
        updates.total_bookings,
        newCalculation.score
      )

      if (blockCheck.blocked) {
        updates.is_blocked = true
        updates.blocked_reason = blockCheck.reason
        updates.blocked_until = new Date(Date.now() + (blockCheck.blockDays! * 24 * 60 * 60 * 1000)).toISOString()
      }

      // Atualizar cliente
      const { error: updateError } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)

      if (updateError) throw updateError

      return updates
    },
  })
}

export function useGetNoShowFee(clientId: string, servicePrice: number) {
  return useQuery({
    queryKey: ['no-show-fee', clientId, servicePrice],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('no_show_count')
        .eq('id', clientId)
        .maybeSingle()

      if (error) throw error

      return getNoShowFee(data?.no_show_count || 0, servicePrice)
    },
    enabled: !!clientId && servicePrice > 0,
  })
}

export function useClientBlockStatus(clientId: string) {
  return useQuery({
    queryKey: ['block-status', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('is_blocked, blocked_reason, blocked_until')
        .eq('id', clientId)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const now = new Date()
      const blockedUntil = data.blocked_until ? new Date(data.blocked_until) : null

      // Se blocked_until passou, desbloquear automaticamente
      if (data.is_blocked && blockedUntil && now > blockedUntil) {
        await supabase
          .from('clients')
          .update({
            is_blocked: false,
            blocked_reason: null,
            blocked_until: null,
          })
          .eq('id', clientId)

        return {
          is_blocked: false,
          blocked_reason: null,
          blocked_until: null,
        }
      }

      return data
    },
    enabled: !!clientId,
  })
}
