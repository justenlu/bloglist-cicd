import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notify, reportError } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      const changedBlog = action.payload
      const id = changedBlog.id
      return state.map((blog) => (blog.id !== id ? blog : changedBlog))
    },
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      const blogToDelete = action.payload
      const id = blogToDelete.id
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, deleteBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (title, author, url) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create({ title, author, url })
      dispatch(appendBlog(newBlog))
      dispatch(notify(`a new blog ${title} by ${author} added`))
    } catch (exception) {
      dispatch(reportError('Something went wrong when trying to add the blog'))
    }
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id)
      dispatch(deleteBlog(blog))
      dispatch(notify(`Removed ${blog.title} by ${blog.author}`))
    } catch (exception) {
      console.log(exception)
      dispatch(reportError(`Could not remove ${blog.title} by ${blog.author}`))
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const id = blog.id
    const updated = {
      ...blog,
      likes: blog.likes + 1,
    }
    try {
      const changedBlog = await blogService.update(id, updated)
      dispatch(updateBlog(changedBlog))
    } catch (exception) {
      dispatch(reportError('Something went wrong when trying to like the blog'))
    }
  }
}

export default blogSlice.reducer
