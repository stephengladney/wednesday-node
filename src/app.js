require("dotenv").config();
const pg = require("pg");
const colors = require("colors");
const wednesday = require("../../frontend/src/wednesday");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models");
const sequelize = require("../config/sequelize");
const app = express();

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
  .get("/proxytest", (req, res) => {
    res.send("here is the proxy test endpoint response");
  })
  .get("/api/weather/:lat,:lon", (req, res) => {
    console.log(
      `API:`.grey +
        `WEATHER => `.yellow +
        `{lat:${req.params.lat}, lon:${req.params.lon}}`
    );
    wednesday
      .getWeatherByLocation(
        process.env.DARKSKY_SECRET_KEY,
        req.params.lat,
        req.params.lon
      )
      .then(data => {
        res.send(JSON.stringify(data.data));
      })
      .catch(e => console.log(e));
  })
  .get("/test", (req, res) => res.send(wednesday.abbreviateWeekday("Thursday")))

  .listen(process.env.PORT || 5000, process.env.IP, () => {
    console.log("Wednesday server is now running!");
    console.log(
      `[${wednesday.timeNow()}]`.grey +
        ` API:`.red +
        `WEATHER => `.yellow +
        `{lat:-38, lon:44}`
    );
  });
