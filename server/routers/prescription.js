const express = require("express");
const mongoose = require("mongoose")
const router = new express.Router();
const auth = require("../middleware/identification");
const fs = require("fs");
const path = require("path");
const DrugData = require("../database/models/drug")
const UserData = require("../database/models/user")
const PrescriptionData = require("../database/models/prescription")
const {isValidId, getDateStr} = require("../utils");

router.route("/prescription")
    .get(auth, async function (req, res) {
        const user = req.user;
        if(!user){
            res.send("<h1>Error user null</h1>");
            return;
        }
        const role = user.role;
        if(role === "Patient"){
            const dataPrescriptions = await PrescriptionData.find({patientId: req.user._id})
            const prescriptions = []
            for(const dataPrescription of dataPrescriptions){
                let prescription = {}
                prescription.createDate = getDateStr(dataPrescription.createDate);
                prescription.doctorName = (await UserData.findById(dataPrescription.doctorId)).getName();
                prescription.patientName = (await UserData.findById(dataPrescription.patientId)).getName();
                prescription.note = dataPrescription.note;
                let listDrug = [];
                let drug;
                for(const dataDrug of dataPrescription.listDrug){
                    drug = {};
                    drug.drugName = (await DrugData.findById(dataDrug.drugId)).name;
                    drug.dosage = dataDrug.dosage;
                    listDrug.push(drug);
                }
                prescription.listDrug = listDrug;
                prescriptions.push(prescription)
            }
            console.log("prescriptions::" + JSON.stringify(prescriptions))
            res.render("prescription/prescription_patient", {prescriptions: prescriptions, role: req.user.role})
        }
        else if(role === "Doctor"){
            const patients = await UserData.find({role: "Patient"});
            res.render("prescription/prescription_list_patient", {patients: patients, role: req.user.role});
        }
        else {
            res.send("<h1>You are not allowed to view this page</h1>");
        }
    });

router.route("/prescription/add/:patientId")
    .get(auth, async function (req, res) {
        if(!req.user || req.user.role !== "Doctor"){
            res.send("<h1>You are not allowed to view this page</h1>");
            return;
        }
        const patientId = req.params.patientId;
        const drugs = await DrugData.find().sort({name: 1});
        res.render("prescription/prescription_doctor", {
            patientId: patientId,
            drugs: drugs,
            role: req.user.role
        })
    })
    .post(auth, async function (req, res) {
        console.log("here -2 ")
        if(!req.user || req.user.role !== "Doctor"){
            res.json({state: "fail", text: "<h1>You are not allow to create prescription</h1>"});
            return;
        }

        if(!isValidId(req.params.patientId)){
            res.json({state: "fail", text: "<h1>Patient not exist</h1>"});
            return;
        }
        const patient = await UserData.findOne({_id: req.params.patientId});
        console.log("here 0.5")
        if(!patient){
            res.json({state: "fail", text: "<h1>Patient not exist</h1>"});
            return;
        }
        console.log("here 1")
        console.log("patientId:: " + req.params.patientId)
        console.log("here 2")
        console.log("prescription create:: " + JSON.stringify(req.body))
        console.log("here 3")
        console.log("doctorId: " + req.user._id)
        const prescription = new PrescriptionData({
            doctorId: req.user._id,
            patientId: req.params.patientId,
            note: req.body.note,
            listDrug: req.body.listDrug
        })
        await prescription.save();
        res.json({state: "success", path: "/prescription"})
    })

module.exports = router;