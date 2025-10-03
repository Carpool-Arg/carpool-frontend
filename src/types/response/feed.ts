import { BaseResponse } from "./response"


export interface FeedData {
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

export type FeedResponse = BaseResponse<FeedData[]>