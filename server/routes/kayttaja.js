const bcrypt = require('bcryptjs');
const pool = require('../db_handler')();
const express = require('express');
var router = express.Router();

//Uuden käyttäjän lisääminen
router.post('/', (req, res) => {
    //console.log(req.body);

    // luodaan hahsattu salasana
    const salt = bcrypt.genSaltSync(6);
    const passwordHash = bcrypt.hashSync(req.body.Salasana, salt);
    const uusiKayttaja = [
        req.body.Etunimi,
        req.body.Sukunimi,
        req.body.Osoite,
        req.body.Paikkakunta,
        req.body.Puhelinnumero,
        req.body.Ika,
        req.body.Saldo,
        req.body.Kayttajatunnus,

        passwordHash,
        req.body.Rooli
    ]
    var sqlKasky = 'INSERT INTO Kayttaja ( Etunimi, Sukunimi, Osoite, Paikkakunta, Puhelinnumero, Ika, Saldo, Kayttajatunnus, Salasana, Rooli ) VALUES ?';
    // luodaan yhteys tietokantaan operaatioita varten
    pool.getConnection(async function (err, connection) {
        // yhteys on asynkrooninen
        if (err) throw err
        connection.promise().query(sqlKasky, [[uusiKayttaja]], function (err) {
            if (err) throw err;
        }).then(
            res.status(201).json({ status: "created" })
        )
    })

    //console.log(kayttajat);
    //res.send("ok");
})

module.exports = router;
