'use strict';

const response = require('./../response');
const db = require('./../settings/db');

exports.repay = (req, res) => {
    const id = req.body.id; //это id самого кредита
    const sum = req.body.sum; //это введённое в repay сумма возврата денег
    const sql = "SELECT `ID`, `loanName`, `firstPerson`, `secondPerson`, `howMuch`, `reason`, `total`, `Users_ID`, `secondPersonID` FROM `loans` WHERE `ID` = '" + id + "'";

    db.query(sql, (error, loansResults) => {
        if (error) {
            console.log(error)
            response.status(400, error, res)
        } else {
            let result = +loansResults[0].total + Number(sum); //Sum изменяться не будет, total будет вычитаться, а в history будет попадать история выплат 
            const updateTotal = "UPDATE `loans` SET `total` = '" + result + "' WHERE `ID` = '" + loansResults[0].ID + "'";

            db.query(updateTotal, (error, totalResults) => {
                if (error) {
                    console.log(error)
                    response.status(400, error, res);
                } else {
                    const repay = "INSERT INTO `history`(`sum`, `Loans_ID`) VALUES('" + sum + "', '" + id + "')";

                    db.query(repay, (error, repayResults) => {
                        if (error) {
                            console.log(error);
                            response.status(400, error, res)
                        } else {
                            response.status(200, { success: `На ваш счёт зачислено ${sum}$`, repayResults }, res)
                        }
                    })
                }
            })
        }
    })
}
