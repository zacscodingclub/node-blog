var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/node-blog');
var multer = require('multer');
var upload = multer({ dest: 'public/images'});

router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  categories.find({}, {}, function(eror, categories) {
    res.render('addpost', {
      title      : 'Add Post',
      categories : categories
    });
  })
});

router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');

  posts.findOne({_id: req.params.id}, {}, function(error, post) {

    res.render('show', {
      'post' : post
    });
  })
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
    res.render('addpost', { 'errors': errors});
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

router.post('/addcomment', function(req, res, next) {
  var postid = req.body.postid;
  var newComment = {};

  req.checkBody('name', 'A name is required').notEmpty();
  req.checkBody('email', 'An email is required, but never displayed.').notEmpty();
  req.checkBody('email', 'Email is not formatted properly.').isEmail();
  req.checkBody('body', 'Please fill out the comment section.').notEmpty();

  var errors = req.validationErrors();
  console.log(errors);
  console.log(postid);
  if(errors) {
    var posts = db.get('posts');
    console.log(postid);

    posts.findOne({_id: postid}, function(error, post) {
      res.render('show', {
        'errors': errors,
        'post'  : post
      })
    });
  } else {
    newComment.name = req.body.name;
    newComment.email = req.body.email;
    newComment.body = req.body.body;
    newComment.date = new Date();

    var posts = db.get('posts');
    posts.update({
      "_id": postid
    }, {
      $push: { "comments": newComment }
    }, function(error, doc) {
      if(error) {
        throw error;
      } else {
        req.flash('success', 'Comment Added');
        res.location('/posts/show/'+req.body.postid);
        res.redirect('/posts/show/'+req.body.postid);
      }
    })
  }
});

module.exports = router;
