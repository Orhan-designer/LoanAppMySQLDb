'use strict'

const response = require('./../response');
const db = require('./../settings/db');

exports.getAllUsers = (req, res) => {
    db.query(
        "SELECT `ID`, `email`, `firstName`, `lastName`, `phone`, `password` FROM `users` ", //выборка из таблицы users
        (error, results, rows) => {
            if (error) {
                response.status(400, error, res);
            } else {
                response.status(200, results, res);
            };
        }
    );
};

exports.usersList = (req, res) => {
    const usersList = "SELECT `ID`, `email`, `firstName`, `lastName`, `phone`, `password` FROM `users`"

    db.query(usersList, (error, results) => {
        if (!usersList) {
            response.status(400, { error: 'Пользователь не найден', error }, res)
        } else {
            let list = results.map(el => {
                return {
                    id: el.ID,
                    name: `${el.firstName} ${el.lastName}`
                }
            });

            response.status(200, list, res)
        };
    });
};