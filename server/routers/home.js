const express = require("express");
const UserData = require("../database/models/user");
const auth = require("../middleware/identification");
const router = new express.Router();
router
    .get("/", auth, async function (req, res) {
        console.log(req)
        switch (req.role){
            case "Patient":
                res.render("home/home_patient", {role: req.role});
                break;
            case "Doctor":
                res.render("home/home_doctor", {role: req.role});
                break;
            default:
                console.log("render home_guest")
                res.render("home/home_guest", {role: req.role});
                break;
        }
    })

module.exports = router;