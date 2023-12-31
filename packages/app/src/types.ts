export type Person = {
  givenName: string
  familyName: string
  address?: {
    streetAddress: string
    addressRegion: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
}
