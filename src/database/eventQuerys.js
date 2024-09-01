const { pool } = require("./db");

const getConflictingEvents = async (event) => {
  const QUERY = `
    SELECT * FROM events
    WHERE location = ? AND date = ? AND (
      (start_time >= ? AND start_time < ?) OR
      (end_time > ? AND end_time <= ?) OR
      (start_time < ? AND end_time > ?)
    )
  `;
  const params = [
    event.location,
    event.date,
    event.start_time,
    event.end_time,
    event.start_time,
    event.end_time,
    event.start_time,
    event.end_time,
  ];

  let client;

  try {
    client = await pool.getConnection();
    const result = await client.query(QUERY, [...params]);
    return result[0];
  } catch (error) {
    console.error(`${error}`);
    throw error;
  } finally {
    if (client) {
      client.release(); // release the connection back to the pool
    }
  }
};

const getConflictingEventsOnUpdate = async (event, id) => {
  const QUERY = `
    SELECT * FROM events
    WHERE location = ? AND date = ? AND id != ? AND (
      (start_time >= ? AND start_time < ?) OR
      (end_time > ? AND end_time <= ?) OR
      (start_time < ? AND end_time > ?)
    )
  `;
  const params = [
    event.location,
    event.date,
    id,
    event.start_time,
    event.end_time,
    event.start_time,
    event.end_time,
    event.start_time,
    event.end_time,
  ];

  let client;

  try {
    client = await pool.getConnection();
    const result = await client.query(QUERY, [...params]);
    return result;
  } catch (error) {
    console.error(`${error}`);
    throw error;
  } finally {
    if (client) {
      client.release(); // release the connection back to the pool
    }
  }
};


const create = async (event) => {
  const QUERY = `INSERT INTO events SET ?`;
  let client;

  try {
    client = await pool.getConnection();
    const result = await client.query(QUERY, [event]);
    return result;
  } catch (error) {
    console.error(`Error occurred while creating event: ${error}`);
    throw error;
  } finally {
    if (client) {
      client.release(); // release the connection back to the pool
    }
  }
};

const find = async () => {
  const QUERY = "SELECT * FROM events";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY);
    return result[0];
  } catch (error) {
    console.log("Error occured while finding all the records");
    console.log(error);
  }
};

const findByPagination = async (limit, offset) => {
  const QUERY = "SELECT * FROM events LIMIT ? OFFSET ?";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [limit, offset]);
    return result[0];
  } catch (error) {
    console.log("Error occurred while finding all the records");
    console.log(error);
    throw error;
  }
};

const findById = async (id) => {
  const QYERY = "SELECT * FROM events WHERE id = ?";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QYERY, [id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while finding the record");
    console.log(error);
  }
};

const deleteRecord = async (id) => {
  const QYERY = `DELETE FROM events WHERE id = ?`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QYERY, [id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while deleteting the event");
    throw error;
  }
};

const updateById = async (event, id) => {
  const QYERY = `UPDATE events SET ? WHERE id = ?`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QYERY, [event, id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while updating the event");
    throw error;
  }
};

module.exports = {
  getConflictingEvents,
  create,
  find,
  findById,
  findByPagination,
  deleteRecord,
  updateById,
  getConflictingEventsOnUpdate,
};
