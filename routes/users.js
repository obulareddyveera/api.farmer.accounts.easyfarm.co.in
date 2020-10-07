var express = require("express");
var router = express.Router();

var usersController = require("../dao/controllers/users");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const { currentUser } = req;
  const response = await usersController.fetchAllUsers();
  res.json(response);
});

router.post("/session/active", async (req, res) => {
  const { sessionUser } = req;
  const { profile } = sessionUser;
  console.log("---== sessionUser profile ", profile);
  if (!profile) {
    res.status(200).json({ error: "Invalied Session" });
  }

  res.status(200).json(profile);
});

module.exports = router;
