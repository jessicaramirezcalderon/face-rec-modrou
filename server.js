require("dotenv").config();

// Requiring necessary npm packages
const express = require("express");
const exphbs  = require('express-handlebars');
const Handlebars = require("handlebars");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "make this secret different for each project", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
//Add all controllers files here
app.use(require("./controllers/users.js"));


// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
