const jwt = require("jsonwebtoken");
const {TOKEN_HASH_KEY} = require("../constants");
const User = require("../database/models/user");
const mongoose = require("mongoose")
const Drug = require("../database/models/drug");
const fetch = require('node-fetch-commonjs');
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
    if(!time)
        return null;
    const dateTime = new Date(time);
    return dateTime.getDate() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getFullYear();
}

const crawlDrugAPI = async function (isCrawl){
    if(!isCrawl)
        return;
    const path1 = "https://api-gateway.pharmacity.vn/api/category?slug=thuoc-ke-don";
    const path2 = "https://api-gateway.pharmacity.vn/api/category?slug=thuoc-khong-ke-don";
    let res = await fetch(path1);
    let json = await res.json();
    let drugs = json.data.products.edges;
    res = await fetch(path2);
    json = await res.json();
    drugs = drugs.concat(json.data.products.edges);
    for(const drug of drugs){
        const name = drug.node.name;
        const description = drug.node.longDescription
        let dataDrug = new Drug({name: name, description: description}) //fixme fix here
        await dataDrug.save();
    }
}

module.exports = {getUserData, isValidId, getDateStr, crawlDrugAPI}