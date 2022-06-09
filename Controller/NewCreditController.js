'use strict';

const response = require('./../response');
const db = require('./../settings/db')

exports.newCredit = (req, res) => {
    try {
        const firstPersonId = req.body.firstPerson.id;
        const loans = "SELECT `ID`, `loanName`, `firstPerson`, `secondPerson`, `howMuch`, `reason`, `total`, `Users_ID`, `secondPersonID`, `created_at` FROM `loans` WHERE `Users_ID` = '" +
            firstPersonId + "'";

        db.query(loans, (error, loansStartResults) => {
            if (error) {
                response.status(400, { error: 'Никаких задолженностей нету...', error }, res);
            } else {
                const loanName = req.body.loanName;
                const firstPerson = req.body.firstPerson.name;
                const secondPerson = req.body.secondPerson.name;
                const howMuch = req.body.howMuch;
                const reason = req.body.reason;
                const total = req.body.howMuch;
                const usersId = req.body.firstPerson.id;
                const secondPersonID = req.body.secondPerson.id;

                const credit = "INSERT INTO `loans`(`loanName`, `firstPerson`, `secondPerson`, `howMuch`, `reason`, `total`, `Users_ID`, `secondPersonID`) VALUES('" +
                    loanName + "', '" +
                    firstPerson + "', '" +
                    secondPerson + "', '" +
                    howMuch + "', '" +
                    reason + "', '" +
                    total + "', '" +
                    usersId + "', '" +
                    secondPersonID + "')";

                db.query(credit, (error, loansIntoResults) => {
                    if (error) {
                        response.status(400, { error: 'Произошла ошибка при открытии кредита', error }, res)
                    } else {
                        response.status(200, { success: 'Кредит успешно открыт', loansIntoResults }, res)
                    };
                });
            };
        });
    } catch (error) {
        response.status(400, error, res);
    };
}
