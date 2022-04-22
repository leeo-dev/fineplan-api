export interface DeleteTransactionRepository {
  delete: (userId: string) => Promise<void>

}
