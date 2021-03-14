/** @format */

const express = require("express");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./database/Schema");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://Admin-Karthik:qwerty12@cluster0.semtp.mongodb.net/userjwt",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);
let items = [
  {
    email: "kk968346@gmail.com",
    value: "d",
  },
  {
    email: "kk968347@gmail.com",
    value: "d2",
  },
];
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/home", checkToken, function (req, res) {
  const value = items.filter((item) => {
    return item.email === req.user.email;
  });
  res.send(value);
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = jwt.sign({ email: user.email }, "secrect");
    if (typeof localStorage === "undefined" || localStorage === null) {
      var LocalStorage = require("node-localstorage").LocalStorage;
      localStorage = new LocalStorage("./scratch");
    }

    localStorage.setItem("myFirstKey", token);

    res.redirect("/home");
  } else {
    console.log("user not found");
  }
});

app.get("/logout", checkToken, async (req, res) => {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }
  localStorage.removeItem("keyName");
  localStorage.clear();
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return console.log("email exists");

  const token = jwt.sign({ email }, "secrect");

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }

  localStorage.setItem("myFirstKey", token);

  try {
    const user = new User({
      email: email,
      password: password,
      tokens: token,
    });
    user
      .save()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
});

function checkToken(req, res, next) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
  }

  const token = localStorage.getItem("myFirstKey");
  console.log(token);
  jwt.verify(token, "secrect", (err, result) => {
    if (err) res.redirect("/");
    else {
      req.user = result;
      next();
    }
  });
}

app.listen(3000, function () {
  console.log("server is running");
});
