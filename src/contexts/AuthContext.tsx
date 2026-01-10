import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthTokens, User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      try {
        const parsed = JSON.parse(storedTokens) as AuthTokens;
        setTokens(parsed);
        setUser({
          id: parsed.user_id,
          username: '',
          email: '',
          role: parsed.role,
        });
      } catch {
        localStorage.removeItem('auth_tokens');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (authTokens: AuthTokens) => {
    setTokens(authTokens);
    setUser({
      id: authTokens.user_id,
      username: '',
      email: '',
      role: authTokens.role,
    });
    localStorage.setItem('auth_tokens', JSON.stringify(authTokens));
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('auth_tokens');
  };

  const isAdmin = user?.role === 'admin_hr';

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!tokens,
        isLoading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
