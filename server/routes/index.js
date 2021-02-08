const express = require('express');
const db = require('../db');

const router = express.Router();

/* API route GET request method */
router.get('/', async (req, res, next) => {
    
    try{
        // let result = await db.all();
        let result = await db.pagination(req.query.page, req.query.size);
        res.json(result);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }

});

router.get('/:id', async (req, res, next) => {
    
    try{
        let result = await db.one(req.params.id);
        res.json(result);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }

});

/* API route POST request method */
router.post('/', async (req, res, next) => {

    try {
        let result = await db.post(req.body);
        res.json(result);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }

});

/* API route DELETE request method */
router.delete('/', async (req, res, next) => {

    try {
        let result = await db.delete(req.params.id);
        res.json(result);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }

});

module.exports = router;