const mongoose = require("mongoose");

// mongodb://localhost:27017/testdb
mongoose
  .connect(
    "mongodb+srv://admin:czbxAnmuDpjaP71I@cluster0.mzd4o.mongodb.net/QcoderDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connection is stablish");
  })
  .catch((e) => {
    console.log("connection is falied");
  });
