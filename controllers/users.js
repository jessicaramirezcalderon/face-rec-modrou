//CONTROLLER DOCUMENT HOLDING ROUTES SAVING AND POSTING TO DB
//BUSINESS LOGIC DOES NOT GO HERE
//ADD ANY NEW CONTROLLER DOCUMENTS TO THE SERVER JS FILE IN ROOT


const express = require("express");
const db = require("../models");
const router = express.Router();
const path = require("path");
const isAuthenticated = require("../config/middleware/isAuthenticated");


//front-end routes
// router.get("/", function(req, res) {
//   res.render("layouts/main", {});//renders HP
// });

router.get("/", function(req, res) {
  res.render("index", {});//renders HP
});

// router.get("/", function(req, res) {
//   res.redirect("login", {});//renders HP
// });

router.get("/", function(req, res) {
  if (req.user) {
    res.redirect("/members");
  }
  res.sendFile(path.join(__dirname, "../views/layouts/signup.html"));//need to create a POST for api/signup
});

router.get("/login", function(req, res) {
  if (req.user) {
    res.redirect("/members");
  }
  res.sendFile(path.join(__dirname, "../views/layouts/login.html"));//need to create a POST for api/login
});

router.get("/members", isAuthenticated, function(req, res) {
  res.sendFile(path.join(__dirname, "../views/layouts/members.html"));//need to create a POST for api/members
});





//DB ROUTES

router.get("/api/results/:id", function (req, res) {
  //gets db data with the user's information (based on the user model inside models folder)
  const id = parseInt(req.params.id);
  //find id of user
  db.User.findAll(({
    where: { id: id }
  }))
    .then(function (user) {

      console.log(user)
      return res.json(user);
    })

});

router.post("/api/user", async (req, res) => {
  //create a new instance of user model
  //this new user should hold the data from the user input once we build a form on the front end
  //all the details here will be replaced with actual user data once we have a form. 
  //We'll probably gut password and email since we're not asking the user to authenticate
  //image might not be needed either since we cannot store image file in db. 
  const userDetails = {
    name: "EINSTEIN",
    email: "newufgedsfgsdfserr@test.com",
    password: "tesrasgtpwd",
    image: "filenardfgme", //we might not need this. added for now to avoid error
    mood: 1,
    playlist: 5,
  };
  //build and save methods below save the new user instance. documentation here https://sequelize.org/master/manual/model-instances.html
  //MUST use Postman in order to test the POST request. 

  const newUser = db.User.build(userDetails);
  console.log("THE NEW USER IS HERE", newUser.toJSON());

  await newUser.save().catch((err) => { console.error(err); });

  //this is just a basic response for testing. we'll remove later to add a real response. 
  res.json(newUser);

});


module.exports = router;
