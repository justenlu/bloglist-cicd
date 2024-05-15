import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useNavigate } from 'react-router-dom'

const BlogView = () => {
  const blogs = useSelector((state) => state.blogs)
  const id = useParams().id

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const navigate = useNavigate()

  const removeButtonStyle = {
    backgroundColor: 'LightCoral',
  }

  const addLike = async () => {
    dispatch(likeBlog(blog))
  }

  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog))
      navigate('/')
    }
  }

  const blog = blogs.find((b) => b.id === id)
  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>{' '}
      </div>
      <div>
        {blog.likes} likes <button onClick={addLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {user.username === blog.user.username ? (
        <button onClick={remove} style={removeButtonStyle}>
          remove
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

export default BlogView
