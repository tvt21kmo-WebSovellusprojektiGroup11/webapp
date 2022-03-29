const bcrypt = require('bcryptjs');
const pool = require('../db_handler')();
const express = require('express');
var router = express.Router();

//Uuden käyttäjän lisääminen
router.post('/', (req, res) => {
    //console.log(req.body);

    // luodaan hahsattu salasana
    const salt = bcrypt.genSaltSync(6);
    const passwordHash = bcrypt.hashSync(req.body.salasana, salt);
    const uusiKayttaja = {
        Etunimi: req.body.Etunimi,
        Sukunimi: req.body.Sukunimi,
        Osoite: req.body.Osoite,
        Paikkakunta: req.body.Paikkakunta,
        Puhelinnumero: req.body.Puhelinnumero,
        Ika: req.body.Ika,
        kayttajatunnus: req.body.kayttajatunnus,
        salasana: passwordHash
    }

    var sqlKasky = 'INSERT INTO kayttaja ( Etunimi, Sukunimi, Osoite, Paikkakunta, Puhelinnumero, Ika, kayttajatunnus, salasana ) VALUES ?';
    // luodaan yhteys tietokantaan operaatioita varten
    pool.getConnection(async function (err, connection) {
        // yhteys on asynkrooninen
        if (err) throw err;

        connection.promise().query(sqlKasky, uusiKayttaja, function (err) {
            if (err) throw err;
            res.status(201).json({ status: "created" });
            connection.end();
        })
    })

    //console.log(kayttajat);
    //res.send("ok");
})

module.exports = router;
