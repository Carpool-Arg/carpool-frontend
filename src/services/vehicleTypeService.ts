import { VehicleTypeResponse } from "@/types/response/vehicleType";


export async function getVehicleTypes(): Promise<{
  success: boolean;
  data?: VehicleTypeResponse;
  message?: string;
}> {
  try {
    const res = await fetch("/api/vehicle/type", {
      method: "GET",
      credentials: "include", // incluye las cookies (donde está el token)
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }

    const response: VehicleTypeResponse = await res.json();

    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Network error" };
  }
}