//CONTROLLER DOCUMENT HOLDING OUT ROUTES
//ADD ANY NEW CONTROLLER DOCUMENTS TO THE SERVER JS FILE IN ROOT


const express = require("express");
const db = require("../models");
const router = express.Router();

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
  name: "New User",
  email: "newuser@test.com",
  password: "testpwd",
  image: "filename", //we might not need this. added for now to avoid error
  mood: 1,
  playlist: 5,
}
//build and save methods below save the new user instance. documentation here https://sequelize.org/master/manual/model-instances.html
//MUST use Postman in order to test the POST request. 
const newUser = db.User.build(userDetails);
console.log("THE NEW USER IS HERE", newUser);

await newUser.save();

//this is just a basic response for testing. we'll remove later to add a real response. 
res.send({id: newUser.id});

});


module.exports = router;
