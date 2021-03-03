const express = require('express');
const db = require('../db');

const authRouter = express.Router();

/* API route POST request method */
authRouter.post('/login', async (req, res, next) => {
    try {
        let result = await db.login(req.body);
        res.json(result);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }

});

/* API route POST request method */
authRouter.post('/register', async (req, res, next) => {
    try {
        let result = await db.post(req.body);
        res.json(result);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }

});


module.exports = authRouter;