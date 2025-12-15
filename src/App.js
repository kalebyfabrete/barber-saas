import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import AuthPage from '@/pages/auth';
import DashboardPage from '@/pages/dashboard';
import OnboardingPage from '@/pages/onboarding';
import LoadingPage from '@/pages/loading';
export default function App() {
    const { user, loading: authLoading } = useAuth();
    const { organization, profile, loading: orgLoading } = useOrganization();
    if (authLoading || orgLoading) {
        return _jsx(LoadingPage, {});
    }
    if (!user) {
        return _jsx(AuthPage, {});
    }
    if (!organization || !profile) {
        return _jsx(OnboardingPage, {});
    }
    return _jsx(DashboardPage, {});
}
//# sourceMappingURL=App.js.map