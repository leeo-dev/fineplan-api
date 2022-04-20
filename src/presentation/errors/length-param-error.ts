export class LengthParamError extends Error {
  constructor (paramName: string, min: number = 3, max: number = 25) {
    super(`${paramName} needs to be between ${min} to ${max} characters`)
    this.name = 'LengthParamError'
  }
}
