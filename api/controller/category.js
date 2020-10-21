var passcatModel = require('../../modules/password_category');
var passModel = require('../../modules/add_password');
var getPassCat = passcatModel.find({}, {
    'password_category': 1,
    '_id': 1
});
exports.getCategory = function (req, res, next) {
    // getPassCat.exec(function (err, data) {
    //     if (err) throw err;
    //     // res.send(data);
    //     res.status(200).json({
    //         message: "Success",
    //         results: data
    //     })
    // });
    getPassCat.exec()
        .then(data => {
            res.status(200).json({
                message: "Ok",
                results: data
            })
        })
        .catch(err => {
            res.json(err);
        });
}

exports.addCategory = function (req, res, next) {

    var passCategory = req.body.pass_cat;
    var passCatDetails = new passcatModel({
        password_category: passCategory
    });
    // passCatDetails.save(function (err, data) {
    //     if (err) throw err;
    //     res.status(201).json({
    //         message: "Category inserted Successfully",
    //         results: data
    //     })
    // })
    passCatDetails.save()
        .then(data => {
            res.status(201).json({
                message: "Category inserted Successfully",
                results: data
            })
        })
        .catch(err => {
            res.json(err);
        });

}
exports.addUpdateCategory = function (req, res, next) {
    var id = req.params.id;
    var passCategory = req.body.pass_cat;
    passcatModel.findById(id, function (err, data) {
        data.password_category = passCategory ? passCategory : data.password_category;
        // data.save(function (err) {
        //     if (err) throw err;
        //     //res.send("Data updated successfully in PUT")
        //     res.status(201).json({
        //         message: "Category Updated Successfully",
        //         results: data
        //     })

        // })
        data.save()
            .then(data => {
                res.status(201).json({
                    message: "Category Updated Successfully",
                    results: data
                })
            })
            .catch(err => {
                res.json(err);
            });

    })


}
exports.updateCategory = function (req, res, next) {

    var id = req.body._id;
    var passCategory = req.body.pass_cat;
    passcatModel.findById(id, function (err, data) {
        data.password_category = passCategory ? passCategory : data.password_category;
        // data.save(function (err) {
        //     if (err) throw err;
        //     //res.send("Data updated successfully in Patch")
        //     res.status(201).json({
        //         message: "Category Updated Successfully",
        //         results: data
        //     })
        // })
        data.save()
            .then(data => {
                res.status(201).json({
                    message: "Category Updated Successfully",
                    results: data
                })
            })
            .catch(err => {
                res.json(err);
            });
    })
}

exports.deleteCategory = function (req, res, next) {
    var passCatId = req.body._id;
    // passcatModel.findByIdAndRemove(passCatId, function (err) {
    //     if (err) throw err;
    //     res.send(passCatId + "Deleted Successfully")
    // })
    passcatModel.findByIdAndRemove(passCatId)
        .then(data => {
            res.status(201).json({
                message: "Category Deleted Successfully",
                results: data
            })
        })
        .catch(err => {
            res.json(err);
        });
}

exports.addNewPassword = function (req, res, next) {

    var password_category = req.body.pass_cat;
    var project_name = req.body.project_name;
    var password_detail = req.body.password_detail;
    var passDetails = new passModel({
        password_category: password_category,
        project_name: project_name,
        password_detail: password_detail
    });
    passDetails.save()
        .then(data => {
            res.status(201).json({
                message: "Category inserted Successfully",
                results: data
            })
        })
        .catch(err => {
            res.json(err);
        });

}

exports.getAllPassword = function (req, res, next) {

    passModel
        .find()
        .select('_id password_category project_name password_detail')
        .exec()
        .then(data => {
            res.status(201).json({
                message: "Ok",
                results: data
            })
        })
        .catch(err => {
            res.json(err);
        });

}

exports.deletePassword = function (req, res, next) {

    var password_id = req.body.password_id;
    passModel.findByIdAndRemove(password_id)
        .then(data => {
            res.status(201).json({
                message: "Ok",
                results: data
            })
        })
        .catch(err => {
            res.json(err);
        })

}