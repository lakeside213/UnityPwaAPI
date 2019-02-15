const Authentication = require("./controllers/authentication.js");
const passportService = require("./services/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function(app) {
  app.post("/signup", Authentication.signup);
  app.get("/current_user", requireAuth, Authentication.fetchuser);
  app.post("/signin", requireSignin, Authentication.signin);
};
