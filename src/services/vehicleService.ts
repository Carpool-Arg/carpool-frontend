import { vehicleFormData } from "@/types/forms";
import { vehicleByIdResponse, VehicleDeleteResponse, VehicleGetResponse, VehiclePostResponse } from "@/types/response/vehicle";

export async function getMyVehicleById(id: number): Promise<{
  success: boolean;
  data?: vehicleByIdResponse;
  message?: string;
}> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }

    const response: vehicleByIdResponse = await res.json();

    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Network error" };
  }
}

export async function myVehicles(): Promise<{
  success: boolean;
  data?: VehicleGetResponse;
  message?: string;
}> {
  try {
    const res = await fetch("/api/vehicle", {
      method: "GET",
      credentials: "include", // incluye las cookies (donde está el token)
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }

    const response: VehicleGetResponse = await res.json();

    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Network error" };
  }
}

export async function registerVehicle(data: vehicleFormData): Promise<{
    success:boolean;
    data?:VehiclePostResponse;
    message?: string}
> {
    try {
        const res = await fetch('/api/vehicle',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include', 
        })

        const responseBody = await res.json();

        if (!res.ok) {
          throw new Error(responseBody.message || 'Error desconocido');
        }

        return { success: true, data: responseBody };
    } catch (err: any) {
        return {success: false, message: err.message}
   }
} 

export async function updateVehicle(id: number, data: vehicleFormData): Promise<{
  success: boolean;
  data?: VehiclePostResponse; // mismo tipo que registerVehicle
  message?: string;
}> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseBody = await res.json();

    if (!res.ok) {
      throw new Error(responseBody.message || "Error desconocido");
    }

    return { success: true, data: responseBody };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteVehicle(id: number): Promise<{
  success: boolean;
  data?: VehicleDeleteResponse;
  message?: string;
}> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const responseBody = await res.json();

    if (!res.ok) {
      throw new Error(responseBody.message || 'Error desconocido');
    }

    return { success: true, data: responseBody };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}