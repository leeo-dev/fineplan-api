export interface Decrypter {
  decrypt: (accessToken: string) => string
}
