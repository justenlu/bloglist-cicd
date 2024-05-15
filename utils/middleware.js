const logger = require('./logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'username already taken' })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  else {
    request.token = null
  }

  next()
}

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET_FOR_TOKEN)
  if (decodedToken.id) {
    request.user = decodedToken.id
  }
  else {
    request.user = null
  }

  next()
}

module.exports = {
  errorHandler, tokenExtractor, userExtractor
}