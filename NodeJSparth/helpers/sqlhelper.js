require('dotenv').config();
const mysql = require('mysql');
const _ = require('lodash');

const DB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

DB.getConnection(function(err, connection) {
    if (err!=null && (err.code==='ECONNREFUSED' || err.code==='ETIMEDOUT')) {
        console.log('sql not connected...');
        return false;
    }else{
        console.log('sql connected...');
    }
});

// pool.on('error', function(err) {
//   console.log("DB ERROR : " + err);
// });


const sqlhelper = {};

sqlhelper.select = async (query, data_array=[], callback) => {
    return new Promise(resolve => {
        DB.getConnection(function(err, con) {
            let sql_data = con.query(query, data_array, (err, res) => {
                con.destroy();
                if (err) {
                    return resolve(callback(err, ""));
                } else {
                    return resolve(callback("", res));
                }
            });
            // console.log("=======================");
            // console.log(sql_data.sql);
        });
    });
}

sqlhelper.insert = async (table_name, insert_data = {}, callback) => {
    return new Promise(resolve => {
        DB.getConnection(function(err, con) {
            let sql_data = con.query('INSERT INTO '+table_name+' SET ?', insert_data, (err, res) => {
                con.destroy();
                if (err) {
                    return resolve(callback(err, ""));
                } else {
                    return resolve(callback("", res));
                }
            });
            // console.log(sql_data.sql);
        });
    });
}

sqlhelper.update = async (table_name, update_data = {}, where = {}, callback) => {
    let update_key = Object.keys(update_data);
    update_key = update_key.join('=?, ');
    update_key = (update_key!='' ? update_key+'=?' : '');

    let where_key = Object.keys(where);
    where_key = where_key.join('=? AND ');
    where_key = (where_key!='' ? ' AND '+where_key+'=? ' : '');

    update_data = Object.values(update_data);
    _.each(where, (wVal, wKey) => {
        update_data.push(wVal);
    });

    return new Promise(resolve => {
        DB.getConnection(function(err, con) {
            let sql_data = DB.query('UPDATE '+table_name+' SET '+update_key+' WHERE 1 '+where_key, update_data, (err, res) => {
                con.destroy();
                if (err) {
                    return resolve(callback(err, ""));
                } else {
                    console.log(sql_data.sql);
                    return resolve(callback("", res));
                }
            });
        });
    });
}

module.exports = sqlhelper;