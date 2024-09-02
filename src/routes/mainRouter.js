const router = require("express").Router();
const defaultRoutes = require("./defaultRoutes");
const userRoutes = require("./userRoutes");
const eventRoutes = require("./eventRoutes");
const participantRoutes = require("./participantRoutes");
const eventParticipantRoutes = require("./eventParticipantRoutes");
//default
router.use(defaultRoutes);

//other routes
router.use(userRoutes);
router.use(eventRoutes);
router.use(participantRoutes);
router.use(eventParticipantRoutes);

module.exports = router;
