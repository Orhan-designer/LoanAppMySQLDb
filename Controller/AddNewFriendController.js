"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.addNewFriend = (req, res) => {
  try {
    const friendEmail = req.body.email; //email пользователя, которого добавляю в свой список контактов
    const currentUserId = req.body.id; //мой id 
    //делаем выборку из таблицы users по емейл существующего пользователя
    const usersTable = "SELECT `ID`, `email`, `firstName`, `lastName`, `phone` FROM `users` WHERE `email` = '" + friendEmail + "'";

    db.query(usersTable, (error, usersTableResults) => {
      //проверка на то, чтобы пользователь не мог добавить самого себя в свой список контактов
      if (!usersTableResults.length || usersTableResults[0].ID === currentUserId) {
        response.status(400, { message: 'Вы не можете добавить себя, в свой список контактов', error }, res);
      } else {
        const friend = "SELECT `ID`, `Users_ID`, `secondPersonID` FROM `friends` WHERE (`Users_ID` = '" +
          currentUserId + "' AND `secondPersonID` = '" + usersTableResults[0].ID + "') OR (`Users_ID` = '" + usersTableResults[0].ID + "' AND `secondPersonID` = '" + currentUserId + "')";

        db.query(friend, (error, friendResults) => {
          if (!friendResults.length) {
            const friendId = usersTableResults.map(el => el.ID);
            const sql = "INSERT INTO `friends`(`Users_ID`, `secondPersonID`) VALUES('" + currentUserId + "', '" + friendId + "')";

            db.query(sql, (error, insertResults) => {
              if (error) {
                response.status(400, { error: `Пользователь ${friendEmail} не зарегистрирован`, error }, res);
              } else {
                response.status(200, { success: `Пользователь ${friendEmail} успешно добавлен в список контактов`, insertResults }, res);
              }
            });

          } else {
            response.status(400, { error: `Пользователь ${friendEmail} уже существует в списке контактов!`, friendResults }, res);
          };
        });
      };
    });
  } catch (error) {
    response.status(400, error, res);
  }
};