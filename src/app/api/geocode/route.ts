import { NextResponse, NextRequest } from "next/server";

// Constantes para la API de Nominatim
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "Carpool/1.0 (argcarpool@gmail.com)"; // Necesario según las políticas de Nominatim

/**
 * @name buildNominatimUrl
 * @description Construye la URL para la solicitud a Nominatim basada en el tipo de geocodificación.
 * @param type 'forward' | 'reverse'
 * @param query Parámetro de búsqueda (forward)
 * @param lat Latitud (reverse)
 * @param lon Longitud (reverse)
 * @returns La URL completa o null si los parámetros son inválidos.
 */
const buildNominatimUrl = (
  type: string,
  query: string | null,
  lat: string | null,
  lon: string | null
): string | null => {
  if (type === "forward" && query) {
    const encodedQuery = encodeURIComponent(query);
    // Agregamos 'addressdetails=1' para obtener información de dirección más detallada (opcional, pero útil)
    return `${NOMINATIM_URL}/search?q=${encodedQuery}&format=json&limit=5&addressdetails=1`;
  }
  
  if (type === "reverse" && lat && lon) {
    // Usamos Number.isNaN para una validación numérica básica
    if (isNaN(Number(lat)) || isNaN(Number(lon))) {
        return null; // Lat/Lon deben ser números
    }
    return `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json`;
  }

  return null;
};

/**
 * Manejador de la solicitud GET para el servicio de geocodificación.
 * Soporta geocodificación directa ('forward') e inversa ('reverse').
 * @param req La solicitud de Next.js (NextRequest)
 * @returns Una respuesta JSON de Next.js
 */
export async function GET(req: NextRequest) {
  // 1. Extracción y Validación de Parámetros
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");
  const query = searchParams.get("query");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!type) {
    return NextResponse.json(
      { error: "El parámetro 'type' es obligatorio (forward o reverse)." }, 
      { status: 400 }
    );
  }

  // 2. Construcción de URL
  const url = buildNominatimUrl(type, query, lat, lon);

  if (!url) {
    // Error específico si la URL no se pudo construir por falta de parámetros dependientes
    const errorMessage = type === 'forward'
      ? "Se requiere el parámetro 'query' para la búsqueda 'forward'."
      : "Se requieren los parámetros 'lat' y 'lon' para la búsqueda 'reverse' o son inválidos.";
      
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // 3. Ejecución de la Solicitud y Manejo de Errores
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      // Usar cache: 'force-cache' si los resultados de Nominatim no cambian con frecuencia.
      // fetch: { cache: 'force-cache' } 
    });

    if (!response.ok) {
      // Intentamos obtener un mensaje de error legible del cuerpo de la respuesta
      const errorText = await response.text();
      const status = response.status;
      
      console.error(`Error en Nominatim (Status ${status}): ${errorText}`);

      // Devolvemos un error genérico para el cliente, ocultando detalles internos si es necesario.
      return NextResponse.json(
        { error: `Error al consultar el servicio de mapas (HTTP ${status}).` }, 
        { status: 502 } // Usar 502 Bad Gateway/Proxy Error para errores de servicios externos.
      );
    }

    // 4. Respuesta Exitosa
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    // Manejo de errores de red o parsing (ej. conexión rechazada)
    const message = error instanceof Error 
      ? `Error de red/petición: ${error.message}` 
      : "Error desconocido e inesperado.";
      
    console.error("Error inesperado en API Route:", error);

    // No es necesario modificar las cookies en un error de red simple, 
    // a menos que estemos seguros de que el token es la causa. Lo eliminaremos aquí 
    // solo si la lógica original lo requería, pero es más común hacerlo en errores de AUTORIZACIÓN.
    const errorRes = NextResponse.json(
      { error: "Error interno del servidor. Por favor, intente más tarde.", debug: message }, 
      { status: 500 }
    );
    // Si la lógica de negocio requiere limpiar tokens en cualquier 500:
    // errorRes.cookies.delete('token');
    // errorRes.cookies.delete('refreshToken');

    return errorRes;
  }
}