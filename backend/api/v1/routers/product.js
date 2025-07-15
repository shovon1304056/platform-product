const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const fileUploaderCommonObject = require("../common/fileUploader");
const { v4: uuidv4 } = require("uuid");
const productModel = require('../models/product');
const productCategoryModel = require('../models/product-category');
const productBrandModel = require('../models/product-brand');
const productHighlightModel = require('../models/product-highlight');
const productReviewModel = require('../models/product-review');
const productImageModel = require('../models/product-image');
const verifyToken = require('../middlewares/jwt_verify/verifyToken');

const { routeAccessChecker } = require('../middlewares/routeAccess');
require('dotenv').config();

let productImageFolderPath = `${process.env.backend_url}${process.env.product_image_path_name}`;
let productCategoryImageFolderPath = `${process.env.backend_url}${process.env.product_category_image_path_name}`;


router.get('/list', [verifyToken, routeAccessChecker("productList")], async (req, res) => {

    const { category } = req.query;
    let whereCondition = { "status": [1, 2] };

    // If a category filter is provided
    if (category) {
        let categoryData = await productCategoryModel.getDataByWhereCondition(
            { "status": [1, 2], "title": category },
            { "id": "DESC" },
            undefined,
            undefined,
            []
        );


        if (!isEmpty(categoryData)) {
            whereCondition["category_id"] = categoryData[0].id;
        } else {
            return res.status(200).send({
                success: true,
                status: 200,
                message: `No products found in category: ${category}`,
                count: 0,
                data: [],
            });
        }
    }

    let result = await productModel.getDataByWhereCondition(whereCondition, { "id": "DESC" });

    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        // Brand details
        let brandDetails = await productBrandModel.getDataByWhereCondition(
            { "status": [1, 2], "id": element.brand_id },
            { "id": "DESC" }
        );
        element.brandDetails = isEmpty(brandDetails) ? {} : brandDetails[0];

        // Category details
        let categoryDetails = await productCategoryModel.getDataByWhereCondition(
            { "status": [1, 2], "id": element.category_id },
            { "id": "DESC" }
        );
        element.categoryDetails = isEmpty(categoryDetails) ? {} : categoryDetails[0];

        // Product images
        let imageDetails = await productImageModel.getDataByWhereCondition(
            { "status": [1, 2], "product_id": element.id },
            { "id": "DESC" }
        );
        element.imageDetails = isEmpty(imageDetails) ? [] : imageDetails;
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Product List",
        count: result.length,
        productImageFolderPath,
        productCategoryImageFolderPath,
        data: result
    });


});

router.get("/details/:id", [verifyToken, routeAccessChecker("productDetails")], async (req, res) => {


    let id = req.params.id;
    let validateId = await commonObject.checkItsNumber(id);

    if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Value should be integer." });
    else id = validateId.data;


    let result = await productModel.getDataByWhereCondition({ "id": id, "status": [1, 2] });

    if (isEmpty(result)) return res.status(404).send({ success: false, status: 404, message: "No data found" });
    else {

        let element = result[0];
        // brand details
        let brandDetails = await productBrandModel.getDataByWhereCondition({ "status": [1, 2], "id": element.brand_id }, { "id": "DESC" }, undefined, undefined, []);

        if (isEmpty(brandDetails)) {
            element.brandDetails = {};
        } else {
            element.brandDetails = brandDetails[0];
        }

        // category details
        let categoryDetails = await productCategoryModel.getDataByWhereCondition({ "status": [1, 2], "id": element.category_id }, { "id": "DESC" }, undefined, undefined, []);

        if (isEmpty(categoryDetails)) {
            element.categoryDetails = {};
        } else {
            element.categoryDetails = categoryDetails[0];
        }

        // product images
        let imageDetails = await productImageModel.getDataByWhereCondition({ "status": [1, 2], "product_id": element.id }, { "id": "DESC" }, undefined, undefined, []);

        if (isEmpty(imageDetails)) {
            element.imageDetails = [];
        } else {
            element.imageDetails = imageDetails;
        }

        // highlights
        let highlightsDetails = await productHighlightModel.getDataByWhereCondition({ "status": [1, 2], "product_id": element.id }, { "id": "DESC" }, undefined, undefined, []);

        if (isEmpty(highlightsDetails)) {
            element.highlightsDetails = [];
        } else {
            element.highlightsDetails = highlightsDetails;
        }

        // reviews
        let reviewDetails = await productReviewModel.getDataByWhereCondition({ "status": [1, 2], "product_id": element.id }, { "id": "DESC" }, undefined, undefined, []);

        if (isEmpty(reviewDetails)) {
            element.reviewDetails = [];
        } else {
            element.reviewDetails = reviewDetails;
        }

        return res.status(200).send({
            success: true, status: 200, message: "Product Details.",
            "productImageFolderPath": productImageFolderPath,
            "productCategoryImageFolderPath": productCategoryImageFolderPath, data: result[0]
        });

    }

});

