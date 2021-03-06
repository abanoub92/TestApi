const mysql = require('mysql');
const jwt = require('jsonwebtoken');
//const { use } = require('../routes');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: '',
    database: 'blog',
    host: 'localhost',
    port: '3306',
    multipleStatements: true    // use this with stored procedures and functions that use multipleStatements
});

let blogdb = {};

/**
 * GET all data in users table
 */
blogdb.all = () => {

    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users`, (err, results) => {
            if (err){
                return reject(err);
            }

            return resolve(results);
        });
    });

};

/**
 * GET all data in users table with pagination
 */
blogdb.pagination = (page, size) => {

    return new Promise((resolve, reject) => {
        var offset = size * (page - 1);

        const mresults = {}
        mresults.next = {
            page: parseInt(page) + 1,
            size: parseInt(size)
        }

        mresults.previous = {
            page: parseInt(page) - 1,
            size: parseInt(size)
        }

        pool.query(`SELECT * FROM users LIMIT ?, ?`, [offset, parseInt(size)], (err, results) => {
            if (err){
                return reject(err);
            }

            mresults.results = results;
            return resolve(mresults);
        });
    });

};

/**
 * GET only one specific row in table by row id
 */
blogdb.one = (id) => {

    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
            if (err){
                return reject(err);
            }

            return resolve(results[0]);
        });
    });

};

/**
 * DELETE one specific row in table by id
 */
blogdb.delete = (id) => {

    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM users WHERE id = ?`, [parseInt(id)], (err, results) => {
            if (err){
                return reject(err);
            }

            return resolve('User deleted successfully');
        });
    });

};

/**
 * POST new row of data (Create or Update)
 */
blogdb.post = (user) => {

    return new Promise((resolve, reject) => {
        var sql = "SET @id = ?;SET @email =?;SET @username =?;SET @password = ?; CALL userAddOrEdit(@id, @email, @username, @password);";

        pool.query(sql, [user.id, user.email, user.username, user.password], (err, results) => {
            if (err){
                return reject(err);
            }

            results.forEach(element => {
                if (element.constructor == Array)
                    if (user.id == 0)
                        return resolve(`Inserted user id :: ${element[0].id}`);
                    else     
                        return resolve(`Updated user id :: ${element[0].id}`);
            });
        });
    });

};


/**
 * GET users by search letters
 */
blogdb.search = (name) => {
    return new Promise((resolve, reject) => {
        var sql = "SET @username = ?; CALL userSearch(@username);";

        pool.query(sql, [`${name}%`], (err, results) => {
            if (err){
                return reject(err);
            }

            return resolve(results[1]);
        });
    });

};

/**
 * GET user if username and password are correct and valid
 */
blogdb.login = (user) => {
    return new Promise((resolve, reject) => {
        var sql = "SET @username =?;SET @password = ?; CALL userLogin(@username, @password);";

        pool.query(sql, [user.username, user.password], (err, results) => {
        
            if (err){
                return reject(err);
            }

            const success = {};
            success.user = results[2][0];

            if (success.user != null){
                jwt.sign({user: user}, 'secretkey', (err, token) => {
                    if (err){
                        return reject(err);
                    }
    
                    success.token = token;
                });

                return resolve(success);
            }else {
                success.status = 404;
                success.message = 'Username / Password not found or registered.';

                return resolve(success);
            }
        });
    });
}

module.exports = blogdb;