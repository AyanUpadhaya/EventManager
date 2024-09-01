const {
  getConflictingEvents,
  create,
  find,
  findById,
  findByPagination,
  deleteRecord,
  updateById,
  getConflictingEventsOnUpdate,
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
      res.status(404).json({ message: "Error occured: No event found" });
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
  try {
    const result = await deleteRecord(id);
    return res.status(200).json({ message: "Event deleted", result });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
};

const updateEvent = async (req, res) => {
  const id = req.params.id;
  
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
    const [conflictingEvents] = await getConflictingEventsOnUpdate(event,id);

    if (conflictingEvents.length > 0) {
      return res
        .status(400)
        .json({ message: "Time conflict with another event." });
    }

    try {
      const result = await updateById(event, id);
      return res.status(201).json({ message: "Event updated", result: result });
    } catch (error) {
      console.log(error.message || "Error occured: Failed to create event");
      return res.status(500).json({
        message: "Error occured",
        error: error.message || "Failed to create event",
      });
    }
};

module.exports = {
  createEvent,
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
};
