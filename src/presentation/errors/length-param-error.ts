export class LengthParamError extends Error {
  constructor (paramName: string, min: number, max: number) {
    super(`${paramName} needs to be between ${min} to ${max} characters`)
    this.name = 'LengthParamError'
  }
}
