const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  username: { type: String, unique: true, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  ],
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bookmark"
    }
  ],
  password: String
});

userSchema.pre("save", function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

const model = mongoose.model("user", userSchema);

module.exports = model;
