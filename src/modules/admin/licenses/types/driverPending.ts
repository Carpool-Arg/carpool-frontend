export interface DriverPendingDTO {
  driverId: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  licenseExpirationDate: string; 
  licenseClass: string;
  licenseStatus: 'PENDING'|'APPROVED'|'REJECTED'
  frontLicensePhotoUrl: string;
  backLicensePhotoUrl: string;
}