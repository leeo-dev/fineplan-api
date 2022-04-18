export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server error, please try again later!')
    this.name = 'ServerError'
    this.stack = stack
  }
}
