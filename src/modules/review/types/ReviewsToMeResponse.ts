import { UserReview } from "./UserReview";

export interface ReviewsToMeResponse{
  total:number;
  rating: number;
  reviews: UserReview[]
}