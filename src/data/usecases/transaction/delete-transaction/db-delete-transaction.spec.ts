import { DbDeleteTransaction } from './db-delete-transaction'
import { DeleteTransactionRepository } from './../../../protocols/transaction/delete-transaction-repository'
import { expect, test, describe, jest } from '@jest/globals'

const mockDeleteTransactionRepository = (): DeleteTransactionRepository => {
  class DeleteTransactionRepositoryStub implements DeleteTransactionRepository {
    async delete (userId: string): Promise<void> {
    }
  }
  return new DeleteTransactionRepositoryStub()
}

type SutTypes = {
  sut: DbDeleteTransaction
  deleteTransactionRepositoryStub: DeleteTransactionRepository
}

const makeSut = (): SutTypes => {
  const deleteTransactionRepositoryStub = mockDeleteTransactionRepository()
  const sut = new DbDeleteTransaction(deleteTransactionRepositoryStub)
  return { sut, deleteTransactionRepositoryStub }
}

describe('DbDeleteTransaction', () => {
  test('Should call DeleteTransactionRepository with correct id', async () => {
    const { sut, deleteTransactionRepositoryStub } = makeSut()
    const deleteSpy = jest.spyOn(deleteTransactionRepositoryStub, 'delete')
    await sut.delete('any_id')
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should throw if DeleteTransactionRepository throws', async () => {
    const { sut, deleteTransactionRepositoryStub } = makeSut()
    jest.spyOn(deleteTransactionRepositoryStub, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.delete('any_id')
    await expect(promise).rejects.toThrow()
  })
})
