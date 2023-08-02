const mongoose = require("mongoose");

const HospitalManagerSchema = new mongoose.Schema({
    hospitalId: {
        type: Number,
        required: true
    },
    curDate: {
        type: Date,
        default: null
    },
    nextNumber: {
        type: Number,
        default: 1
    }
})

const HospitalManagerData = mongoose.model("HospitalManager", HospitalManagerSchema);
module.exports = HospitalManagerData;