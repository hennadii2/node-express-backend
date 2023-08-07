require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const port= process.env.PORT;

var corsOptions = {
    origin: '*'
  };
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//app.use(bodyParser.json());

/**
 * 
 */
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.json({ message: "Here goes the apis for DIWI app." });
});
require("./app/routes/user.routes.js")(app);
require("./app/routes/friend.routes.js")(app);
require("./app/routes/look.routes.js")(app);
require("./app/routes/media.routes.js")(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});