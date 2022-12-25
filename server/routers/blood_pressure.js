const express = require("express");
const mongoose = require("mongoose")
const router = new express.Router();
const auth = require("../middleware/identification");
const fs = require("fs");
const path = require("path");
const DrugData = require("../database/models/drug")
const UserData = require("../database/models/user")
const BloodPressureData = require("../database/models/blood_pressure")
const {isValidId, getDateStr} = require("../utils");

router.route("/blood_pressure")
    .get(auth, async function (req, res) {
        const user = req.user;
        if(!user){
            res.send("<h1>Error user null</h1>");
            return;
        }
        const role = user.role;
        if(role === "Patient"){
            const dataListBloodPressure = await BloodPressureData.find({patientId: req.user._id})
            const listBloodPressure = []
            for(const dataBloodPressure of dataListBloodPressure){
                let bloodPressure = {}
                bloodPressure.createDate = getDateStr(dataBloodPressure.createDate);
                bloodPressure.doctorName = (await UserData.findById(dataBloodPressure.doctorId)).getName();
                bloodPressure.sys = dataBloodPressure.sys;
                bloodPressure.dia = dataBloodPressure.dia;
                bloodPressure.pulse = dataBloodPressure.pulse;
                listBloodPressure.push(bloodPressure);
            }
            console.log("listBloodPressure::" + JSON.stringify(listBloodPressure))
            res.render("bloodPressure/blood_pressure_patient", {listBloodPressure: listBloodPressure, role: req.user.role})
        }
        else if(role === "Doctor"){
            const patients = await UserData.find({role: "Patient"});
            res.render("bloodPressure/blood_pressure_list_patient", {patients: patients, role: req.user.role});
        }
        else {
            res.send("<h1>You are not allowed to view this page</h1>");
        }
    });

router.route("/blood_pressure/:patientId")
    .get(auth, async function (req, res) {
        const user = req.user;
        if(!user){
            res.send("<h1>Error user null</h1>");
            return;
        }
        const role = user.role;
        if(role === "Patient"){

        }
        else if(role === "Doctor"){
            if(!isValidId(req.params.patientId)){
                res.send("<h1>Patient not exist</h1>");
                return;
            }
            const dataListBloodPressure = await BloodPressureData.find({patientId: req.params.patientId})
            const listBloodPressure = []
            for(const dataBloodPressure of dataListBloodPressure){
                let bloodPressure = {}
                bloodPressure.createDate = getDateStr(dataBloodPressure.createDate);
                bloodPressure.doctorName = (await UserData.findById(dataBloodPressure.doctorId)).getName();
                bloodPressure.sys = dataBloodPressure.sys;
                bloodPressure.dia = dataBloodPressure.dia;
                bloodPressure.pulse = dataBloodPressure.pulse;
                listBloodPressure.push(bloodPressure);
            }
            console.log("listBloodPressure::" + JSON.stringify(listBloodPressure))
            res.render("bloodPressure/blood_pressure_patient", {listBloodPressure: listBloodPressure, role: req.user.role})
        }
        else {
            res.send("<h1>You are not allowed to view this page</h1>");
        }
    })

router.route("/blood_pressure/add/:patientId")
    .get(auth, async function (req, res) {
        if(!req.user || req.user.role !== "Doctor"){
            res.send("<h1>You are not allowed to view this page</h1>");
            return;
        }
        res.render("bloodPressure/blood_pressure_doctor", {
            patientId: req.params.patientId,
            role: req.user.role
        })
    })
    .post(auth, async function (req, res) {
        console.log("here -2 ")
        if(!req.user || req.user.role !== "Doctor"){
            res.send("<h1>You are not allow to create blood pressure</h1>");
            return;
        }

        if(!isValidId(req.params.patientId)){
            res.send("<h1>Patient not exist</h1>");
            return;
        }
        const patient = await UserData.findOne({_id: req.params.patientId});
        console.log("here 0.5")
        if(!patient){
            res.send("<h1>Patient not exist</h1>");
            return;
        }
        console.log("patientId:: " + req.params.patientId)
        console.log("bloodPressure create:: " + JSON.stringify(req.body))
        console.log("doctorId: " + req.user._id)
        const bloodPressure = new BloodPressureData({
            doctorId: req.user._id,
            patientId: req.params.patientId,
            sys: req.body.sys,
            dia: req.body.dia,
            pulse: req.body.pulse
        })
        await bloodPressure.save();
        res.redirect("/blood_pressure")
    })

module.exports = router;