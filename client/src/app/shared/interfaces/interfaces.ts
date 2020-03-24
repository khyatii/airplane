export interface userInterface {
  created_at?: string,
  email: string,
  firstName?: string,
  password: string,
  id?: string,
  promoCode?: string,
  role?: string,
  adminSecret?: string,
  updated_at?: string,
  __v?: number
  _id?: string,
  idFront?: {
    originalName: string,
    secureUrl: string,
    mimeType: string
  },
  idBack?: {
    originalName: string,
    secureUrl: string,
    mimeType: string
  },
  address?:{
    address: string,
    postalCode: string,
    city: string,
    country: string
  },
  message?:string
}

export interface claimInterface {
  __v?: number
  _id?: string,
  createdAt?: string,
  updatedAt?: string,
  promoCode?: string,
  userMoney?: number,
  collaboratorMoney?: number,
  companyMoney?: number,
  username?: any,
  claimType: string,
  delay?: boolean,
  airline: object,
  airports: Array<object>,
  companyClaim?: {
    originalName: string,
    secureUrl: string,
    mimeType: string
  },
  flightTicketOrReservation?: {
    originalName: string,
    secureUrl: string,
    mimeType: string
  },
  boardingPass?: {
    originalName: string,
    secureUrl: string,
    mimeType: string
  },
  status?: string,
}

export interface airportInterface {
  name: string,
  location: Array<number>,
  continent: string,
  country: string,
}

export interface airlineInterface {
  name: string,
  country: string,
  iata: string,
  icao: string,
}

export interface authErrorInterface {
  message?: string
}
