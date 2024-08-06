const express = require("express");
const mySqlpool = require("./config/db.js");
const bodyParser = require("body-parser");
var fileuploader = require("express-fileupload");
var cors = require("cors");
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
const path = require("path");
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileuploader());
app.use(express.static("public"));
app.use(cors());

// routes
app.use("/api", require("./routes/offerdataRouter.js"));
app.use("/out", express.static(path.join(__dirname, "../out")));

//hosting port
app.get("/", (req, resp) => {
  resp.sendFile(process.cwd() + "/public/index.htm");
});

const PORT =  process.env.PORT|| 8000;
// backend connection
mySqlpool
  .query("SELECT 1")
  .then(() => {
    console.log("MySql DB Connected");
    app.listen()
  })
  .catch((err) => {
    console.log(err);
  });
