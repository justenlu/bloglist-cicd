import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ blogFormRef }) => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    dispatch(createBlog(title, author, url))
    blogFormRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            data-testid="title-field"
            type="text"
            value={title}
            name="Title"
            id="title-input"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author-field"
            type="text"
            value={author}
            name="Author"
            id="author-input"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url-field"
            type="text"
            value={url}
            name="Url"
            id="url-input"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" data-testid="create-blog-button">
          create
        </button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  blogFormRef: PropTypes.object.isRequired,
}

export default BlogForm
