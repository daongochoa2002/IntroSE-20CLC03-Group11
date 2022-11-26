const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();
router.route("/")
    .get(async function (req, res) {
        res.sendFile(path.join(__dirname, "../client/home_guest.html"));
    })

router.route("/home_doctor")
    .get(async function (req, res) {
        res.sendFile(path.join(__dirname, "../client/home_doctor.html"));
    })

router.route("/home_patient")
    .get(async function (req, res) {
        res.sendFile(path.join(__dirname, "../client/home_patient.html"));
    })

module.exports = router;