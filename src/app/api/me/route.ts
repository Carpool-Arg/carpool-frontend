// src/app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parseJwt } from "@/utils/jwt";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type Authority = { authority: string };

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const response = await fetch(`${apiUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ user: null }, { status: response.status });
    }

    const data = await response.json();
    console.log('data',data)

    const decoded = parseJwt(token);

    if (!decoded || !decoded.authorities) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const rawAuthorities: Authority[] = typeof decoded.authorities === 'string'
      ? JSON.parse(decoded.authorities)
      : decoded.authorities;

    const roles = rawAuthorities
      .map((a) => {
        switch (a.authority) {
          case 'ROLE_USER':
            return 'user';
          case 'ROLE_DRIVER':
            return 'driver';
          default:
            return null;
        }
      })
      .filter(Boolean);

    // Armamos el user combinando backend + roles
    const user = {
      id: data.data.id,
      profileImage: data.data.profileImage,
      name: data.data.name,
      lastname: data.data.lastname,
      username: decoded.username,
      email: data.data.email,
      dni: data.data.dni,
      phone: data.data.phone,
      gender: data.data.gender,
      status: data.data.status,
      roles
    };

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { user: null, message: "Token inválido o error al obtener usuario" },
      { status: 400 }
    );
  }
}

