const mysql = require("mysql2");
const config = require("../config");

const connection = mysql.createConnection({
  host: config.HOST,
  user: config.DBUSER,
  database: config.DBNAME,
  password: config.DBPASSWORD,
});

connection.connect((error) => {
  if (error) {
    return console.log("Ошибка подключения к БД");
  } else {
    return console.log("Подлючение к БД успешно...");
  }
});

module.exports = connection;
