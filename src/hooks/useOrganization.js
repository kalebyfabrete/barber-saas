import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export function useOrganization() {
    const [organization, setOrganization] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getOrganization = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError)
                    throw userError;
                if (!user) {
                    setLoading(false);
                    return;
                }
                const { data: profileData, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (profileError && profileError.code !== 'PGRST116')
                    throw profileError;
                setProfile(profileData || null);
                if (profileData) {
                    const { data: orgData, error: orgError } = await supabase
                        .from('organizations')
                        .select('*')
                        .eq('id', profileData.organization_id)
                        .single();
                    if (orgError)
                        throw orgError;
                    setOrganization(orgData);
                }
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load organization');
            }
            finally {
                setLoading(false);
            }
        };
        getOrganization();
    }, []);
    return { organization, profile, loading, error };
}
//# sourceMappingURL=useOrganization.js.map