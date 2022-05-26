"use strict";

const response = require("./../response");
const db = require("./../settings/db");

exports.addNewFriend = (req, res) => {
  const friendEmail = req.body.email; //email пользователя, которого добавляю в свой список контактов
  const currentUserId = req.body.id; //мой id 

  // const sql = "SELECT `ID` FROM `users` WHERE `ID` = '" + currentUserId + "'"; //делаю выборку своего id из таблицы users
  const friend = "SELECT `email`, `firstName`, `lastName`, `phone`, `password` FROM `users` WHERE `email` = '" + friendEmail + "'";

  db.query(friend, (error, results1) => {
    if (error) {
      response.status(400, { message: 'Ошибка', error }, res)
    } else {
      if (!results1.length) {
        response.status(400, { message: 'Пользователь не зарегистрирован', error }, res)
      } else {
        const friend = "SELECT `email`, `Users_ID` FROM `friends` WHERE `email` = '" + friendEmail + "'";
        db.query(friend, (error, results) => {
          if (!results.length) {
            const friendEmail = req.body.email;
            const friendFirstName = results1[0].firstName;
            const friendLastName = results1[0].lastName;
            const friendPhone = results1[0].phone;
            const friendPassword = results1[0].password;

            const sql = "INSERT INTO `friends`(`email`, `firstName`, `lastName`, `phone`, `password`, `Users_ID`) VALUES('" +
              friendEmail + "', '" +
              friendFirstName + "', '" +
              friendLastName + "', '" +
              friendPhone + "', '" +
              friendPassword + "' , '" +
              currentUserId + "')";

            db.query(sql, (error, results) => {
              if (error) {
                response.status(400, error, res)
              } else {
                response.status(200, { message: 'Пользователь успешно добавлен в список контактов', results }, res)
              }
            })
          } else {
            let isAble = true;

            for (let i = 0; i < results.length; i++) {
              if (results[i].Users_ID === currentUserId) {
                isAble = false;
                break;
              }
            }

            if (isAble) {
              const friendEmail = req.body.email;
              const friendFirstName = req.body.firstName;
              const friendLastName = req.body.lastName;
              const friendPhone = req.body.phone;
              const friendPassword = req.body.password;

              const sql = "INSERT INTO `friends`(`email`, `firstName`, `lastName`, `phone`, `password`, `Users_ID`) VALUES('" +
                friendEmail + "', '" +
                friendFirstName + "', '" +
                friendLastName + "', '" +
                friendPhone + "', '" +
                friendPassword + "' , '" +
                currentUserId + "')";

              db.query(sql, (error, results) => {
                if (error) {
                  response.status(400, error, res)
                } else {
                  response.status(200, { message: 'Пользователь успешно добавлен в список контактов', results }, res)
                }
              })
            } else {
              response.status(400, { message: 'Пользователь уже у вас в друзьях!', error }, res)
            };
          };
        });
      };
    };
  });
};