const express = require("express");
const auth = require("../middleware/identification");
const AppointmentData = require("../database/models/appointment");
const UserData = require("../database/models/user");
const router = new express.Router();
router
    .get("/appointment/doctor", auth, async function (req, res) {
        const dataAppointments = await AppointmentData.find({doctorId: req.user._id}).sort({time: 'desc'});
        const appointments = [];
        dataAppointments.forEach(dataAppointment => {
            const dateTime = new Date(dataAppointment.time);
            const date = dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
            const hour = dateTime.getHours() + ":" + dateTime.getMinutes();
            appointments.push({
                doctorId: dataAppointment.doctorId,
                patientId: dataAppointment.patientId,
                date: date,
                hour: hour
            })
        })
        res.render("appointment_doctor", {appointments: appointments});
    })
    .post("/appointment/doctor", auth, async function (req, res) {
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
        await AppointmentData.findOne({_id: req.params.appointment_id}).remove();
        res.redirect("/appointment/doctor");
    })
    .get("/appointment/patient", auth, async function (req, res) {
        // const doctors = await UserData.find({role: "Doctor"}); //todo update check role doctor
        const doctors = await UserData.find();
        const dataAppointments = await AppointmentData.find({patientId: null}).sort({time: 'desc'});
        const appointments = [];
        dataAppointments.forEach(dataAppointment => {
            const dateTime = new Date(dataAppointment.time);
            const date = dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
            const hour = dateTime.getHours() + ":" + dateTime.getMinutes();
            appointments.push({
                _id: dataAppointment._id,
                doctorId: dataAppointment.doctorId,
                patientId: dataAppointment.patientId,
                date: date,
                hour: hour
            })
        })
        console.log("appointments:: " + appointments)
        res.render("appointment", {
            doctors: doctors,
            appointments: appointments
        })
    })
    .post("/appointment/patient", auth, async function (req, res) {
        console.log("booking:: " + JSON.stringify(req.body))
        const appointment = await AppointmentData.findOne({_id: req.body.appointmentId});
        appointment.patientId = req.user._id;
        appointment.save();
        res.redirect("/appointment/patient");
    })

module.exports = router;