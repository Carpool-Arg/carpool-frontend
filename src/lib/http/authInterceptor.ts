class TokenManager {
  private static instance: TokenManager;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async refreshToken(): Promise<boolean> {
    // Si ya hay un refresh en progreso, esperar a que termine
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<boolean> {
    try {
      const refresh = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refresh.ok) {
        return true;
      } else {
        console.error('[TOKEN] Refresh falló:', refresh.status);
        return false;
      }
    } catch (error) {
      console.error('[TOKEN] Error en refresh:', error);
      return false;
    }
  }
}

export async function fetchWithRefresh(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const tokenManager = TokenManager.getInstance();

  const res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (res.status !== 401) {
    return res;
  }

  console.warn(`[fetchWithRefresh] Token expirado para ${input}. Intentando refrescar...`);

  // Usar el token manager para evitar múltiples refresh
  const refreshSuccess = await tokenManager.refreshToken();
   
  if (!refreshSuccess) {
    console.error('[fetchWithRefresh] No se pudo refrescar el token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Token inválido o expirado');
  }

  // Reintentamos la petición original
  const retryRes = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  return retryRes;
}