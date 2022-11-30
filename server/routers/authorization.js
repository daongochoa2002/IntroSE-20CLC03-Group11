const express = require("express");
const UserData = require("../database/models/user");
const path = require("path");
const router = new express.Router();
const auth = require("../middleware/identifycation");

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
    .get(function (req, res) {
        res.render("login");
    })
    .post(auth, async function (req, res){
        res.clearCookie("Authorization");
        const user = await UserData.findByCredential(req.body.email, req.body.password);
        const token = await user.createToken();
        res.cookie("Authorization", token);
        return res.redirect("/");
    })

module.exports = router;