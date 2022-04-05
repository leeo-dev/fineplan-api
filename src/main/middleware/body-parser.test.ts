import request from 'supertest'
import app from '@/main/config/app'

describe('Body Parse Middleware', () => {
  test('Should parse body to json', async () => {
    app.post('/test_body_parse', (request, response) => {
      response.send(request.body)
    })
    await request(app)
      .post('/test_body_parse')
      .send({ name: 'Leonardo' })
      .expect({ name: 'Leonardo' })
  })
})
