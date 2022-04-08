import { AddAccountParams } from './add-account'

export interface Authentication {
  auth: (data: AddAccountParams) => Promise<string>
}
