const fs = require("fs");
const path = require("path");
const UserData = require("../database/models/user");

const createAdminAccount = async function (){
    await UserData.deleteMany({role: "Admin"})
    const file = await fs.readFileSync(path.join(__dirname, "../config/json/admin.json"));
    const admins = JSON.parse(file);
    for(const admin of admins){
        const newUser = new UserData({
            email: admin.email,
            password: admin.password,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role,
            gender: admin.gender,
            dateOfBirth: admin.dateOfBirth,
            phoneNumber: admin.phoneNumber,
            userIdInHospital: admin.userIdInHospital
        })
        await newUser.save();
    }
}

const getListBloodPressureHospitalAPI = async function (){
    const file = await fs.readFileSync(path.join(__dirname, "../config/json/blood_pressure.json"));
    return JSON.parse(file);
}

const getListPrescriptionHospitalAPI = async function (){
    const file = await fs.readFileSync(path.join(__dirname, "../config/json/prescription.json"));
    return JSON.parse(file);
}

const runConfig = async function () {
    createAdminAccount();
}

module.exports = {runConfig, getListPrescriptionHospitalAPI, getListBloodPressureHospitalAPI}