module.exports = {
  getInitialToken: getInitialToken,
  getNewToken: getNewToken,
  player: {
    actions: {
      play: token => playerAction(token, "play"),
      pause: token => playerAction(token, "pause"),
      previous: token => playerAction(token, "previous"),
      next: token => playerAction(token, "next"),
      shuffle: (token, desiredValue) =>
        playerAction(token, "shuffle", desiredValue),
      volume: (token, desiredValue) =>
        playerAction(token, "volume", desiredValue)
    },
    getState: token => getPlayerState(token),
    isSongInLibrary: (token, songId) => isSongInLibrary(token, songId)
  }
};

require("dotenv").config();
const axios = require("axios");
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
let token = "";

function isSongInLibrary(token, songId) {
  return axios({
    method: "get",
    url: `https://api.spotify.com/v1/me/tracks/contains`,
    params: { ids: songId },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
function playerAction(token, action, desiredValue) {
  var method;
  var params = {};
  switch (action) {
    case "next":
      method = "post";
      break;
    case "previous":
      method = "post";
      break;
    case "shuffle":
      method = "put";
      params = { state: desiredValue };
      break;
    case "next":
      method = "post";
      break;
    case "previous":
      method = "post";
      break;
    case "volume":
      method = "put";
      params = { volume_percent: desiredValue };
      break;
    default:
      method = "put";
  }

  return axios({
    method: method,
    url: `https://api.spotify.com/v1/me/player/${action}`,
    params: params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

function getInitialToken(code) {
  return axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    params: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function getNewToken() {
  return axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function getPlayerState(token) {
  return axios({
    method: "get",
    url: "https://api.spotify.com/v1/me/player",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
