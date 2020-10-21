var express = require("express");
var router = express.Router();
var checkAuth = require('./middleware/auth');
const categoryController = require('./controller/category')


router.get('/getCategory', checkAuth, categoryController.getCategory)
router.post('/add-category', checkAuth, categoryController.addCategory);
router.put('/add-update-category/:id', checkAuth, categoryController.addUpdateCategory);
router.patch('/update-category/', checkAuth, categoryController.updateCategory);
router.delete('/delete-category/', checkAuth, categoryController.deleteCategory);
router.post('/add-new-password', checkAuth, categoryController.addNewPassword);
router.get('/getAllPassword', checkAuth, categoryController.getAllPassword);
router.delete('/delete-password', checkAuth, categoryController.deletePassword);

module.exports = router;