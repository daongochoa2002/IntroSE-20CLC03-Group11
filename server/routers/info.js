const express = require("express");
const router = new express.Router();
const auth = require("../middleware/identification");
const UserData = require("../database/models/user");
const {isValidId, showError} = require("../utils");

router.route("/personal_info")
    .get(auth, function (req, res) {
        try {
            const userData = req.user;
            const user = {};
            user.email = userData.email;
            user.password = userData.password;
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            const dateTime = userData.dateOfBirth;
            if(userData.dateOfBirth){
                const year = dateTime.getFullYear();
                let month = dateTime.getMonth() + 1;
                if(month < 10)
                    month = "0" + month;
                let date = dateTime.getDate();
                if(date < 10)
                    date = "0" + date;
                user.dateOfBirth = year + "-" + month + "-" + date;
            }
            user.role = userData.role;
            user.gender = userData.gender;
            user.phoneNumber = userData.phoneNumber;
            user.userIdInHospital = userData.userIdInHospital;
            user._id = userData._id;
            console.log("user::" + JSON.stringify(user))
            if(userData){
                res.render("info/personal_information", {
                    user: user,
                    role: req.user.role
                });
            }
            else {
                console.log("user null");
            }
        }catch (e){
            console.log(e);
        }
    });

router.route("/personal_info/edit")
    .post(auth, async function (req, res) {
        try {
            let user = req.user;
            if(!user){
                res.send("<h1>User not exist</h1>");
                return;
            }
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.gender = req.body.gender;
            user.phoneNumber = req.body.phoneNumber;
            user.userIdInHospital = req.body.userIdInHospital;
            if(req.body.dateOfBirth){
                const dateParts = req.body.dateOfBirth.split("-");
                user.dateOfBirth = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            }
            await user.save();
            res.redirect("/personal_info");
        }catch (e){
            console.log(e);
        }
    })

module.exports = router;