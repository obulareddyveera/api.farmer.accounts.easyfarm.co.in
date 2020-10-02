const express = require("express");
const https = require("https");
const router = express.Router();
const google = require("googleapis").google;
const jwt = require("jsonwebtoken");
const CONFIG = require("./../config");

router.get("/", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    `http://${req.headers.host}/auth_callback`
  );
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: CONFIG.oauth2Credentials.scopes,
  });

  return res.json({ loginLink: loginLink });
});

router.get("/auth_callback", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    `http://${req.headers.host}/auth_callback`
  );
  const { query } = req;
  if (query.error) {
    return res.json({ error: query.error });
  } else {
    const { err, tokens } = await oauth2Client.getToken(query.code);
    if (err) return res.json({ error: err });
    const { access_token } = tokens;
    const googleProfileUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
    https
      .get(googleProfileUrl, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          console.log(JSON.parse(data));

          return res.json({
            tokens,
            profile: JSON.parse(data),
            jwt: jwt.sign(tokens, CONFIG.JWTsecret),
          });
        });
      })
      .on("error", (err) => {
        return res.json({ error: err });
      });
  }
});

module.exports = router;
