"use strict";

module.exports = (app) => {
  const passport = require("passport");
  const usersController = require("./../Controller/UsersController");
  const postsController = require("./../Controller/PostsController");
  const addNewFriendController = require("./../Controller/AddNewFriendController");
  const friendsIdController = require("./../Controller/FriendsIdController");

  app.route("/api/register").post(usersController.register);
  app.route("/add-new-friend").post(addNewFriendController.addNewFriend);
  app.route("/friends/:id").post(friendsIdController.searchFriendById);

  app.route("/login").get(usersController.login);
  app
    .route("/users")
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