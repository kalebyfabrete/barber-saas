import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, AlertCircle } from 'lucide-react';
export default function AuthPage() {
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(email, password);
            }
            else {
                await signIn(email, password);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication error');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center px-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-block mb-4", children: _jsxs("div", { className: "text-4xl font-bold", children: [_jsx("span", { className: "text-white", children: "Barber" }), _jsx("span", { className: "text-gold-500", children: "Tech" })] }) }), _jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Bem-vindo" }), _jsx("p", { className: "text-gray-400", children: "Gerencie sua barbearia com tecnologia premium" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "card space-y-4", children: [error && (_jsxs("div", { className: "bg-red-950 border border-red-700 rounded-lg p-3 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-200", children: error })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3.5 w-5 h-5 text-gray-500" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "input-base pl-10", placeholder: "seu@email.com", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3.5 w-5 h-5 text-gray-500" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "input-base pl-10", placeholder: "Sua senha", required: true })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-gray-400 text-sm", children: [isSignUp ? 'Já tem conta? ' : 'Novo por aqui? ', _jsx("button", { onClick: () => setIsSignUp(!isSignUp), className: "text-gold-500 hover:text-gold-400 font-medium transition-colors", children: isSignUp ? 'Entrar' : 'Criar conta' })] }) })] }) }));
}
//# sourceMappingURL=auth.js.map