module.exports = () => {
    var mysql = require('mysql2');
    var dotenv = require('dotenv');
    dotenv.config();

    var connectionPool = mysql.createPool({
        host: process.env.MYSQL_URL,
        user: process.env.MYSQL_USR,
        password: process.env.MYSQL_PASSWD,
        database: process.env.MYSQL_DB
    });
    console.log(process.env.MYSQL_URL)
    return connectionPool
}
