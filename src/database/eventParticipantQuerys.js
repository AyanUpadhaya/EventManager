const { pool } = require("./db");

const create = async (event_id, participant_id) => {
  const insertQuery = `INSERT INTO event_participants (event_id, participant_id) VALUES (?, ?)`;
  let client;
  try {
    client = await pool.getConnection();
    const result = await client.query(insertQuery, [event_id, participant_id]);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (client) {
      client.release(); // release the connection back to the pool
    }
  }
};

const findByEventIdParticipantId = async (event_id, participant_id) => {
  const QUERY =
    "SELECT p.* FROM event_participants ep JOIN participants p ON ep.participant_id = p.id WHERE ep.event_id = ? AND ep.participant_id = ?";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [event_id, participant_id]);
    return result[0];
  } catch (error) {
    console.log("Error occured while finding the record");
    console.log(error);
  }
};

const findByEventId = async(event_id)=>{
    const QUERY =
      "SELECT p.* FROM event_participants ep JOIN participants p ON ep.participant_id = p.id WHERE ep.event_id = ?";
    try {
      const client = await pool.getConnection();
      const result = await client.query(QUERY, [event_id]);
      return result[0];
    } catch (error) {
      console.log("Error occured while finding the record");
      console.log(error);
    }
}

module.exports = {
  create,
  findByEventIdParticipantId,
  findByEventId,
};
