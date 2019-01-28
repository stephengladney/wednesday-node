module.exports = {
  getByLatLon: getByLatLon
};

require("dotenv").config();
const axios = require("axios");
const apiKey = process.env.DARKSKY_SECRET_KEY;

function getByLatLon(latitude, longitude) {
  return axios.get(
    `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`
  );
}
