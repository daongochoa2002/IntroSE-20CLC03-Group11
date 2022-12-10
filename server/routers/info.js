const express = require("express");
const router = new express.Router();
const auth = require("../middleware/identification");
const fs = require("fs");
const path = require("path");

router.route("/personal_info")
    .get(auth, function (req, res) {
        const user = req.user;
        if(user){
            res.render("personal_info", {
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth,
                phoneNumber: user.phoneNumber,
                gender: user.gender
            });
        }
        else {
            console.log("user null");
        }
    });

router.route("/prescription")
    .get(auth, async function (req, res) {
        const user = req.user;
        if(!user){
            console.log("user null");
            return;
        }
        const userIdInHospital = user.userIdInHospital;
        const role = user.role;
        // if(!userIdInHospital){
        //     console.log("userIdInHospital null");
        //     return;
        // }
        const file = await fs.readFileSync(path.join(__dirname, "../config/prescription.json"));
        const prescriptions = JSON.parse(file);
        const userPrescriptions = [];
        prescriptions.forEach(prescription => {
            if((role == "Doctor" && userIdInHospital == prescription.doctorIdInHospital) ||
                (role == "Patient" && userIdInHospital == prescription.patientIdInHospital)){
                userPrescriptions.push(prescription)
            }
        })
        res.render("prescription", {prescriptions: userPrescriptions})
    })

module.exports = router;