var productModel = require("../../modules/products");

exports.getAllProduct = function (req, res, next) {
    productModel
        .find()
        .select("product_name price quality productImage")
        .exec()
        .then((data) => {
            res.status(200).json({
                message: "Ok",
                results: data,
            });
        })
        .catch((err) => {
            res.json(err);
        });
}

exports.addProduct = function (req, res, next) {

    var product_name = req.body.product_name;
    var price = req.body.price;
    var quality = req.body.quality;
    var productImage = req.file.path;
    var productDetails = new productModel({
        product_name: product_name,
        price: price,
        quality: quality,
        productImage: productImage,
    });
    productDetails
        .save()
        .then((data) => {
            res.status(201).json({
                message: "Product inserted Successfully",
                results: data,
            });
        })
        .catch((err) => {
            res.json(err);
        });
}