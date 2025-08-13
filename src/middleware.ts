import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./utils/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas públicas que no necesitan autenticación
  const publicPaths = [
    '/login', 
    '/register', 
    '/email-verify',
    '/email-verified',
    '/api/login', 
    '/api/register', 
    '/api/google', 
    '/api/refresh', 
    '/api/email-verify',
    '/api/complete-registration',
    '/api/resend-activation',
    '/api/genders',
    '/complete-profile'
  ];
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  
  // Si no hay token, redirigir inmediatamente
  if (!token) {
    return redirectToLogin(req, pathname);
  }

  // Verificar si el token está expirado SOLO basándose en el JWT
  if (isTokenExpired(token)) {
    // Si hay refresh token, intentar renovar
    if (refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);
        if (newTokens) {
          const response = NextResponse.next();
          setTokenCookies(response, newTokens);
          return response;
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
    
    // Si no se pudo renovar, redirigir a login
    return redirectToLogin(req, pathname);
  }

  // Si el token no está expirado, verificar cache de validación
  const tokenValidUntilStr = req.cookies.get('tokenValidUntil')?.value;
  const now = Date.now();

  // Si tenemos cache válido, continuar sin más verificaciones
  if (tokenValidUntilStr && Number(tokenValidUntilStr) > now) {
    return NextResponse.next();
  }

  // Solo verificar con el servidor si no hay cache o expiró
  try {
    const isValid = await verifyTokenWithServer(token);
    
    if (isValid) {
      const response = NextResponse.next();
      // Cachear la validación por 5 minutos
      const nextCheck = now + 5 * 60 * 1000;
      response.cookies.set('tokenValidUntil', nextCheck.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 300,
      });
      return response;
    }
  } catch (error) {
    console.error('Error verificando token:', error);
  }

  // Si llegamos aquí, el token no es válido
  return redirectToLogin(req, pathname);
}

// Función auxiliar para redireccionar a login
function redirectToLogin(req: NextRequest, pathname: string) {
  if (pathname.startsWith('/api')) {
    return new NextResponse(
      JSON.stringify({ message: 'No autorizado' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
  
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

// Función auxiliar para renovar el token
async function refreshAccessToken(refreshToken: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken // usar el nuevo o mantener el actual
      };
    }
  } catch (error) {
    console.error('Error en refresh token:', error);
  }
  
  return null;
}

// Función auxiliar para verificar token con servidor
async function verifyTokenWithServer(token: string): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.state === 'OK';
    }
  } catch (error) {
    console.error('Error verificando token:', error);
  }
  
  return false;
}

// Función auxiliar para establecer cookies de tokens
function setTokenCookies(response: NextResponse, tokens: { accessToken: string; refreshToken?: string }) {
  const { accessToken, refreshToken } = tokens;
  
  // Decodificar el token para obtener expiry
  const decoded = JSON.parse(
    Buffer.from(accessToken.split('.')[1], 'base64').toString()
  );
  const maxAge = decoded.exp - decoded.iat;

  response.cookies.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  });

  if (refreshToken) {
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });
  }

  // Actualizar cache de validación
  const nextCheck = Date.now() + 5 * 60 * 1000;
  response.cookies.set('tokenValidUntil', nextCheck.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 300,
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/me|icons|manifest.webmanifest).*)'
  ],
};