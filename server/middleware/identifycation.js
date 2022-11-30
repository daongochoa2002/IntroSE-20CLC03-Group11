const User = require("../database/models/user");
const jwt = require("jsonwebtoken");
const {TOKEN_HASH_KEY} = require("../constants")

const auth = async function (req, res, next) {
    try {
        const token = req.cookies["Authorization"];
        const decode = jwt.verify(token, TOKEN_HASH_KEY);
        const user = await User.findOne({_id: decode._id, "tokens.token": token});
        if(!user){
            req.error = "Account not found";
        }
        req.user = user;
        req.token = token;
        req.role = decode.role;
        next();
    }catch (e){
        console.log(e);
        res.redirect("/login");
    }
}

module.exports = auth;