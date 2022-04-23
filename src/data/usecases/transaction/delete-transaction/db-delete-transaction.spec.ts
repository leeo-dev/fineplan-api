import { LoadTransactionByIdRepository } from './../../../protocols/transaction/load-transaction-by-id-repository'
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

const mockLoadTransactionByIdRepository = (): LoadTransactionByIdRepository => {
  class DeleteTransactionRepositoryStub implements LoadTransactionByIdRepository {
    async loadById (id: string): Promise<boolean> {
      return true
    }
  }
  return new DeleteTransactionRepositoryStub()
}

type SutTypes = {
  sut: DbDeleteTransaction
  deleteTransactionRepositoryStub: DeleteTransactionRepository
  loadTransactionByIdRepositoryStub: LoadTransactionByIdRepository
}

const makeSut = (): SutTypes => {
  const deleteTransactionRepositoryStub = mockDeleteTransactionRepository()
  const loadTransactionByIdRepositoryStub = mockLoadTransactionByIdRepository()
  const sut = new DbDeleteTransaction(deleteTransactionRepositoryStub, loadTransactionByIdRepositoryStub)
  return { sut, deleteTransactionRepositoryStub, loadTransactionByIdRepositoryStub }
}

describe('DbDeleteTransaction', () => {
  test('Should call DeleteTransactionRepository with correct id', async () => {
    const { sut, deleteTransactionRepositoryStub } = makeSut()
    const deleteSpy = jest.spyOn(deleteTransactionRepositoryStub, 'delete')
    await sut.delete('any_id')
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should call LoadTransactionByIdRepository with correct id', async () => {
    const { sut, loadTransactionByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadTransactionByIdRepositoryStub, 'loadById')
    await sut.delete('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return false if LoadTransactionByIdRepository return false', async () => {
    const { sut, loadTransactionByIdRepositoryStub } = makeSut()
    jest.spyOn(loadTransactionByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(false))
    const transaction = await sut.delete('any_id')
    expect(transaction).toBeFalsy()
  })
  test('Should throw if LoadTransactionByIdRepository throws', async () => {
    const { sut, loadTransactionByIdRepositoryStub } = makeSut()
    jest.spyOn(loadTransactionByIdRepositoryStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.delete('any_id')
    await expect(promise).rejects.toThrow()
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
