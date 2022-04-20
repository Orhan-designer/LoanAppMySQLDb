"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.addNewFriend = (req, res) => {
  const sql =
    "INSERT INTO `users`(`email`) VALUES('" + req.body.email + "')";
  db.query(sql, (error, results) => {
    if (error) {
      response.status(400, error, res);
    } else {
      response.status(200, { message: "Друг успешно добавлен", results }, res);
    }
  });
};
