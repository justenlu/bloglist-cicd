import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  if (users === null) {
    return <div>Loading users...</div>
  }

  const countUsersBlogs = (id) => {
    const blogsOfUser = blogs.filter((b) => b.user.id === id)
    return blogsOfUser.length
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{countUsersBlogs(user.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
