export interface DeleteTransactionRepository {
  delete: (id: string) => Promise<void>

}
