const pool = require('../db_handler')();
const express = require('express');
const passport = require('passport');
var router = express.Router();

router.post('/uusi', passport.authenticate('jwt', { session: false }), (req, res) => {
    // TODO: Jos jää aikaa tekee kuiteista kantaan muutoksia niin että ne toimii järkevästi
    // tällähetkellä jotta saadaan toimivatuote jätetään idKuitti tyhjäksi
    var lisaaUusiTilaus = 'INSERT INTO Tilaus ( Hinta, Toimitusaika ) VALUES ?';
    var haeTuotteenHinta = 'SELECT idTuote, Hinta FROM Tuote WHERE idTuote IN (?)';
    var asetaTilausKayttajalle = 'UPDATE Kayttaja SET Tilaus = LAST_INSERT_ID()  WHERE idKayttaja = ? '
    var kokonaisHinta = 0;
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(haeTuotteenHinta, [req.body.Tuotteet], function (err, rivit) {
            for (idTuote in req.body.Tuotteet)
                for (tuote in rivit) {
                    if (req.body.Tuotteet[idTuote] == rivit[tuote]['idTuote'])
                        kokonaisHinta += Number(rivit[tuote]['Hinta']);
                }
            connection.query(lisaaUusiTilaus, [[[kokonaisHinta, req.body.Toimitusaika]]], function () {
                connection.query(asetaTilausKayttajalle, [[req.user.Kayttaja.idKayttaja]], function () {
                    res.status(201).json({ status: "created" })
                })
            })
        })
    })
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    haeTilaus = 'SELECT idTilaus, Hinta, Toimitusaika FROM Tilaus where idTilaus = (SELECT Tilaus from Kayttaja where idKayttaja = ?)'
    pool.getConnection(async function (err, connection) {
        if (err) throw err;
        connection.promise().query(haeTilaus, [[req.user.Kayttaja.idKayttaja]]).then(
            connection.end()
        ).then(rivit => {
            res.send(rivit[0]);
        })
    })
})

// TODO: tässä vähän raameja tilauksen Tilan päivittämiseen, muta tämäkin vaatii vähän kanta rakenteen hiomista
// Ongelma kantarakenteessa on, että tällähetkellä tilauksesta on epäluotettavaa
//router.post('/paivita', passport.authenticate('jwt', { session: false }), (req, res) => {
//    asetaTila = 'UPDATE Tilaus SET Tila = ? WHERE idTilaus = ?';
//    pool.getConnection(async function (err, connection) {
//        if (err) throw err;
//        connection.promise().query(asetaTila, [[req.body.Tila, req.user.Kayttaja.idKayttaja]])
//    })
//})

module.exports = router;
