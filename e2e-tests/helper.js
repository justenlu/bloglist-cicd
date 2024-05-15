const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button').click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByTestId('open-BlogForm-button').click()
  await page.getByTestId('title-field').fill(title)
  await page.getByTestId('author-field').fill(author)
  await page.getByTestId('url-field').fill(url)
  await page.getByTestId('create-blog-button').click()
}

export { loginWith, createBlog }