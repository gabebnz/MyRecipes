var express = require('express');
var router = express.Router();

const recipes = require('../models/recipe');

/* GET welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyRecipes' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  recipes.find({}, function (err, docs) {
    if (err){
        console.log(err);
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

module.exports = router;
