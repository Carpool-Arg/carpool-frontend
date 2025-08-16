import { BaseResponse } from "./response";

export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleLoginData {
  accessToken: string;
  refreshToken: string | null;
  email: string;
  name: string;
  status: string;
  needsAction: boolean;
};

export interface CompleteRegData {
  data: unknown //poner la data que devuelve el back
}

export type VoidResponse = BaseResponse<void>;
export type LoginResponse = BaseResponse<LoginData>;
export type GoogleLoginResponse = BaseResponse<GoogleLoginData>;
export type CompleteRegResponse = BaseResponse<CompleteRegData>;