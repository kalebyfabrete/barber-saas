import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Plus } from 'lucide-react';
import BookingFlow from '@/components/BookingFlow';
export default function DashboardPage() {
    const { organization } = useOrganization();
    const { signOut } = useAuth();
    const [showBookingFlow, setShowBookingFlow] = useState(false);
    const { data: metrics } = useQuery({
        queryKey: ['metrics', organization?.id],
        queryFn: async () => {
            if (!organization?.id)
                return null;
            const today = new Date().toISOString().split('T')[0];
            const { data } = await supabase
                .from('daily_metrics')
                .select('*')
                .eq('organization_id', organization.id)
                .eq('date', today)
                .maybeSingle();
            return data;
        },
        enabled: !!organization?.id,
    });
    const { data: bookings } = useQuery({
        queryKey: ['bookings-today', organization?.id],
        queryFn: async () => {
            if (!organization?.id)
                return [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const { data } = await supabase
                .from('bookings')
                .select('*, clients(full_name, phone), users(full_name), services(name, price)')
                .eq('organization_id', organization.id)
                .gte('scheduled_at', today.toISOString())
                .lt('scheduled_at', tomorrow.toISOString())
                .order('scheduled_at');
            return data || [];
        },
        enabled: !!organization?.id,
    });
    return (_jsxs("div", { className: "min-h-screen bg-dark-950", children: [_jsx("nav", { className: "border-b border-dark-700 bg-dark-900", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex items-center justify-between", children: [_jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-white", children: organization?.name || 'Dashboard' }) }), _jsxs("button", { onClick: () => signOut(), className: "flex items-center gap-2 text-gray-400 hover:text-white transition-colors", children: [_jsx(LogOut, { className: "w-5 h-5" }), "Sair"] })] }) }), _jsx("div", { className: "container-page", children: showBookingFlow ? (_jsxs("div", { className: "mb-8", children: [_jsx("button", { onClick: () => setShowBookingFlow(false), className: "text-gray-400 hover:text-white mb-4 text-sm", children: "\u2190 Voltar ao Dashboard" }), _jsx(BookingFlow, {})] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-white", children: "Bem-vindo" }), _jsx("p", { className: "text-gray-400", children: "Gerencie sua barbearia em tempo real" })] }), _jsxs("button", { onClick: () => setShowBookingFlow(true), className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { className: "w-5 h-5" }), "Novo Agendamento"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "Agendamentos Hoje" }), _jsx("p", { className: "text-3xl font-bold text-white", children: bookings?.length || 0 })] }), _jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "Taxa de No-Show" }), _jsxs("p", { className: "text-3xl font-bold text-gold-500", children: [metrics?.no_show_rate || 0, "%"] })] }), _jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "Faturamento Hoje" }), _jsxs("p", { className: "text-3xl font-bold text-white", children: ["R$ ", (metrics?.revenue || 0).toFixed(2)] })] }), _jsxs("div", { className: "card", children: [_jsx("p", { className: "text-gray-400 text-sm mb-1", children: "Taxa de Ocupa\u00E7\u00E3o" }), _jsxs("p", { className: "text-3xl font-bold text-green-500", children: [metrics?.occupancy_rate || 0, "%"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Agendamentos de Hoje" }), bookings && bookings.length > 0 ? (_jsx("div", { className: "space-y-3", children: bookings.map((booking) => (_jsxs("div", { className: "p-4 bg-dark-800 rounded-lg border border-dark-700 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white font-semibold", children: booking.clients?.full_name || 'Cliente' }), _jsxs("p", { className: "text-gray-400 text-sm", children: [booking.services?.name, " \u2022 ", booking.users?.full_name] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-gold-500 font-semibold", children: new Date(booking.scheduled_at).toLocaleTimeString('pt-BR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    }) }), _jsx("span", { className: `text-xs px-2 py-1 rounded ${booking.status === 'completed'
                                                                        ? 'bg-green-950 text-green-400'
                                                                        : booking.status === 'no_show'
                                                                            ? 'bg-red-950 text-red-400'
                                                                            : 'bg-yellow-950 text-yellow-400'}`, children: booking.status })] })] }, booking.id))) })) : (_jsx("p", { className: "text-gray-400", children: "Nenhum agendamento para hoje" }))] }) }), _jsx("div", { children: _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Pr\u00F3ximos Passos" }), _jsxs("ul", { className: "space-y-3 text-sm", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-gold-500", children: "\u2713" }), _jsx("span", { className: "text-gray-300", children: "Agendamento online funcionando" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-gold-500", children: "\u2192" }), _jsx("span", { className: "text-gray-400", children: "Integra\u00E7\u00E3o WhatsApp" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-gold-500", children: "\u2192" }), _jsx("span", { className: "text-gray-400", children: "Sistema anti-no-show" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-gold-500", children: "\u2192" }), _jsx("span", { className: "text-gray-400", children: "Pagamentos integrados" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-gold-500", children: "\u2192" }), _jsx("span", { className: "text-gray-400", children: "Sistema de assinaturas" })] })] })] }) })] })] })) })] }));
}
//# sourceMappingURL=dashboard.js.map