// mongoose product model
const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");

module.exports.index = async function (req, res) {
   const products = await Product.find({});
   res.render("products/index", { products });
}

module.exports.newProductForm = function (req, res) {
   res.render("products/newProduct");
}

module.exports.createProduct = async function (req, res) {
   const product = new Product(req.body.product);
   product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
   product.author = req.user._id;
   await product.save();
   req.flash("success", "New Product Added!");
   res.redirect(`/products/${product._id}`);
}

module.exports.showProduct = async function (req, res) {
   const product = await Product.findById(req.params.id);
   if (!product) {
      req.flash("error", "Cannot find the product you are looking for.")
      return res.redirect("/products");
   }
   res.render("products/showProduct", { product });
}

module.exports.editProductForm = async function (req, res) {
   const { id } = req.params;
   const product = await Product.findById(id);
   if (!product) {
      req.flash("error", "Cannot find the product you are looking for.")
      return res.redirect("/products");
   }
   // checks the user id matches that of the person attempting to update product information
   res.render("products/editProduct", { product });
}

module.exports.updateProduct = async function (req, res) {
   const { id } = req.params;
   const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
   const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
   // spreads the images into the array to update those displayed
   product.images.push(...imgs);
   await product.save();
   // selecting the images by filename that match those selected by user to remove from database
   if (req.body.deleteImages) {
      for(let filename of req.body.deleteImages){
         await cloudinary.uploader.destroy(filename);
      }
      await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
   }
   req.flash("success", "Product Updated!");
   res.redirect(`/products/${product._id}`);
}

module.exports.deleteProduct = async function (req, res) {
   const { id } = req.params;
   await Product.findByIdAndDelete(id);
   req.flash("success", "Product Deleted!");
   res.redirect("/products");
}