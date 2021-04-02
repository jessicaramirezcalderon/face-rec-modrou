require("dotenv").config();

// Requiring necessary npm packages
const express = require("express");

const session = require("express-session");

const passport = require("./config/passport");

const exphbs  = require('express-handlebars');

const handlebars = require("handlebars");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "make this secret different for each project", resave: true, saveUninitialized: true }));// SECRET TBD?
app.use(passport.initialize());
app.use(passport.session());

//Add all controllers files here
app.use(require("./controllers/moodApp.js"));
// app.use(require("./controllers/login.js"));

//ORIGINAL
// require("./routes/html-routes.js")(app);
// require("./routes/api-routes.js")(app);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
