import { SITE_NAME } from "@/app/constants";
import React, { useContext, useState, useCallback } from "react";
import { AuthContext, mockUsers } from "./utils";
import { User, UserRole } from "./interfaces";

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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem(
          `${SITE_NAME}_user`,
          JSON.stringify(userWithoutPassword),
        );
        return { success: true };
      }

      return { success: false, error: "Invalid email or password" };
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user exists
      if (mockUsers.some((u) => u.email === email)) {
        return { success: false, error: "Email already registered" };
      }

      // Create new user (in real app, this would be saved to database)
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email,
        name,
        role,
      };

      mockUsers.push({ ...newUser, password });
      setUser(newUser);
      localStorage.setItem(`${SITE_NAME}_user`, JSON.stringify(newUser));

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
