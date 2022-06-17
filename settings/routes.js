"use strict";

module.exports = (app) => {
  const passport = require("passport");
  const usersController = require("./../Controller/UsersController");
  const addNewFriendController = require("./../Controller/AddNewFriendController");
  const friendsIdController = require("./../Controller/FriendsIdController");
  const usersListController = require('./../Controller/UsersListController')
  const loansController = require('./../Controller/LoansController')
  const newCreditController = require('./../Controller/NewCreditController')
  const repayController = require('./../Controller/RepayController')
  const accountingGroupDebtsController = require('./../Controller/AccountingGroupDebtsController')

  app.route("/api/auth/signup").post(usersController.signUp);
  app.route("/api/auth/signin").post(usersController.signIn);
  app.route("/api/add-new-friend").post(addNewFriendController.addNewFriend);
  app.route("/api/friends/:id").post(friendsIdController.searchFriendById);
  app.route('/api/new-credit').post(newCreditController.newCredit);
  app.route('/api/repay').post(repayController.repay);
  app.route('/api/accounting-group-debts').post(accountingGroupDebtsController.debts);

  app.route('/api/loans/:id').get(loansController.loansById);
  app.route('/api/users/list').get(usersListController.usersList)
  app
    .route("/api/users")
    .get(
      passport.authenticate("jwt", { session: false }),
      usersListController.getAllUsers
    );
};
