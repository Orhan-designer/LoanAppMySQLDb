const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3500;
const bodyParser = require("body-parser");
const passport = require("passport");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());
require("./middleware/passport")(passport);

const routes = require("./settings/routes");
routes(app);

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
