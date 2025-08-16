import { ChangePasswordData } from "@/schemas/change-password/changePasswordSchema";
import { UnlockAccountResponse } from "@/types/response/user";


export async function unlockAccount(
  data: ChangePasswordData,
  token: string
): Promise<UnlockAccountResponse> {
  if (!token) {
    return { success: false, message: "No se ha proporcionado un token." };
  }

  try {
    const response = await fetch("/api/users/unlock-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      return { success: false, message: responseBody.message || "Error al desbloquear la cuenta." };
    }

    return {
      success: true,
      message: "Se actualizó tu contraseña, puedes volver a intentar iniciar sesión",
    };
  } catch (error) {
    return { success: false, message: "Ocurrió un problema." };
  }
}
