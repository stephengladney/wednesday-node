require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app
  .get("/", (req, res) => res.send("server is responding!"))
  .listen(process.env.PORT || 5000, process.env.IP, () =>
    console.log("Spotify player is now running!")
  );
