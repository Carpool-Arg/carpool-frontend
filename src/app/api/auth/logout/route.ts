import { NextRequest, NextResponse } from 'next/server'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('token')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Token no encontrado' }, { status: 400 });
    }

    // Llamar al backend para hacer logout e invalidar el token
    await fetch(`${apiUrl}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Borrar cookies del lado cliente
    const response = NextResponse.json({ message: 'Logout exitoso' });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    // falta devolver el error de la response
    console.error('Error al hacer logout:', error);
    return NextResponse.json({ message: 'Error durante logout' }, { status: 500 });
  }
}
