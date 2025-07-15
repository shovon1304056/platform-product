const mysql = require('mysql');
require('dotenv').config();


// This is for single connect
const connectionProductOperation = mysql.createConnection({
    host: process.env.DB_HOST_v1,
    user: process.env.DB_USER_v1,
    password: process.env.DB_PASS_v1,
    database: process.env.DB_DATABASE_v1
});


// This is for pool connect
const connectionProductOperationPool = mysql.createPool({
    connectionLimit: 500,
    host: process.env.DB_HOST_v1,
    user: process.env.DB_USER_v1,
    password: process.env.DB_PASS_v1,
    database: process.env.DB_DATABASE_v1
});


// Use only testing time
const connectionProductOperationTesting = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "",
    database: "staffingdb_products"
});


module.exports = {

    connectionProductOperationMYSQL: connectionProductOperationPool,
    connectionProductOperationMYSQLGeneral: connectionProductOperation,
}