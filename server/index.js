const express = require('express')
var app = express()
const port = 3001

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db_handler')();

var kayttajaRouter = require('./routes/kayttaja');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

app.use(bodyParser.json());
app.use(cors());
app.use('/rekisteroidy', kayttajaRouter);




/*********************************************
 * HTTP Basic Authentication
   Route level middleware
*/
passport.use(
  new BasicStrategy(async (kayttajatunnus, salasana, done) => {

      pool.query('SELECT * FROM kayttaja WHERE kayttajatunus=?', 
      [ kayttajatunnus ], function (err, result){
      //console.log(result);
      if (err) throw err;
        //console.log(result[0].kayttajatunus);
        if (result.length > 0) {
          if (result[0].kayttajatunus != undefined) {
          // if passwords match, then proceed to route handler (the protected resource)
            if (bcrypt.compareSync(salasana, result[0].salasana)) {
              done(null, result[0]); 
          }else {
            // if passwords does not match, reject the request
            done(null, false);
          }
        } else {
            done(null, false);
          }
        } else {
          // if user is not found, reject the request
          done(null, false);
        }
    })
  })
);

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
      Puhelinnumero: req.user.Puhelinnnumero
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