'use strict'

const response = require('./../response');
const db = require('./../settings/db');

exports.users = (req, res) => {
    const users = "SELECT * FROM `users`";
    console.log(users)

    db.query(users, (error, results) => {
        console.log(results)
        if (users.length === 0) {
            response.status(400, { message: 'Пользователь не найден', error }, res)
        } else {
            response.status(400, results, res)
        }
    });
}

exports.usersList = (req, res) => {
    const usersList = "SELECT * FROM `users`"

    db.query(usersList, (error, results) => {
        if (!usersList) {
            response.status(400, { message: 'Пользователь не найден', error }, res)
        } else {
            let list = results.map(el => {
                return {
                    id: el.ID,
                    name: `${el.firstName} ${el.lastName}`
                }
            })

            response.status(200, list, res)
        }
    })
}