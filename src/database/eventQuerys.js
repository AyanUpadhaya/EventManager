const { pool } = require("./db");

//get  conflicting events on post
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

//get conflicts on update
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

//event created query
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
//get all events
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

//get a list of participants email for event
const getEventParticipants = async (eventId) => {
  /**
   * selecting only the email column from the participants table, which is aliased as p
   * selecting from the event_participants table, which is aliased as ep, contains - many-to-many rel
   *  joining the event_participants table with the participants table on the condition
   * that the participant_id column in event_participants matches the id column in participants
   * ON clause specifies the join condition, which is the common column between the two tables
   */
  const QUERY =
    "SELECT p.email FROM event_participants ep JOIN participants p ON ep.participant_id = p.id WHERE ep.event_id = ?";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [eventId]);
    return result[0].map((row) => row.email);
  } catch (error) {
    console.log("Error occurred while finding event participants");
    console.log(error);
    throw error;
  }
};

//find events by pagination
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
//find a event by id
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
//delete a record by id
const deleteRecordById = async (id) => {
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
//update event by id
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

// Check if the participant exists
const findParticipantById = async (participantId) => {
  const QUERY = "SELECT * FROM participants WHERE id = ?";
  try {
    const client = await pool.getConnection();
    const participantResult = await client.query(QUERY, [participantId]);
    return participantResult[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//check if participant exist in event
const checkParticipantExist = async (eventId, participantId) => {
  const QUERY =
    "SELECT * FROM event_participants WHERE event_id = ? AND participant_id = ?";
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [eventId, participantId]);
    return result[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//add participant in event

const addParticipantInEvent = async(eventId,participantId)=>{
  const QUERY = `INSERT INTO event_participants (event_id, participant_id) VALUES (?, ?)`;
  
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [eventId, participantId]);
    return result[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//remove participant from event 

const removeParticipantFromEvent = async (eventId, participantId) => {
  const QUERY = `DELETE FROM event_participants WHERE event_id = ? AND participant_id = ?`;
  try {
    const client = await pool.getConnection();
    const result = await client.query(QUERY, [eventId, participantId]);
    return result[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getConflictingEvents,
  create,
  find,
  findById,
  findByPagination,
  deleteRecordById,
  updateById,
  getConflictingEventsOnUpdate,
  getEventParticipants,
  findParticipantById,
  checkParticipantExist,
  addParticipantInEvent,
  removeParticipantFromEvent,
};
