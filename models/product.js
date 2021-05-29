// product model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
   title: String,
   images: [
      {
         url: String,
         filename: String
      }
   ],
   description: String,
   price: Number,
   // links to id of user who created the product
   author: {
      type: Schema.Types.ObjectId,
      ref: "User"
   }
});

module.exports = mongoose.model("Product", ProductSchema);