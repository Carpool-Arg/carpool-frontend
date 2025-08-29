import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/email-verified?status=error", req.url));
  }

  const response = await fetch(`${apiUrl}/users/activate-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (response.ok) {
    return NextResponse.redirect(new URL("/email-verified?status=success", req.url));
  } else {
    return NextResponse.redirect(new URL("/email-verified?status=error", req.url));
  }
}
