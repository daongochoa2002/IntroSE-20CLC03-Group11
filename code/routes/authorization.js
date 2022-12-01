const express = require("express");
const UserData = require("./../models/user");
const router = new express.Router();

router.route("/signup")
    .get(function (req, res) {
        res.render('account/sign_up')
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
            res.render('account/login')
        }catch (e){
            console.log(e);
        }
    })

router.route("/login")
    .get( function (req, res) {
        res.render('account/login');
    })
    .post(async function (req, res){
        res.clearCookie("Authorization")
    })

module.exports = router;