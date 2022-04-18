import { DbLoadAccountIdByAccessToken } from './db-load-account-id-by-access-token'
import { Decrypter } from './../../../protocols/decrypter'
import { expect, test, describe, jest } from '@jest/globals'

const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (accessToken: string): string | null {
      return 'any_id'
    }
  }
  return new DecrypterStub()
}

type SutTypes = {
  sut: DbLoadAccountIdByAccessToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const sut = new DbLoadAccountIdByAccessToken(decrypterStub)
  return { sut, decrypterStub }
}
describe('DbLoadAccountIdByAccessToken', () => {
  test('Should call decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadIdByAccessToken('any_accessToken')
    expect(decryptSpy).toHaveBeenCalledWith('any_accessToken')
  })
  test('Should return if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const id = await sut.loadIdByAccessToken('any_accessToken')
    expect(id).toBeNull()
  })
})
