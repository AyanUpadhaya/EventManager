const {
  getConflictingEvents,
  create,
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
} = require("../database/eventQuerys");

const createEvent = async (req, res) => {
  const { name, date, start_time, end_time, location, description } = req.body;
  const event = {
    name,
    date,
    start_time,
    end_time,
    location,
    description,
  };

  // Check for time conflicts
  const conflictingEvents = await getConflictingEvents(event);

  if (conflictingEvents.length > 0) {
    return res
      .status(400)
      .json({ message: "Time conflict with another event." });
  }

  try {
    const result = await create(event);
    return res.status(201).json({ message: "Event created", result: result });
  } catch (error) {
    console.log(error.message || "Error occured: Failed to create event");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to create event",
    });
  }
};

const getEvents = async (req, res) => {
  const { page, size } = req.query;
  const pageNumber = parseInt(page, 10) || 1; // validate and default to 1
  const pageSize = parseInt(size, 10) || 10; // validate and default to 10
  const offset = (pageNumber - 1) * pageSize;

  try {
    const events = await findByPagination(pageSize, offset);
    const eventsWithParticipants = await Promise.all(
      events.map(async (event) => {
        const participants = await getEventParticipants(event.id);
        return { ...event, participants };
      })
    );

    const formattedResults = eventsWithParticipants.map((event) => ({
      ...event,
      date: new Date(event.date).toISOString().split("T")[0], // Formats date to YYYY-MM-DD
    }));
    return res.status(200).json(formattedResults);
    return res.status(200).json(events);
  } catch (error) {
    console.log("Error occurred while fetching events");
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error occurred: Fetch all events",
    });
  }
};

const getSingleEvent = async (req, res) => {
  const id = req.params.id;
  try {
    const [event] = await findById(id);
    if (!event) {
      return res.status(404).json({ message: "Error occured: No event found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error occured: No event found",
    });
  }
};

const deleteEvent = async (req, res) => {
  const id = req.params.id;
  const [event] = await findById(id);
  if (!event) {
    return res.status(404).json({ message: "Error occured: No event found" });
  }
  try {
    const result = await deleteRecordById(id);
    return res.status(200).json({ message: "Event deleted", result });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
};

const updateEvent = async (req, res) => {
  const id = req.params.id;

  const [item] = await findById(id);
  if (!item) {
    return res.status(404).json({ message: "Error occured: No event found" });
  }

  const { name, date, start_time, end_time, location, description } = req.body;

  if (!name || !date || !start_time || !end_time || !location || !description) {
    return res.status(400).json({ message: "missing field required" });
  }

  const event = {
    name,
    date,
    start_time,
    end_time,
    location,
    description,
  };

  // Check for time conflicts
  const [conflictingEvents] = await getConflictingEventsOnUpdate(event, id);

  if (conflictingEvents.length > 0) {
    return res
      .status(400)
      .json({ message: "Time conflict with another event." });
  }

  try {
    const result = await updateById(event, id);
    return res.status(200).json({ message: "Event updated", result: result });
  } catch (error) {
    console.log(error.message || "Error occured: Failed to create event");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to create event",
    });
  }
};

//add participant in a event
const addEventParticipant = async (req, res) => {
  //check event exist
  const eventId = req.params.id;
  const [event] = await findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Error occured: No event found" });
  }

  //check if participant id is correct
  const participantId = req.body.participantId;
  const participantResult = await findParticipantById(participantId);
  if (participantResult.length === 0) {
    return res
      .status(404)
      .json({ message: "Error occured:Participant not found" });
  }

  //check if participant is already exist in event
  const eventParticipantResult = await checkParticipantExist(
    eventId,
    participantId
  );
  if (eventParticipantResult.length > 0) {
    return res
      .status(400)
      .json({ message: "Participant is already associated with the event" });
  }

  try {
    //add participant in event
    const addResult = await addParticipantInEvent(eventId, participantId);
    return res.status(201).json({
      message: "Participant added to event successfully",
      result: addResult,
    });
  } catch (error) {
    console.log(error.message || "Error occured: Failed to create event");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to create event",
    });
  }
};
//remove participant from event
const removeEventParticipant = async (req, res) => {
  const eventId = req.params.id;
  const [event] = await findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Error occured: No event found" });
  }

  //check if participant id is correct
  const participantId = req.params.participantId;
  const participantResult = await findParticipantById(participantId);
  if (participantResult.length === 0) {
    return res
      .status(404)
      .json({ message: "Error occured:Participant not found" });
  }

  //check if participant is already exist in event
  const eventParticipantResult = await checkParticipantExist(
    eventId,
    participantId
  );
  if (eventParticipantResult.length > 0) {
    try {
      const result = await removeParticipantFromEvent(eventId, participantId);
      return res.status(200).json({ message: "Participant removed" });
    } catch (error) {
      console.log(error.message || "Error occured: Failed remove participant");
      return res.status(500).json({
        message: "Error occured",
        error: error.message || "Failed to remove participant",
      });
    }
  } else {
    return res
      .status(400)
      .json({ message: "Participant doesn't exist, no need to delete" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  addEventParticipant,
  removeEventParticipant,
};
