const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
require("./models/user");
require("./models/post");
require("./models/comment");
const cors = require("cors");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/unity",
  {
    useNewUrlParser: true
  }
);
mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
});
mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});
app.use(bodyParser.json({ type: "*/*" }));

app.use(cors());
router(app);
require("./routes/postRoutes")(app);
require("./routes/userRoutes")(app);
const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
console.log("PORT", port);
