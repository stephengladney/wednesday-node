module.exports = {
  getInitialToken: getInitialToken,
  getNewToken: getNewToken,
  player: {
    actions: {
      play: () => playerAction("play"),
      pause: () => playerAction("pause"),
      previous: () => playerAction("previous"),
      next: () => playerAction("next"),
      shuffle: desiredValue => playerAction("shuffle", desiredValue)
    },
    getState: () => getPlayerState()
  }
};

require("dotenv").config();
const axios = require("axios");
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const token = "";

function playerAction(action, desiredValue) {
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
    case "previous":
      method = "post";
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

function getPlayerState() {
  return axios({
    method: "get",
    url: "https://api.spotify.com/v1/me/player",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
