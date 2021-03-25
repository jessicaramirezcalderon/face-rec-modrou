const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/api/results/:id", function(req, res) {
  const id = parseInt(req.params.id);
  db.User.findAll(({
    where: { id:id }
  })).then(function(user) {

  console.log(user)
  return res.json(user);
})

});

module.exports = router;
