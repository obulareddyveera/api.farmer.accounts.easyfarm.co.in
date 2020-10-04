module.exports = {
  getHostNameUri: (req) => {
    if (req.hostname === "localhost") {
      return "localhost:5000";
    }

    return !req.hostname ? "localhost:5000" : req.hostname;
  },
};
