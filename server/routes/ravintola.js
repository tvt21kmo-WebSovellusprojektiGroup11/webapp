const pool = require('../db_handler')();
const express = require('express');
const passport = require('passport');
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
router.post('/uusi', passport.authenticate('jwt', { session: false }), (req, res) => {
    var uusiRavintola = [
        req.body.Nimi,
        req.body.Osoite,
        req.body.Paikkakunta,
        req.body.Saldo,
        req.body.Kuva,
        req.body.Kuvaus,
        req.body.Aukioloaika,
        req.body.Hintataso,
        req.body.Tyyppi
    ]
    kayttajanID = req.user.Kayttaja.idKayttaja
    var ravintolaInsert = 'INSERT INTO Ravintola ( Nimi, Osoite, Paikkakunta, Saldo, Kuva, Kuvaus, Aukioloaika, Hintataso, Tyyppi, Omistaja ) VALUES ?'
    var tarkistaKayttajaTyyppi = `SELECT IF((SELECT Rooli from Kayttaja where idKayttaja = ${req.user.Kayttaja.idKayttaja}) = "Omistaja", "True", "False") AS OnkoOmistaja`
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query(tarkistaKayttajaTyyppi).then(
            vastaus => {
                console.log(vastaus[0][0])
                if (vastaus[0][0].OnkoOmistaja === "True") {
                    uusiRavintola.push(req.user.Kayttaja.idKayttaja)
                    connection.promise().query(ravintolaInsert, [[uusiRavintola]]).then(
                        res.status(201).json({ status: "created" })
                    )
                } else if (vastaus[0][0].OnkoOmistaja === "False") {
                    res.status(403).json({ status: "not allowed" });
                } else {
                    res.status(500).json({ status: "Jottain meni vikkaan" })
                }
            }
        )
    })
})

module.exports = router;
