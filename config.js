const port = 3000;
const baseURL = `http://api.farmer.accounts.easyfarm.co.in/:${port}`;
module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: "mysecret",
  baseURL: baseURL,
  port: port,
  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id:
      "643540525219-947emudk7cr2svpavlc621epqiie02fs.apps.googleusercontent.com",
    project_id: "easyfarm-291212", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "-Zz2R5yOnOyZjgQyyr5Qewbl",
    redirect_uris: [`${baseURL}/auth_callback`],
    scopes: [
      "https://mail.google.com/",
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/contacts',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },
};
