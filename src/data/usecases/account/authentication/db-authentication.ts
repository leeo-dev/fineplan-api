import { LoadUserByUsernameRepository } from './../../../protocols/load-user-by-username-repository'
import { Authentication } from '@/domain/usecases/account/authentication'
import { AddAccountParams } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository) {}
  async auth (data: AddAccountParams): Promise<string | null> {
    this.loadUserByUsernameRepository.loadByUsername(data.username)
    return await Promise.resolve(null)
  }
}
