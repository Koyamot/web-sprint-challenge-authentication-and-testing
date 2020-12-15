const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets.js');
const dbConfig = require('../../data/dbConfig.js');

const router = require('express').Router();

const Users = require('../users/users-model.js')

const checkForUser = async (req, res, next) => {
  try {
    let username = req.body.username;
    if (username) {
      const user = await Users.findBy(username);
      if (user) { req.userExists = true; req.user = user }
      else { req.userExists = false; }
      console.log("this is user: ", user)
      console.log("this is username: ", req.user.username)
      next();
    }
    else {
      res.status(400).json({message: "error: you must provide a username"})
    }
  }
  catch (error) {
    throw error;
  }
}



router.post('/register', checkForUser, async (req, res) => {
  
  if (req.userExists) {
    res.status(400).json({ message: "username taken" })
  } else {
    let {username, password } = req.body;
      if (!username && !password ) {
        res.status(401).json({ error: "username and password required"});
      } else {
        try {
          const rounds = process.env.BCRYPT_ROUNDS;
          const hash = bcryptjs.hashSync(password, rounds)
          const saved = { username, password: hash }
          const addUser = await Users.add(saved)
          const name = await Users.findBy(username)
          const token = jwt.sign({ username }, process.env.JWT_SECRET, {expiresIn: '1d'})
          res.status(201).json({ Welcome: name, token: token })
        } catch (err) {
          console.log(err)
        }
      }
    } 
});


 router.post('/login', checkForUser, async (req,res) => {
    let { username, password } = req.body

    try {
      if (req.userExists) {
        console.log("USER EXISTS:", req.userExists)
        const user = await Users.findBy(username)
        console.log("This is Log IN user: ", user)

        if (username && password) {
          if (bcryptjs.compareSync(password, req.user.password)) {
            const token = jwt.sign({ username: user.username}, process.env.JWT_SECRET, { expiresIn: '1d'})
            res.status(200).json({ message: `welcome, ${req.user.username}`, token })
          } else {
            res.status(401).json({ message: "invalid credentials" })
          }
        } else {
          res.status(400).json({ message: "username and password required"})
        }  
      }  else {
        res.status(400).json({message: "failed to log in: user does not exist"})
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'invalid credentials'})
    }
})
  // try {
  //   let { username, hash } = req.body;
  //   const user = await Users.findBy({ username })
  //   console.log(`This is "user" = ${req.body}`)
  //   console.log(user);
  //   if(user && bcryptjs.compareSync(hash, user[0].hash)) {
  //       const token = generateToken(user)
        
  //       res.status(200).json({
  //           message: `Welcome ${username}`,
  //           token: token
  //       })
  //   } else {
  //       res.status(401).json({message: 'Invalid credentials!'})
  //   }
  // } catch (err) {
  //     console.log(err);
  //     res.status(500).json({message: `There was an error with the database ${err}`})
  // }


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


    // 



 
module.exports = router;
