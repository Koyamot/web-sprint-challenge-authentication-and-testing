const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets.js');
const dbConfig = require('../../data/dbConfig.js');
const usersModel = require('../users/users-model.js');

const router = require('express').Router();

const Users = require('../users/users-model.js')



router.post('/register', async (req, res) => {
  let {username, password } = req.body || null;
  if (!username || !password ) {
    res.status(401).json({ error: "username and password required"});
  } else {
    try {
      const rounds = process.env.BCRYPT_ROUNDS;
      const hash = bcryptjs.hashSync(password, rounds)
      password = hash
      const saved = { username, hash }
      const newUser = await Users.add(saved)
      res.status(201).json(newUser)
    } catch (err) {
      console.log(err)
    }
  }

});

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */


 router.post('/login', async (req,res) => {
  let { username, password } = req.body;
  
  try {
      const user = await users.findBy({username})
      console.log(`This is "user" = ${req.body}`)
      console.log(user);
      if(user && bcrypt.compareSync(password, user[0].password)) {
          const token = generateToken(user)
          
          res.status(200).json({
              message: `Welcome ${username}`,
              token: token
          })
      } else {
          res.status(401).json({message: 'Invalid credentials!'})
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({message: `There was an error with the database ${err}`})
  }
})

function generateToken(user) {
  //
  const payload =  {
      subject: user.id,
      username: user.username,
  }

  const options = {
      expiresIn: "1d"
  }
  return jwt.sign(payload, secrets.jwtSecret, options)
}
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

 
module.exports = router;
