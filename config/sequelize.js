const Sequelize = require("sequelize");
const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "postgres",
    logging: false
  }
);
const dbPreferences = {
  freezeTableName: true,
  underscored: true
};

module.exports = {
  Sequelize: Sequelize,
  connection: connection,
  preferences: dbPreferences
};
