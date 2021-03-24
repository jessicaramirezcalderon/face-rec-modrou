


// Spotify URL (playlist url) OR URI?
// Token? 
// Sporify Category ID 

// Playlist Items
// Playlist id? 
// Playlist tracks object (array)
// Creating our Mood model/TABLE
//Playlist
    //Tracks
        //Album
        //Artist
        //SongName

module.exports = function(sequelize, DataTypes) {
    
    const SpotifyApiData = sequelize.define("SpotifyApiData", {
        musicPlaylist: {
            type: DataTypes.INTEGER,//?
            allowNull: false
        },
    
    });
//we're getting an array of objects
    
    //ADD ANY METHODS RELATED TO THIS MODEL BELOW BUT BEFORE THE RETURN
   
    return SpotifyApiData;
};

