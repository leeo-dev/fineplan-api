export type DecrypterParam = {
  id: string
  iat: number
  exp?: number
}
export interface Decrypter {
  decrypt: (accessToken: string) => DecrypterParam | null
}
