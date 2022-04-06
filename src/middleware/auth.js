const jwt = require("jsonwebtoken");

const Register = require("../models/signup");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(
      token,
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJK"
    );
    console.log(verifyUser);

    const user = await Register.findOne({ _id: verifyUser._id });
    console.log(user.email);

    req.token = token;
    req.user = user;

    next();
  } catch (err) {
    res.redirect(`/?$authFailed=true`);
    // res.status(401).send(err);
  }
};

module.exports = auth;
