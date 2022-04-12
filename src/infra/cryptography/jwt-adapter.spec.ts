import { JwtAdapter } from './jwt-adapter'
import { expect, test, describe, jest } from '@jest/globals'
import jwt from 'jsonwebtoken'
const secret = 'any_secret'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('JWT Adapter', () => {
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
