import { vehicleFormData } from "@/types/forms";
import { VoidResponse } from "@/types/response/response";
import { VehicleResponse, VehiclesResponse } from "@/types/response/vehicle";

export async function getVehicleById(id: number): Promise<VehicleResponse> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }

    const response: VehicleResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function getVehicles(): Promise<VehiclesResponse> {
  try {
    const res = await fetch("/api/vehicle", {
      method: "GET",
      credentials: "include", // incluye las cookies (donde está el token)
    });

    const response: VehiclesResponse = await res.json();

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

export async function registerVehicle(data: vehicleFormData): Promise<VoidResponse> {
    try {
        const res = await fetch('/api/vehicle',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include', 
        })

        const response: VoidResponse = await res.json();

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

export async function updateVehicle(id: number, data: vehicleFormData): Promise<VoidResponse> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const response: VoidResponse = await res.json();
    
    if (!res.ok) {
      throw new Error(response.messages?.[0] || "Error desconocido");
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function deleteVehicle(id: number): Promise<VoidResponse> {
  try {
    const res = await fetch(`/api/vehicle?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const response: VoidResponse = await res.json();

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