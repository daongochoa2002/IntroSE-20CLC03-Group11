const mongoose = require("mongoose");

const BloodPressureSchema = new mongoose.Schema({
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