const express = require("express");
const UserData = require("../database/models/user");
const auth = require("../middleware/identification");
const router = new express.Router();
router
    .get("/appointment_doctor", auth, async function (req, res) {
        res.render("appointment_doctor")
    })

module.exports = router;