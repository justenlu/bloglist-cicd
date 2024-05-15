import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)

  const compareBlogs = (a, b) => b.likes - a.likes
  const sortedBlogs = blogs.toSorted(compareBlogs)

  const blogStyle = {
    marginTop: 5,
    paddingTop: 5,
    paddingLeft: 8,
    border: 'solid',
    borderWidth: 1,
    paddingBottom: 5,
  }

  return (
    <div data-testid="blogsDiv">
      {sortedBlogs.map((blog) => (
        <div style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Blogs
