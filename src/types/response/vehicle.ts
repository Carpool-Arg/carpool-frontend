export interface VehicleGetResponse {
  data: Vehicle[];
  messages: string[];
  state: string;
}


export interface VehiclePostResponse {
  data: null;
  messages: string[];
  state: string;
}