//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const session = require("express-session");
const passportLocalSession = require("passport-local-mongoose");
const app = express();

app.use(express.static("public"));
//ejs
app.set('view engine', 'ejs');
//body-parser
app.use(bodyParser.urlencoded({
  extended: true
}))
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true
});
// first created a simple schema and later implimented the new mwthod to create a new model of schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);
//Using the mongoose encryption
//mongo schema for field data

const postSchema = mongoose.Schema({
  fullName: { type: String, required: false, set: a => a === '' ? undefined : a},
  fieldEmail: { type: String, required: false, set: b => b === '' ? undefined : b},
  phNo: { type: String, required: false, set: c => c === '' ? undefined : c},
  state: { type: String, required: false, set: d => d === '' ? undefined : d},
  zip : { type: String, required: false, set: e => e === '' ? undefined : e},
  address: { type: String, required: false, set: e => e === '' ? undefined : e},
  cropName: { type: String, required: false, set: f => f === '' ? undefined : f},
  cropregion: { type: String, required: false, set: g => g === '' ? undefined : g},
  cropQuantity:{ type: String, required: false, set: h => h === '' ? undefined : h},
});

const Post = mongoose.model("Post", postSchema);






app.get("/", function(req, res) {

  res.render("home");

});
app.get("/login", function(req, res) {

  res.render("login");

});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/main", function(req, res) {

  res.render("main");
})
app.get("/aboutus", function(req, res) {

  res.render("aboutus");
});
app.get("/logout", function(req, res) {

  res.render("home");
});
app.get("/submit", function(req, res) {

  res.render("compose");
})
app.get("/compose", function(req, res) {
  res.render("compose");
});
app.get("/contactus",function(req,res){
  res.render("contactus");
});


app.get("/search" , function(req,res){

    res.render("search");
});



app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("main");
      }
    });
  });

});

app.post("/login", function(req, res) {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("main");
          }
        });

      } else {
        console.log("Password Not Correct");
      }
    }



  });

});




app.post("/compose",function(req,res){

    const post = new Post({
      fullName: req.body.fullName,
      fieldEmail: req.body.fieldEmail,
      phNo: req.body.phnno,
      state: req.body.state,
      zip :req.body.pincode,
      address:req.body.address,
      cropName:req.body.cropName,
      cropregion:req.body.cropregion,
      cropQuantity:req.body.cropQuantity

    });
    post.save();
    res.redirect('/main');
});


app.post("/search",function(req,res){

  const cropname = req.body.cropName;
  const regionarea = req.body.region;

  Post.find({
    cropName: cropname,
    cropregion : regionarea
  }, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {

      if(Object.keys(foundPost).length>0){

        res.render("sucess" ,{users:foundPost});
      }
      else{
        res.render("failure");
      }

      }
    });

});

app.listen(3000, function() {
  console.log("Server started on Port 3000");
})
