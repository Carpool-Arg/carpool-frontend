import { UserReview } from "./UserReview";

export interface ReviewsToMeResponse{
  total:number;
  reviews: UserReview[]
}