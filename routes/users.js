var express = require("express");
var router = express.Router();

var usersController = require("../dao/controllers/users");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const {currentUser} = req;
  const response = await usersController.fetchAllUsers();
  res.json(response);
});

router.post("/duplicate/email", async (req, res) => {
  const inputEmail = req.body.email;
  if (inputEmail) {
    const response = await usersController.validateEmail(inputEmail);
    res.status(200).json(response);
  }

  res.status(200).json({ error: "provide a valid email address" });
});

module.exports = router;
