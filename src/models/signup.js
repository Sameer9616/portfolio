const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

const employeeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  check: {
    type: Boolean,
    require: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating token
employeeSchema.methods.generateAuthToken = async function (req, res) {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJK"
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log("the error " + error);
    return res.send("the err " + error);
  }
};

// we create collection
const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
