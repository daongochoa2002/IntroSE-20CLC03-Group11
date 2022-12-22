const mongoose = require("mongoose");

const BloodPressureSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    sys: {
        type: Number,
        required: true
    },
    dia: {
        type: Number,
        required: true
    },
    pulse: {
        type: Number,
        required: true
    }
})

const BloodPressureData = mongoose.model("BloodPressure", BloodPressureSchema);
module.exports = BloodPressureData;