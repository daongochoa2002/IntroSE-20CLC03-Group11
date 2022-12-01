const express = require("express");
const UserData = require("./../models/user");
const router = new express.Router();
router.route("/")
    .get(async function (req, res) {
        res.render('home/home_guest')
    })

router.route("/home_doctor")
    .get(async function (req, res) {
        res.render('home/home_doctor')
    })

router.route("/home_patient")
    .get(async function (req, res) {
        res.render('home/home_patient')
    })

    

module.exports = router;