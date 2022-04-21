"use strict";

const response = require("../response");
const db = require("../settings/db");

exports.friends = (req, res) => {
  db.query(
    "INSERT INTO `friends`(`email`, `users_id`) VALUES('" +
      req.body.email +
      "', '" +
      req.body.id +
      "')",
    (error, results) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(
          200,
          { message: "Друг успешно добавлен в таблицу...", results },
          res
        );
      }
    }
  );
};
