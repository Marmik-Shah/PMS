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

router.get("/", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    getPassCat.exec(function (err, data) {
        if (err) throw err;
        res.render("password_category", {
            title: "Password Management System",
            loginUser: loginUser,
            records: data,
        });
    });
});
router.get("/delete/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    var passcat_id = req.params.id;
    var passdelete = passcatModel.findByIdAndDelete(passcat_id);
    passdelete.exec(function (err) {
        if (err) throw err;
        res.redirect('/passwordCategory');
    });
});

router.get("/edit/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    var passcat_id = req.params.id;
    var getpassCategory = passcatModel.findById(passcat_id);
    getpassCategory.exec(function (err, data) {
        if (err) throw err;
        res.render("edit_pass_category", {
            title: "Password Management System",
            loginUser: loginUser,
            records: data,
            errors: "",
            success: "",
            id: passcat_id
        });
    });
});

router.post("/edit/", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    var passcat_id = req.body.id;
    var passwordCate = req.body.passwordCategory;
    var update_passCat = passcatModel.findByIdAndUpdate(passcat_id, {
        password_category: passwordCate
    });
    update_passCat.exec(function (err, data) {
        if (err) throw err;
        res.redirect('/passwordCategory');
    });
});
module.exports = router;