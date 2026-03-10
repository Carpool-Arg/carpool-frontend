import { CitiesResponseDTO } from "@/modules/city/types/dto/CitiesResponseDTO";
import { CityResponseDTO } from "@/modules/city/types/dto/CityResponseDTO";


export async function fetchCities(query: string, signal?: AbortSignal): Promise<CitiesResponseDTO> {
  const res = await fetch(`/api/city/autocomplete?name=${query}`,{
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include',
    signal
  });

  if (!res.ok) throw new Error("Error al obtener localidades");

  const text = await res.text();
  const response: CitiesResponseDTO = text
  ? JSON.parse(text)
  : { data: null, messages: [], state: "ERROR" };
  return response; 
}

export async function fetchCityById(id: number): Promise<CityResponseDTO> {

  const res = await fetch(`/api/city/${id}`,{
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error la localidad");

  const response: CityResponseDTO = await res.json();
  return response; 
}

export async function fetchCityByName(name: string): Promise<CityResponseDTO>{
  const res = await fetch(`/api/city/name/${name}`,{
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error la localidad");

  const response: CityResponseDTO = await res.json();
  return response; 
}

export async function getCityByCoordinates(lat: number, lng: number) {
  const res = await fetch(`/api/city?lat=${lat}&lng=${lng}`, {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}