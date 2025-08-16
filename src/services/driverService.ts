import { DriverData } from "@/schemas/auth/driverSchema";
import { DriverResponse } from "@/types/response/driver";

export async function registerDriver( data: DriverData): Promise<{
  success:boolean;
  data?:DriverResponse;
  message?: string}
> {
  try {
    const body = { ...data};

    const res = await fetch(`/api/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', 
    });

    if (!res.ok){
      throw new Error('Datos inválidos')
    }

    const response: DriverResponse = await res.json();

    return {success: true, data: response}
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return {success: false, message: message}
  }
}