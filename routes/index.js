var express = require('express');
var createError = require('http-errors')
var router = express.Router();

const recipes = require('../models/recipe');
const shoppinglist = require('../models/shoppinglist');

//Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '568232610264-cd4mdts6cc7160ollui9efmk0dpihcjo.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

//for search recipes
var SavePostSearchResult;

/* GET welcome page. */
router.get('/', getUser, function(req, res, next) {

  // if user is logged in, they get taken to home page.
  if(req.user != null){
    res.redirect('/home');
  }

  res.render('index', { title: 'MyRecipes' });
});

/* GET home page. */
router.get('/home', checkAuthenticated, function(req, res, next) {
  recipes.find({"UserID":req.user.id}, function (err, docs) {
    if (err){
        console.log(err);
        res.redirect('/'); // we need a better error handler
    }
    else{
        recipess = docs;
    }
  })
  .then(function(response) {
    res.render('home', { title: 'MyRecipes', recipes:response, user:req.user});
  })
  .catch(err => console.log(err));
});

/* GET recipe page. */
// We dont have to check authentication for this page as non logged in users 
// should be able to view these pages.
router.get('/recipe/:_id', getUser, function(req, res) {

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
    res.render('recipe', { title: 'Recipe', recipe:response, user:req.user});
  })
  .catch(err => console.log(err));
});

 
/* GET mealplanner page. */
router.get('/mealplanner', checkAuthenticated, function(req, res, next) {
  res.render('mealplanner', { title: 'Meal Planner' });
});

/* GET shoppinglist page. */
router.get('/shoppinglist', checkAuthenticated, function(req, res, next) {

  shoppinglist.findOne({"UserID":req.user.id}, function (err, docs){
    if (err){
      console.log(err);
      res.redirect('/home'); // we need a better error handler
    }})
  .then(function(response) {
    console.log(response)
    res.render('shoppinglist', { title: 'Shopping List', shoppinglist:response, user:req.user});
  })
  .catch(err => console.log(err));

});

/* GET insert page. */
router.get('/insertRecipes', checkAuthenticated, function(req, res, next) {
  res.render('insertRecipes', { title: 'Insert Recipes' });
});

/* GET search page. */
router.get('/searchRecipes', checkAuthenticated, function(req, res, next) {
  res.render('searchRecipes', { title: 'Search Recipes' });
});

/* GET search result page. */
router.get('/searchResult', checkAuthenticated, function(req, res, next) {
  recipes.find({ Title: new RegExp(SavePostSearchResult, "i")}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        if (docs.length === 0) {
          res.render('searchResult', { title: 'Search Result'});
        }
        else {
          res.render('searchResult', { title: 'Search Result', recipes:docs});
        }
    }
  })
});

/* GET update receipes page. */
router.get('/updateRecipes/:_id', checkAuthenticated, function(req, res, next) {
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
    res.render('updateRecipes', { title: 'Update Recipes', recipe:response, user:req.user});
  })
  .catch(err => console.log(err));
});

router.get('/logout', function(req, res){
  res.clearCookie('session-token');
  res.redirect('/');
})

router.post('/insertRecipes', function(req, res){ //may remove
  console.log('MyRecipes');
});

router.post('/addrecipe', checkAuthenticated, function(req, res){ //using for insert
  const insertColumn = new recipes ({
    UserID: req.user.id,
    UserName:req.user.name,
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
        res.redirect('/home');
      }
  })
});

router.post('/searchRecipes', function(req, res){ //using for search
  var searchValue = req.body.Title;
  SavePostSearchResult = searchValue;
  res.redirect('/searchResult'); //post to result with data(SavePostSearchResult)
});

router.post('/updateRecipes/:_id', checkAuthenticated, function(req, res){ //using for update
  recipes.findByIdAndUpdate(req.params._id, req.body, function (err, docs){
    if (err){
      console.log(err);
      res.redirect('/home'); // we need a better error handler
    }
    else{
        recipe = docs;
    }
  })
  .then(function(response) {
    res.redirect('/recipe/'+req.params._id);
  })
  .catch(err =>
    res.status(400).json({ error: 'Unable to update recipes' })
  );
});

router.post('/delete', function(req, res){ //using for delete
  var data = req.body.ToDelete;
  recipes.findByIdAndRemove(data)
    .then(recipes => res.json({ mgs: 'Recipes deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such recipes' }));
});

router.post('/removeshoppinglistitem', function(req, res){ //using for delete
  console.log(req.body);
  var data = req.body.ToDelete;
  shoppinglist.findByIdAndRemove(data)
    .then(shoppinglist => res.json({ mgs: 'Item deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such Item in Shopping List' }));
});
// N O T  W O R K I N G
// router.post('/delete', function(req, res, next){  
//   var id = req.body.id;
//   mongo.connect(url,function(err, db){
//     assert.equal(null, err);
//     db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err,result) {
//       assert.equal(null, err);
//       console.log('Item deleted');
//       db.close();
//     });
//   });
// });

// router.post('/removeshoppinglistitem', function(req, res){ // in progress doesnt work..
//   let tempID = "6136cdceadb34168696581a9"; // temp until we get logins
//   let Item = {Item: req.body.Item, Quantity: req.body.Quantity}

//   shoppinglist.findOneAndUpdate(
//     {_id: tempID},
//     {$pull:{List:Item}},
//     function (error, success) {
//       if (error) {
//           console.log(error);
//           res.redirect('/shoppinglist');
//       } else {
//           console.log(success);
//           res.redirect('/shoppinglist');
//       }
//   });
// })

router.post('/addshoppinglistitem', checkAuthenticated, function(req, res){
  let Item = {Item: req.body.Item, Quantity: req.body.Quantity}

  shoppinglist.findOneAndUpdate(
    {UserID: req.user.id},
    {$push:{List:Item}},
    {upsert: true}, // this boolean checks if the object exists, if not, creates it
    function (error, success) {
      if (error) {
          console.log("error");
          res.redirect('/shoppinglist');
      } else {
          console.log("success");
          res.redirect('/shoppinglist');
      }
  });

})

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

//dupe function that doesnt redirect (for recipe page) theres surely a better way to do this
// use this when you want to get the user information, but dont want to redirect if they arent logged in
function getUser(req, res, next){
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
          console.log("Viewing, but not logged in")
          next();
      })
}

module.exports = router;
