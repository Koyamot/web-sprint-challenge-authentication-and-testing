const db = require("../../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
};

async function find() {

  try {
    return await db("users").select("id", "username", "password").orderBy("id");
  } catch (error) {
    throw error;
  }
  
}

async function findBy(username) {
  try {
    return await db('users').where({ username }).first();   
  } catch (err) {
      throw err;
  }
}


async function add(userData) {
  try {
      const {id} = await db('users').insert(userData);
      return id
  } catch (err) {
      throw err;
  }
}
