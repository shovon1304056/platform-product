const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const productCategoryModel = require('../models/product-category');
const fileUploaderCommonObject = require("../common/fileUploader");
const verifyToken = require('../middlewares/jwt_verify/verifyToken');

const { routeAccessChecker } = require('../middlewares/routeAccess');
require('dotenv').config();

const i18next = require('i18next');

let imageFolderPath = `${process.env.backend_url}${process.env.product_category_image_path_name}`;

// routeAccessChecker("")

router.get('/list', [verifyToken, routeAccessChecker("productCategoryList")], async (req, res) => {

    let result = await productCategoryModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Product Category List",
        "imageFolderPath": imageFolderPath,
        "count": result.length,
        "data": result
    });
});


module.exports = router;