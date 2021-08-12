var express = require('express');
var app = express();

app.get('/', function (req,res){
    res.send('This is the home page');
});

app.get('/what', function (req,res){
    res.send('Hello wow');
});

app.listen(3000, function(){
    console.log('MyRecipes app listening on port 3000!');
});