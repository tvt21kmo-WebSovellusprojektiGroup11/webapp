const pool = require('../db_handler')();
const express = require('express');
const passport = require('passport');
var router = express.Router();

router.post('/uusi', passport.authenticate('jwt', { session: false }), (req, res) => {
    var lisatty_tuote = [
        req.body.nimi,
        req.body.kuvaus,
        req.body.kategoria,
        req.body.hinta,
        req.body.kuva,
    ]
    var sqlKasky = 'INSERT INTO Tuote ( Nimi, Kuvaus, Kategoria, Hinta, Kuva, Valmistaja ) VALUES ?';
    var haeRavintola = 'SELECT idRavintola FROM RAVINTOLA WHERE Omistaja = ?'
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query(haeRavintola, [[req.user.kayttaja.idKayttaja]]).then(
            rivit => {
                lisatty_tuote.push(rivit[0][0]);
                connection.promise().query(sqlKasky, [[lisatty_tuote]]).then(
                    res.status(201).json({ status: "created" })
                )
            }
        )
    })
})

router.get('/', (req, res) => {
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query('SELECT * FROM Tuote').then(
            connection.end()
        ).then(rivit => {
            res.send(rivit[0]);
        })
    })
})

module.exports = router;
