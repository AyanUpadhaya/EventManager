const router = require("express").Router();
const {
  getUsers,
  createUser,
  signIn,
} = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
router.get("/users", verifyToken, getUsers);
router.post("/users", createUser);
router.post("/users/login", signIn);

module.exports = router;
