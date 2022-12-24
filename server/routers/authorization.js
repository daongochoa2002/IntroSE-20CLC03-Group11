const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();
const auth = require("../middleware/identification");

router.route("/signup")
    .get(function (req, res) {
        res.render("sign_up", {role: null});
    })
    .post(async function (req, res) {
        try {
            console.log("signup " + JSON.stringify(req.body))
            let date = null;
            if(req.body.dateOfBirth){
                const dateParts = req.body.dateOfBirth.split("-");
                date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            }
            const newUser = new UserData({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role,
                gender: req.body.gender,
                dateOfBirth: date,
                phoneNumber: req.body.phoneNumber,
                userIdInHospital: req.body.userIdInHospital
            })
            await newUser.save();
            res.render("login", {role: null});
        }catch (e){
            console.log(e);
        }
    })

router.route("/login")
    .get(function (req, res) {
        res.render("login", {role: null});
    })
    .post(async function (req, res){
        //todo update remember me
        res.clearCookie("Authorization");
        console.log("login req = " + JSON.stringify(req.body))
        const user = await UserData.findByCredential(req.body.email, req.body.password);
        if(user){
            console.log("user info " + JSON.stringify(user))
            const token = await user.createToken();
            res.cookie("Authorization", token);
            return res.redirect("/");
        }
        else {
            res.render("login", {alertTxt: "Wrong email or password", role: null})
        }
    });

router.route("/logout")
    .get(function (req, res) {
        res.cookie("Authorization", "");
        res.redirect("/login");
    })

module.exports = router;
