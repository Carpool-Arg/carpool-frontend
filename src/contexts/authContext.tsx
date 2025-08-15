'use client'

import { loginUser, authWithGoogle, logoutUser } from '@/services/authService';
import { LoginFormData } from '@/types/forms';
import { User } from '@/types/user';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginFormData & { recaptchaToken?: string }) => Promise<void>;
  logout: () => void;
  authGoogle: (idToken: string) => Promise<void>;
  initialized: boolean;
  fetchUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Rutas públicas donde no necesitamos autenticación
  const publicRoutes = ['/login', '/register', '/complete-profile', '/email-verify', '/email-verified', '/send-change-password-email','/password-change','/unlock-account'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Función para obtener el usuario actual
  const fetchUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        console.log('json',json)
        if (json.user) {
          setUser({ 
            username: json.user.username,
            roles: json.user.roles,
           });
          return true;
        }
      }
      
      setUser(null);
      return false;
    } catch (err) {
      console.error('Error cargando usuario:', err);
      setUser(null);
      return false;
    }
  }, []);

  // Inicializar autenticación solo una vez
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      // Si estamos en una ruta pública, no verificar usuario
      if (isPublicRoute) {
        setInitialized(true);
        return;
      }

      // Verificar si hay usuario autenticado
      const hasUser = await fetchUser();
      
      if (isMounted) {
        setInitialized(true);
        
        // Si no hay usuario y estamos en ruta protegida, redirigir
        if (!hasUser && !isPublicRoute) {
          router.replace('/login');
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [isPublicRoute, fetchUser, router]);

  const login = async (data: LoginFormData & { recaptchaToken?: string }) => {
    setLoading(true);
    try {
      const result = await loginUser(data);
      console.log('result', result)

      const code = result.messages?.[0]; 
      console.log('data desde login',data)

      if (code === 'PENDING_VERIFICATION') {
        router.push('/email-verify');
        return;
      }

      if (result.success) {
        await fetchUser();
        router.push('/home');
      } else {
        setUser(null);
        throw new Error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const authGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const result = await authWithGoogle(idToken);
      
      if (result.success && result.data) {
        await fetchUser();
        // Redirigir según el estado del usuario
        if (result.data.status === 'PENDING_PROFILE') {
          router.push(`/complete-profile?email=${encodeURIComponent(result.data.email)}`);
        } else if (result.data.status === 'ACTIVE') {
          router.push('/home');
        }
      } else {
        setUser(null);
        throw new Error(result.error || 'Error al iniciar sesión con Google');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Limpiar estado local incluso si falla el logout del servidor
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const value = {
    user,
    loading,
    login,
    logout,
    authGoogle,
    initialized,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}