router.post('/add', [verifyToken, routeAccessChecker("productAdd")], async (req, res) => {

    let timeNow = await commonObject.getGMT();

    let reqData = {
        "category_id": req.body.category_id,
        "brand_id": req.body.brand_id,
        "name": req.body.name,
        "description": req.body.description,
        "price": req.body.price,
        "cutted_price": req.body.cutted_price,
        "stock": req.body.stock,
        "warranty": req.body.warranty,
        "highlights": req.body.highlights,
        "created_at": timeNow,
        "created_by": req.decoded.userInfo.id,
        "updated_at": timeNow,
        "updated_by": req.decoded.userInfo.id
    }



    // product category id check
    let validateProductCategoryId = await commonObject.checkItsNumber(reqData.category_id);
    if (validateProductCategoryId.success == false)
        return res.status(400).send({ "success": false, "status": 400, "message": "Product category value should be integer.", "id": reqData.category_id });

    let existingProductCategory = await productCategoryModel.getDataByWhereCondition({ "id": reqData.category_id, "status": [1, 2] });
    if (isEmpty(existingProductCategory))
        return res.status(404).send({ "success": false, "status": 404, "message": "Product category data not found" });

    // product brand id check
    let validateProductBrandId = await commonObject.checkItsNumber(reqData.brand_id);
    if (validateProductBrandId.success == false)
        return res.status(400).send({ "success": false, "status": 400, "message": "Product brand value should be integer.", "id": reqData.brand_id });

    let existingProductBand = await productBrandModel.getDataByWhereCondition({ "id": reqData.brand_id, "status": [1, 2] });
    if (isEmpty(existingProductBand))
        return res.status(404).send({ "success": false, "status": 404, "message": "Product brand data not found" });


    // name
    let validateTitle = await commonObject.characterLimitCheck(reqData.name, "Product");

    if (validateTitle.success == false) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": validateTitle.message,

        });
    }

    reqData.name = validateTitle.data;

    // check duplicate entry of same product name
    let existingData = await productModel.getDataByWhereCondition({ "name": reqData.name, "status": [1, 2] });

    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "Any of This Product Name Already Exists." : "Any of This Product Name Already Exists but Deactivate, You can activate it."
        });
    }


    // description
    if (isEmpty(reqData.description)) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Description should not be empty.",
        });
    }

    // stock
    let validateQuantity = await commonObject.checkItsNumber(reqData.stock);
    if (validateQuantity.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": `Invalid Stock. `

        });

    } else {
        reqData.stock = validateQuantity.data;
    }

    // Warranty
    let validateWarranty = await commonObject.checkItsNumber(reqData.warranty);
    if (validateWarranty.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": `Invalid warranty. `

        });

    } else {
        reqData.warranty = validateWarranty.data;
    }


    // price
    let validatePrice = await commonObject.checkItsNumber(reqData.price);
    if (validatePrice.success == false) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": `Invalid Price. `

        });

    } else {
        reqData.price = validatePrice.data;
    }

    // cutted price validation
    if (reqData.cutted_price > 0) {
        let validateCuttedPrice = await commonObject.checkItsNumber(reqData.cutted_price);
        if (validateCuttedPrice.success == false) {

            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": `Invalid Cutted Price. `

            });
        } else {
            reqData.cutted_price = validateCuttedPrice.data;

            if (reqData.cutted_price > reqData.price) {
                return res.status(400).send({
                    "success": false,
                    "status": 400,
                    "message": `Cutted Price value should be less than  price . `
                });
            }
        }
    } else {
        reqData.cutted_price = 0;
    }

    // product images
    let imageArray = [];
    if (req.files.image) {
        // Ensure `req.files.image` is always an array
        req.files.image = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

        let imageObject = {};
        for (let i = 0; i < req.files.image.length; i++) {

            let imageElement = req.files.image[i];

            // Call the uploader with the specific file
            let imageUploadCode = await fileUploaderCommonObject.uploadFile(
                { files: { image: imageElement } }, // Create a temporary request object
                "productImage",
                "image"
            );

            if (imageUploadCode.success === false) {
                console.log("error");
                return res.status(400).send({
                    success: false,
                    status: 400,
                    message: imageUploadCode.message,
                });
            }

            

            let uuid = uuidv4();
            imageObject.public_id = uuid;
            imageObject.url = imageUploadCode.fileName;

            imageArray.push(imageObject);
        }
    }

    // highlights data
    let highlightsArray = [];
    if (!isEmpty(reqData.highlights) && Array.isArray(reqData.highlights)) {
        // check duplicate array
        let duplicateCheckInArrayResult = await commonObject.duplicateCheckInArray(reqData.highlights);

        if (duplicateCheckInArrayResult.result) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": `Highlights contains duplicate value. `

            });
        } else {
            let highlightsObject = {};

            for (let i = 0; i < reqData.highlights.length; i++) {
                let element = reqData.highlights[i];
                highlightsObject.highlight = element;

                highlightsArray.push(highlightsObject);
            }


        }
    } else {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Please add product highlights."

        });
    }


    // product data
    let data = {};

    data.category_id = reqData.category_id;
    data.brand_id = reqData.brand_id;
    data.name = reqData.name;
    data.description = reqData.description;
    data.price = reqData.price;
    data.cutted_price = reqData.cutted_price;
    data.warranty = reqData.warranty;
    data.stock = reqData.stock;
    data.created_by = req.decoded.userInfo.id;
    data.updated_by = req.decoded.userInfo.id;
    data.created_at = await commonObject.getGMT();
    data.updated_at = await commonObject.getGMT();

    let result = await productModel.addWithMultipleInfo(data, highlightsArray, imageArray);

    if (result.affectedRows == undefined || result.affectedRows < 1)
        return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });


    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Product has been added successfully.",

    });

});







module.exports = router;