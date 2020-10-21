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
    res.redirect('/dashboard');
});

router.get("/edit/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    var id = req.params.id;
    var getPassDetail = passModel.findById({
        _id: id
    });
    getPassDetail.exec(function (err, data) {
        if (err) throw err;
        getPassCat.exec(function (err, data1) {
            res.render("edit_password_detail", {
                title: "Password Management System",
                loginUser: loginUser,
                record: data,
                records: data1,
                success: ''
            });
        })
    })
});

router.post("/edit/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    var id = req.params.id;
    var passCat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_detail = req.body.pass_detail;
    passModel.findByIdAndUpdate(id, {
        password_category: passCat,
        project_name: project_name,
        password_detail: pass_detail
    }).exec(function (err) {
        if (err) throw err;
        var getPassDetail = passModel.findById({
            _id: id
        });
        getPassDetail.exec(function (err, data) {
            if (err) throw err;
            getPassCat.exec(function (err, data1) {
                res.render("edit_password_detail", {
                    title: "Password Management System",
                    loginUser: loginUser,
                    record: data,
                    records: data1,
                    success: 'Password Details Updated Successfully'
                });
            });
        });
    });
});

router.get("/delete/:id", checkLoginUser, function (req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    var passdetailid = req.params.id;
    var passdetaildelete = passModel.findByIdAndDelete(passdetailid);
    passdetaildelete.exec(function (err) {
        if (err) throw err;
        res.redirect('/viewAllPassword');
    });
});

module.exports = router;