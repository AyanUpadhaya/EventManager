const router = require("express").Router();
const defaultRoutes = require("./defaultRoutes");
const userRoutes = require("./userRoutes");
const testRotes = require("./testRotes");
const eventRoutes = require("./eventRoutes");
const participantRoutes = require("./participantRoutes");
//default
router.use(defaultRoutes);

//other routes
router.use(userRoutes);
router.use(testRotes);
router.use(eventRoutes);
router.use(participantRoutes);

module.exports = router;
