
// Creating our Mood model/TABLE
module.exports = function(sequelize, DataTypes) {
    
    const FaceApiData = sequelize.define("FaceApiData", {
        userPicture: {
            type: DataTypes.INTEGER,//?
            allowNull: false
        },
        userMood: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    
    //ADD ANY METHODS RELATED TO THIS MODEL BELOW BUT BEFORE THE RETURN
    
    return FaceApiData;
};

