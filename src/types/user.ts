export interface User {
  username: string
  roles: Array<'user' | 'driver'>;
  imageUrl?:string
}
