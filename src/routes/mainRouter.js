const router = require("express").Router();
const defaultRoutes = require("./defaultRoutes");
const userRoutes = require("./userRoutes");
const testRotes = require("./testRotes");

//default
router.use(defaultRoutes);

//other routes
router.use(userRoutes);
router.use(testRotes);

module.exports = router;
