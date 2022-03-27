const express = require('express')
const app = express()
const port = 3001

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');  

app.use(bodyParser.json());
app.use(cors());

//Uuden käyttäjän testailua varten ilman databasea
const kayttajat = [
    
];

//Uuden käyttäjän lisääminen
app.post('/kayttaja', (req, res) => {
    console.log(req.body);
    
    // luodaan hahsattu salasana
    const salt = bcrypt.genSaltSync(6);
    const passwordHash = bcrypt.hashSync(req.body.salasana, salt);
    const uusiKayttaja= {
       id: uuidv4(),
       Etunimi: req.body.Etunimi,
       Sukunimi: req.body.Sukunimi,
       Osoite: req.body.Osoite,
       Paikkakunta: req.body.Paikkakunta,
       Puhelinnumero: req.body.Puhelinnumero,
       Ika: req.body.Ika,
       kayttajatunnus: req.body.kayttajatunnus,
       salasana: passwordHash
    }

    //koska käyttäjät on taulukossa eikä vielä db connectionia, pusketaan uusi sinne taulukkoon
    kayttajat.push(uusiKayttaja);

    console.log(kayttajat);

    //res.send("ok");
    res.status(201).json({ status: "created" });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})