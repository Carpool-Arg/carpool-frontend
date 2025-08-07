import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    

    if (!refreshToken) {
      console.error('[REFRESH] No refresh token found');
      return NextResponse.json({ 
        success: false, 
        message: 'No refresh token found' 
      }, { status: 401 });
    }

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.error('[REFRESH] Backend refresh failed:', response.status);
      
      // Si el refresh token es inválido, limpiar cookies
      const res = NextResponse.json({ 
        success: false, 
        message: 'Refresh token invalid' 
      }, { status: 401 });

      res.cookies.delete('token');
      res.cookies.delete('refreshToken');
      
      return res;
    }

    const data = await response.json();

    if (!data.data?.accessToken) {
      console.error('[REFRESH] No access token in response');
      return NextResponse.json({ 
        success: false, 
        message: 'No access token received' 
      }, { status: 401 });
    }

    const accessToken = data.data.accessToken;
    
    // Parsear el token para obtener la expiración
    const decoded = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );
    const maxAge = decoded.exp - decoded.iat;

    const res = NextResponse.json({ 
      success: true,
      message: 'Token refreshed successfully'
    });

    res.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge,
    });

    return res;

  } catch (error) {
    console.error('[REFRESH] Error during token refresh:', error);
    
    const res = NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });

    // Limpiar cookies en caso de error
    res.cookies.delete('token');
    res.cookies.delete('refreshToken');

    return res;
  }
}