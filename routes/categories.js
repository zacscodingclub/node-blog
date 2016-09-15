var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/node-blog');

router.get('/add', function(req, res, next) {
  res.render('addcategory', { title: 'Add Category'} );
});

router.post('/add', function(req, res, next) {
  req.checkBody('name', 'Name field is required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    res.render('addcategory', {'errors': errors} );
  } else {
    var categories = db.get('categories');

    categories.insert( { 'name': req.body.name }, function(error, category) {
      if(error) {
        res.send(error);
      } else {
        req.flash('success', 'Category added.');
        res.location('/');
        res.redirect('/');
      }
    });
  }
})

module.exports = router;
