import { CityResponse } from "@/types/response/city";

export async function fetchCities(query: string): Promise<CityResponse> {
    console.log(query)
  const res = await fetch(`/api/city/autocomplete?name=${query}`,{
    headers: {
        "Content-Type": "application/json",
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error("Error al obtener localidades");

  const response: CityResponse = await res.json();
  return response; // tu Response<T> trae el objeto en `data`
}
