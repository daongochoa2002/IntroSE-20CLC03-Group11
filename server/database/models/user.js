const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error("Invalid Email!");
            }
        }
    },
    "password": {
        type: String,
        required: true,
        trim: true,
    },
    "name": {
        type: String,
        required: true
    },
    "age": {
        type: String,
        required: true
    },
    "role": {
        type: String,
        enum: ["DOCTOR", "PATIENT"],
        required: true
    }
});

const UserData = mongoose.model("User", UserSchema);
module.exports = UserData;

