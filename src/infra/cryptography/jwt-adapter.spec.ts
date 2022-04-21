import { JwtAdapter } from './jwt-adapter'
import { expect, test, describe, jest } from '@jest/globals'
import jwt from 'jsonwebtoken'
const secret = 'any_secret'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  },
  verify (): string {
    return 'any_id'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('JWT Adapter', () => {
  describe('Encrypt', () => {
    test('Should call JWT with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
    })
    test('Should return a token on success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_value')
      expect(accessToken).toBe('any_token')
    })
  })
  describe('decrypt()', () => {
    test('Should call JWT with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', secret)
    })
    test('Should JTW Adapter return null if JWT throws invalid signature', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error('invalid signature')
      })
      const token = sut.decrypt('any_token')
      expect(token).toBeNull()
    })
    test('Should return an id on success', async () => {
      const sut = makeSut()
      const id = sut.decrypt('any_token')
      expect(id).toEqual('any_id')
    })
  })
})
