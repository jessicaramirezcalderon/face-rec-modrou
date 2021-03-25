const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/api/results/:id", function (req, res) {
  //replace this to use the user's input
  const id = parseInt(req.params.id);
  db.User.findAll(({
    where: { id: id }
  }))
    .then(function (user) {

      console.log(user)
      return res.json(user);
    })

});

router.post("/api/results/:id", function (req, res) {

  const id = parseInt(req.params.id);
  db.User.findAll(({
    where: { id: id }
  }))
    .then(function (user) {

      console.log()
      return res.json();
    })

});

module.exports = router;
