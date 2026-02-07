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

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          email,
          name,
          role,
          avatar,
          chef_id,
          password
        `,
        )
        .eq("email", email)
        .single();

      if (error || !data) {
        return { success: false, error: "Invalid email or password" };
      }

      /**
       * IMPORTANT:
       * Replace this comparison with bcrypt/argon2 verification
       */
      if (data.password !== password) {
        return { success: false, error: "Invalid email or password" };
      }

      const clientUser = {
        id: data.id,
        chefId: data["chef_id"],
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
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
      // check for existing email
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        return { success: false, error: "Email already registered" };
      }

      /**
       * IMPORTANT:
       * Hash password before insert
       */
      const { data, error } = await supabase
        .from("users")
        .insert({
          email,
          password, // hashed in real app
          name,
          role,
        })
        .select(
          `
          id,
          email,
          name,
          role,
          avatar,
          chef_id
        `,
        )
        .single();

      if (error || !data) {
        return { success: false, error: "Signup failed" };
      }

      setUser({
        ...data,
        chefId: data["chef_id"],
      });
      localStorage.setItem(`${SITE_NAME}_user`, JSON.stringify(data));

      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
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
