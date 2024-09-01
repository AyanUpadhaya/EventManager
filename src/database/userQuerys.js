const { pool } = require("./db");

const find = async () => {
  const QUERY = "SELECT * FROM users";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY);
    return result[0];
  } catch (error) {
    console.log("Error occured while finding all the records");
    console.log(error);
  }
};

const create = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("Whoops! required field is missing");
  }
  const QUERY = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [name, email, password]);
    return result;
  } catch (error) {
    console.log("Error occured while creating user");
    console.log(error);
  }
};

const findByEmail = async (email) => {
  const QUERY = `SELECT id, name, email, password FROM users WHERE email = ?`;
  let client;

  try {
    client = await pool.getConnection();
    const [rows] = await client.query(QUERY, [email]); // Using destructuring to get rows directly
    return rows[0]; // Return the first user found, if any
  } catch (error) {
    console.error("Error occurred while getting user by email:", error);
    throw error;
  } finally {
    if (client) client.release(); // Make sure to release the connection
  }
};
module.exports = {
  find,
  create,
  findByEmail,
};
