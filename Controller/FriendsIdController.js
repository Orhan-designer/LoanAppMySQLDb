"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.searchFriendById = (req, res) => {
  // const id = req.body.id; //id данного пользователя
  const data = req.body.searchValue.toLowerCase(); //ищем пользователей в нижнем регистре
  const user = "SELECT `id` * FROM `users` WHERE `id` = '" + req.params.id + "'";

  db.query(user, data, (error, rows, fields) => {
    if (error) {
      response.status(400, error, res);
    } else {
      response.status(200, { message: `Найден друг по id - ${id}` }, res);
    }
  });

  if (!user) {
    response.status(400, {
      message: `Невозможно найти пользователя по данному id - ${user}`,
    });
  }

  if (data === "") {
    return response.status(200, user.friends);
  }

  const filteredData = user.friends.filter((el) => {
    el.email.toLowerCase().includes(data) ||
      el.firstName.toLowerCase().includes(data) ||
      el.lastName.toLowerCase().includes(data) ||
      el.phone.toLowerCase().includes(data);
  });

  response.status(200, filteredData);
};
