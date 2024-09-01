const router = require("express").Router();
const {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} = require("../controllers/participantController");
const verifyToken = require("../middleware/verifyToken");

router.post("/participants", verifyToken, createParticipant);
router.get("/participants", verifyToken, getParticipants);
router.get("/participants/:id", verifyToken, getParticipantById);
router.put("/participants/:id", verifyToken, updateParticipant);
router.delete("/participants/:id", verifyToken, deleteParticipant);

module.exports = router;
