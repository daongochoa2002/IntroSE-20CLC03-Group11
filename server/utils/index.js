const jwt = require("jsonwebtoken");
const {TOKEN_HASH_KEY} = require("../constants");
const User = require("../database/models/user");
const mongoose = require("mongoose")
const getUserData = async function (req) {
    const token = req.cookies["Authorization"];
    if(!token || token == ""){
        return null;
    }
    console.log("token " + token)
    const decode = jwt.verify(token, TOKEN_HASH_KEY);
    console.log("decode: " + JSON.stringify(decode))
    const user = await User.findOne({_id: decode._id});
    console.log("user:: " + JSON.stringify(user))
    if(!user){
        return null;
    }
    return user;
}

const isValidId = function (id) {
    return mongoose.Types.ObjectId.isValid(id);
}

const getDateStr = function (time){
    const dateTime = new Date(time);
    return dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
}

module.exports = {getUserData, isValidId, getDateStr}