const models = require("../models");

const usersController = {
  validateEmail: async (emailId, pwd) => {
    const response = await models.users.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("email")), "total"]],
      where: {
        email: emailId,
      },
    });
    return response;
  },
  checkDuplicateEmail: async (emailId) => {
    const response = await models.users.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("email")), "total"]],
      where: {
        email: emailId,
      },
    });
    return response;
  },
  fetchAllUsers: async () => {
    return await models.users.findAll({});
  },
  setGoogleOAuth2User: async (userProfile) => {
    const [users, created] = await models.users.findOrCreate({
      where: { gId: userProfile.id },
      defaults: {
        name: userProfile.name,
        givenName: userProfile.given_name,
        familyName: userProfile.family_name,
        email: userProfile.email,
        picture: userProfile.picture,
        verifiedEmail: userProfile.verified_email,
      },
    });
    const {dataValues} = users;

    return {
      currentUser: dataValues,
    };
  },
};

module.exports = usersController;
