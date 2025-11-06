'use client';

import { ThemeProvider } from 'next-themes';

import { AuthProvider, useAuth } from '@/contexts/authContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { usePathname } from 'next/navigation';
import Spinner from '@/components/ux/Spinner';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface AppProvidersProps {
  children: React.ReactNode;
}

function GlobalLoadingOverlay() {
  const { loading } = useAuth();

  const loadingRoutes = ['/login', '/register', '/complete-registration']; // solo donde querés el overlay
  const pathname = usePathname() || '';

  const shouldShowSpinner = loadingRoutes.some(route => pathname.startsWith(route)) && ( loading);

  if (!shouldShowSpinner) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75">
      <Spinner />
      <span>Cargando...</span>
    </div>
  );
  }

export function AppProviders({ children }: AppProvidersProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID no está configurado');
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GoogleOAuthProvider clientId={clientId || ''}>
        <GoogleReCaptchaProvider 
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: 'body',
          }}
        >
          <AuthProvider>
            <GlobalLoadingOverlay />
            {children}
          </AuthProvider>
        </GoogleReCaptchaProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
