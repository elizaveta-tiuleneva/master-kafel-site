import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { AuthContext } from "./authContext.js";

// status: "loading" | "signedOut" | "checking" | "admin" | "notAdmin"
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [adminCheck, setAdminCheck] = useState({ userId: null, isAdmin: false });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoaded(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id || null;

  // Вход ещё не даёт прав: проверяем строку в таблице admins (RLS отдаёт только свою).
  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled) setAdminCheck({ userId, isAdmin: !error && Boolean(data) });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo(() => {
    let status = "loading";
    if (sessionLoaded && !userId) status = "signedOut";
    else if (userId && adminCheck.userId !== userId) status = "checking";
    else if (userId) status = adminCheck.isAdmin ? "admin" : "notAdmin";

    return {
      status,
      user: session?.user || null,
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signOut: () => supabase.auth.signOut(),
    };
  }, [session, sessionLoaded, userId, adminCheck]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
