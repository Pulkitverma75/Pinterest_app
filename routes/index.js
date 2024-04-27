var express = require('express');
const userModel = require('../models/User.models.js');
const postModel = require('../models/posts.models.js')
const passport = require("passport");
var router = express.Router();
const localStrategy = require("passport-local");
const upload = require("./multer.js");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res) {
  res.render("index.ejs")
});

router.get('/login', function (req, res) {
  res.render("login.ejs", { error: req.flash("error") })
});

router.get('/feed', isloggedin, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  const posts = await postModel.find()
  res.render("feed.ejs", { user, posts })
});

router.get('/profile', isloggedin, async function (req, res) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user
    })
    .populate("posts")
  res.render("profile.ejs", { user })
});

router.get('/show/posts', isloggedin, async function (req, res) {
  const user = await userModel
    .findOne({
      username: req.session.passport.user
    })
    .populate("posts")
  res.render("show.ejs", { user })
});

router.get('/add', isloggedin, async function (req, res) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render("add.ejs", { user })
});

router.post('/createpost', isloggedin, upload.single('postimage'), async function (req, res) {
  try {
    const { title, description } = req.body;
    if (!title || !description || !req.file) {
      return res.status(400).send("Title, description, and image are required");
    }

    const user = await userModel.findOne({ username: req.session.passport.user });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const post = await postModel.create({
      title,
      description,
      image: req.file.filename,
      user: user._id
    });

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/fileupload', isloggedin, upload.single('image'), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
})

router.post("/register", (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => { })

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/");
  })
})

function isloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;