"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const response = require("./../response");
const db = require("./../settings/db");
const config = require("./../config");

exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT `id`, `firstName`, `lastName`, `email`, `phone` FROM `users`",
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.register = (req, res) => {
  db.query(
    "SELECT `id`, `email`, `firstName` FROM `users` WHERE `email` = '" +
      req.body.email +
      "'",
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else if (typeof rows !== "undefined" && rows.length > 0) {
        const row = JSON.parse(JSON.stringify(rows));
        row.map((rw) => {
          response.status(
            302,
            {
              message: `Пользователь с таким email - ${rw.email} уже зарегистрирован`,
            },
            res
          );
          return true;
        });
      } else {
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName =
          req.body.lastName !== "" ? req.body.lastName : "Не указано";
        const phone = req.body.phone;

        const salt = bcrypt.genSaltSync(15);
        const password = bcrypt.hashSync(req.body.password, salt);

        const sql =
          "INSERT INTO `users`(`email`, `firstName`, `lastName`, `phone`, `password`) VALUES('" +
          email +
          "', '" +
          firstName +
          "', '" +
          lastName +
          "', '" +
          phone +
          "', '" +
          password +
          "')";

        db.query(sql, (error, results) => {
          if (error) {
            response.status(400, error, res);
          } else {
            response.status(
              200,
              { message: `Регистрация прошла успешно.`, results },
              res
            );
          }
        });
      }
    }
  );
};

exports.login = (req, res) => {
  db.query(
    "SELECT `id`, `email`, `password` FROM `users` WHERE `email` = '" +
      req.body.email +
      "'",
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else if (rows.length <= 0) {
        response.status(
          401,
          {
            message: `Пользователь с таким email - ${req.body.email} не найден. Пройдите регистрацию`,
          },
          res
        );
      } else {
        const row = JSON.parse(JSON.stringify(rows));
        row.map((rw) => {
          const password = bcrypt.compareSync(req.body.password, rw.password);
          if (password) {
            //Если true мы пускаем юзера и генерируем токен
            const token = jwt.sign(
              {
                userId: rw.id,
                email: rw.email,
              },
              config.jwt,
              { expiresIn: 120 * 120 }
            );

            response.status(200, { token: `Bearer ${token}` }, res);
          } else {
            //Выкидываем ошибку что пароль неверный
            response.status(401, { message: `Пароль не верный.` }, res);
          }
          return true;
        });
        response.status(200, `User found`, res);
      }
    }
  );
};
