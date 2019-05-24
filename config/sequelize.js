const Sequelize = require("sequelize");
const connection = new Sequelize(process.env.DATABASE_URL);
const dbPreferences = {
  freezeTableName: true,
  underscored: true
};

module.exports = {
  Sequelize: Sequelize,
  connection: connection,
  preferences: dbPreferences
};
