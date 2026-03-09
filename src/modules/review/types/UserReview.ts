export interface UserReview {
  id: number,
  stars: number,
  createdAt: string,
  tripDate: string, 
  description: string, 
  completeName: string,
  profilePhotoUrl: string 
  tripId: number;
}