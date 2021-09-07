var express = require('express');
var createError = require('http-errors')
var router = express.Router();

const recipes = require('../models/recipe');
const shoppinglist = require('../models/shoppinglist');

/* GET welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyRecipes' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  recipes.find({}, function (err, docs) {
    if (err){
        console.log(err);
        res.redirect('/'); // we need a better error handler
    }
    else{
        recipess = docs;
    }
  })
  .then(function(response) {
    res.render('home', { title: 'MyRecipes', recipes:response});
  })
  .catch(err => console.log(err));
});

/* GET recipe page. */
router.get('/recipe/:_id', function(req, res) {
  
  var id = req.params._id;

  recipes.findOne({"_id":id}, function (err, docs){
    if (err){
      console.log(err);
      res.redirect('/home'); // we need a better error handler
    }
    else{
        recipe = docs;
    }
  })
  .then(function(response) {
    res.render('recipe', { title: 'Recipe', recipe:response});
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
  GetUserID = 0; //change later

  const insertColumn = new recipes ({
    UserID: GetUserID,
    Title: req.body.Title,
    Description:req.body.Description,
    Ingredients:req.body.Ingredients,
    Method:req.body.Method,
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

router.post('/delete', function(req, res){ //using for delete
  var data = req.body.ToDelete;
  recipes.findByIdAndRemove(data)
    .then(recipes => res.json({ mgs: 'Recipes deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such recipes' }));
});

router.post('/removeshoppinglistitem', function(req, res){ // in progress doesnt work..
  let tempID = "6136cdceadb34168696581a9"; // temp until we get logins
  let Item = {Item: req.body.Item, Quantity: req.body.Quantity}

  shoppinglist.findOneAndUpdate(
    {_id: tempID},
    {$pull:{List:Item}},
    function (error, success) {
      if (error) {
          console.log(error);
          res.redirect('/shoppinglist');
      } else {
          console.log(success);
          res.redirect('/shoppinglist');
      }
  });
})

router.post('/addshoppinglistitem', function(req, res){
  let tempID = "6136cdceadb34168696581a9"; // temp until we get logins
  let Item = {Item: req.body.Item, Quantity: req.body.Quantity}

  shoppinglist.findOneAndUpdate(
    {_id: tempID},
    {$push:{List:Item}},
    function (error, success) {
      if (error) {
          console.log(error);
          res.redirect('/shoppinglist');
      } else {
          console.log(success);
          res.redirect('/shoppinglist');
      }
  });
})

module.exports = router;
