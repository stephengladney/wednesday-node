const db = require("../config/sequelize");
const bcrypt = require("bcryptjs");
const User = db.connection.define(
  "users",
  {
    username: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: db.Sequelize.STRING,
    display_name: {
      type: db.Sequelize.STRING,
      unique: true
    }
  },
  Object.assign({}, db.preferences, {
    hooks: {
      afterValidate: user => {
        user.password = bcrypt.hashSync(user.password, 8);
      }
    }
  })
);

module.exports = User;
