"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.searchFriendById = (req, res) => {
  const data = req.body.searchValue.toLowerCase(); //ищем пользователей в нижнем регистре
  const currentUserId = req.params.id; //id основного пользователя
  const friendEmail = req.body.email; // email друга коготорого мы хотим добавить к себе в список

  const currentUser = "SELECT `ID` FROM `users` WHERE `ID` = '" + currentUserId + "'"; //делается выборка id основного пользователя

  db.query(currentUser, (error, results) => {
    if (error) {
      response.status(400, { error: `Пользователь по данному id ${currentUserId} не найден!`, error }, res);
    } else {
      let sql; //будем использоваться в условиях

      if (friendEmail) {
        sql = "SELECT `email`, `Users_ID` FROM `friends` WHERE `email` = '" + friendEmail + "' AND '" + currentUserId + "'";
      } else {
        //если true то все поля из таблицы friends будут отображаться в списке контактов пользователя
        sql = "SELECT `ID`, `email`, `firstName`, `lastName`, `phone`, `password` FROM `friends` WHERE `Users_ID` = '" + currentUserId + "'";
      }

      db.query(sql, (error, results) => {
        if (error) {
          response.status(400, { message: 'Пользователь не найден', error }, res);
        } else {
          const filteredData = results.filter((el) => {
            return (
              el.email.toLowerCase().includes(data) ||
              el.firstName.toLowerCase().includes(data) ||
              el.lastName.toLowerCase().includes(data) ||
              el.phone.toLowerCase().includes(data)
            );
          }); //делаем поиск пользователей в по разным свойстам в списке

          response.status(200, filteredData, res);
        };
      });
    };
  });
};
