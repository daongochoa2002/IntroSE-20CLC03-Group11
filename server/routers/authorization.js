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
            res.render("login", {alertTxt: "Wrong email or password"})
        }
    });

router.route("/logout")
    .get(function (req, res) {
        res.cookie("Authorization", "");
        res.redirect("/login");
    })

router.route("/edit/:id")
    .post(auth, async function (req, res) {
        let user = await UserData.findOne({_id: req.params.id})
        if(!user){
            res.send("<h1>User not exist</h1>");
            return;
        }
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.role = req.body.role;
        user.gender = req.body.gender;
        user.phoneNumber = req.body.phoneNumber;
        user.userIdInHospital = req.body.userIdInHospital;
        if(req.body.dateOfBirth){
            const dateParts = req.body.dateOfBirth.split("-");
            user.dateOfBirth = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        }
        await user.save();
        res.redirect("/");
    })

module.exports = router;
