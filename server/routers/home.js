const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const auth = require("../middleware/identifycation");
const router = new express.Router();
router.route("/")
    .get(async function (req, res) {
        res.render("home_guest");
    })

router.route("/home_doctor")
    .get(async function (req, res) {
        res.render("home_doctor");
    })

router.route("/home_patient")
    .get(async function (req, res) {
        res.render("home_patient");
    })

module.exports = router;