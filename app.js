//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  username = req.body.username;
  password = req.body.password;

  User.findOne({ userName: username }, function (err, foundOne) {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        if (foundOne.password === password) {
          res.render("secrets");
        } else {
          console.log("Doesn't find!");
        }
      }
    }
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  username = req.body.username;
  password = req.body.password;

  const newUser = new User({
    userName: username,
    password: password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.listen(3000, () => console.log("Server is running!"));
