import { AddAccountParams } from '../../domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (addAccount: AddAccountParams) => Promise<string>
}
