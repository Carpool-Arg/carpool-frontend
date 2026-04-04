
export interface Driver {
  id: number
  fullName: string
  rating: number
  licenseStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  frontLicenseUrl: string
  backLicenseUrl: string
  city: string
}