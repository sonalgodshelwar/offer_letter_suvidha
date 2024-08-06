const mysql=require('mysql2/promise');
require('dotenv').config();
const mySqlpool=mysql.createPool({
    host:"localhost",
    user:process.env.USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB
})
module.exports=mySqlpool;