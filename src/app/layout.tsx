import type { Metadata } from "next";
import localFont from 'next/font/local'
import { AppProviders } from './providers';
import ClientLayout from "@/layout/ClientLayout";
import ServiceWorkerRegistration from '@/SWRegister'
import "./globals.css";
import { cookies } from "next/headers";
import { WebSocketProvider } from "@/providers/WebSocketProvider";

export const outfit = localFont({
  src: [
    { path: '../fonts/outfit/Outfit-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/outfit/Outfit-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/outfit/Outfit-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/outfit/Outfit-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-outfit',
  display: 'swap',
});

export const inter = localFont({
  src: [
    { path: '../fonts/inter/Inter-Light.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/inter/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/inter/Inter-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Carpool",
  description: "Conectá conductores y pasajeros para compartir viajes de forma segura, rápida y económica.",
  manifest: '/web.manifest',
  icons: {
    icon: '/icons/favicon.ico',
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const tokenCookie = await cookieStore.get('token');
  const token = tokenCookie?.value ?? null;

  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <AppProviders>
          <WebSocketProvider token={token}>
            <ClientLayout>
              <ServiceWorkerRegistration />
              {children}
            </ClientLayout>
          </WebSocketProvider>
        </AppProviders>
      </body>
    </html>
  );
}

