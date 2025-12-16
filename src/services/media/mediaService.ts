import { MediaResponse, VoidResponse } from "@/shared/types/response";

export async function getUserFile(id: number): Promise<MediaResponse> {
  try {
    const res = await fetch(`/api/media`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.messages?.[0]);
    }

    const response: MediaResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}


export async function uploadUserFile(file: File): Promise<VoidResponse> {
  try {

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/media`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.messages?.[0]);
    }

    const response: VoidResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}


export async function deleteUserFile(): Promise<VoidResponse> {
  try {

    const res = await fetch(`/api/media`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.messages?.[0]);
    }

    const response: VoidResponse = await res.json();

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}
