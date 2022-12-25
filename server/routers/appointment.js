const express = require("express");
const auth = require("../middleware/identification");
const AppointmentData = require("../database/models/appointment");
const UserData = require("../database/models/user");
const {isValidId} = require("../utils");
const router = new express.Router();
router
    .get("/appointment/doctor", auth, async function (req, res) {
        if(req.user && req.user.role !== "Doctor"){
            res.redirect("/login");
            return;
        }
        const dataAppointments = await AppointmentData.find({doctorId: req.user._id}).sort({time: 1});
        const appointments = [];
        for (const dataAppointment of dataAppointments) {
            const dateTime = new Date(dataAppointment.time);
            const date = dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
            const hour = dateTime.getHours() + ":" + dateTime.getMinutes();
            const patient = await UserData.findOne({_id: dataAppointment.patientId});
            appointments.push({
                _id: dataAppointment._id,
                patientName: patient ? patient.getName() : null,
                doctorId: dataAppointment.doctorId,
                patientId: dataAppointment.patientId,
                date: date,
                hour: hour
            })
        }
        res.render("appointment/appointment_doctor", {appointments: appointments, role: req.user.role});
    })
    .post("/appointment/doctor", auth, async function (req, res) {
        if(req.user && req.user.role !== "Doctor"){
            res.redirect("/login");
            return;
        }
        console.log("appointment:: " + JSON.stringify(req.body))
        const dateParts = req.body.date.split("-")
        const hourParts = req.body.hour.split(":")
        const time = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hourParts[0], hourParts[1]);
        const appointment = new AppointmentData({
            doctorId: req.user._id,
            time: time
        });
        await appointment.save();
        res.redirect("/appointment/doctor");
    })
    .delete("/appointment/doctor/:appointment_id", auth, async function (req, res) {
        if(req.user && req.user.role !== "Doctor"){
            res.redirect("/login");
            return;
        }
        if(!isValidId(req.params.appointment_id)){
            res.send("<h1>Invalid appointment ID</h1>");
            return;
        }
        await AppointmentData.findOne({_id: req.params.appointment_id}).remove();
        res.redirect("/appointment/doctor");
    })
    .get("/appointment/patient", auth, async function (req, res) {
        if(req.user && req.user.role !== "Patient"){
            res.redirect("/login");
            return;
        }
        // const doctors = await UserData.find({role: "Patient"}); //todo update check role doctor
        const doctors = await UserData.find();
        const dataAppointments = await AppointmentData.find({patientId: null}).sort({time: 1});
        const appointments = [];
        for (const dataAppointment of dataAppointments) {
            const dateTime = new Date(dataAppointment.time);
            const date = dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
            const hour = dateTime.getHours() + ":" + dateTime.getMinutes();
            const doctor = await UserData.findOne({_id: dataAppointment.doctorId});
            appointments.push({
                _id: dataAppointment._id,
                doctorName: doctor ? doctor.getName() : null,
                doctorId: dataAppointment.doctorId,
                patientId: dataAppointment.patientId,
                date: date,
                hour: hour
            })
        }
        const dataUserAppointments = await AppointmentData.find({patientId: req.user._id}).sort({time: 1});
        const userAppointments = [];
        for(const dataAppointment of dataUserAppointments){
            const dateTime = new Date(dataAppointment.time);
            const date = dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
            const hour = dateTime.getHours() + ":" + dateTime.getMinutes();
            const doctor = await UserData.findOne({_id: dataAppointment.doctorId});
            userAppointments.push({
                _id: dataAppointment._id,
                doctorName: doctor ? doctor.getName() : null,
                date: date,
                hour: hour
            })
        }
        res.render("appointment/appointment_patient", {
            userId: req.user._id,
            doctors: doctors,
            appointments: appointments,
            userAppointments: userAppointments,
            role: req.user.role
        })
    })
    .post("/appointment/patient", auth, async function (req, res) {
        if(req.user && req.user.role !== "Patient"){
            res.redirect("/login");
            return;
        }
        console.log("booking:: " + JSON.stringify(req.body))
        if(!isValidId(req.body.appointmentId)){
            res.send("<h1>Invalid appointment ID</h1>");
            return;
        }
        const appointment = await AppointmentData.findOne({_id: req.body.appointmentId});
        appointment.patientId = req.user._id;
        appointment.save();
        res.redirect("/appointment/patient");
    })

module.exports = router;