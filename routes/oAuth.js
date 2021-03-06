const express = require("express");
const https = require("https");
const router = express.Router();
const google = require("googleapis").google;
const jwt = require("jsonwebtoken");

const CONFIG = require("./../config");
const usersController = require("../dao/controllers/users");

router.use("/auth/*", (req, res, next) => {
  console.log('<<--== /auth/* ==-->>');
  const token = req.headers["x-access-token"];
  console.log('--== /auth/* ==-->>', token);
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
    req.sessionUser = decoded;
    next();
  });
});

router.get("/", (req, res) => {
  const referer = req.get("referer");
  let redirectUrl = `${req.protocol}://${req.headers.host}/auth_callback`;
  if (referer) {
    redirectUrl = `${req.protocol}://${req.headers.host}/auth_callback/?referer=${referer}`;
  }

  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    redirectUrl
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
  const { query } = req;
  let redirectUrl = `${req.protocol}://${req.headers.host}/auth_callback`;
  if (query.referer) {
    redirectUrl = `${req.protocol}://${req.headers.host}/auth_callback/?referer=${query.referer}`;
  }
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    redirectUrl
  );
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
          const jwtToken = jwt.sign(
            { ...tokens, profile: JSON.parse(data) },
            CONFIG.JWTsecret
          );

          if (query.referer) {
            if (query.referer.indexOf("localhost") > -1) {
              return res.redirect(
                query.referer + `auth_callback?token=${jwtToken}`
              );
            }
            return res.redirect(
              query.referer + `auth_callback.html?token=${jwtToken}`
            );
          }

          return res.send({
            token: jwtToken,
          });
        });
      })
      .on("error", (err) => {
        return res.json({ error: err });
      });
  }
});

module.exports = router;
