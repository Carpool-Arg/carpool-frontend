'use client'

import { PUBLIC_PATHS } from '@/constants/publicPaths';
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
  prevImage: string | null;
  setPrevImage: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Rutas públicas donde no necesitamos autenticación
  const publicRoutes = [...PUBLIC_PATHS.pages];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Función para obtener el usuario actual
  const fetchUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const response = await res.json();
        if (response.data) {
          setUser({ 
            username: response.data.username,
            profileImage: response.data.profileImage,
            roles: response.data.roles,
            id: response.data.id,
            name: response.data.name,
            lastname: response.data.lastname,
            email: response.data.email,
            dni: response.data.dni,
            phone: response.data.phone,
            gender: response.data.gender,
            status: response.data.status,
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

      // Estado del usuario
      const code = result.messages?.[0]; 

      if (code === 'PENDING_VERIFICATION') {
        router.push('/email-verify');
        return;
      }

      if (result.state === "OK") {
        await fetchUser();
        router.push('/home');
      } else {
        setUser(null);
        throw new Error(result.messages?.[1]|| 'Error al iniciar sesión');
      }
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setUser(null);
      throw new Error(message); 
    } finally {
      setLoading(false);
    }
  };

  const authGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const result = await authWithGoogle(idToken);
      
      if (result.state === "OK" && result.data) {
        await fetchUser();
        // Redirigir según el estado del usuario
        if (result.data.status === 'PENDING_PROFILE') {
          router.push(`/complete-profile?email=${encodeURIComponent(result.data.email)}`);
        } else if (result.data.status === 'ACTIVE') {
          router.push('/home');
        }
      } else {
        setUser(null);
        throw new Error(result.messages?.[1] || 'Error al iniciar sesión con Google');
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
    try {
      const res = await logoutUser(); // logoutUser debería lanzar error solo si hay fallo de red
      if (res.state === "OK") { // suponiendo que devuelve { ok: boolean } o status 200
        setUser(null);
        router.push('/login');
      } else {
        console.error('Logout failed', res.messages?.[0]);
        // opcional: mostrar mensaje de error sin redirigir
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // opcional: mostrar mensaje al usuario
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
    prevImage,
    setPrevImage
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