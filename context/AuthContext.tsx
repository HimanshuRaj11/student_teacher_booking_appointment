"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "student" | "teacher" | "admin";
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void; // Function to trigger re-fetch after login
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/auth/me");
            if (res.data.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = () => {
        fetchUser();
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
            setUser(null);
            router.push("/login"); // Redirect to login after logout
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
