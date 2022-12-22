//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const _ = require('lodash');

const connect = process.env.CONNECT;

const homeStartingContent = "Welcome to this mini web application that I created based off of an original project for a blog website. Here I wanted to experiment with databases and being able to log and save data entries on the web so that this could be a fully functional app. I will be documenting my journey as I go through my coding courses and bootcamps to become a marketable web developer! Thanks for visiting!";
const aboutContent = "Well I am a transitioning entrepreneur from manicuring into learning web development full-time! So I’m currently building fun things that I learn from my courses, bootcamps, and YouTube tutorials including this little app that’s built using node, ejs templates, bootstrap, and mongodb. I plan on making the same successful impact as I have in the beauty industry with fun and polished web things! Thanks for reading this tid-bit of info about me as I continue tinkering away into tech!";
const contactContent = "If you’d like to get in touch with me, leave feedback, or anything else my email is codenametam@yahoo.com ❤︎";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(connect, {useUnifiedTopology: true,useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String,
  date: String
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // }
};

const Post = mongoose.model("Post", postSchema);


app.get("/views/home", function(req, res){
  
  Post.find({}, function(err, posts){
    res.render("home", {startingContent: homeStartingContent, posts: posts});
  });
});

app.get("/views/home", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/views/ontact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/views/compose", function(req, res){
  res.render("compose");
});

app.post("/views/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    date: req.body.postDate,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){ //how to tap into new entries to create new pages from them
  const requestedPostId = req.params.postId; //convert the title to lowercase

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      date: post.date,
      content: post.content
    });
  });
});


app.listen(3000, function() {
  console.log("Server has started.");
});


module.exports = app;