'use strict';

const response = require('./../response');
const db = require('./../settings/db');

exports.loansById = (req, res) => {
    try {
        const id = req.params.id; //id пользователя
        const userId = req.query.id; //id друзей
        const loan = "SELECT `ID`, `loanName`, `firstPerson`, `secondPerson`, `howMuch`, `reason`, `total`, `Users_ID`, `secondPersonID`, `created_at` FROM `loans` WHERE `Users_ID` = '" +
            id + "' OR `secondPersonID` = '" + id + "'";
        const history = "SELECT `ID`, `sum`, `Loans_ID` FROM `history`";

        db.query(loan, (error, loanResults) => {
            if (error) {
                response.status(400, error, res);
            } else {
                let data; //будет использоваться в query запросе

                db.query(history, (error, historyResults) => {
                    if (error) {
                        response.status(400, { error: 'Произошла ошибка', error }, res);
                    } else {
                        data = historyResults; //передаются данные из таблицы history

                        let newResults = loanResults.map((el1) => {
                            let result = data.filter(el => el.ID).map(el => el.sum); //el.sum - это наша history

                            return { ...el1, history: result }; //выводится результат в history на фронте
                        });

                        response.status(200, {
                            success: 'Пользователь найден...', results: userId ?
                                newResults.filter(el => el.secondPersonID === Number(userId)) : newResults
                        }, res);
                    };
                });
            };
        });
    } catch (error) {
        response.status(400, error, res);
    };
};