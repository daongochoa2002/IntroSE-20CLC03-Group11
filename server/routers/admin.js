const express = require("express");
const auth = require("../middleware/identification");
const AppointmentData = require("../database/models/appointment");
const UserData = require("../database/models/user");
const {isValidId, getDateStr} = require("../utils");
const router = new express.Router();
const {showError} = require("../utils/index")

router
    .get("/admin/manage_account", auth, async function (req, res) {
        try {
            if(req.user && req.user.role !== "Admin"){
                res.redirect("/login");
                return;
            }
            let users = await UserData.find({role: {$ne: "Admin"}});
            for(let i = 0; i < users.length; i++){
                users[i].dateOfBirthStr = getDateStr(users[i].dateOfBirth);
            }
            res.render("admin/manage_account", {users: users, role: req.user.role});
        }catch (e){
            console.log(e);
        }
    })
    .get("/admin/manage_account/edit/:id", auth, async function (req, res) {
        try {
            if(req.user && req.user.role !== "Admin"){
                res.redirect("/login");
                return;
            }
            if(!isValidId(req.params.id)){
                res.send("<h1>Invalid account ID</h1>");
                return;
            }
            const userData = await UserData.findOne({_id: req.params.id});
            if(!userData){
                res.send("user " + req.params.id + " undefined");
                return;
            }
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
            console.log("edit user:: " + JSON.stringify(user))
            res.render("admin/create_account", {
                user: user,
                type: "edit",
                role: req.user.role
            })
        }catch (e){
            console.log(e);
        }
    })
    .post("/admin/manage_account/edit/:id", auth, async function (req, res) {
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
            res.redirect("/admin/manage_account");
        }catch (e){
            console.log(e);
        }
    })
    .delete("/admin/manage_account/delete/:id", auth, async function(req, res) {
        try {
            if(req.user && req.user.role !== "Admin"){
                res.redirect("/login");
                return;
            }
            if(!isValidId(req.params.id)){
                res.send("<h1>Invalid account ID</h1>");
                return;
            }
            await UserData.deleteOne({_id: req.params.id});
            res.redirect("/admin/manage_account");
        }catch (e){
            console.log(e);
        }
    })
    .get("/admin/manage_account/create", auth, async function (req, res) {
        try {
            if(req.user && req.user.role !== "Admin"){
                res.redirect("/login");
                return;
            }
            res.render("admin/create_account", {user: {}, type: "create", role: req.user.role})
        }catch (e){
            console.log(e);
        }
    })
    .post("/admin/manage_account/create", auth, async function (req, res) {
        try {
            const email = req.body.email;
            const isEmailExist = await UserData.findOne({email: email});
            if(isEmailExist){
                showError(res, "Email already exists", "/admin/manage_account/create");
                return;
            }
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
            res.redirect("/admin/manage_account")
        }catch (e){
            console.log(e);
        }
    })

module.exports = router;