import { DeleteTransaction } from './../../../../domain/usecases/transaction/delete-transaction'
import { expect, test, describe, jest } from '@jest/globals'
import { DeleteTransactionController } from './delete-transaction-controller'

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
})
