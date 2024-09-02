const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createEventParticipant,
  getEventParticipant,
  getEventParticipants,
} = require("../controllers/eventParticipantControllers");

router.post(
  "/event_participants",
  verifyToken,
  createEventParticipant
);
router.get(
  "/event_participants/:event_id/participants/:participant_id",
  verifyToken,
  getEventParticipant
);
router.get(
  "/event_participants/:event_id",
  verifyToken,
  getEventParticipants
);


module.exports = router;
