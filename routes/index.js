var express = require('express');
var createError = require('http-errors')
var router = express.Router();

const recipes = require('../models/recipe');
const shoppinglist = require('../models/shoppinglist');

//Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '568232610264-cd4mdts6cc7160ollui9efmk0dpihcjo.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

/* GET welcome page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyRecipes' });
});

/* GET home page. */
router.get('/home', checkAuthenticated, function(req, res, next) {
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
router.get('/recipe/:_id', checkAuthenticated, function(req, res) {
  
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
router.get('/mealplanner', checkAuthenticated, function(req, res, next) {
  res.render('mealplanner', { title: 'Meal Planner' });
});

/* GET shoppinglist page. */
router.get('/shoppinglist', checkAuthenticated, function(req, res, next) {
  res.render('shoppinglist', { title: 'Shopping List' });
});

/* GET shoppinglist page. */
router.get('/insertRecipes', checkAuthenticated, function(req, res, next) {
  res.render('insertRecipes', { title: 'Insert Recipes' });
});

router.get('/logout', function(req, res){
  res.clearCookie('session-token');
  res.redirect('/');
})

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
    Label1:req.body.Label1,
    Label2:req.body.Label2,
    Label3:req.body.Label3,
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

//remove labels by updating them their values to "" or null
router.post('/deletelabel', function(req, res){
  console.log(req.body.labelId);
  var data = req.body.labelId;
  var query = {};
  query[""+ data] = " ";
  recipes.update(
    {_id: req.body.recipeId},
    {"$unset":query},
    function (error, success) {
      if (error) {
          console.log(error);
          res.redirect(req.get('referer'));
      } else {
          console.log(success);
          res.redirect(req.get('referer'));
      }
  });
});

// Updated delete function to only delete one item from list.
router.post('/removeshoppinglistitem', function(req, res){ //using for delete
  shoppinglist.update(
    {_id: req.body.id},
    {"$pull":{Label1 }},
    function (error, success) {
      if (error) {
          console.log(error);
          res.redirect('/shoppinglist');
      } else {
          console.log(success);
          res.redirect('/shoppinglist');
      }
  });
});

//recieves the Google ID token from the frontend and verifies it
router.post('/login', function(req, res){
  let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);
})

//checks whether the user is logged in and gets user information
function checkAuthenticated(req, res, next){
  let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.id = payload.sub;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/')// redirects to login page if not logged in
      })
}

module.exports = router;
