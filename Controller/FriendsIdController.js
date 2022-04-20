"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.searchFriendById = (req, res) => {
  const id = req.body.id; //id данного пользователя
  console.log(id);
  const data = req.body.searchValue.toLowerCase(); //ищем пользователей в нижнем регистре
  const user = "SELECT `id` * FROM `users` WHERE `id` = '" + req.body.id + "'";

  db.query(user, [id, data], (error, rows, fields) => {
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
