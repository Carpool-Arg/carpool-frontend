import { City } from "../city";
import { BaseResponse } from "./response";

export type CitiesResponse = BaseResponse<City[]>
export type CityResponse = BaseResponse<City>