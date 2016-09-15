var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/node-blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function(error, posts) {
    res.render('index', { posts: posts });
  });
});

module.exports = router;
