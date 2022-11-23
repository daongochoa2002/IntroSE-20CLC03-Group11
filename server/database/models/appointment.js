const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    time: {
        type: Date,
        required: true
    }
})

const AppointmentData = mongoose.model("Appointment", AppointmentSchema);
module.exports = AppointmentData;