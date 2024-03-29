const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {TOKEN_HASH_KEY} = require("../../constants")

const UserSchema = new mongoose.Schema({
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email!");
            }
        }
    },
    "password": {
        type: String,
        required: true,
        trim: true,
    },
    "firstName": {
        type: String,
        required: true
    },
    "lastName": {
        type: String,
        required: true
    },
    "dateOfBirth": {
        type: Date,
    },
    "role": {
        type: String,
        enum: ["Doctor", "Patient","Admin"],
        required: true
    },
    "gender": {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    "phoneNumber": {
        type: Number
    },
    "userIdInHospital": {
        type: String
    }
});

UserSchema.statics.findByCredential = async function (email, password) {
    const user = await UserData.findOne({email, password});
    return user;
}

UserSchema.methods.createToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id}, TOKEN_HASH_KEY);
    console.log("userId: " + user._id)
    return token;
}

UserSchema.methods.getName = function () {
    return this.firstName + " " + this.lastName;
}

const UserData = mongoose.model("User", UserSchema);

module.exports = UserData;
