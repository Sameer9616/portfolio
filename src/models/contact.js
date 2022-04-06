const mongoose = require("mongoose");

const emplSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  check: {
    type: String,
    require: true,
  },
});

// we create collection
const Contact = new mongoose.model("Contact", emplSchema);

module.exports = Contact;
