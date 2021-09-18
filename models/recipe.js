const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },  
  Ingredients: {
    type: Array
  },
  Method: {
    type: String
  },
  Label1: {
    type: String
  },
  Label2: {
    type: String
  },
  Label3: {
    type: String
  }
},{collection:'recipes'});

module.exports = mongoose.model('recipe', RecipeSchema, 'recipes');