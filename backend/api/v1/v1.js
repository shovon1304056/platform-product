const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
let fs = require('fs');
let path = require('path');
const commonObject = require('./common/common');

const { connectionProductOperationMYSQL } = require('./connections/connection');
global.config = require('./jwt/config/config');

const roleRouter = require('./routers/role');
const authenticationRouter = require('./routers/authentication');
const userRouter = require('./routers/user');
const productCategoryRouter = require('./routers/product-category');
const productRouter = require('./routers/product');

router.use('/authentication', authenticationRouter);
router.use('/role', roleRouter);
router.use('/user', userRouter);
router.use('/product-category', productCategoryRouter);
router.use('/product', productRouter);

router.get('/connection_check', (req, res) => {

    try {

        // This is for Pool connect
        connectionProductOperationMYSQL.getConnection(function (err, connection) {
            if (err) {
                // connection.release();
                return res.send({
                    "message": "Connection create fail",
                    "error": err,
                    "api v": 1
                });
            }

            connection.release();
            return res.send({
                "message": "Connection create success ",
                "api v": 1,
                "precess": connectionProductOperationMYSQL._acquiringConnections.length,
                "length": connectionProductOperationMYSQL._allConnections.length
            });
        });


    } catch (error) {
        return res.status(400)
            .send({
                "status": 404,
                "message": "Connection create fail try",
                "api v": 1,
                "error": error
            });
    }
});


module.exports = router;