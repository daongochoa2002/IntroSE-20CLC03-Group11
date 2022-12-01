const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    listDrug: [
        {
            drug: {
                type: Schema.Types.ObjectId,
                ref: "Drug",
                required: true
            },
            dosage: [
                {
                    sessionOfDay: {
                        type: String,
                        enum: ["MORNING", "AFTERNOON", "EVENING", "NIGHT"]
                    },
                    quantity: Number,
                    required: true
                }
            ]
        }
    ],
    note: String
})

const PrescriptionData = mongoose.model("Prescription", PrescriptionSchema);
module.exports = PrescriptionData;