const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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
    },
    "tokens": {
        type: Map
    }
});

UserSchema.statics.findByCredential = async function (email, password) {
    const user = await UserData.findOne({email, password});
    if (!user)
        throw "Wrong email or password!";
    return user;
}

UserSchema.methods.createToken = async function () {
    const user = this;
    const token = jwt.sign({id: user._id, role: user.role}, "introSE-20CLC03-Group11");
    user.tokens = user.tokens.set(token, "");
    await user.save();
    return token;
}

const UserData = mongoose.model("User", UserSchema);
module.exports = UserData;
