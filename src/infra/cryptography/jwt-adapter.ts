import { Encrypter } from './../../data/protocols/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}
  encrypt (value: string): string {
    jwt.sign(value, this.secret)
    return ''
  }
}
