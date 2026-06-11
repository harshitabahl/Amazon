const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("User route working");
});

module.exports = router;