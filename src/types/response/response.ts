export interface BaseResponse<T>{
  data: T;
  messages: string[];
  state: string;
}