"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.addNewFriend = (req, res) => {
  db.query(
    "INSERT INTO `users`(`friends`) VALUES('" + req.body.email + "')",
    (error, results) => {
      if (error) {
        console.log(req.body.email);
        response.status(400, error, res);
      } else {
        response.status(
          200,
          { message: "Друг успешно добавлен", results },
          res
        );
      }
    }
  );
};
