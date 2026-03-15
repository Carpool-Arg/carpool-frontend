import {UserReview } from "./UserReview";

export interface ReviewsFromMeResponse{
  total: number;
  reviews: UserReview[]
}