const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


const initialBlogs = [
  {
    'title': 'Living on a planet',
    'author': 'Wanderer',
    'url': 'https://livingonaplanet.fi',
    'likes': 3
  },
  {
    'title': 'Best books ever',
    'author': 'Philosopher',
    'url': 'https://bestbooksever.fi',
    'likes': 5
  }
]

const initialUsers = [
  {
    'username': 'johsmith',
    'name': 'John Smith',
    'password': 'verysecret'
  },
  {
    'username': 'jansmith',
    'name': 'Jane Smith',
    'password': 'somethingsecret'
  }
]

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'to be removed',
    author: 'whoever',
    url: 'toberemoved.net',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()
  return blog.id
}

const newBlogData={
  'title': 'new title',
  'author': 'new author',
  'url': 'new url',
  'likes': 100
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON)
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON)
}

const login = async (user) => {
  const userData = {
    'username': user.username,
    'password': user.password
  }

  const response = await api.post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const token=response.body.token

  return token
}

module.exports = {
  initialBlogs, initialUsers, nonExistingBlogId, newBlogData, usersInDb, blogsInDb, login
}

