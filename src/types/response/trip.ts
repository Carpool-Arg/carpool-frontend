import { BaseResponse } from "./response"


export interface SearchData {
    driverInfo: {
        fullName: string
        profileImageUrl: string
        rating: number
    }
    startDateTime: string // ISO string
    tripStops: {
        cityName: string
        observation: string
    }[]
    availableSeat: number
    seatPrice: number
}

export type SearchResponse = BaseResponse<SearchData[]>