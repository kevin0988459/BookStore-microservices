// db.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'demo-dbclusteraurorabookstore-ou8haugw4fqd.cluster-cxjtm3qlr9xq.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'awsadmin',
    password: 'password',
    database: 'lab1db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// mysql2 must have
module.exports = pool.promise();