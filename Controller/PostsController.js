"use strict";

const response = require("./../response");
/* 
TODO: Test controller return posts, need create db table and sql request
@param {*} req
@param {*} res
*/
exports.getPosts = (req, res) => {
  const posts = [
    {
      id: 1,
      title: "Post title 1",
      description: "Description post",
      author_id: 6,
    },
    {
      id: 2,
      title: "Post title 2",
      description: "Description post",
      author_id: 5,
    },
    {
      id: 3,
      title: "Post title 3",
      description: "Description post",
      author_id: 4,
    },
  ];
  response.status(200, posts, res);
};
