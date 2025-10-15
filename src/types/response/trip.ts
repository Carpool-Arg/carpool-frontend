import { BaseResponse } from "./response"


export interface SearchData {
    driverInfo: {
        fullName: string
        profileImageUrl: string
        rating: number
    }
    startDateTime: string // ISO string
    tripStops: {
        cityId:null
        cityName: string
        observation: string
        estimatedArrivalDateTime: string
    }[]
    availableSeat: number
    seatPrice: number
}

export type SearchResponse = BaseResponse<SearchData[]>
