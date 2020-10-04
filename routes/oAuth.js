const express = require("express");
const https = require("https");
const router = express.Router();
const google = require("googleapis").google;
const jwt = require("jsonwebtoken");

const utils = require("./utils");
const CONFIG = require("./../config");
const usersController = require("../dao/controllers/users");

router.get("/auth/*", (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });
  jwt.verify(token, CONFIG.JWTsecret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    const { expiry_date, profile } = decoded;
    if (new Date().getTime() > expiry_date) {
      res.status(401).send({ auth: false, message: "Session Expired" });
    }
    req.currentUser = decoded;
    next();
  });
});

router.get("/", (req, res) => {
  const referer = req.get('Referer');
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    `http://${utils.getHostNameUri(req)}/auth_callback?referer=${referer}`
  );
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: CONFIG.oauth2Credentials.scopes,
  });

  return res.json({
    loginLink: loginLink,
    referer,
  });
});

router.get("/auth_callback", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    `http://${utils.getHostNameUri(req)}/auth_callback`
  );
  const { query } = req;
  if (query.error) {
    return res.json({ error: query.error });
  } else {
    const { err, tokens } = await oauth2Client.getToken(query.code);
    if (err) return res.json({ error: err });
    const { access_token } = tokens;
    const googleProfileUrl = `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`;
    https
      .get(googleProfileUrl, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", async () => {
          const {
            err,
            currentUser,
          } = await usersController.setGoogleOAuth2User(JSON.parse(data));
          if (err) return res.json({ error: err });
          console.log(
            "--== Request HostName ",
            req.secure,
            req.hostname,
            req.originalUrl
          );

          return res.json({
            jwt: jwt.sign(
              { ...tokens, profile: JSON.parse(data) },
              CONFIG.JWTsecret
            ),
            referer: query,
          });
        });
      })
      .on("error", (err) => {
        return res.json({ error: err });
      });
  }
});

module.exports = router;
