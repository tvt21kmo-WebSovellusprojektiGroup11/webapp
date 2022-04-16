const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);

const serverAddress = "http://localhost:3001";
const ravintolaArrayInfoSchema = require('../schemas/ravintolaArray.schema.json');




describe('Ravintola API test', function () {

    before(function(){
        server.start();
    });

    after(function() {
        server.close();
    });

    describe('GET /ravintola', function() {
        it('pitäisi palauttaa kaikki ravintolat', function(done) {
            //send http request
            chai.request(serverAddress)
                .get('/ravintola')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    // check response status
                    expect(res).to.have.status(200);

                    // check response data structure
                    expect(res.body).to.be.jsonSchema(ravintolaArrayInfoSchema)
                    done();
                })
        })
    })

    describe('Uuden ravintola datan lisäys', function() {

        it('pitäisi hyväksyä uuden ravintolan lisäyksen kun login ja data on oikein', function(done) {
            chai.request(serverAddress)
                    .post('/login')
                    .auth('testCase', 'testCase')
                    // send user login details
                    .send({
                        Kayttajatunnus: 'testCase',
                        Salasana: 'testCase'
                    })
                    .end((err, res) => {
                        console.log('this runs the login part');
                        expect(res).to.have.status(200);
                        var generatedJWT = res.body.jwt;
                        //console.log(generatedJWT);  

            chai.request(serverAddress)
                .post('/ravintola/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimi: "TestiCaseRavintola",
                    Osoite: "Testiravintola 123",
                    Paikkakunta: "Oulu",
                    Saldo: 77,
                    Kuva: "https://public.keskofiles.com/f/recipe/napolilainenpizza_21?w=2400&fit=crop",
                    Kuvaus: "TestiCaseRavintola",
                    Aukioloaika: "MA-PE: 11:00-20:00, LA: 11:00-22:00, SU: SULJETTU",
                    Hintataso: "eee",
                    Tyyppi: "cd"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done();
                })
            })
        })


        it('pitäisi hylätä uuden ravintolan lisäyksen kun login data on väärin', function(done) {
                chai.request(serverAddress)
                    .post('/login')
                    .auth('testCase123', 'testCase')
                    // send user login details
                    .send({
                        Kayttajatunnus: 'testCase123',
                        Salasana: 'testCase'
                    })
                    .end((err, res) => {
                            console.log('this runs the login part');
                        expect(res).to.have.status(401);     
                        var generatedJWT = res.body.jwt;
                        //console.log(generatedJWT);
                            
            chai.request(serverAddress)
                .post('/ravintola/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimi: "TestiCaseRavintola",
                    Osoite: "Testiravintola 123",
                    Paikkakunta: "Oulu",
                    Saldo: 77,
                    Kuva: "https://public.keskofiles.com/f/recipe/napolilainenpizza_21?w=2400&fit=crop",
                    Kuvaus: "TestiCaseRavintola",
                    Aukioloaika: "MA-PE: 11:00-20:00, LA: 11:00-22:00, SU: SULJETTU",
                    Hintataso: "eee",
                    Tyyppi: "cd"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    done();
                    })
                })   
                })
        
        it('pitäisi hylätä uuden ravintolan lisäyksen kun datasta puuttuu kenttiä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                // send user login details
                .send({
                    Kayttajatunnus: 'testCase',
                    Salasana: 'testCase'
                })
                .end((err, res) => {
                        console.log('this runs the login part');
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/ravintola/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    //Nimi: "TestiCaseRavintola",
                    Osoite: "Testiravintola 123",
                    Paikkakunta: "Oulu",
                    Saldo: 77,
                    Kuva: "https://public.keskofiles.com/f/recipe/napolilainenpizza_21?w=2400&fit=crop",
                    Kuvaus: "TestiCaseRavintola",
                    Aukioloaika: "MA-PE: 11:00-20:00, LA: 11:00-22:00, SU: SULJETTU",
                    Hintataso: "eee",
                    Tyyppi: "cd"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })

        it('pitäisi hylätä uuden ravintolan lisäyksen kun datassa vääriä datatyyppejä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                // send user login details
                .send({
                    Kayttajatunnus: 'testCase',
                    Salasana: 'testCase'
                })
                .end((err, res) => {
                        console.log('this runs the login part');
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/ravintola/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimi: "TestiCaseRavintola",
                    Osoite: "Testiravintola 123",
                    Paikkakunta: null, //tässä väärä tietotyyppi
                    Saldo: 77,
                    Kuva: "https://public.keskofiles.com/f/recipe/napolilainenpizza_21?w=2400&fit=crop",
                    Kuvaus: "TestiCaseRavintola",
                    Aukioloaika: "MA-PE: 11:00-20:00, LA: 11:00-22:00, SU: SULJETTU",
                    Hintataso: "eee",
                    Tyyppi: "cd"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })

        it('pitäisi hylätä uuden ravintolan lisäyksen kun lähetetään tyhjä pyyntö', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                // send user login details
                .send({
                    Kayttajatunnus: 'testCase',
                    Salasana: 'testCase'
                })
                .end((err, res) => {
                        console.log('this runs the login part');
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/ravintola/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })

        it('pitäisi löytyä lisätty ravintola', function(done) {
            //send http request
            chai.request(serverAddress)
            .get('/ravintola')
            .end(function(err, res) {
                expect(err).to.be.null;
                // check response status
                expect(res).to.have.status(200);
                
                // check response data structure
                let found = false;
                
                for(let i =0; i<res.body.length; i++){
                    if((res.body[i].Nimi == "TestiCaseRavintola") && 
                    (res.body[i].Osoite == "Testiravintola 123") &&
                    (res.body[i].Paikkakunta == "Oulu") &&
                    (res.body[i].Saldo == 77) &&
                    (res.body[i].Kuva == "https://public.keskofiles.com/f/recipe/napolilainenpizza_21?w=2400&fit=crop") &&
                    (res.body[i].Kuvaus == "TestiCaseRavintola") &&
                    (res.body[i].Aukioloaika == "MA-PE: 11:00-20:00, LA: 11:00-22:00, SU: SULJETTU") &&
                    (res.body[i].Hintataso == "eee") &&
                    (res.body[i].Tyyppi == "cd")
                    ) {
                        found = true;
                        break;
                    }
                }
                if(found == false) {
                    assert.fail('Data not saved');
                }
                done();
            })
            })
    })
})

