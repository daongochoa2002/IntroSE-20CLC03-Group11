const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();

router.route("/signup")
    .get(function (req, res) {
        res.sendFile(path.join(__dirname, "../client/sign_up.html"));
    })
    .post(async function (req, res) {
        try {
            const newUser = new UserData({
                email: req.body.email,
                password: req.body.password,
                age: req.body.age,
                role: req.body.role,
                userIdInHospital: req.body.userIdInHospital
            })
            await newUser.save();
            res.render("/login");
        }catch (e){
            console.log(e);
        }
    })

router.route("/login")
    .get( function (req, res) {
        res.sendFile(path.join(__dirname, "../client/login.html"));
    })
    .post(async function (req, res){
        res.clearCookie("Authorization")
    })

module.exports = router;