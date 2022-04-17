export type TransactionParam = {
  title: string
  amount: number
  date: Date
  created_at?: Date
}

export interface AddTransaction {
  add: (data: TransactionParam) => Promise<void>
}
