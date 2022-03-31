const pool = require('../db_handler')();
const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    pool.query('SELECT * from Ravintola', (err, result) => {
        //console.log(result);
        res.json(result);
        if (err) throw err;
    })
})
router.get('/:id', (req, res) => {
    pool.query('SELECT * from Ravintola where idRavintola= ?', [req.params.id], (err, result) => {
        res.json(result);
        if (err) throw err;
    })
})   


module.exports = router;
