import { createContext, useContext } from "react";
import { AuthContextType, User } from "./interfaces";

// Mock users database
export const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "chef@example.com",
    password: "chef123",
    name: "Chef Marcus",
    role: "chef",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: "2",
    email: "viewer@example.com",
    password: "viewer123",
    name: "Jane Viewer",
    role: "viewer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
];

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
