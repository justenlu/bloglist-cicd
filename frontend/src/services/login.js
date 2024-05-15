import axios from 'axios'

//eslint-disable-next-line no-undef
const baseUrl = typeof BACKEND_URL !== 'undefined' ? `${BACKEND_URL}/api/login` : null
//When testing frontend, BACKEND_URL is undefined

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
