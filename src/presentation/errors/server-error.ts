export class ServerError extends Error {
  constructor () {
    super('Internal server error, please try again later!')
    this.name = 'ServerError'
  }
}
