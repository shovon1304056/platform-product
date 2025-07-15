const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const roleModel = require('../models/role');

const verifyToken = require('../middlewares/jwt_verify/verifyToken');
require('dotenv').config();
const { routeAccessChecker } = require('../middlewares/routeAccess');

router.get('/list', [], async (req, res) => {

    let result = await roleModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Role List.",
        "count": result.length,
        "data": result
    });
});


module.exports = router;