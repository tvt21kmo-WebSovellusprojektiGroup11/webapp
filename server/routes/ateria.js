const pool = require('../db_handler')();
const express = require('express');
const Connection = require('mysql2/typings/mysql/lib/Connection');
const { transformAuthInfo } = require('passport');
var router = express.Router();

router.post('/uusi', (req, res) => {
    const lisattu_tuote = [
        req.body.nimi,
        req.body.kuvaus,
        req.body.kategoria,
        req.body.hinta,
        req.body.kuva
    ]
    var sqlKasky = 'INSERT INTO Tuote ( nimi, kuvau, kategoria, hinta, kuva ) VALUES ?';
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query(sqlKasky[[lisattu_tuote]], function (err) {
            if (err) throw err;
        }).then(
            connection.destroy()
        ).then(
            res.status(201).json({ status: "created" })
        )
    })
})
router.get('/', (req, res) => {
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise.query('SELECT * FROM Tuote', function (err) {
            if (err) throw err;
        }).then(rivit => {
            res.send(rivit[0]);
        })
    })
})
module.exports = router;
