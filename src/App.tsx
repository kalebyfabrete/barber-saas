import { useAuth } from '@/hooks/useAuth'
import { useOrganization } from '@/hooks/useOrganization'
import AuthPage from '@/pages/auth'
import DashboardPage from '@/pages/dashboard'
import OnboardingPage from '@/pages/onboarding'
import LoadingPage from '@/pages/loading'

export default function App() {
  const { user, loading: authLoading } = useAuth()
  const { organization, profile, loading: orgLoading } = useOrganization()

  if (authLoading || orgLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return <AuthPage />
  }

  if (!organization || !profile) {
    return <OnboardingPage />
  }

  return <DashboardPage />
}
