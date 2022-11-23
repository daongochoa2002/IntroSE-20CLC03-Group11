const express = require("express");
import {PORT} from "./constants";
const app = express();

app.listen(PORT, () => {
    console.log("Server start port: " + PORT);
})