var express = require("express");
var router = express.Router();
var userModel = require("../modules/user");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

router.post("/login", function (req, res, next) {
  var username = req.body.username;
  userModel.find({
      username: username
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(404).json({
          message: "Authentication Failed",
        })
      } else {
        bcrypt.compare(req.body.password, user[0].password, function (err, result) {
          if (err) {
            res.status(404).json({
              message: "Authentication Failed",
            })
          }
          if (result) {
            var token = jwt.sign({
                username: user[0].username,
                email: user[0].email
              },
              'secret', {
                expiresIn: '1h'
              }
            )
            res.status(201).json({
              message: "User Found",
              token: token
            })
          } else {
            res.status(404).json({
              message: "Authentication Failed",
            })
          }
        });

      }
    })
    .catch(err => {
      res.json({
        error: err
      })
    })

});

router.post("/signup", function (req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;

  if (password !== confirmpassword) {
    res.json({
      message: "Password doesnot match!",
    });
  } else {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return res.json({
          message: "Something Wrong,Try Later!",
          err: err,
        });
      } else {
        var userDetails = new userModel({
          username: username,
          email: email,
          password: hash,
        });
        userDetails
          .save()
          .then((data) => {
            res.status(201).json({
              message: "User Registerd Successfully",
              results: data,
            });
          })
          .catch((err) => {
            res.json(err);
          });
      }
    });
  }
});
module.exports = router;