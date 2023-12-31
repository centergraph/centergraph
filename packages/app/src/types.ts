export type Person = {
  givenName: string
  familyName: string
  birthDate?: string
  address?: {
    streetAddress: string
    addressRegion: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }[]
}
