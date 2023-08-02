const mongoose = require("mongoose");

const HospitalNumberSchema = new mongoose.Schema({
    patientId: {
        type: {},
        default: {}
    },
    hospitalId: {
        type: Number,
        required: true
    },
    number: {
        type: Number,
        default: 0
    }
})

const HospitalNumberData = mongoose.model("HospitalNumber", HospitalNumberSchema);
module.exports = HospitalNumberData;