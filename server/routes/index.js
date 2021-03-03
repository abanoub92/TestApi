const { query } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

/* API route GET request method for users search */
router.get('/search', verifyToken, async (req, res, next) => {
    try {
        let result = await db.search(req.query.name);
        res.json(result);
    } catch (e){
        res.send(e);
        //console.log(e);
        //res.sendStatus(500);
    }

});

/* API route GET request method */
router.get('/', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err){
            res.sendStatus(401);
        }else {
            try{
                // let result = await db.all();
                let result = await db.pagination(req.query.page, req.query.size);
                res.json(result);
            }catch(e){
                console.log(e);
                res.sendStatus(500);
            }
        }
    });
});

router.get('/:id', verifyToken, async (req, res, next) => {
    
    try{
        let result = await db.one(req.params.id);
        res.json(result);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }

});

/* API route POST request method */
router.post('/', verifyToken, async (req, res, next) => {

    try {
        let result = await db.post(req.body);
        res.json(result);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }

});

/* API route DELETE request method */
router.delete('/', verifyToken, async (req, res, next) => {

    try {
        let result = await db.delete(req.params.id);
        res.json(result);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }

});

/** 
 * Format of TOKEN
 * Authorization: Bearer <access_token>
 * Check if user authorized for calling these previous APIs
 */
function verifyToken(req, res, next){
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined'){
        // Split at the space 
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next to middleware
        next();
    }else {
        // unauthorized
        // res.json({
        //     status: 401,
        //     message: 'You are not authorized to use this route'
        // })
        res.sendStatus(401);
    }

}

module.exports = router;