'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({
    gId: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    picture: DataTypes.STRING,
    givenName: DataTypes.STRING,
    familyName: DataTypes.STRING,
    verifiedEmail: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};