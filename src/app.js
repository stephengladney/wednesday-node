require("dotenv").config();
const pg = require("pg");
const colors = require("colors");
const weather = require("./weather");
const spotify = require("./spotify");
const express = require("express");
const favicon = require("express-favicon");
const newsAPI = require("newsapi");
const newsapi = new newsAPI(process.env.NEWS_API_KEY);
const path = require("path");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const db = require("../models");
const sequelize = require("../config/sequelize");
const app = express();
const tesla = require("./tesla");
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const tesla_client_id = process.env.TESLA_CLIENT_ID;
const tesla_client_secret = process.env.TESLA_CLIENT_SECRET;
const tesla_vehicle_id = process.env.TESLA_VEHICLE_ID;
const tesla_user_agent = process.env.TESLA_USER_AGENT;
let tesla_access_token, tesla_refresh_token;

sequelize.connection.sync().then(() => {
  db.User.findById(1)
    .then(user => {
      tesla_access_token = user.dataValues.tesla_access_token;
      tesla_refresh_token = user.dataValues.tesla_refresh_token;
    })
    .catch(error => console.log("Error connecting to Database: ", error));
});

app.use(favicon(__dirname + "/build/favicon.ico"));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.urlencoded({ extended: true }));

app

  //API
  .post("/api/authorize", (req, res) => {
    console.log("auth requested");
    const usernameSubmitted = req.query.user;
    const pwSubmitted = req.query.password;
    db.User.findById(1).then(user => {
      if (usernameSubmitted === user.username) {
        bcrypt.compare(pwSubmitted, user.password, (err, resp) => {
          if (resp) {
            res.status(200).send();
          } else {
            res.status(401).send();
          }
        });
      } else {
        res.status(401).send();
      }
    });
  })
  .get("/api/news/headlines", (req, res) => {
    newsapi.v2
      .topHeadlines({
        language: "en",
        country: "us"
      })
      .then(response => {
        if (response.status === "ok") {
          res.status(200).send(response);
        } else {
          res.status(500).send();
        }
      });
  })
  .get("/api/tesla/state/drive", (req, res) => {
    tesla.state
      .drive(tesla_access_token, tesla_user_agent, tesla_vehicle_id)
      .then(response => {
        res.send(JSON.stringify(response.data));
      })
      .catch(error => {
        if (error.response.status === 401) {
          tesla
            .getNewToken(
              tesla_client_id,
              tesla_client_secret,
              tesla_refresh_token
            )
            .then(response2 => {
              tesla_access_token = response2.data.access_token;
              tesla_refresh_token = response2.data.refresh_token;
              db.User.findById(1).then(user => {
                user.update({
                  tesla_access_token: tesla_access_token,
                  tesla_refresh_token: tesla_refresh_token
                });
                tesla.state
                  .drive(tesla_access_token, tesla_user_agent, tesla_vehicle_id)
                  .then(response => {
                    res.send(JSON.stringify(response.data));
                  })
                  .catch(error =>
                    res
                      .status(418)
                      .send(
                        "Error on second attempt to get state: " +
                          error.response.status
                      )
                  );
              });
            })
            .catch(error =>
              res
                .status(418)
                .send("Error on getting new token: " + error.response.status)
            );
        } else {
          res
            .status(418)
            .send(
              "Unknown error from Tesla on initial request: " +
                error.response.status
            );
        }
      });
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
          .then(response => {
            switch (response.status) {
              case 200:
                res.status(200).send(response.data);
                break;
              case 204:
                res.status(204).send();
                break;
              default:
            }
          })
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
        res.send(data.data);
      })
      .catch(e => console.log(e));
  })
  .get("/*", (req, res) =>
    res.sendFile(path.join(__dirname, "build", "index.html"))
  )

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("Wednesday server is now running!");
  });
