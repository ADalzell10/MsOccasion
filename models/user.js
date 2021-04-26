//mongoose schema for information the user
//use of passport to hash and store passwords securely

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
   email: {
       type: String,
       required: true,
       unique: true
   }
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);