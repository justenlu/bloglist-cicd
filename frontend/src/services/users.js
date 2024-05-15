import axios from 'axios'

//eslint-disable-next-line no-undef
const baseUrl = typeof BACKEND_URL !== 'undefined' ? `${BACKEND_URL}/api/users` : null
//When testing frontend, BACKEND_URL is undefined

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export default { getAll }
