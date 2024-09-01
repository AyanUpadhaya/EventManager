const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const { testOne } = require("../controllers/testControllers");

router.get("/test", verifyToken, testOne);

module.exports = router;
