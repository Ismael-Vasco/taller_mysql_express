const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '157.180.40.190',
    user: 'root',
    password: 'scORHWprCvp26Gz1zwPQgSsokHyPC2',
    database: 'db_andrescortes_ejercicio',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

module.exports = pool;
