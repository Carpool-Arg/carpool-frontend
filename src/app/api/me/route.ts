// src/app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parseJwt } from "@/utils/jwt";

type Authority = { authority: string };

export async function GET(request: NextRequest) {
  
  const token = request.cookies.get("token")?.value;
  
  if (!token) {

    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = parseJwt(token);
    
    if (!decoded || !decoded.username || !decoded.authorities) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // authorities es un string JSON, lo parseamos
    const rawAuthorities: Authority[] = typeof decoded.authorities === 'string'
      ? JSON.parse(decoded.authorities)
      : decoded.authorities;
    
    const roles = rawAuthorities
      .map((a) => {
        switch (a.authority) {
          case 'ROLE_USER': //Transformamos ROLE_USER a algo mas legible como user.
            return 'user';
          case 'ROLE_DRIVER': //Transformamos ROLE_DRIVER a algo mas legible como user.
            return 'driver';
          default:
            return null;
        }
      })
      .filter(Boolean); // elimina nulls

    const user = {
      username: decoded.username,
      roles
    };

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { user: null, message: "Token inválido" },
      { status: 400 }
    );
  }
}