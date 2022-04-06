const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("./db/conn");
const Signup = require("./models/signup");
const async = require("hbs/lib/async");
const Register = require("./models/signup");
const { DEFAULT_ENCODING } = require("crypto");
const Contact = require("./models/contact");
const { resetWatchers } = require("nodemon/lib/monitor/watch");
const auth = require("./middleware/auth");

const port = process.env.PORT || 8080;

// path

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// routing

app.get("/", (req, res) => {
  const paratmers = {
    authFailed: req.query["$authFailed"] ? req.query["$authFailed"] : false,
  };
  console.log(req.query);
  console.log(req.params);
  console.log(paratmers);
  res.render("index", paratmers);
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

app.get("/study", auth, (req, res) => {
  // console.log(`this is cookie ${req.cookies.jwt}`);
  res.render("study");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/logout", auth, async (req, res) => {
  try {
    console.log("in logout");
    console.log(req.user);

    // console.log(req.user.token, req);

    req.user.tokens = req.user.tokens.filter((currElement) => {
      console.log(req.token);
      return currElement.token !== req.token;
    });

    res.clearCookie("jwt");

    console.log("logout successfully");

    await req.user.save();
    res.redirect("/");
  } catch (e) {
    res.status(500);
    res.send(e);
  }
});

// create a new user
app.post("/index", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const registerEmployee = new Register({
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      const token = await registerEmployee.generateAuthToken();
      console.log(token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });

      const register = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      //  res.send("password are not matched")
      alert("Something is wrong!");
    }
  } catch (e) {
    res.status(400);
    console.log(e);
    res.send(e);
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email }).exec();
    console.log("found user");
    console.log(useremail);
    const token = await useremail.generateAuthToken(req, res);
    console.log("here the token part : " + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    if (password === useremail.password) {
      res.redirect("/index");
      //   res.status(201).json({ msg: "wokring fukcing fine" });
    } else {
      res.send("invalid password Details");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send("invaild login Detail");
  }
});

// Contact

app.post("/contact", async (req, res) => {
  try {
    const email = req.body.email;

    console.log(email);

    const user = await Register.findOne({ email: email }).exec();
    console.log(user);
    if (user) {
      const ContactEmployee = new Contact({
        email: req.body.email,
        text: req.body.text,
        check: req.body.check,
      });

      const contact = await ContactEmployee.save();
      if (contact) res.render("submit");
      else
        res
          .status(500)
          .json({ msg: "not able to save the data. server madharchod." });
    } else {
      alert("Something is wrong!");
    }
  } catch (e) {
    res.status(400);
    console.log(e);
    res.send(e);
  }
});

// listen port

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
