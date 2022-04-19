export type TransactionParam = {
  title: string
  type: string
  amount: number
  date: Date
  created_at?: Date
  user_id: string
}

export interface AddTransaction {
  add: (data: TransactionParam) => Promise<void>
}
