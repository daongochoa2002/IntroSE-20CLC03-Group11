const express = require("express");
const UserData = require("../database/models/user");
const auth = require("../middleware/identification");
const router = new express.Router();
router
    .get("/", auth, async function (req, res) {
        console.log(req)
        switch (req.role){
            case "Patient":
                res.render("home/home_patient");
                break;
            case "Doctor":
                res.render("home/home_doctor");
                break;
            default:
                console.log("render home_guest")
                res.render("home/home_guest");
                break;
        }
    })

module.exports = router;