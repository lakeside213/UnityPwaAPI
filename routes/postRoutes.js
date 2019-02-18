const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const User = mongoose.model("user");
module.exports = app => {
  app.post("/api/post", requireAuth, async (req, res) => {
    const { title, category, description, tags } = req.body;
    const user = await User.findOne({ _id: new ObjectId(id) });
    const post = new Post({
      title: title,
      category: category,
      description: description,

      _user: user,
      createdAt: Date.now()
    });

    await post.save();
    res.send(post._id);
  });
  app.post("/api/fetch/post", async (req, res) => {
    const { id } = req.body;

    let post = await Post.find({ _id: new ObjectId(id) });

    try {
      post[0].views += 1;

      await post[0].save();
      res.send(post);
    } catch (err) {
      console.log(err);
      res.status(422).send(err);
    }
  });
  app.get("/api/posts", async (req, res) => {
    const posts = await Post.find();

    res.send(posts);
  });

  app.post("/api/fetch/comment", async (req, res) => {
    const { _post } = req.body;
    console.log(_post);
    const comments = await Comment.find({ _post: new ObjectId(_post) });
    console.log(comments);
    res.send(comments);
  });
  app.post("/api/post/comment", requireAuth, async (req, res) => {
    const { _post, description, _responseUser } = req.body;
    if (_responseUser) {
      const comment = await new Comment({
        _responseUser,
        description,
        _post,
        _user: req.user.id,
        createdAt: Date.now()
      });
      try {
        await comment.save();
        const comments = await Comment.find({ _post: new ObjectId(_post) });
        res.send(comments);
      } catch (err) {
        console.log(err);
        res.status(422).send(err);
      }
    } else {
      const comment = await new Comment({
        description,
        _post,
        _user: req.user.id,
        createdAt: Date.now()
      });

      try {
        await comment.save();
        const comments = await Comment.find({ _post: new ObjectId(_post) });
        res.send(comments);
      } catch (err) {
        console.log(err);
        res.status(422).send(err);
      }
    }
  });
  app.post("/api/post/category", async (req, res) => {
    const { query } = req.body;

    const posts = await Post.find({ category: query });

    res.send(posts);
  });
  app.post("/api/post/like", requireAuth, async (req, res) => {
    const { _id } = req.body; //postid

    let post = await Post.find({ likes: new ObjectId(req.user._id) });

    if (post.length) {
      console.log("here");
      try {
        post[0].likes.splice(post[0].likes.indexOf(req.user._id), 1);
        req.user.likes.splice(req.user.likes.indexOf(_id), 1);

        const user = req.user;
        await post[0].save();
        await user.save();
        const data = {
          user,
          post
        };
        res.send(data);
      } catch (err) {
        res.status(422).send(err);
      }
    } else {
      try {
        post = await Post.find({ _id: new ObjectId(_id) });
        post[0].likes.push(req.user._id);

        const user = req.user;
        await post[0].save();

        const data = {
          user,
          post
        };

        res.send(data);
      } catch (err) {
        res.status(422).send(err);
      }
    }
  });
};
