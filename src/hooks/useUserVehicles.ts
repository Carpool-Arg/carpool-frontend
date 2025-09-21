import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { getVehicles } from '@/services/vehicleService';

export function useUserVehicles() {
  const { user, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return; // Esperar a que el usuario esté disponible

    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVehicles(); // pasamos el id del usuario
        setVehicles(data.data??[]);
      } catch (err) {
        setError('Error al cargar los vehículos');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  return { vehicles, loading: loading || authLoading, error };
}
