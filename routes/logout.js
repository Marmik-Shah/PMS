var express = require("express");
var router = express.Router();
var userModule = require("../modules/user");
var passcatModel = require('../modules/password_category');
var passModel = require("../modules/add_password");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
    check,
    validationResult
} = require("express-validator");
var getPassCat = passcatModel.find({});
var getAllPass = passModel.find({});

/* GET home page. */
function checkLoginUser(req, res, next) {
    var userToken = localStorage.getItem('userToken');
    try {
        var decoded = jwt.verify(userToken, 'loginToken');
    } catch (err) {
        res.redirect('/');
    }
    next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}

function checkEmail(req, res, next) {
    var email = req.body.email;
    var checkexistemail = userModule.findOne({
        email: email,
    });
    checkexistemail.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render("signup", {
                title: "Password Management System",
                msg: "Email Already Exist",
            });
        }
        next();
    });
}

function checkUserName(req, res, next) {
    var username = req.body.username;
    var checkexistusername = userModule.findOne({
        username: username,
    });
    checkexistusername.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render("signup", {
                title: "Password Management System",
                msg: "Username Already Exist",
            });
        }
        next();
    });
}
router.get("/", function (req, res, next) {
    localStorage.removeItem("loginUser");
    localStorage.removeItem("userToken");
    res.redirect("/");
});

module.exports = router;