var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/node-blog');
var multer = require('multer');
var upload = multer({ dest: 'uploads/'});

router.get('/add', function(req, res, next) {
  res.render('addpost', { title: 'Add Post'} );
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  var newPost = {};

  if(req.file) {
    newPost.mainimage = req.file.filename;
  } else {
    newPost.mainimage = 'noimage.jpg';
  }

  req.checkBody('title', 'A title is required').notEmpty();
  req.checkBody('body', 'Please fill out the Body section.').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('addpost', { errors: errors});
  } else {
    var posts = db.get('posts');
    newPost.title = req.body.title;
    newPost.category = req.body.category;
    newPost.body = req.body.body;
    newPost.author = req.body.author;
    newPost.date = new Date();

    posts.insert(newPost, function(error, post) {
      if(error) {
        res.send(error);
      } else {
        req.flash('success', 'Your new post was added.');
        res.location('/');
        res.redirect('/');
      }
    });
  }
})
module.exports = router;
