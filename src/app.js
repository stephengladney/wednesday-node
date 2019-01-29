require("dotenv").config();
const pg = require("pg");
const colors = require("colors");
const weather = require("./weather");
const spotify = require("./spotify");
const express = require("express");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const db = require("../models");
const sequelize = require("../config/sequelize");
const app = express();
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;

app.use(bodyParser.urlencoded({ extended: true }));

// db.User.create(
//   {
//     username: "sgladney",
//     email: "stephengladney@gmail.com",
//     password: "perswerd",
//     display_name: "juju"
//   },
//   sequelize.preferences
// );

app
  .get("/", (req, res) =>
    res.sendFile("frontend/public/index.html", { root: "../../" })
  )

  //API
  .get("/api/spotify/authorize", (req, res) => {
    var permissions =
      "user-modify-playback-state user-read-currently-playing user-read-playback-state user-read-recently-played user-library-read playlist-read-private";
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          client_id: spotify_client_id,
          response_type: "code",
          redirect_uri: spotify_redirect_uri,
          scope: permissions,
          show_dialog: true
        })
    );
  })
  .get("/api/spotify/player/state", (req, res) => {
    spotify.getNewToken().then(response => {
      spotify.player
        .getState(response.data.access_token)
        .then(response => res.send(response.data))
        .catch(error => res.send(String(error)));
    });
  })
  .get("/api/spotify/player/:action", (req, res) => {
    spotify.getNewToken().then(response => {
      spotify.player.actions[req.params.action](
        response.data.access_token,
        req.query.value
      )
        .then(response => res.send("success"))
        .catch(error => res.send(String(error.code)));
    });
  })
  .get("/spotify", (req, res) => {
    spotify
      .getInitialToken(req.query.code)
      .then(response => {
        res.redirect(
          "/#" +
            querystring.stringify({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token
            })
        );
      })
      .catch(err => {
        console.log(err);
        res.send("failure");
      });
  })
  .get("/api/weather/:lat,:lon", (req, res) => {
    console.log(
      `API:`.grey +
        `WEATHER => `.yellow +
        `{lat:${req.params.lat}, lon:${req.params.lon}}`
    );
    weather
      .getByLatLon(req.params.lat, req.params.lon)
      .then(data => {
        res.send(JSON.stringify(data.data));
      })
      .catch(e => console.log(e));
  })
  .get("/test", (req, res) => res.send(wednesday.abbreviateWeekday("Thursday")))

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("Wednesday server is now running!");
  });
