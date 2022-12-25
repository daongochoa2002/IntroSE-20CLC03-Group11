const express = require("express");
const router = new express.Router();
const auth = require("../middleware/identification");
const UserData = require("../database/models/user");
const {isValidId} = require("../utils");

router.route("/personal_info")
    .get(auth, function (req, res) {
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
    });

router.route("/personal_info/edit/:id")
    .post(auth, async function (req, res) {
        if(!isValidId(req.params.id)){
            res.send("<h1>Invalid account ID</h1>");
            return;
        }
        console.log("here 1")
        let user = await UserData.findOne({_id: req.params.id})
        console.log("here 2")

        if(!user){
            res.send("<h1>User not exist</h1>");
            return;
        }
        console.log("here 3")

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
        console.log("here 4")

        await user.save();
        console.log("here 5")

        res.redirect("/personal_info");
    })

module.exports = router;