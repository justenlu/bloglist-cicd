import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { notify } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'

const BlogsElement = ({ user, blogFormRef }) => (
  <div>
    {user && (
      <Togglable
        buttonLabel="create new blog"
        buttonTestId="open-BlogForm-button"
        ref={blogFormRef}
      >
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    )}
    {user && <Blogs />}
  </div>
)

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  const menudiv = {
    backgroundColor: 'lightgrey',
  }
  return (
    <div style={menudiv}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user ? (
        <>
          {user.name} logged in&nbsp;
          <button onClick={handleLogout}>logout</button>
        </>
      ) : (
        ''
      )}
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async (event) => {
    event.preventDefault()
    const name = user.name
    dispatch(logoutUser())
    navigate('/')
    dispatch(notify(`Logged out ${name}`))
    setUsername('')
    setPassword('')
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification />
      {user && <Menu user={user} handleLogout={handleLogout} />}
      {!user && (
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && <h2>Bloglist</h2>}
      <Routes>
        <Route
          path="/"
          element={<BlogsElement user={user} blogFormRef={blogFormRef} />}
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  )
}

export default App
