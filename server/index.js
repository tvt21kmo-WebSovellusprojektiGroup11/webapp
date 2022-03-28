const express = require('express')
const app = express()
const port = 3001

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

app.use(bodyParser.json());
app.use(cors());

//Uuden käyttäjän testailua varten ilman databasea
const kayttajat = [
  {
    idKayttaja: uuidv4(),
    Etunimi: "Testi",
    Sukunimi: "Kaali",
    Osoite: "Testikatu 1",
    Paikkakunta: "Oulu",
    Puhelinnumero: "045",
    Ika: 66,
    kayttajatunnus: 'demouser',
    salasana: '$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou', // testerpassword
  }
];

//Uuden käyttäjän lisääminen
app.post('/kayttaja', (req, res) => {
  //console.log(req.body);

  // luodaan hahsattu salasana
  const salt = bcrypt.genSaltSync(6);
  const passwordHash = bcrypt.hashSync(req.body.salasana, salt);
  const uusiKayttaja = {
    idKayttaja: uuidv4(),
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

  //console.log(kayttajat);
  //res.send("ok");
  res.status(201).json({ status: "created" });
})


/*********************************************
 * HTTP Basic Authentication
   Route level middleware
*/
passport.use(new BasicStrategy(
  function (kayttajatunnus, salasana, done) {
    //console.log('kayttajatunnus: ' + kayttajatunnus);
    //console.log('salasana: ' + salasana);

    // Katsotaan löytyykö täsmäävää käyttäjätunnusta 
    // Tämä database queryksi, kuhan database käytössä
    const kayttaja = kayttajat.find(u => u.kayttajatunnus === kayttajatunnus);

    // Jos täsmäävä käyttäjätunnus, vertaillaan salasanoja
    if (kayttaja != null) {
      // if passwords match, then proceed to route handler (the protected resource)
      if (bcrypt.compareSync(salasana, kayttaja.salasana)) {
        done(null, kayttaja); // tässä välitetään user info, jota voi käyttää req:llä myöhemmin
      } else {
        // if passwords does not match, reject the request
        done(null, false);
      }
    } else {
      // if user is not found, reject the request
      done(null, false);
    }

  }

));

//http- basic auth testiä varten potected resource
app.get('/my-protected-resource', passport.authenticate('basic', { session: false }), (req, res) => {
  console.log('Protected recourse accessed!');

  res.send('Hello Protected World')
})


/*********************************************
//LOGIN
  käyttää http basic authia ja palauttaa lopuksi JsonWebTokenin
//basic auth tarkastaa käyttäjätunnuksen ja salasanan
*/

//Tällä haetaan secretKey jwt-key.json tiedostosta, joka ei ole githubissa mukana
let jwtSecretKey = require('./jwt-key.json').secret;

app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
  //console.log(req);
  // generoidaan jwt
  //Luulin että pitäs olla 'req.kayttaja.idKayttaja', mutta ei toimiku userilla
  const payload = {
    kayttaja: {
      idKayttaja: req.user.idKayttaja,
      Etunimi: req.user.Etunimi,
      Sukunimi: req.user.Sukunimi,
      Puhelinnumero: req.user.Puhelinnumero
    }
  };
  const secretKey = jwtSecretKey;
  const options = {
    expiresIn: '1d' // tokenin vanhenemisaika
  }
  const generatedJWT = jwt.sign(payload, secretKey, options)
  // send JWT as a response
  res.json({ jwt: generatedJWT })
})

//JWT 
//Optionissa määritellään mistä passportti löytää tokenin
//Annetaan secret key, niin jwtStrategy voi käyttää sitä automaattisesti tokenin validointiin
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecretKey
}

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  console.log('JWT on validi');
  console.log('Payloadi: ');
  console.log(jwt_payload);

  //tässä voidaan välittää serverille payloadin sisältö
  done(null, jwt_payload);
}))

//JWT suojattu testi-reitti
app.get('/jwt-protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  //console.log(req);
  console.log('Käyttäjä ID jwt tokenista luettuna ' + req.user.kayttaja.idKayttaja);
  res.send("OK " + req.user.kayttaja.Etunimi + " " + req.user.kayttaja.Sukunimi);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
