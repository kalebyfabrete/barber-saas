import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError)
                    throw sessionError;
                setUser(session?.user || null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Auth error');
            }
            finally {
                setLoading(false);
            }
        };
        getSession();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });
        return () => subscription?.unsubscribe();
    }, []);
    const signUp = async (email, password) => {
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error)
                throw error;
        }
        catch (err) {
            throw err instanceof Error ? err : new Error('Sign up failed');
        }
    };
    const signIn = async (email, password) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error)
                throw error;
        }
        catch (err) {
            throw err instanceof Error ? err : new Error('Sign in failed');
        }
    };
    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error)
                throw error;
        }
        catch (err) {
            throw err instanceof Error ? err : new Error('Sign out failed');
        }
    };
    return { user, loading, error, signUp, signIn, signOut };
}
//# sourceMappingURL=useAuth.js.map