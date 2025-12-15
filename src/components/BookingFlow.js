import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useServices, useBarbersAvailability, useAvailableSlots, useCreateBooking, useClients } from '@/hooks/useBooking';
import { useOrganization } from '@/hooks/useOrganization';
import { ChevronRight, Calendar, User, Clock } from 'lucide-react';
export default function BookingFlow() {
    const { organization } = useOrganization();
    const [step, setStep] = useState('service');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const { data: services, isLoading: servicesLoading } = useServices(organization?.id || '');
    const { data: barbers } = useBarbersAvailability(organization?.id || '', selectedDate || new Date());
    const { data: slots } = useAvailableSlots(organization?.id || '', selectedBarber || '', selectedService || '', selectedDate || new Date());
    const { data: clients } = useClients(organization?.id || '');
    const createBooking = useCreateBooking();
    if (!organization)
        return null;
    const handleCreateBooking = async () => {
        if (!selectedClientId || !selectedBarber || !selectedService || !selectedTime)
            return;
        const service = services?.find(s => s.id === selectedService);
        if (!service)
            return;
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
            });
            alert('Agendamento criado com sucesso!');
            setStep('service');
            setSelectedService(null);
            setSelectedBarber(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setSelectedClientId(null);
        }
        catch (error) {
            alert('Erro ao criar agendamento');
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "Novo Agendamento" }), _jsx("p", { className: "text-gray-400", children: "Guia passo a passo para agendar um hor\u00E1rio" })] }), _jsx("div", { className: "flex gap-2 mb-8", children: ['service', 'barber', 'date', 'time', 'client'].map((s) => (_jsx("div", { className: `flex-1 h-2 rounded-full transition-colors ${s === step ? 'bg-gold-500' : 'bg-dark-700'}` }, s))) }), step === 'service' && (_jsxs("div", { className: "card mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5 text-gold-500" }), "Selecione o Servi\u00E7o"] }), servicesLoading ? (_jsx("p", { className: "text-gray-400", children: "Carregando servi\u00E7os..." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: services?.map((service) => (_jsxs("div", { onClick: () => {
                                setSelectedService(service.id);
                                setStep('barber');
                            }, className: `p-4 border rounded-lg cursor-pointer transition-colors ${selectedService === service.id
                                ? 'border-gold-500 bg-dark-800'
                                : 'border-dark-700 hover:border-gold-500'}`, children: [_jsx("p", { className: "text-white font-semibold", children: service.name }), _jsxs("p", { className: "text-gray-400 text-sm", children: [service.duration_minutes, "min"] }), _jsxs("p", { className: "text-gold-500 font-bold mt-2", children: ["R$ ", service.price.toFixed(2)] })] }, service.id))) })), selectedService && (_jsxs("button", { onClick: () => setStep('barber'), className: "btn-primary w-full mt-6 flex items-center justify-center gap-2", children: ["Pr\u00F3ximo ", _jsx(ChevronRight, { className: "w-4 h-4" })] }))] })), step === 'barber' && (_jsxs("div", { className: "card mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5 text-gold-500" }), "Selecione o Barbeiro"] }), _jsxs("div", { className: "space-y-3", children: [barbers?.map((barber) => (_jsxs("div", { onClick: () => {
                                    setSelectedBarber(barber.id);
                                    setStep('date');
                                }, className: `p-4 border rounded-lg cursor-pointer transition-colors ${selectedBarber === barber.id
                                    ? 'border-gold-500 bg-dark-800'
                                    : 'border-dark-700 hover:border-gold-500'}`, children: [_jsx("p", { className: "text-white font-semibold", children: barber.full_name }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["\u2B50 ", barber.rating, " (", barber.total_reviews, " avalia\u00E7\u00F5es)"] })] }, barber.id))), _jsxs("button", { onClick: () => {
                                    setSelectedBarber('any');
                                    setStep('date');
                                }, className: "w-full p-4 border border-dark-700 rounded-lg hover:border-gold-500 transition-colors", children: [_jsx("p", { className: "text-white font-semibold", children: "Sem prefer\u00EAncia" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Pr\u00F3ximo dispon\u00EDvel" })] })] }), _jsx("button", { onClick: () => setStep('service'), className: "btn-secondary w-full mt-6", children: "Voltar" })] })), step === 'date' && (_jsxs("div", { className: "card mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-gold-500" }), "Selecione a Data"] }), _jsx("input", { type: "date", value: selectedDate ? selectedDate.toISOString().split('T')[0] : '', onChange: (e) => setSelectedDate(new Date(e.target.value)), className: "input-base w-full", min: new Date().toISOString().split('T')[0] }), selectedDate && (_jsxs("button", { onClick: () => setStep('time'), className: "btn-primary w-full mt-6 flex items-center justify-center gap-2", children: ["Pr\u00F3ximo ", _jsx(ChevronRight, { className: "w-4 h-4" })] })), _jsx("button", { onClick: () => setStep('barber'), className: "btn-secondary w-full mt-3", children: "Voltar" })] })), step === 'time' && (_jsxs("div", { className: "card mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Selecione o Hor\u00E1rio" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: slots?.map((slot) => {
                            const time = new Date(slot);
                            const timeStr = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            return (_jsx("button", { onClick: () => {
                                    setSelectedTime(slot);
                                    setStep('client');
                                }, className: `p-3 rounded-lg border transition-colors ${selectedTime === slot
                                    ? 'border-gold-500 bg-gold-500 text-dark-950'
                                    : 'border-dark-700 hover:border-gold-500'}`, children: timeStr }, slot));
                        }) }), _jsx("button", { onClick: () => setStep('date'), className: "btn-secondary w-full mt-6", children: "Voltar" })] })), step === 'client' && (_jsxs("div", { className: "card mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Selecione o Cliente" }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: clients?.map((client) => (_jsxs("div", { onClick: () => {
                                setSelectedClientId(client.id);
                            }, className: `p-3 border rounded-lg cursor-pointer transition-colors ${selectedClientId === client.id
                                ? 'border-gold-500 bg-dark-800'
                                : 'border-dark-700 hover:border-gold-500'}`, children: [_jsx("p", { className: "text-white font-semibold", children: client.full_name }), _jsx("p", { className: "text-gray-400 text-sm", children: client.phone })] }, client.id))) }), selectedClientId && (_jsx("button", { onClick: handleCreateBooking, disabled: createBooking.isPending, className: "btn-primary w-full mt-6 disabled:opacity-50", children: createBooking.isPending ? 'Criando...' : 'Confirmar Agendamento' })), _jsx("button", { onClick: () => setStep('time'), className: "btn-secondary w-full mt-3", children: "Voltar" })] }))] }));
}
//# sourceMappingURL=BookingFlow.js.map