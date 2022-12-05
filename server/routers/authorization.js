const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();
const auth = require("../middleware/identification");

router.route("/signup")
    .get(function (req, res) {
        res.render("sign_up");
    })
    .post(async function (req, res) {
        try {
            console.log("signup " + JSON.stringify(req.body))
            const newUser = new UserData({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role,
                gender: req.body.gender,
                dateOfBirth: req.body.dateOfBirth,
                userIdInHospital: req.body.userIdInHospital
            })
            await newUser.save();
            res.render("login");
        }catch (e){
            console.log(e);
        }
    })

router.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(async function (req, res){
        res.clearCookie("Authorization");
        console.log("login req = " + JSON.stringify(req.body))
        const user = await UserData.findByCredential(req.body.email, req.body.password);
        if(user){
            console.log("user info " + JSON.stringify(user))
        }
        else {
            console.log("user null " + user)
        }
        const token = await user.createToken();
        res.cookie("Authorization", token);
        return res.redirect("/");
    });

router.route("/logout")
    .get(function (req, res) {
        res.cookie("Authorization", "");
        res.redirect("/login");
    })

router.route("/prescription")
    .get (function (req, res) {
        res.render('prescription');
    })



module.exports = router;
