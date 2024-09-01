const { pool } = require("./db");

const create = async (email, name) => {
  const QUERY = `INSERT INTO participants (email, name) VALUES (?,?)`;
  let client;

  try {
    client = await pool.getConnection();
    const result = await client.query(QUERY, [email, name]);
    return result;
  } catch (error) {
    console.error(`Error occurred while creating participants`);
    throw error;
  } finally {
    if (client) {
      client.release(); // release the connection back to the pool
    }
  }
};

const findByEmail = async (email) => {
  const QUERY = `SELECT id, email, name FROM participants WHERE email = ?`;
  let client;

  try {
    client = await pool.getConnection();
    const [rows] = await client.query(QUERY, [email]);
    return rows[0];
  } catch (error) {
    console.error("Error occurred while getting participant by email:", error);
    throw error;
  } finally {
    if (client) client.release();
  }
};

const find = async () => {
  const QUERY = `SELECT * FROM participants`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY);
    return result[0];
  } catch (error) {
    console.log("Error occured while finding all the records");
    throw error;
  }
};

const findById = async (id) => {
  const QYERY = "SELECT * FROM participants WHERE id = ?";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QYERY, [id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while finding the record");
    console.log(error);
  }
};

const updateById = async(update,id) =>{
  const QYERY = `UPDATE participants SET ? WHERE id = ?`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QYERY, [update, id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while updating the event");
    throw error;
  }

}
const deleteRecord = async (id) => {
  const QYERY = `DELETE FROM participants WHERE id = ?`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QYERY, [id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while deleteting the participant");
    throw error;
  }
};

module.exports = {
  create,
  findByEmail,
  find,
  findById,
  updateById,
  deleteRecord,
};
