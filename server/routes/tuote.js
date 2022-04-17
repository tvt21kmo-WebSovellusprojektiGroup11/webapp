const pool = require('../db_handler')();
const express = require('express');
const passport = require('passport');
var router = express.Router();
const Ajv = require("ajv")
const ajv = new Ajv()


const tuoteSchema= require('../schemas/tuote.schema.json');
const tuoteInfoValidator = ajv.compile(tuoteSchema);


//middleware jolla tarkastetaan onko kaikissa kentissä arvot ennen lähetystä
const tuoteInfoValidateMw = function(req, res, next) {
    const validationResult = tuoteInfoValidator(req.body);

    if(validationResult == true) {
        next();
    }else {
        console.log(tuoteInfoValidator.errors);
        res.status(400).json({ status: "puuttuvia tietoja"})
    }
}

router.post('/uusi', tuoteInfoValidateMw, passport.authenticate('jwt', { session: false }), (req, res) => {
    var lisatty_tuote = [
        req.body.Nimi,
        req.body.Kuvaus,
        req.body.Kategoria,
        req.body.Hinta,
        req.body.Kuva,
    ]
    var sqlKasky = 'INSERT INTO Tuote ( Nimi, Kuvaus, Kategoria, Hinta, Kuva, Valmistaja ) VALUES ?';
    var haeRavintola = 'SELECT idRavintola FROM Ravintola WHERE Omistaja = ?'
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query(haeRavintola, [[req.user.Kayttaja.idKayttaja]]).then(
            rivit => {
                lisatty_tuote.push(rivit[0][0].idRavintola);
                connection.promise().query(sqlKasky, [[lisatty_tuote]]).then(
                    res.status(201).json({ status: "created" })
                )
            }
        )
    })
})

router.get('/:idravintola', (req, res) => {
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query('SELECT * FROM Tuote where Valmistaja = ?', req.params.idravintola).then(
            connection.end()
        ).then(rivit => {
            res.send(rivit[0]);
        })
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
