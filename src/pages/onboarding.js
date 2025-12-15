import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
export default function OnboardingPage() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [orgName, setOrgName] = useState('');
    const [orgSlug, setOrgSlug] = useState('');
    const [barberName, setBarberName] = useState('');
    const [barberEmail, setBarberEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleCreateOrganization = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!user?.email)
                throw new Error('User not found');
            // Create organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert({
                name: orgName,
                slug: orgSlug.toLowerCase().trim(),
            })
                .select()
                .single();
            if (orgError)
                throw orgError;
            // Create owner user
            const { error: userError } = await supabase
                .from('users')
                .insert({
                id: user.id,
                organization_id: org.id,
                role: 'owner',
                full_name: user.email.split('@')[0],
                email: user.email,
            });
            if (userError)
                throw userError;
            setStep(2);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create organization');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddBarber = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data: user } = await supabase.auth.getUser();
            if (!user.user)
                throw new Error('User not found');
            const { data: profile } = await supabase
                .from('users')
                .select('organization_id')
                .eq('id', user.user.id)
                .single();
            if (!profile)
                throw new Error('Organization not found');
            // Create barber auth user
            const { data: { user: barberAuth }, error: authError } = await supabase.auth.admin.createUser({
                email: barberEmail,
                password: Math.random().toString(36).slice(-12),
                email_confirm: true,
            });
            if (authError)
                throw authError;
            if (!barberAuth)
                throw new Error('Failed to create barber user');
            // Create barber profile
            const { error: barberError } = await supabase
                .from('users')
                .insert({
                id: barberAuth.id,
                organization_id: profile.organization_id,
                role: 'barber',
                full_name: barberName,
                email: barberEmail,
            });
            if (barberError)
                throw barberError;
            alert('Barbeiro adicionado com sucesso!');
            window.location.reload();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add barber');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-dark-950", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 py-12", children: [_jsx("h1", { className: "text-4xl font-bold text-white mb-2", children: "Bem-vindo ao BarberTech Pro" }), _jsx("p", { className: "text-gray-400 mb-8", children: "Vamos configurar sua barbearia" }), step === 1 ? (_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-6", children: "Informa\u00E7\u00F5es da Barbearia" }), error && (_jsxs("div", { className: "bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3 mb-6", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-200", children: error })] })), _jsxs("form", { onSubmit: handleCreateOrganization, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Nome da Barbearia" }), _jsx("input", { type: "text", value: orgName, onChange: (e) => setOrgName(e.target.value), className: "input-base", placeholder: "Ex: Barber Shop Premium", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "URL (slug)" }), _jsx("input", { type: "text", value: orgSlug, onChange: (e) => setOrgSlug(e.target.value), className: "input-base", placeholder: "ex: barber-shop-premium", required: true }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: "URL \u00FAnica para acessar sua barbearia" })] }), _jsx("button", { type: "submit", disabled: loading || !orgName || !orgSlug, className: "btn-primary w-full disabled:opacity-50", children: loading ? 'Criando...' : 'Próximo' })] })] })) : (_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-xl font-bold text-white mb-6", children: "Adicione um Barbeiro" }), error && (_jsxs("div", { className: "bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3 mb-6", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-200", children: error })] })), _jsxs("form", { onSubmit: handleAddBarber, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Nome do Barbeiro" }), _jsx("input", { type: "text", value: barberName, onChange: (e) => setBarberName(e.target.value), className: "input-base", placeholder: "Ex: Jo\u00E3o Silva", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Email do Barbeiro" }), _jsx("input", { type: "email", value: barberEmail, onChange: (e) => setBarberEmail(e.target.value), className: "input-base", placeholder: "joao@example.com", required: true })] }), _jsx("button", { type: "submit", disabled: loading || !barberName || !barberEmail, className: "btn-primary w-full disabled:opacity-50", children: loading ? 'Adicionando...' : 'Adicionar Barbeiro' })] }), _jsx("p", { className: "text-gray-400 text-sm mt-4", children: "Voc\u00EA poder\u00E1 adicionar mais barbeiros depois. Clique em \"Pular\" para come\u00E7ar." }), _jsx("button", { onClick: () => window.location.reload(), className: "btn-secondary w-full mt-3", children: "Pular por enquanto" })] }))] }) }));
}
//# sourceMappingURL=onboarding.js.map