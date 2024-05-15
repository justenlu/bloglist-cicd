import { render, screen } from '@testing-library/react'
import BlogView from './BlogView'
import store from '../store'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { setBlogs } from '../reducers/blogReducer'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const user = {
  username: 'johsmith',
  name: 'John Smith',
  id: '65d734a2279089e8ceba7144',
}

const blogUser = {
  username: 'johsmith',
  name: 'John Smith',
  id: '65d734a2279089e8ceba7144',
}

const blog = {
  title: 'My Wonderful Blog',
  author: 'Wonderful Blogist',
  url: 'https://mywonderfulblog.net',
  likes: 248,
  user: blogUser,
  id: '65d8831308b0989a38cf9ece'
}

const BlogViewTester = () => {
  const dispatch = useDispatch()

  dispatch(setUser(user))
  dispatch(setBlogs([blog]))

  return (
    <BlogView />
  )
}

test('renders title, author, url, likes and user', async () => {
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
        <Routes>
          <Route path='/blogs/:id' element={<BlogViewTester />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  screen.findByText('My Wonderful Blog', { exact: false })
  screen.getByText('by Wonderful Blogist', { exact: false })
  screen.getByText('https://mywonderfulblog.net')
  screen.getByText('248 likes', { exact: false })
  screen.getByText('John Smith', { exact: false })
})