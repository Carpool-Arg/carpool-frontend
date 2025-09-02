import { VehicleTypeResponse } from "@/types/response/vehicleType";


export async function getVehicleTypes(): Promise<VehicleTypeResponse> {
  try {
    const res = await fetch("/api/vehicle/type", {
      method: "GET",
      credentials: "include", // incluye las cookies (donde está el token)
    });


    const response: VehicleTypeResponse = await res.json();

    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}