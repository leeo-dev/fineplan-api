export type AddAccountParams = {
  username: string
  password: string
}
export interface AddAccount {
  add: (accountParams: AddAccountParams) => Promise<string | null>
}
