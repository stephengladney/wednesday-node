module.exports = {
  state: {
    drive: (token, userAgent, vehicleId) =>
      driveState(token, userAgent, vehicleId)
  }
};
const axios = require("axios");
const baseUrl = `https://owner-api.teslamotors.com/api/1/vehicles/`;

function driveState(token, userAgent, vehicleId) {
  return axios({
    method: "get",
    url: `${baseUrl}${vehicleId}/data_request/drive_state`,
    params: {},
    headers: {
      "User-Agent": userAgent,
      Authorization: `Bearer ${token}`
    }
  });
}
