import { AuthUser } from '@/types';
export declare function useAuth(): {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};
//# sourceMappingURL=useAuth.d.ts.map