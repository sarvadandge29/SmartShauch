import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";


interface AuthState {
    user: any | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthState | null>(null);

// --- Provider ---

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("userid", userId)
                .single();

            if (error) throw error;

            setUser(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchSessionAndUser = async () => {
            try {
                setLoading(true);

                const { data, error } = await supabase.auth.getSession();

                if (error) throw error;

                setSession(data.session);

                if (data.session?.user) {
                    await fetchUser(data.session.user.id);
                } else {
                    setUser(null);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionAndUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                if (session?.user) {
                    await fetchUser(session.user.id);
                } else {
                    setUser(null);
                }
            }
        );

        return () => {
            authListener.subscription?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Hook ---

export const useAuth = (): AuthState => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export default AuthProvider;