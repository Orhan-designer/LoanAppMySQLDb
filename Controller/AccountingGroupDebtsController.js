'use strict';
const response = require('./../response');
const db = require('./../settings/db');

exports.debts = (req, res) => {
    try {
        const currentUserId = req.body.userId;
        // const selectFromUsers = "SELECT `ID`, `event`, `totalSum`, `Users_ID` FROM `events` WHERE `Users_ID` = '" + currentUserId + "'";
        const selectFromLoans = "SELECT `ID`, `loanName`, `firstPerson`, `secondPerson`, `total`, `Users_ID`, `secondPersonID` FROM `loans` WHERE `Users_ID` = '" +
            currentUserId + "' OR `secondPersonID` = '" + currentUserId + "'";
        const eventRequest = "SELECT `ID`, `event`, `totalSum`, `Users_ID` FROM `events`"
        l
        db.query(selectFromLoans, (error, loansTableResults) => {
            if (error) {

                response.status(400, { message: 'Вы не можете открыть счёт на своё имя', loansTableResults }, res);
            } else {
                console.log('user', loansTableResults)
                db.query(eventRequest, (error, results) => {
                    if (error) {
                        response.status(400, error, res);
                    } else {
                        console.log('event', results)
                        const event = req.body.event;
                        const totalSum = req.body.totalSum;

                        const sql = "INSERT INTO `events`(`event`, `totalSum`, `Users_ID`) VALUES('" +
                            event + "', '" +
                            totalSum + "', '" +
                            currentUserId + "')";

                        db.query(sql, (error, eventTableResults) => {
                            if (error) {
                                response.status(400, { message: 'Пиздец', error }, res)
                            } else {
                                response.status(200, { message: 'Событие успешно открыто', eventTableResults }, res);
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        response.status(400, error, res);
    }
}