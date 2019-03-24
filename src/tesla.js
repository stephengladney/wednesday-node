module.exports = {
  state: {
    drive: (token, userAgent, vehicleId) =>
      driveState(token, userAgent, vehicleId)
  },
  getNewToken: (clientId, clientSecret, refreshToken) =>
    getNewToken(clientId, clientSecret, refreshToken)
};
const axios = require("axios");
const baseUrl = `https://owner-api.teslamotors.com`;

function driveState(token, userAgent, vehicleId) {
  return axios({
    method: "get",
    url: `${baseUrl}/api/1/vehicles/${vehicleId}/data_request/drive_state`,
    params: {},
    headers: {
      "User-Agent": userAgent,
      Authorization: `Bearer ${token}`
    }
  });
}

function getNewToken(clientId, clientSecret, refreshToken) {
  return axios({
    method: "post",
    url: `${baseUrl}/oauth/token`,
    params: {
      grant_type: "refresh_token",
      client_id: String(clientId),
      client_secret: String(clientSecret),
      refresh_token: String(refreshToken)
    }
  });
}
