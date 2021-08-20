var express = require('express');
var router = express.Router();
const Column = require('../models/Column');

/* GET welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyRecipes' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'MyRecipes' });
});

/* GET mealplanner page. */
router.get('/mealplanner', function(req, res, next) {
  res.render('mealplanner', { title: 'Meal Planner' });
});

/* GET shoppinglist page. */
router.get('/shoppinglist', function(req, res, next) {
  res.render('shoppinglist', { title: 'Shopping List' });
});

/* GET shoppinglist page. */
router.get('/insertRecipes', function(req, res, next) {
  res.render('insertRecipes', { title: 'Insert Recipes' });
});

router.post('/insertRecipes', function(req, res){ //using for insert later
  console.log('MyRecipes');
});

router.post('/', function(req, res){ //using for insert later
  const insertColumn = new Column ({
    Title: req.body.Title,
    Description:req.body.Description,
    URL:req.body.URL,
    Comments:req.body.Comments,
  })
  insertColumn.save(function (error, document) {
    if (error) {
        console.error(error)}
    else{
        console.log('You have saved the recipes!'); //change to alert later
        res.redirect('/home');
        console.log(document)}
  })
});

module.exports = router;
