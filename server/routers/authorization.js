const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();
const auth = require("../middleware/identification");
const {showError} = require("../utils");

router.route("/signup")
    .get(function (req, res) {
        res.render("sign_up", {role: null});
    })
    .post(async function (req, res) {
        try {
            console.log("signup " + JSON.stringify(req.body))
            const email = req.body.email;
            const isEmailExist = await UserData.findOne({email: email});
            if(isEmailExist){
                showError(res, "Email already exists", "/signup");
                return;
            }
            let date = null;
            if(req.body.dateOfBirth){
                const dateParts = req.body.dateOfBirth.split("-");
                date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                if(Date.now() < date.getTime()){
                    showError(res, "Wrong date of birth", "/signup");
                    return;
                }
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
        try {
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
        }catch (e){
            console.log(e);
        }
    });

router.route("/logout")
    .get(function (req, res) {
        try {
            res.cookie("Authorization", "");
            res.redirect("/login");
        }catch (e){
            console.log(e);
        }
    })

module.exports = router;
