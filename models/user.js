//MODEL DOCUMENT


// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");
const sequelize = require("sequelize");


// Creating our User model/TABLE
//Other models will hold the rest of the user data

//shape of object -- Name STRING, Email STRING, Password STRING (ENCRYPTED), 
//Image(filename)STRING, Mood INTERGER, Playlist ARRAY OF STRINGS?

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    // name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // image: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },

    mood: DataTypes.STRING

    // playlist: {
    //   type: DataTypes.UUID,
    // }

  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  //This will associate the playlist User data to the playlist object model
  //User.belongsTo(Playlist);

  return User;
};
