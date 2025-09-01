import { BaseResponse } from "./response";

export interface UserData {
  accessToken: string;
  refreshToken: string;
}

export interface UserDetailsData {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  email: string;
  gender: string;
  phone: string;
  profileImage?: string;
  status: string;
  birthDate:string; 
}

export type UserResponse = BaseResponse<UserData>
export type UserDetailsResponse = BaseResponse<UserDetailsData>