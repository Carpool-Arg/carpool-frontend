import { BaseResponse } from "./response";

export interface DriverData {
  
  accessToken: string;
  refreshToken: string;
  
}

export type VoidResponse = BaseResponse<void>;
export type DriverResponse = BaseResponse<DriverData>;