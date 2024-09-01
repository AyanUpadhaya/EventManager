const {
  create,
  findByEmail,
  find,
  findById,
  updateById,
  deleteRecord,
} = require("../database/participantQuerys");

const createParticipant = async (req, res) => {
  const { email, name } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }
  const participant = await findByEmail(email);
  if (participant) {
    return res.status(400).json({ message: "Participant already exists" });
  }
  try {
    const result = await create(email, name);
    return res
      .status(201)
      .json({ message: "Participant created", result: result });
  } catch (error) {
    console.log(error.message || "Error occured: Failed to create participant");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to create participant",
    });
  }
};

const getParticipants = async (req, res) => {
  // res.send({ message: "Hello" });
  try {
    const participants = await find();
    res.status(200).json(participants);
  } catch (error) {
    console.log(error.message || "Error occured: Failed to fetch participants");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to fetch participantst",
    });
  }
};

const getParticipantById = async (req, res) => {
  const id = req.params.id;
  // res.send("hello");
  try {
    const [participant] = await findById(id);
    if (!participant) {
      return res
        .status(404)
        .json({ message: "Error occured: No participant found" });
    }
    return res.status(200).json(participant);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error occured: No participant found",
    });
  }
};

const updateParticipant = async (req, res) => {
  const id = req.params.id;
  const [participant] = await findById(id);
  if (!participant) {
    return res
      .status(404)
      .json({ message: "Error occured: No participant found" });
  }
  const { email, name } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }
 
  try {
    const result = await updateById({ email, name }, id);
    return res
      .status(201)
      .json({ message: "Participant updated", result: result });
  } catch (error) {
    console.log(error.message || "Error occured: Failed to update participant");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to update participant",
    });
  }
};

const deleteParticipant = async (req, res) => {
  const id = req.params.id;
  const [participant] = await findById(id);
  if (!participant) {
    return res
      .status(404)
      .json({ message: "Error occured: No participant found" });
  }

  try {
    const result = await deleteRecord(id);
    return res.status(200).json({ message: "Participant deleted", result });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured",
    });
  }
};

module.exports = {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
};
