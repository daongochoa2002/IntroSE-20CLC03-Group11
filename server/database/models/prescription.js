const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    listDrug: [
        {
            drugId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Drug",
                required: true
            },
            dosage: {
                type: String,
                required: true
            }
        }
    ],
    note: {
        type: String
    }
})

const PrescriptionData = mongoose.model("Prescription", PrescriptionSchema);
module.exports = PrescriptionData;