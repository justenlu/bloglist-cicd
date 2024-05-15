import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const User = () => {
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  const id = useParams().id

  const user = users.find((u) => u.id === id)
  if (!user) {
    return null
  }

  const blogsOfUser = blogs.filter((b) => b.user.id === id)

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {blogsOfUser.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User
