import { SITE_NAME } from "@/app/constants";
import React, { useState, useCallback } from "react";
import { AuthContext } from "./utils";
import { User, UserRole } from "./interfaces";
import { supabase } from "@/db/supabaseClient";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(`${SITE_NAME}_user`);
    return stored ? JSON.parse(stored) : null;
  });

  async function startSession(email: string, password: string) {
    // After login/signUp, save session automatically
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return;
  }

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      // 1. Authenticate via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return {
          success: false,
          error: error?.message ?? "Invalid credentials",
        };
      }

      // 2. Fetch profile (optional but common)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          `id,
        display_name,
        role,
        avatar_url
        `,
        )
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, error: "Profile not found" };
      }
      startSession(email, password);

      // 3. Build client user
      const clientUser = {
        id: profile.id,
        chefId: profile.chef_id,
        name: profile.display_name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar_url,
      };

      setUser(clientUser);
      localStorage.setItem(`${SITE_NAME}_user`, JSON.stringify(clientUser));

      return { success: true };
    },
    [],
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: UserRole,
    ): Promise<{ success: boolean; error?: string }> => {
      // 1. Create Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            role: role,
          },
        },
      });

      if (authError || !authData.user) {
        return { success: false, error: authError?.message ?? "Signup failed" };
      }
      startSession(email, password);

      // 2. Build client user object
      const clientUser = {
        id: authData.user.id,
        name: name,
        email: email,
        role: role,
      };

      setUser(clientUser);
      localStorage.setItem(`${SITE_NAME}_user`, JSON.stringify(clientUser));

      return { success: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut(); // Ends the Supabase session
    setUser(null);
    localStorage.removeItem(`${SITE_NAME}_user`);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
