const expressJwt = require("express-jwt");
// authentication for rest api
function authJwt() {
  const secret = process.env.SECERT;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      {url: /\/api\/v1\/product(.*)/, methods: ["GET", "OPTIONS"]},
      {url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"]},
      `${api}/user/login`,
    ],
  });
}
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}
module.exports = authJwt;
