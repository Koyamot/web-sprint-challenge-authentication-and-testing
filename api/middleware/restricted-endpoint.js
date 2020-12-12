const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET;


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          
        } else {
          
        }
      })
    }
  } catch (error) {
    
  }
};
