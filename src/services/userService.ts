import { ProfileData } from "@/schemas/profile/profileSchema";
import { UserResponse } from "@/types/response/user";

/**
 * Actualiza el perfil de un usuario en el backend.
 *
 * Envía los datos del perfil al endpoint correspondiente y devuelve
 * la respuesta estándar `UserResponse`. En caso de error de red o
 * excepción, retorna un `UserResponse` con `data` en `null` y `state` como "ERROR".
 *
 * @param {ProfileData} data - Datos del perfil a actualizar.
 * @returns {Promise<UserResponse>} - Resultado de la actualización.
 */

export async function updateUser(data: ProfileData): Promise<UserResponse> {
  try {
    const formData = new FormData();
    formData.append(
      "userProfileUpdateRequestDTO",
      new Blob([JSON.stringify({
        phone: data.phone,
        gender: data.gender?.toUpperCase(),
        removeProfileImage: data.removeProfileImage ?? false,
      })], { type: "application/json" })
    );

    if (data.file) formData.append("file", data.file);

    const res = await fetch('/api/users/update-profile', {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    const response: UserResponse = await res.json();
    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}
