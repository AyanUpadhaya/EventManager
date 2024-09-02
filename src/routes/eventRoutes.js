const {
  createEvent,
  getEvents,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  addEventParticipant,
  removeEventParticipant,
} = require("../controllers/eventControllers");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

router.post("/events", createEvent);
router.get("/events", verifyToken, getEvents);
router.get("/events/:id", verifyToken, getSingleEvent);
router.delete("/events/:id", verifyToken, deleteEvent);
router.put("/events/:id", verifyToken, updateEvent);
router.post(
  "/events/:id/participants", 
  verifyToken, 
  addEventParticipant
);
router.delete(
  "/events/:id/participants/:participantId",
  verifyToken,
  removeEventParticipant
);

module.exports = router;
