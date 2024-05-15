const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

const Blog = require('./models/blog')
const User = require('./models/user')

mongoose.connect(config.MONGODB_URI)

const resetDb = async () => {
  await User.deleteMany({})
  logger.info('deleted users')
  await Blog.deleteMany({})
  logger.info('deleted blogs')
  mongoose.connection.close()
}

resetDb()
