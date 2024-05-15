const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(request.user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedSavedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedSavedBlog)

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const id = request.params.id

  const updates = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).populate('user', { username: 1, name: 1 })

  if (updatedBlog) {
    response.json(updatedBlog)
  }
  else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogId = request.params.id
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(blogId)
  const user = await User.findById(request.user)

  if ( blog.user.toString() === request.user ) {
    await blog.deleteOne()
    user.blogs=user.blogs.filter(b => b._id.toString() !== blog._id.toString())
    await user.save()
    response.status(204).end()
  }
  else {
    response.status(401).json({ error: 'deleting blogs added by another user is not allowed' })
  }
})

module.exports = blogsRouter