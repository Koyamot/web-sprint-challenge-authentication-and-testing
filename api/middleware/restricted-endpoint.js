const jwt = require('jsonwebtoken')
const secrets = require('../../config/secrets.js')
// const secret = process.env.JWT_SECRET;


module.exports = (req, res, next) => {
  
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
    
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                res.status(401).json({message: 'token invalid'})
            } else {
                jwt.decode = decodedToken;
                console.log("is this a decoded token? : ", decodedToken)
                next();
            }
        })
    } else {
        res.status(401).json({message: 'token required'})
    }
} catch (err) {
  console.log(err);
    res.status(500).json({message: 'There was an error fetching jokes'});
}
}
