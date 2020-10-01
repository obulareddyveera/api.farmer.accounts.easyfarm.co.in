const Sequelize = require("sequelize");
const config = require("./database.json");

// const sequelize = new Sequelize(config.development);
console.log("--== Iniliatizing Sequelize ==--", config.development);
const { database, username, password, host, dialect } = config.development;
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});
sequelize.authenticate().then(
  () => {
    console.log("Connection has been established successfully.");
  },
  (error) => {
    console.error("Unable to connect to the database:", error);
  }
);

module.exports = sequelize;
global.sequelize = sequelize;
