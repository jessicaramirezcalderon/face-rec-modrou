
// Creating our User model/TABLE

//This model holds the login information only
//Other models will hold the rest of the user data
module.exports = function (sequelize, DataTypes) {
  const userData = sequelize.define("userData", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //Mood property that will be assigned from the FaceAPI call
    userMood: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  //foreign key do a join from the api tables
  //add face api and spotify methods here


  return userData;
};
