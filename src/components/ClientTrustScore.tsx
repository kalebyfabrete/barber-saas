import { useTrustScore, useClientBlockStatus } from '@/hooks/useNoShowPrevention'
import { AlertCircle, ShieldCheck, AlertTriangle } from 'lucide-react'

interface ClientTrustScoreProps {
  clientId: string
}

export default function ClientTrustScore({ clientId }: ClientTrustScoreProps) {
  const { data: trustData } = useTrustScore(clientId)
  const { data: blockStatus } = useClientBlockStatus(clientId)

  if (!trustData) return null

  const { score, level, requiresPrepayment, prepaymentPercentage, riskLevel } = trustData

  // Determinar cor baseado no nível
  const levelColors = {
    vip: 'bg-green-950 border-green-700 text-green-400',
    regular: 'bg-blue-950 border-blue-700 text-blue-400',
    low: 'bg-red-950 border-red-700 text-red-400',
  }

  const riskColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-gold-500" />
        Score de Confiabilidade
      </h3>

      <div className="space-y-4">
        {/* Score Visual */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-300">Score: {score}/1000</p>
            <p className={`text-sm font-semibold px-3 py-1 rounded border ${levelColors[level]}`}>
              {level === 'vip' ? 'VIP' : level === 'regular' ? 'Regular' : 'Baixo Risco'}
            </p>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                level === 'vip'
                  ? 'bg-green-500'
                  : level === 'regular'
                  ? 'bg-blue-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${(score / 1000) * 100}%` }}
            />
          </div>
        </div>

        {/* Histórico */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-gray-400 text-xs">Agendamentos</p>
            <p className="text-lg font-bold text-white">{trustData.total_bookings}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Completados</p>
            <p className="text-lg font-bold text-green-400">{trustData.completed_bookings}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">No-Shows</p>
            <p className="text-lg font-bold text-red-400">{trustData.no_show_count}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Cancelados</p>
            <p className="text-lg font-bold text-yellow-400">{trustData.cancelled_count}</p>
          </div>
        </div>

        {/* Pré-pagamento */}
        {requiresPrepayment && (
          <div className="bg-yellow-950 border border-yellow-700 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-400">Pré-pagamento Obrigatório</p>
              <p className="text-xs text-yellow-300 mt-1">
                Este cliente deve pagar {prepaymentPercentage}% do valor antes do agendamento
              </p>
            </div>
          </div>
        )}

        {/* Bloqueado */}
        {blockStatus?.is_blocked && (
          <div className="bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Cliente Bloqueado</p>
              <p className="text-xs text-red-300 mt-1">
                {blockStatus.blocked_reason}
              </p>
              {blockStatus.blocked_until && (
                <p className="text-xs text-red-300 mt-1">
                  Desbloqueado em: {new Date(blockStatus.blocked_until).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Informações de Risco */}
        <div className={`text-sm p-2 rounded ${riskColors[riskLevel]}`}>
          <p>
            {riskLevel === 'low'
              ? '✓ Cliente confiável - sem restrições'
              : riskLevel === 'medium'
              ? '⚠ Cliente com risco moderado - monitorar'
              : '✗ Cliente de alto risco - restrições aplicadas'}
          </p>
        </div>
      </div>
    </div>
  )
}
