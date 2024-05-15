const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
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

  await Blog.deleteMany({})

  let user=helper.initialUsers[0]
  let token = await helper.login(user)
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(helper.initialBlogs[0])

  user=helper.initialUsers[1]
  token = await helper.login(user)
  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token)
    .send(helper.initialBlogs[1])

})

describe('when there are initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('right number of blogs is returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('all saved blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    const urls = response.body.map(b => b.url)

    helper.initialBlogs.forEach(b => expect(urls).toContain(b.url))
  })

  test('blogs have a field called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })

})

describe('adding a new blog', () => {

  test('without token fails with status code 401', async () => {
    const blogsBefore = await helper.blogsInDb()

    const newBlog = {
      'title': 'My Awesome Blog',
      'author': 'Awesome Blogist',
      'url': 'https://myawesomeblog.net',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toStrictEqual(blogsBefore)
  })

  describe('with valid token', () => {

    test('blogs can be added sending HTTP POST request to /api/blogs', async () => {
      const user=helper.initialUsers[0]
      const token = await helper.login(user)

      const newBlog =   {
        'title': 'My Wonderful Blog',
        'author': 'Wonderful Blogist',
        'url': 'https://mywonderfulblog.net',
        'likes': 7
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const blogsInDB = response.body

      const urls = blogsInDB.map(blog => blog.url)

      expect(blogsInDB).toHaveLength(helper.initialBlogs.length + 1)
      expect(urls).toContain(newBlog.url)

    })

    test('when saving a blog with undefined likes field, the field gets value 0', async () => {
      const user=helper.initialUsers[0]
      const token = await helper.login(user)

      const newBlog = {
        'title': 'My Awesome Blog',
        'author': 'Awesome Blogist',
        'url': 'https://myawesomeblog.net',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog=response.body

      expect(savedBlog.likes).toBe(0)
    })

    test('when saving a blog without title field, server answers with status code 400 Bad request', async () => {
      const user=helper.initialUsers[0]
      const token = await helper.login(user)

      const newBlog = {
        'author': 'Some Person',
        'url': 'https://titleless.net',
        'likes': 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(400)
    })

    test('when saving a blog without url field, server answers with status code 400 Bad request', async () => {
      const user=helper.initialUsers[0]
      const token = await helper.login(user)

      const newBlog = {
        'title': 'Awesome',
        'author': 'Some Person',
        'likes': 12
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(400)
    })

  })

})

describe('deletion of a blog', () => {
  test('succeeds if id is valid and the user who deletes the blog is the user who added the blog', async () => {
    let response = await api.get('/api/blogs')
    const blogs = response.body

    const idToRemove=blogs[0].id

    const user = helper.initialUsers[0]
    const token = await helper.login(user)

    await api
      .delete(`/api/blogs/${idToRemove}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length-1)
    const remainingBlogs = response.body
    const remainingIds = remainingBlogs.map(blog => blog.id)
    expect(remainingIds).not.toContain(idToRemove)

  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const user = helper.initialUsers[0]
    const token = await helper.login(user)

    const invalidId = '65ccc116ba3200d53e35df1'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  })

})

describe('updating a blog', () => {
  test('succeeds if id is valid and found', async () => {
    let response = await api.get('/api/blogs')
    const blogs = response.body
    const blogToUpdate = blogs[0]

    const idToUpdate=blogToUpdate.id
    const newLikes=blogToUpdate.likes+1

    const update = {
      'title': blogToUpdate.title,
      'author': blogToUpdate.author,
      'url': blogToUpdate.url,
      'likes': newLikes
    }

    response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(update)
      .expect(200)
    const updatedBlog = response.body

    expect(updatedBlog.likes).toBe(newLikes)

  })

  test('fails with statuscode 404 if id valid but not found', async () => {
    const nonExistingId = await helper.nonExistingBlogId()
    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(helper.newBlogData)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '65ccc116ba3200d53e35df1'
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(helper.newBlogData)
      .expect(400)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})