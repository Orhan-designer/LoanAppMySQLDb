"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.searchFriendById = (req, res) => {
  const data = req.body.searchValue.toLowerCase(); //ищем пользователей в нижнем регистре
  const currentUserId = req.params.id; //id основного пользователя

  const friendsTable = "SELECT `ID`, `Users_ID`, `secondPersonID` FROM `friends` WHERE `Users_ID` = '" + currentUserId + "' OR `secondPersonID` = '" + currentUserId + "'";

  db.query(friendsTable, (error, results1) => {
    if (error) {
      response.status(400, { error: `Пользователь по данному id ${currentUserId} не найден!`, error }, res);
    } else {
      const friendsResult = results1.map((el) => el.Users_ID == currentUserId ? el.secondPersonID : el.Users_ID);
      //делается выборка id основного пользователя
      const usersTable = "SELECT `ID`, `email`, `firstName`, `lastName`, `phone` FROM `users`";

      db.query(usersTable, (error, results) => {
        if (error) {
          response.status(400, { error: `Пользователь по данному id ${currentUserId} не найден!`, error }, res);
        } else {
          const filteredData = results.filter((el) => {
            return (
              friendsResult.includes(el.ID) &&
              (
                el.email.toLowerCase().includes(data) ||
                el.firstName.toLowerCase().includes(data) ||
                el.lastName.toLowerCase().includes(data) ||
                el.phone.toLowerCase().includes(data)
              )
            )
          }); //делаем поиск пользователей в по разным свойстам в списке

          response.status(200, filteredData, res);
        };
      });
    };
  });
};
