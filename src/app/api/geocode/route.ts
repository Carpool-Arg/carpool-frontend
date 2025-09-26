import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const query = searchParams.get("query");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    let url = "";

    if (type === "forward" && query) {
      url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`;
    } else if (type === "reverse" && lat && lon) {
      url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    } else {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Carpool/1.0 (argcarpool@gmail.com)",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
