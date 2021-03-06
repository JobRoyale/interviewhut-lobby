const express = require("express");
const router = express.Router();

const { getUserData } = require("../controllers/userController");

router.get("/", (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(JSON.stringify(getUserData(), null, 4));
});

module.exports = router;
