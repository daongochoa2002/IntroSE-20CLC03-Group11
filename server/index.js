const {PORT} = require("./constants")
const express = require("express");
const homeRouter = require("./routers/home");
const authorizationRouter = require("./routers/authorization")
const app = express();

app.listen(PORT, function () {
    console.log("Server start port: " + PORT);
})

app.use(homeRouter);
app.use(authorizationRouter);