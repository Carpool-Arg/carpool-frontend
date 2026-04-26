import { BaseResponse } from "@/shared/types/response";
import { TopCityStat } from "../topCity";


export interface TopCityStatResponseDTO {
  cities: TopCityStat[]
}


export type TopCityStatResponse = BaseResponse<TopCityStatResponseDTO>