export class UsernameInUseError extends Error {
  constructor () {
    super('Username already in use! please try another one')
    this.name = 'UsernameInUseError'
  }
}
