export interface UserResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
  messages: string[];
  state: string;
}