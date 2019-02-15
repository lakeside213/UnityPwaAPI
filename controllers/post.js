const mongoose = require("mongoose");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

const Post = mongoose.model("Post");

module.exports = app => {
  app.get("/posts", requireAuth, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    console.log(surveys);
    res.send(surveys);
  });

  app.post("/api/surveys", requireLogin, checkCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title: title,
      subject: subject,
      body: body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: keys.email,
        pass: keys.password
      }
    });

    const mailOptions = {
      from: survey.title,
      to: survey.recipients,
      subject: survey.subject,
      html: surveyTemplate(survey)
    };

    try {
      await transporter.sendMail(mailOptions);
      /*
      await mailer.send();
      */

      await survey.save();

      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
