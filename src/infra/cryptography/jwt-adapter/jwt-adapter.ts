import { Decrypter, DecrypterParam, Encrypter } from './jwt-adapter-protocols'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}
  async encrypt (value: string): Promise<string> {
    const token = await jwt.sign({ id: value }, this.secret)
    return token
  }

  decrypt (accessToken: string): DecrypterParam | null {
    const result: any = jwt.verify(accessToken, this.secret)
    return result
  }
}
