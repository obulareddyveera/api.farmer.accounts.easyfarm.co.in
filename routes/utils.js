module.exports = {
  getHostNameUri: (req) => {
    if (req.hostname === "localhost") {
      return "localhost:5000";
    }

    return !req.hostName ? "localhost:5000" : req.hostName;
  },
};
