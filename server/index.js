const {PORT} = require("./constants")
const express = require("express");
const homeRouter = require("./routers/home");
const authorizationRouter = require("./routers/authorization")
const app = express();
const hbs = require("hbs");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const publicPath = path.join(__dirname, "client"); // link to css/img
const viewsPath = path.join(__dirname, "client"); //link to views (HTML/HBS/ejs)
// const PartialPath = path.join(__dirname, "templates/partials");

app.set("views", viewsPath);
app.set("view engine", "hbs");
// hbs.registerPartials(PartialPath); ///Header and Footer register

app.use(express.static(publicPath));
app.use(express.json()); // every object automatically turn into JSON formatted

app.listen(PORT, function () {
    console.log("Server start port: " + PORT);
})

app.use(homeRouter);
app.use(authorizationRouter);