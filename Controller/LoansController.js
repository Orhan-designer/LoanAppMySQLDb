'use strict'

const response = require('./../response');
const db = require('./../settings/db');

exports.loansById = (req, res) => {
    const id = req.params.id; //id пользователя
    const userId = req.query.id

    const loan = "SELECT `ID`, `loanName`, `firstPerson`, `secondPerson`, `howMuch`, `reason`, `total`, `Users_ID`, `secondPersonID` FROM `loans` WHERE `Users_ID` = '" +
        id + "' OR `secondPersonID` = '" + id + "'";
    const history = "SELECT `ID`, `sum`, `Loans_ID` FROM `history`";

    db.query(loan, (error, results1) => {
        if (error) {
            console.log(error);
            response.status(400, error, res)
        } else {
            let data;

            db.query(history, (error, results) => {
                if (error) {
                    response.status(400, { error: 'Ошибка', error }, res);
                } else {
                    data = results; //передаются данные из таблицы history

                    let newResults = results1.map((el) => {
                        let result = data.filter(el => el.ID).map(el => el.total);

                        return { ...el, history: result };
                    });

                    response.status(200, { success: 'Успех', results: userId ? newResults.filter(el => el.secondPersonID === +userId) : newResults }, res);
                };
            });
        };
    });
};
