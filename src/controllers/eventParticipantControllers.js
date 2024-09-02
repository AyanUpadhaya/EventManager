const {
  create,
  findByEventIdParticipantId,
  findByEventId,
} = require("../database/eventParticipantQuerys");

const createEventParticipant = async (req, res) => {
  try {
    const event_id = req.body.event_id;
    const participant_id = req.body.participant_id;
    if (!event_id || !participant_id) {
      return res.status(400).json({ message: "missing required fields" });
    }
    const result = await create(event_id, participant_id);
    res.status(201).send({ message: "event participant created", result });
  } catch (error) {
    console.log(
      error.message || "Error occurred: Failed to create event participant"
    );
    return res.status(500).json({
      message: "Error occurred",
      error: error.message || "Failed to create event participant",
    });
  }
};

//get participant info from event_id and participant_id
const getEventParticipant = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const participant_id = req.params.participant_id;
    const [result] = await findByEventIdParticipantId(event_id, participant_id);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).json({ message: "No event or participant found" });
    }
  } catch (error) {
    console.log(
      error.message || "Error occurred: Failed to retrieve event participants"
    );
    return res.status(500).json({
      message: "Error occurred",
      error: error.message || "Failed to retrieve event participants",
    });
  }
};

//get list of participants from particular event
const getEventParticipants = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const result = await findByEventId(event_id);
    res.send(result);
  } catch (error) {
    console.log(
      error.message || "Error occurred: Failed to retrieve event participants"
    );
    return res.status(500).json({
      message: "Error occurred",
      error: error.message || "Failed to retrieve event participants",
    });
  }
};



module.exports = {
  createEventParticipant,
  getEventParticipant,
  getEventParticipants,
};
