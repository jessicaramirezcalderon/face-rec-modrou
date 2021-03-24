// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");
const express = require("express");
const burger = require("../models/burger.js");
const router = express.Router();


//GET THEIR IMAGE TAKEN (*BUISNESS LOGIC) AND ADD THAT AS A POST NOT STORED IN MY SQL INSIDE THAT POST THEN ADD CALLBACK FUNCTION TO CALL THE API

//STORE USER MOOD AND PLAUYLIST TO MYSQL

//Cant save image to db


module.exports = function (app) {

    app.post("/api/mood", function (req, res) {
        controller.getMood(req.body.image) // call the api with the image
            .then((response) => controller.storeMood(req.userId, response.mood))
            .then((mood) => controller.getPlaylistForMood(mood))
            .then((response) => res.send(response.list));
    });

    app.get("/api/movieApiTest/:movie", function (req, res) {

        let query = `http://www.omdbapi.com/?apikey=${process.env.movieKey}&t=${req.params.movie}`;
        console.log(query);

        axios.get(query).then(results => {
            console.log(results.data);
            res.json(results.data);
        });
    });

    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    //db is the variable name at the top requiring the models
    //db.User is calling the table/model "USER" created in users.js
    app.post("/api/signup", function (req, res) {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        })
            .then(function () {
                res.redirect(307, "/api/login");
            })
            .catch(function (err) {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });
};
