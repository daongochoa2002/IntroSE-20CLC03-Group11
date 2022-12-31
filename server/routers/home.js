const express = require("express");
const UserData = require("../database/models/user");
const auth = require("../middleware/identification");
const router = new express.Router();
router
    .get("/", auth, async function (req, res) {
        console.log(req)
        res.render("home/index", {role: req.role})
    })

module.exports = router;