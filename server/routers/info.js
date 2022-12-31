const express = require("express");
const router = new express.Router();
const auth = require("../middleware/identification");
const UserData = require("../database/models/user");
const {isValidId} = require("../utils");

router.route("/personal_info")
    .get(auth, function (req, res) {
        try {
            const user = req.user;
            if(user){
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

router.route("/personal_info/edit/:id")
    .post(auth, async function (req, res) {
        try {
            if(!isValidId(req.params.id)){
                res.send("<h1>Invalid account ID</h1>");
                return;
            }
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
            res.redirect("/personal_info");
        }catch (e){
            console.log(e);
        }
    })

module.exports = router;