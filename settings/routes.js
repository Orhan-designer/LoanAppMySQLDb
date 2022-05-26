"use strict";

module.exports = (app) => {
  const passport = require("passport");
  const postsController = require("./../Controller/PostsController");
  const usersController = require("./../Controller/UsersController");
  const addNewFriendController = require("./../Controller/AddNewFriendController");
  const friendsIdController = require("./../Controller/FriendsIdController");
  const usersListController = require('./../Controller/UsersListController')

  app.route("/api/auth/signup").post(usersController.signUp);
  app.route("/api/auth/signin").post(usersController.signIn);
  app.route("/api/add-new-friend").post(addNewFriendController.addNewFriend);
  app.route("/api/friends/:id").post(friendsIdController.searchFriendById);

  app.route('/api/users').get(usersListController.users)
  app.route('/api/users/list').get(usersListController.usersList)
  app
    .route("/api/users")
    .get(
      passport.authenticate("jwt", { session: false }),
      usersController.getAllUsers
    );
  app
    .route("/api/posts")
    .get(
      passport.authenticate("jwt", { session: false }),
      postsController.getPosts
    );
};
