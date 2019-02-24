require("dotenv").config();
const pg = require("pg");
const colors = require("colors");
const weather = require("./weather");
const spotify = require("./spotify");
const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const db = require("../models");
const sequelize = require("../config/sequelize");
const app = express();
const tesla = require("./tesla");
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const tesla_vehicle_id = process.env.TESLA_VEHICLE_ID;
const tesla_access_token = process.env.TESLA_ACCESS_TOKEN;
const tesla_user_agent = process.env.TESLA_USER_AGENT;

app.use(favicon(__dirname + "/build/favicon.ico"));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

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

  //API\
  .get("/api/tesla/state/drive", (req, res) => {
    tesla.state
      .drive(tesla_access_token, tesla_user_agent, tesla_vehicle_id)
      .then(response => {
        res.send(JSON.stringify(response.data));
      })
      .catch(error => res.send(String(error)));
  })
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
  .get("/api/spotify/library", (req, res) => {
    spotify.getNewToken().then(response => {
      spotify
        .getLibrary(response.data.access_token, req.query.offset)
        .then(response => {
          res.status(200).send(response.data);
        })
        .catch(error => res.status(500).send(error));
    });
  })
  .get("/api/spotify/player/song/isinlibrary/:id", (req, res) => {
    spotify.getNewToken().then(response => {
      spotify.player
        .isSongInLibrary(response.data.access_token, req.params.id)
        .then(response => res.status(200).send(response.data[0]))
        .catch(error => res.status(500).send(error));
    });
  })
  .get("/api/spotify/player/state", (req, res) => {
    spotify
      .getNewToken()
      .then(response => {
        spotify.player
          .getState(response.data.access_token)
          .then(response => res.status(200).send(response.data))
          .catch(error =>
            res.status(500).send("Error getting Spotify state: " + error)
          );
      })
      .catch(error =>
        res.status(500).send("Error getting new Spotify token: " + error)
      );
  })
  .get("/api/spotify/player/:action", (req, res) => {
    spotify.getNewToken().then(response => {
      spotify.player.actions[req.params.action](
        response.data.access_token,
        req.query.value
      )
        .then(response => {
          console.log(response);
          res.send("success");
        })
        .catch(error => console.log(error));
    });
  })
  .get("/spotifyauth", (req, res) => {
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
  .get("/*", (req, res) =>
    res.sendFile(path.join(__dirname, "build", "index.html"))
  )

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("Wednesday server is now running!");
  });
