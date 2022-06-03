"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.addNewFriend = (req, res) => {
  const friendEmail = req.body.email; //email пользователя, которого добавляю в свой список контактов
  const currentUserId = req.body.id; //мой id 

  //делаем выборку из таблицы users по емейл существующего пользователя
  const usersTable = "SELECT `ID`, `email`, `firstName`, `lastName`, `phone` FROM `users` WHERE `email` = '" + friendEmail + "'";

  db.query(usersTable, (error, results1) => {
    console.log(results1)
    if (!results1.length) {
      response.status(400, { error: `Пользователь ${friendEmail} не зарегистрирован`, error }, res)
    } else {
      const friend = "SELECT `ID`, `Users_ID`, `secondPersonID` FROM `friends` WHERE (`Users_ID` = '" +
        currentUserId + "' AND `secondPersonID` = '" + results1[0].ID + "') OR (`Users_ID` = '" + results1[0].ID + "' AND `secondPersonID` = '" + currentUserId + "')";

      db.query(friend, (error, results) => {
        console.log(results)
        if (!results.length) {
          const friendId = results1.map(el => el.ID)
          const sql = "INSERT INTO `friends`(`Users_ID`, `secondPersonID`) VALUES('" + currentUserId + "', '" + friendId + "')";

          db.query(sql, (error, results) => {
            if (error) {
              response.status(400, error, res);
            } else {
              response.status(200, { success: `Пользователь ${friendEmail} успешно добавлен в список контактов`, results }, res);
            }
          })
        } else {
          response.status(400, { error: `Пользователь ${friendEmail} уже существует в списке контактов!`, results }, res);
        }
      });
    };
  });
};
