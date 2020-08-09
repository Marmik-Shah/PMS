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
    res.render("addNewCategory", {
        title: "Password Management System",
        loginUser: loginUser,
        errors: "",
        success: "",
    });
});


router.post(
    "/",
    checkLoginUser,
    [
        check("passwordCategory", "Enter Password Category Name").isLength({
            min: 1,
        }),
    ],
    function (req, res, next) {
        var loginUser = localStorage.getItem("loginUser");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("addNewCategory", {
                title: "Password Management System",
                loginUser: loginUser,
                errors: errors.mapped(),
                success: "",
            });
        } else {
            var passCatName = req.body.passwordCategory;
            var passCatDetails = new passcatModel({
                password_category: passCatName
            });
            passCatDetails.save(function (err, data) {
                if (err) throw err;
                res.render("addNewCategory", {
                    title: "Password Management System",
                    loginUser: loginUser,
                    errors: "",
                    success: "Password category inserted successfully",
                });
            })
        }
    }
);

module.exports = router;