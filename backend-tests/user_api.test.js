const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('when saving a user', () => {

  test('without username field, server answers with status code 400 and error message including "username missing" without creating the user', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      'name': 'Some Name',
      'password': 'verysecret'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toStrictEqual(usersBefore)

    expect(response.body.error).toContain('username missing')
  })

  test('with too short username, server answers with status code 400 and error message including "username too short" without creating the user', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      'username': 'sn',
      'name': 'Some Name',
      'password': 'verysecret'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toStrictEqual(usersBefore)

    expect(response.body.error).toContain('username too short')
  })

  test('with username that is already taken, server answers with status code 400 and error message including "username already taken" without creating the user', async () => {

    const newUser1 = {
      'username': 'popular',
      'name': 'Some Name',
      'password': 'verysecret'
    }

    await api
      .post('/api/users')
      .send(newUser1)

    const usersBefore = await helper.usersInDb()

    const newUser2 = {
      'username': 'popular',
      'name': 'Some Other Name',
      'password': 'veryhardtoguess'
    }

    const response = await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toStrictEqual(usersBefore)

    expect(response.body.error).toContain('username already taken')
  })


  test('without password field, server answers with status code 400 and error message including "password missing" without creating the user', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      'username': 'somebody',
      'name': 'Some Person',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toStrictEqual(usersBefore)

    expect(response.body.error).toContain('password missing')
  })

  test('with too short password, server answers with status code 400 and error message including "password too short" without creating the user', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      'username': 'somename',
      'name': 'Some Name',
      'password': 'vs'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toStrictEqual(usersBefore)

    expect(response.body.error).toContain('password too short')
  })

  test('with long enough password and username, server creates the user and answers with status code 201', async () => {
    const newUser = {
      'username': 'longenoughname',
      'name': 'Long Enough Name',
      'password': 'longenough'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')

    const usersInDb = response.body

    const usernames = usersInDb.map(user => user.username)

    expect(usersInDb).toHaveLength(1)
    expect(usernames).toContain(newUser.username)

  })

})

afterAll(async () => {
  await mongoose.connection.close()
})