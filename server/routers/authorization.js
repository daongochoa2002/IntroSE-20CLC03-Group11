const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();

router.route("/signup")
    .post(async function (req, res) {
        const newUser = new UserData({

        })
    })

router.route("/login")
    .get(async function (req, res) {
        res.sendFile(path.join(__dirname, "../client/login.html"));
    })

module.exports = router;