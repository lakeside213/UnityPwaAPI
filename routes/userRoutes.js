const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const User = mongoose.model("user");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
module.exports = app => {
  app.post("/api/profile", async (req, res) => {
    const { id, feed } = req.body;

    if (feed === "posts") {
      const userProfile = await User.findOne({ _id: new ObjectId(id) }).select({
        password: false
      });
      const items = await Post.find({ _user: new ObjectId(id) });
      const data = { items, userProfile };

      try {
        res.send(data);
      } catch (err) {
        res.status(422).send(err);
      }
    } else if (feed === "activity") {
      const userProfile = await User.findOne({ _id: new ObjectId(id) }).select({
        password: false
      });
      const comments = await Comment.find({ _user: new ObjectId(id) });
      const likes = await Post.find({ likes: new ObjectId(id) });

      const items = comments.concat(likes);
      const data = { items, userProfile };

      try {
        res.send(data);
      } catch (err) {
        res.status(422).send(err);
      }
    }
  });
  app.post("/api/user", async (req, res) => {
    const { id } = req.body;
    console.log(id);
    const user = await User.findOne({ _id: new ObjectId(id) }).select({
      email: false,
      password: false
    });
    const username = user.username;
    const postsLength = await Post.find({ _user: new ObjectId(id) }).count();
    const commentsLength = await Comment.find({
      _user: new ObjectId(id)
    }).count();
    const joined = ObjectId(id).getTimestamp();
    const data = {
      _id: user._id,
      username,
      postsLength,
      commentsLength,
      joined
    };

    try {
      res.send(data);
    } catch (err) {
      res.status(422).send(err);
    }
  });
  app.post("/api/user/bookmark", requireAuth, async (req, res) => {
    const { _post } = req.body;

    let user = await User.findOne({ _id: new ObjectId(req.user._id) }).select({
      password: false
    });

    if (user.bookmarks.map(bookmark => bookmark.toString()).includes(_post)) {
      user.bookmarks.splice(user.bookmarks.indexOf(_post), 1);
    } else {
      user.bookmarks.push(_post);
    }

    try {
      await user.save();

      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(422).send(err);
    }
  });

  // app.get("/posts", async (req, res) => {
  //   const surveys = await Post.find().toArray();
  //   console.log(surveys);
  //   res.send(surveys);
  // });
};
