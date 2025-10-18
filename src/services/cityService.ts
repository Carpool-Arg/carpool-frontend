import { CitiesResponse, CityResponse } from "@/types/response/city";

export async function fetchCities(query: string): Promise<CitiesResponse> {
  const res = await fetch(`/api/city/autocomplete?name=${query}`,{
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error al obtener localidades");

  const response: CitiesResponse = await res.json();
  return response; 
}

export async function fetchCityById(id: number): Promise<CityResponse> {

  const res = await fetch(`/api/city/${id}`,{
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error la localidad");

  const response: CityResponse = await res.json();
  return response; 
}

export async function fetchCityByName(name: string): Promise<CityResponse>{
  const res = await fetch(`/api/city/name/${name}`,{
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error la localidad");

  const response: CityResponse = await res.json();
  return response; 
}