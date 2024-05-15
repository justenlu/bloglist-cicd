const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send(helper.initialUsers[0])
    .expect(201)

  await api
    .post('/api/users')
    .send(helper.initialUsers[1])
    .expect(201)

})

test('existing user with right password can log in', async () => {
  const user=helper.initialUsers[0]

  const userData = {
    'username': user.username,
    'password': user.password
  }

  let response = await api.post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const body = response.body

  expect(body.username).toBe(user.username)
  expect(body.name).toBe(user.name)
  expect(body.token).toBeDefined()

})

test('login attempt with existing username but wrong password fails', async () => {
  const user=helper.initialUsers[0]

  const userData = {
    'username': user.username,
    'password': 'wrong'
  }

  let response = await api.post('/api/login')
    .send(userData)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const body = response.body

  expect(body.username).not.toBeDefined()
  expect(body.name).not.toBeDefined()
  expect(body.token).not.toBeDefined()
})