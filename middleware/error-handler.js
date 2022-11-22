const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }

  if(err.code && err.code === 11000){
    customError.msg = `${Object.keys(err.keyValue)} already exists, please try a different one`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  else if(err.name && err.name === 'CastError'){
    customError.msg = `No Job found with id ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  else if(err.name && err.name === 'ValidationError'){
    customError.msg = 
      Object.values(err.errors)
      .map(item => item.message)
      .join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // return res.status(customError.statusCode).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
