"use strict";

module.exports = (app) => {
  const passport = require("passport");
  const usersController = require("./../Controller/UsersController");
  const postsController = require("./../Controller/PostsController");
  const addNewFriendController = require("./../Controller/AddNewFriendController");
  // const friendsIdController = require("./../Controller/FriendsIdController");
  const friendsTable = require("./../Controller/FriendsTableController");

  app.route("/api/register").post(usersController.register);
  app.route("/api/add-new-friend").post(addNewFriendController.addNewFriend);
  // app.route("/api/friends/:id").post(friendsIdController.searchFriendById);
  app.route("/api/friends").post(friendsTable.friends);
  app.route("/api/login").post(usersController.login);
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
