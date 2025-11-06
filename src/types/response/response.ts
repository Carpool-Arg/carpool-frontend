export interface BaseResponse<T>{
  data: T | null;
  messages: string[];
  state: string;
}

export type VoidResponse = BaseResponse<null>;