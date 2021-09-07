const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true
  },
  List: {
    type: Array,
    required: true
  }
},{collection:'shoppinglists'});

module.exports = mongoose.model('shoppinglist', ShoppingListSchema, 'shoppinglists');