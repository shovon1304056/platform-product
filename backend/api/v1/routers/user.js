const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require('uuid');

const userModel = require("../models/user");
const superAdminModel = require("../models/super-admin");
const verifyToken = require("../middlewares/jwt_verify/verifyToken");

const commonObject = require("../common/common");
const { routeAccessChecker } = require('../middlewares/routeAccess');




require("dotenv").config();


//******

router.get("/me", verifyToken, async (req, res) => {

    let profileInfo = {};
    let dateTimeToday = await commonObject.getGMT();
    let dateToday = await commonObject.getCustomDate(dateTimeToday);

    let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;
    if (req.decoded.role.id == 1) {
        profileInfo = await superAdminModel.getById(
            req.decoded.profileInfo.id
        );
    } else {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Unauthorize Request. User not found, please login again.",
        });
    }

    if (isEmpty(profileInfo)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "Unknown user.",
        });
    } else {
        profileInfo[0].role = {
            role_id: req.decoded.role.id,
            role_name: req.decoded.role.title,
        };


        profileInfo[0].imageFolderPath = imageFolderPath;
        // profileInfo[0].user_id = req.decoded.userInfo.id;

        profileInfo[0].user_id = req.decoded.userInfo.id;

        return res.status(200).send({
            success: true,
            status: 200,
            data: profileInfo[0],
            permissions: req.decoded.permissions
        });
    }
});


module.exports = router;
