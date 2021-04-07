// product model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: String,
    description: String,
    price: String
});

module.exports = mongoose.model("Product", ProductSchema);