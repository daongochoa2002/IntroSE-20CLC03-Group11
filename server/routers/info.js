const express = require("express");
const router = new express.Router();
const auth = require("../middleware/identification");
const fs = require("fs");

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

// router.route("/prescription") //todo update
//     .get(auth, async function (req, res) {
//         const user = req.user;
//         if(!user){
//             console.log("user null");
//             return;
//         }
//         const userIdInHospital = user.userIdInHospital;
//         if(!userIdInHospital){
//             console.log("userIdInHospital null");
//             return;
//         }
//         const presciptionFile = await fs.readFileSync("../config/prescription.json");
//         let prescritionData = []
//         if(user){
//             res.render("prescription", {
//                 prescription: prescritionData
//             })
//         }
//         else {
//             console.log("user null");
//         }
//     })

module.exports = router;