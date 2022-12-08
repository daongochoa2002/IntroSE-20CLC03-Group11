const User = require("../database/models/user");
const jwt = require("jsonwebtoken");
const {TOKEN_HASH_KEY} = require("../constants")

const auth = async function (req, res, next) {
    try {
        console.log("path: " + req.path)
        const token = req.cookies["Authorization"];
        if(!token || token == ""){
            redirectToNonUser(req, res);
            return;
        }
        console.log("token " + token)
        const decode = jwt.verify(token, TOKEN_HASH_KEY);
        console.log("decode: " + JSON.stringify(decode))
        const user = await User.findOne({_id: decode._id});
        console.log("user:: " + JSON.stringify(user))
        if(!user){
            req.error = "Account not found";
        }
        req.user = user;
        req.token = token;
        req.role = user.role;
        next();
    }catch (e){
        console.log(e);
        redirectToNonUser(req, res);
    }
}

const redirectToNonUser = function (req, res){
    console.log("redirectToNonUser")
    if(req.path == "/")
        res.render("home/home_guest");
    else
        res.redirect("/login");
}

module.exports = auth;