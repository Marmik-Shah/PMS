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

router.get("/", function(req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
        res.redirect('./dashboard');
    } else {
        res.render("index", {
            title: "Password Management System",
            msg: "",
        });
    }
});

router.post("/", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var checkusername = userModule.findOne({
        username: username,
    });
    checkusername.exec((err, data) => {
        if (err) throw err;
        var getUserId = data._id;
        var getPassword = data.password;
        if (bcrypt.compareSync(password, getPassword)) {
            var token = jwt.sign({
                userId: getUserId
            }, "loginToken");
            localStorage.setItem("userToken", token);
            localStorage.setItem("loginUser", username);

            res.redirect("/dashboard");
        } else {
            res.render("index", {
                title: "Password Management System",
                msg: "Invalid Username or Password",
            });
        }
    });
});

router.post("/signup", checkUserName, checkEmail, function(req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confpassword = req.body.confpassword;

    if (password != confpassword) {
        res.render("signup", {
            title: "Password Management System",
            msg: "Password does not match!",
        });
    } else {
        password = bcrypt.hashSync(password, 10);
        var userDetail = new userModule({
            username: username,
            email: email,
            password: password,
        });

        userDetail.save(function(err, data) {
            if (err) throw err;
            res.render("signup", {
                title: "Password Management System",
                msg: "Registered Successfully",
            });
        });
    }
});

router.get("/signup", function(req, res, next) {
    var loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
        res.redirect('./dashboard');
    } else {
        res.render("signup", {
            title: "Password Management System",
            msg: "",
        });
    }
});
module.exports = router;