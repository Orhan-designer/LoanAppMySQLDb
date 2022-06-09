"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const response = require("./../response");
const db = require("./../settings/db");
const config = require('./../config');

exports.signUp = (req, res) => {
  try {
    const userEmail = req.body.email;

    db.query("SELECT `ID`, `email`, `firstName`, `lastName`, `phone`, `password` FROM `users` WHERE `email` = '" + userEmail + "'",
      (error, rows, fields) => {
        if (error) {
          response.status(400, error, res)
        } else if (typeof rows !== 'undefined' && rows.length > 0) {
          const row = JSON.parse(JSON.stringify(rows));
          row.map(() => {
            response.status(302, { error: `Пользователь с таким email ${userEmail} уже существует` }, res)
            return true;
          })
        } else {
          const userEmail = req.body.email;
          const firstName = req.body.firstName;
          const lastName = req.body.lastName !== '' ? req.body.lastName : "Не указано";
          const phone = req.body.phone;

          const salt = bcrypt.genSaltSync(15);
          const password = bcrypt.hashSync(req.body.password, salt);

          const sql = "INSERT INTO `users`(`email`, `firstName`, `lastName`, `phone`, `password`) VALUES('" +
            userEmail + "', '" +
            firstName + "', '" +
            lastName + "', '" +
            phone + "', '" +
            password + "')";

          db.query(sql, (error, results) => {
            if (error) {
              response.status(400, error, res)
            } else {
              const payload = { subject: results.insertId }
              const token = jwt.sign(payload, 'secretKey');
              const id = results.insertId;

              response.status(200, {
                success: 'Регистрация прошла успешно!', token: `Bearer ${token}`,
                user: { id, userEmail, firstName, lastName, phone, password }
              }, res)
            }
          })
        }
      });
  } catch (error) {
    response.status(400, error, res)
  }
};

exports.signIn = (req, res) => {
  try {
    const userEmail = req.body.email;

    db.query(
      "SELECT `ID`, `email`, `firstName`, `lastName`, `phone`, `password` FROM `users` WHERE `email` = '" + userEmail + "'",
      (error, rows, fields) => {
        if (error) {
          response.status(400, error, res);
        } else if (rows.length <= 0) {
          response.status(
            401,
            { error: `Пользователь с таким email ${userEmail} не найден. Пройдите регистрацию!` }, res);
        } else {
          const row = JSON.parse(JSON.stringify(rows));
          row.map(rw => {
            const id = rw.ID;
            const email = rw.email;
            const firstName = rw.firstName;
            const lastName = rw.lastName;
            const phone = rw.phone;
            const password = bcrypt.compareSync(req.body.password, rw.password);

            if (password) {
              //Если true мы пускаем юзера и генерируем токен
              const token = jwt.sign(
                {
                  userId: rw.ID,
                  email: rw.email
                },
                config.jwt,
                { expiresIn: 120 * 120 }
              );

              response.status(200, { token: `Bearer ${token}`, user: { id, email, firstName, lastName, phone } }, res);
            } else {
              //Выкидываем ошибку что пароль неверный
              response.status(401, { error: `Неверный пароль для ${email}. Повторите попытку снова!` }, res);
            }

            return true;
          });
        }
      }
    );
  } catch (error) {
    response.status(400, error, res)
  }
};
