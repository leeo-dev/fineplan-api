export interface LoadTransactionByIdRepository {
  loadById: (id: string) => Promise<boolean>
}
