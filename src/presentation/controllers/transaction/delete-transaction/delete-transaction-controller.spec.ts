import { DeleteTransactionController } from './delete-transaction-controller'
import { DeleteTransaction } from './delete-transaction-controller-protocols'
import { noContent, serverError } from './../../../helpers/http/http'
import { expect, test, describe, jest } from '@jest/globals'

const mockDeleteTransaction = (): DeleteTransaction => {
  class DeleteTransactionStub implements DeleteTransaction {
    async delete (id: string): Promise<void> {
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
    await sut.handle({ params: { id: 'any_id' } })
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ params: { id: 'any_id' } })
    expect(httpResponse).toEqual(noContent())
  })
  test('Should throw if DeleteTransaction throws', async () => {
    const { sut, deleteTransactionStub } = makeSut()
    jest.spyOn(deleteTransactionStub, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle({ params: { id: 'any_id' } })
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
