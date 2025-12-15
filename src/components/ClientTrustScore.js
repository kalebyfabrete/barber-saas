import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTrustScore, useClientBlockStatus } from '@/hooks/useNoShowPrevention';
import { AlertCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
export default function ClientTrustScore({ clientId }) {
    const { data: trustData } = useTrustScore(clientId);
    const { data: blockStatus } = useClientBlockStatus(clientId);
    if (!trustData)
        return null;
    const { score, level, requiresPrepayment, prepaymentPercentage, riskLevel } = trustData;
    // Determinar cor baseado no nível
    const levelColors = {
        vip: 'bg-green-950 border-green-700 text-green-400',
        regular: 'bg-blue-950 border-blue-700 text-blue-400',
        low: 'bg-red-950 border-red-700 text-red-400',
    };
    const riskColors = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-red-400',
    };
    return (_jsxs("div", { className: "card", children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "w-5 h-5 text-gold-500" }), "Score de Confiabilidade"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("p", { className: "text-gray-300", children: ["Score: ", score, "/1000"] }), _jsx("p", { className: `text-sm font-semibold px-3 py-1 rounded border ${levelColors[level]}`, children: level === 'vip' ? 'VIP' : level === 'regular' ? 'Regular' : 'Baixo Risco' })] }), _jsx("div", { className: "w-full bg-dark-700 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition-all ${level === 'vip'
                                        ? 'bg-green-500'
                                        : level === 'regular'
                                            ? 'bg-blue-500'
                                            : 'bg-red-500'}`, style: { width: `${(score / 1000) * 100}%` } }) })] }), _jsxs("div", { className: "grid grid-cols-4 gap-2 text-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Agendamentos" }), _jsx("p", { className: "text-lg font-bold text-white", children: trustData.total_bookings })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Completados" }), _jsx("p", { className: "text-lg font-bold text-green-400", children: trustData.completed_bookings })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "No-Shows" }), _jsx("p", { className: "text-lg font-bold text-red-400", children: trustData.no_show_count })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Cancelados" }), _jsx("p", { className: "text-lg font-bold text-yellow-400", children: trustData.cancelled_count })] })] }), requiresPrepayment && (_jsxs("div", { className: "bg-yellow-950 border border-yellow-700 rounded-lg p-3 flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-yellow-400", children: "Pr\u00E9-pagamento Obrigat\u00F3rio" }), _jsxs("p", { className: "text-xs text-yellow-300 mt-1", children: ["Este cliente deve pagar ", prepaymentPercentage, "% do valor antes do agendamento"] })] })] })), blockStatus?.is_blocked && (_jsxs("div", { className: "bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-red-400", children: "Cliente Bloqueado" }), _jsx("p", { className: "text-xs text-red-300 mt-1", children: blockStatus.blocked_reason }), blockStatus.blocked_until && (_jsxs("p", { className: "text-xs text-red-300 mt-1", children: ["Desbloqueado em: ", new Date(blockStatus.blocked_until).toLocaleDateString('pt-BR')] }))] })] })), _jsx("div", { className: `text-sm p-2 rounded ${riskColors[riskLevel]}`, children: _jsx("p", { children: riskLevel === 'low'
                                ? '✓ Cliente confiável - sem restrições'
                                : riskLevel === 'medium'
                                    ? '⚠ Cliente com risco moderado - monitorar'
                                    : '✗ Cliente de alto risco - restrições aplicadas' }) })] })] }));
}
//# sourceMappingURL=ClientTrustScore.js.map