export interface DeleteTransaction {
  delete: (id: string) => Promise<boolean>
}
