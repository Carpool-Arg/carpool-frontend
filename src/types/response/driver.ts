export interface DriverResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  messages: string[];
  state: string;
}