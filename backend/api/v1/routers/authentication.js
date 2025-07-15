const express = require("express");
const isEmpty = require("is-empty");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const commonObject = require("../common/common");
const userModel = require("../models/user");
const superAdminModel = require("../models/super-admin");
const roleModel = require("../models/role");
const verifyToken = require("../middlewares/jwt_verify/verifyToken");
let moment = require('moment');


router.post("/login", async (req, res) => {

    let loginData = {
        password: req.body.password,
        email: req.body.email, // or email
    };

    let errorMessage = "";
    let isError = 0;

    // Check email validation
    if (loginData.email === undefined || isEmpty(loginData.email)) {
        isError = 1;
        errorMessage += "E-mail is empty.";
    }

    try {
        loginData.email = loginData.email.trim();
    } catch (error) { }


    let validateEmail = await commonObject.isValidEmail(loginData.email);
    if (validateEmail == false) {
        isError = 1;
        errorMessage += "E-mail is not valid.";
    }

    // Check Password Validation
    if (loginData.password == undefined || loginData.password.length < 6) {
        isError = 1;
        errorMessage += "Give valid password.";
    } else if (typeof loginData.password === "number") {
        loginData.password = loginData.password.toString();
    }

    if (isError == 1) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: errorMessage,
        });
    }

    // Get User data from user table.
    let userData = await userModel.getDataByWhereCondition({
        email: loginData.email,
        status: 1
    });

    if (isEmpty(userData) || userData[0].status == 0 || !(userData[0].email == loginData.email)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "No user found.",
        });
    } else if (userData[0].status == 2) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "You can't login as your account is disable now.",
        });
    }


    // Check Password
    if (bcrypt.compareSync(loginData.password, userData[0].password)) {
        let profileData = {};

        //Check Role
        let roleData = await roleModel.getById(userData[0].role_id);
        let imageFolderPath = `${process.env.backend_url}${process.env.user_profile_image_path_name}`;

        if (isEmpty(roleData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: " Unknown User role.",
            });
        }



        if (userData[0].role_id == 1) {
            profileInfo = await superAdminModel.getDataByWhereCondition(
                { id: userData[0].profile_id }, undefined, undefined, undefined, ["id", "name", "email", "profile_image", "status"]
            );

        } else {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "No user found.",
            });
        }

        if (isEmpty(profileInfo)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Unknown User.",
            });
        } else {
            for (let index = 0; index < profileInfo.length; index++) {
                if (profileInfo[index].role_id == userData[0].role_id) {
                    profileInfo = [profileInfo[index]];
                    delete profileInfo[0].role_id;
                    break;
                }
            }
        }

        let uuid = uuidv4();
        delete profileInfo[0].id;

        // Generate profile data

        hashId = await commonObject.hashingUsingCrypto(userData[0].id.toString());
        profileData.api_token = hashId;

        profileData.email = userData[0].email;
        profileData.role = {
            role_id: roleData[0].id,
            role_name: roleData[0].title,
        };

        profileData.profile = profileInfo[0];
        profileData.time_period = Date.now() + 3600000;
        profileData.identity_id = uuid;

        //  "Generate Token"
        let token = jwt.sign(profileData, global.config.secretKey, {
            algorithm: global.config.algorithm,
            expiresIn: global.config.expiresIn, // one day
        });

        delete profileData.api_token;
        delete profileData.time_period;
        delete profileData.identity_id; // device track id
        profileData.token = token;

        // Save user identity in login-tracker
        let dateTimeToday = await commonObject.getGMT();
        let dateToday = await commonObject.getCustomDate(dateTimeToday);



        // profileData.id = userData[0].id; //  frontend requested, we send user id in response.
        profileData.imageFolderPath = imageFolderPath;

        return res.status(200).send({
            success: true,
            message: "Welcome to the system.",
            data: profileData,
        });
    } else {
        return res.status(401).send({
            status: 401,
            success: false,
            message: "Wrong Password",
        });
    }
});


module.exports = router;
