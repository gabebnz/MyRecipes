var express = require('express');
var router = express.Router();
const Column = require('../models/Column');

/* GET welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyRecipes' });
});

/* GET home page. */
// router.get('/home', function(req, res, next) {
//   res.render('home', { title: 'MyRecipes' });
// });

router.get('/home', function(req, res, next) {
  Column.find({}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        column = docs;
        //console.log(column);
    }
  })
  .then(function(response) { 
    column => res.json(response);
    res.render('home', { title: 'MyRecipes' });
  })
  .catch(err => console.log(err));
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

router.post('/insertRecipes', function(req, res){ //may remove
  console.log('MyRecipes');
});

router.post('/', function(req, res){ //using for insert
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
        console.log(document);
        res.redirect('/home');
      }
  })
});

module.exports = router;
