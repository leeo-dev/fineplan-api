import { SignUpController } from '@/presentation/controllers/signup'
describe('SignUp Controller', () => {
  test('ensure SignUp Controller returns 400 if no username is provided ', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
  test('ensure SignUp Controller returns 400 if no password is provided ', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        username: 'any_username'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
