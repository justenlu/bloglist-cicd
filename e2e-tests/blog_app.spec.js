const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require ('./helper')
const config = require('../utils/config')

describe('Bloglist app', () => {
  const backend_url = `http://localhost:${config.PORT}`
  beforeEach(async ({ page, request }) => {
    await request.post(`${backend_url}/api/testing/reset`)
    await request.post(`${backend_url}/api/users`, {
      data: {
        username: 'johsmith',
        name: 'John Smith',
        password: 'verysecret'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, 'johsmith', 'verysecret')
      await expect(page.getByText('Logged in John Smith')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'johsmith', 'wrongpassword')
      await expect(page.getByText('Login failed. Wrong username or password?')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'johsmith', 'verysecret')
    })
    test('a new blog can be created', async ({ page }) => {
      createBlog(page, 'My Awesome Blog', 'Awesome Blogist', 'https://myawesomeblog.net')
      const notificationDiv = await page.getByTestId('notification')
      await expect(notificationDiv).toContainText('a new blog My Awesome Blog by Awesome Blogist added')

      const blogsDiv = await page.getByTestId('blogsDiv')
      await expect(blogsDiv).toContainText('Awesome Blog by Awesome Blogist')
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'My Wonderful Blog', 'Wonderful Blogist', 'https://mywonderfulblog.net')
      })
      test('blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'My Wonderful Blog' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1 likes')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('2 likes')).toBeVisible()
      })
      test('user who created the blog can remove it', async ({ page }) => {
        await page.getByRole('link', { name: 'My Wonderful Blog' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        const notificationDiv = await page.getByTestId('notification')
        await expect(notificationDiv).toContainText('Removed My Wonderful Blog by Wonderful Blogist')

        await page.getByRole('link', { name: 'blogs' }).click()
        const blogsDiv = await page.getByTestId('blogsDiv')
        await expect(blogsDiv).not.toContainText('My Wonderful Blog')
      })
      test('only the user who created the blog sees the remove button', async ({ page, request }) => {
        await page.getByRole('link', { name: 'My Wonderful Blog' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()
        await request.post(`${backend_url}/api/users`, {
          data: {
            username: 'jansmith',
            name: 'Jane Smith',
            password: 'somethingsecret'
          }
        })
        loginWith(page, 'jansmith', 'somethingsecret')
        await page.getByRole('link', { name: 'My Wonderful Blog' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

  })

})

