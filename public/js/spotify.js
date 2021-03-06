// Start @177

// var redirect_uri = "https://makeratplay.github.io/SpotifyWebAPI/"; // change this your value

// malcolm var client_id = "ace5f2d6e3af4a78af05061f9a27201c";
//malcolm var client_secret = "e8b317a8d6c542539b218d2795b70aea"; // In a real app you should not expose your client_secret to the user

let client_id = "4063b2447c1b4aeda330247daa2fbd5e";
let client_secret = "0e780be79e5b46089f31013a32c1f063";

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const SEARCH = "https://api.spotify.com/v1/search";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";

const searchParams = (new URL(location.href)).searchParams;
const mood = searchParams.get('mood');
const apiCode = searchParams.get('code');
const redirect_uri = location.href.split('&code=')[0].split('code=')[0];

let accessTokenRetrieved = false;

function onPageLoad() {
    if (!apiCode) {
        return requestAuthorization();
    }
    
    if (!accessTokenRetrieved) {
        return handleRedirect();
    }

    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    
    access_token = localStorage.getItem("access_token");
    if (access_token == null) {
        // we don't have an access token so present token section
        document.getElementById("tokenSection").style.display = 'block';
    }
    else {
        // we have an access token so present device section
        document.getElementById("deviceSection").style.display = 'block';
        refreshDevices();
        refreshPlaylists();
        //currentlyPlaying();
    }
    refreshRadioButtons();
}

function handleRedirect() {
    let code = getCode();
    window.history.pushState("", "", redirect_uri); // remove param from url
    fetchAccessToken(code);
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function requestAuthorization() {
    client_id = document.getElementById("clientId").value || client_id;
    client_secret = document.getElementById("clientSecret").value || client_secret;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status == 200) {
        accessTokenRetrieved = true;
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function refreshDevices() {
    callApi("GET", DEVICES, null, handleDevicesResponse);
}

function handleDevicesResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        // console.log(data);
        // removeAllItems("devices");
        data.devices.forEach(item => addDevice(item));
    }
    else if (this.status == 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addDevice(item) {
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node);
}

function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function refreshPlaylists() {
    const endpoint = `${SEARCH}?q=${mood}&type=playlist`;
    callApi("GET", endpoint, null, handlePlaylistsResponse);
}

function playTraxResponse() {
    console.log(JSON.parse(this.responseText));
    window.testTracks = JSON.parse(this.responseText);
    let trackList = testTracks.items.map(data => data.track).filter((track) => track.preview_url);

    for (var i = 0; i < trackList.length; i++) {
        setTimeout(function (url) {
            if (url !== null) {
                let player = `<audio controls autoplay>
                <source src="${url}" type="audio/mpeg">
                </audio>`; 
                document.getElementById("player").innerHTML = player;
            }

        }, 30000 * i, trackList[i].preview_url);
    }
}

function handlePlaylistsResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);

        const moodPlaylist = data.playlists.items.shift();
        console.log(moodPlaylist);

        // addPlaylist(moodPlaylist);

        document.getElementById('playlists').textContent = moodPlaylist.name;
        console.log(moodPlaylist.name);

        callApi("GET", TRACKS.replace('{{PlaylistId}}', moodPlaylist.id), null, playTraxResponse);
    }
    else if (this.status == 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

// function addPlaylist(item) {
//     let node = document.createElement("option");
//     node.value = item.id;
//     node.innerHTML = item.name + " (" + item.tracks.total + ")";
//     document.getElementById("playlists").appendChild(node);
// }

// function removeAllItems(elementId) {
//     let node = document.getElementById(elementId);
//     while (node.firstChild) {
//         node.removeChild(node.firstChild);
//     }
// }

// function play() {
//     let playlist_id = document.getElementById("playlists").value;
//     let trackindex = document.getElementById("tracks").value;
//     let album = document.getElementById("album").value;
//     let body = {};
//     if (album.length > 0) {
//         body.context_uri = album;
//     }
//     else {
//         body.context_uri = "spotify:playlist:" + playlist_id;
//     }
//     body.offset = {};
//     body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
//     body.offset.position_ms = 0;
//     callApi("PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse);
// }

// function shuffle() {
//     callApi("PUT", SHUFFLE + "?state=true&device_id=" + deviceId(), null, handleApiResponse);
//     play();
// }

// function pause() {
//     callApi("PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse);
// }

// function next() {
//     callApi("POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse);
// }

// function previous() {
//     callApi("POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse);
// }

// function transfer() {
//     let body = {};
//     body.device_ids = [];
//     body.device_ids.push(deviceId())
//     callApi("PUT", PLAYER, JSON.stringify(body), handleApiResponse);
// }

function handleApiResponse() {
    if (this.status == 200) {
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if (this.status == 204) {
        setTimeout(currentlyPlaying, 2000);
    }
    else if (this.status == 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

// function deviceId() {
//     return document.getElementById("devices").value;
// }

function fetchTracks() {
    let playlist_id = document.getElementById("playlists").value;
    if (playlist_id.length > 0) {
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        callApi("GET", url, null, handleTracksResponse);
    }
}

function handleTracksResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("tracks");
        data.items.forEach((item, index) => addTrack(item, index));
    }
    else if (this.status == 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addTrack(item, index) {
    let node = document.createElement("option");
    node.value = index;
    node.innerHTML = item.track.name + " (" + item.track.artists[0].name + ")";
    document.getElementById("tracks").appendChild(node);
}

function currentlyPlaying() {
    callApi("GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse);
}

function handleCurrentlyPlayingResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.item != null) {
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }


        if (data.device != null) {
            // select device
            currentDevice = data.device.id;
            document.getElementById('devices').value = currentDevice;
        }

        if (data.context != null) {
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring(currentPlaylist.lastIndexOf(":") + 1, currentPlaylist.length);
            document.getElementById('playlists').value = currentPlaylist;
        }
    }
    else if (this.status == 204) {

    }
    else if (this.status == 401) {
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function saveNewRadioButton() {
    let item = {};
    item.deviceId = deviceId();
    item.playlistId = document.getElementById("playlists").value;
    radioButtons.push(item);
    localStorage.setItem("radio_button", JSON.stringify(radioButtons));
    refreshRadioButtons();
}

function refreshRadioButtons() {
    let data = localStorage.getItem("radio_button");
    if (data != null) {
        radioButtons = JSON.parse(data);
        if (Array.isArray(radioButtons)) {
            removeAllItems("radioButtons");
            radioButtons.forEach((item, index) => addRadioButton(item, index));
        }
    }
}

function onRadioButton(deviceId, playlistId) {
    let body = {};
    body.context_uri = "spotify:playlist:" + playlistId;
    body.offset = {};
    body.offset.position = 0;
    body.offset.position_ms = 0;
    callApi("PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse);
    //callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId, null, handleApiResponse );
}

function addRadioButton(item, index) {
    let node = document.createElement("button");
    node.className = "btn btn-primary m-2";
    node.innerText = index;
    node.onclick = function () { onRadioButton(item.deviceId, item.playlistId) };
    document.getElementById("radioButtons").appendChild(node);
}

// {/* <audio controls>
//     <source src="https://p.scdn.co/mp3-preview/cc617f669fd1e3ee33a4ac0c66346fefd15286e7?cid=ace5f2d6e3af4a78af05061f9a27201c" type="audio/mpeg">
// </audio> */}