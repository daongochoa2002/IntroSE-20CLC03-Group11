require("./database/mongoose")
const {PORT} = require("./constants")
const express = require("express");
const homeRouter = require("./routers/home");
const authorizationRouter = require("./routers/authorization");
const infoRouter = require("./routers/info");
const articleRouter = require("./routers/articles");
const app = express();
const hbs = require("hbs");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'))

const publicPath = path.join(__dirname, "views/"); // link to css/img
const viewsPath = path.join(__dirname, "views/"); //link to views (HTML/HBS/ejs)
// const PartialPath = path.join(__dirname, "templates/partials");

app.set("views", viewsPath);
// app.set("view engine", "hbs");
app.set("view engine", "ejs");
// hbs.registerPartials(PartialPath); ///Header and Footer register

app.use(express.static(publicPath));
app.use(express.json()); // every object automatically turn into JSON formatted

app.listen(PORT, function () {
    console.log("Server start port: " + PORT);
})

app.use(homeRouter);
app.use(authorizationRouter);
app.use(infoRouter);
app.use(articleRouter)