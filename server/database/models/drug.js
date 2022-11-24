const mongoose = require("mongoose");

const DrugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        enum: ["PILL", "PACK"],
        required: true
    }
})

const DrugData = mongoose.model("Drug", DrugSchema);
module.exports = DrugData;