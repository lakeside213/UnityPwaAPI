const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function userToken(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
exports.signin = function(req, res, next) {
  res.send({ token: userToken(req.user) });
};
exports.fetchuser = function(req, res, next) {
  res.send(req.user);
};
exports.signup = function(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(422).send({ error: "please fill in your details fully" });
  }
  //see if user exists
  User.findOne({ email, username }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      res.status(422).send({ error: "email or username already in use" });
    }

    const user = new User({
      username,
      email,
      password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.send({ user, token: userToken(user) });
    });
  });
};
