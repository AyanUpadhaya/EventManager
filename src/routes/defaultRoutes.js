const router = require("express").Router();


router.get("/", (req, res) => {
  return res.send("Event server running");
});

module.exports = router;
