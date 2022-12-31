require("./database/mongoose")
const {PORT} = require("./constants")
const express = require("express");
const homeRouter = require("./routers/home");
const authorizationRouter = require("./routers/authorization");
const infoRouter = require("./routers/info");
const articleRouter = require("./routers/articles");
const drugRouter = require("./routers/drugs");
const appointmentRouter = require("./routers/appointment");
const adminRouter = require("./routers/admin");
const prescriptionRouter = require("./routers/prescription");
const bloodPressureRouter = require("./routers/blood_pressure");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const {runConfig} = require("./config/config")
const {crawlDrugAPI} = require("./utils/index")


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'))

const publicPath = path.join(__dirname, "views/"); // link to css/img
const viewsPath = path.join(__dirname, "views/"); //link to views (HTML/HBS/ejs)

app.set("views", viewsPath);
app.set("view engine", "ejs");

app.use(express.static(publicPath));
app.use(express.json()); // every object automatically turn into JSON formatted

app.listen(PORT, async function () {
    await runConfig();
    await crawlDrugAPI(false);
    console.log("Server start port: " + PORT);
})

app.use( express.static( "public" ) );
app.use(homeRouter);
app.use(authorizationRouter);
app.use(infoRouter);
app.use(articleRouter);
app.use(appointmentRouter);
app.use(drugRouter);
app.use(adminRouter);
app.use(prescriptionRouter);
app.use(bloodPressureRouter);
