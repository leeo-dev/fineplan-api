import { DeleteTransactionController } from './delete-transaction-controller'
import { DeleteTransaction } from './delete-transaction-controller-protocols'
import { AccessDeniedError } from './../../../errors/access-denied-error'
import { forbidden } from './../../../helpers/http/http'
import { expect, test, describe, jest } from '@jest/globals'

const mockDeleteTransaction = (): DeleteTransaction => {
  class DeleteTransactionStub implements DeleteTransaction {
    async delete (id: string): Promise<null> {
      return null
    }
  }
  return new DeleteTransactionStub()
}

type SutTypes = {
  sut: DeleteTransactionController
  deleteTransactionStub: DeleteTransaction
}

const makeSut = (): SutTypes => {
  const deleteTransactionStub = mockDeleteTransaction()
  const sut = new DeleteTransactionController(deleteTransactionStub)
  return { sut, deleteTransactionStub }
}

describe('DeleteTransaction Controller', () => {
  test('Should call DeleteTransaction with correct id', async () => {
    const { sut, deleteTransactionStub } = makeSut()
    const deleteSpy = jest.spyOn(deleteTransactionStub, 'delete')
    await sut.handle({ user: { id: 'any_id' } })
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return 403 if no user is founded', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
