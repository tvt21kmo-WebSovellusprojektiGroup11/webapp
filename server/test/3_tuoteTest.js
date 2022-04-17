const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);

const serverAddress = "http://localhost:3001";
const tuoteArrayInfoSchema = require('../schemas/tuoteArray.schema.json');



describe('Tuote API test', function () {

    before(function(){
        server.start();
    });

    after(function() {
        server.close();
    });

    describe('GET /tuote', function() {
        it('pitäisi palauttaa kaikki tuotteet', function(done) {
            //send http request
            chai.request(serverAddress)
                .get('/tuote')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    // check response status
                    expect(res).to.have.status(200);

                    // check response data structure
                    expect(res.body).to.be.jsonSchema(tuoteArrayInfoSchema)
                    done();
                })
        })
    })
    describe('Uuden tuotteen lisäys', function() {

        it('pitäisi hyväksyä uuden tuotteen lisäyksen kun login ja data on oikein', function(done) {
            chai.request(serverAddress)
                    .post('/login')
                    // send user login details
                    .auth('testCase', 'testCase')
                    /*.send({
                        Kayttajatunnus: 'testCase',
                        Salasana: 'testCase'
                    })*/
                    .end((err, res) => {
                        //console.log('this runs the login part');
                        expect(res).to.have.status(200);
                        var generatedJWT = res.body.jwt;
                        //console.log(generatedJWT);  

            chai.request(serverAddress)
                .post('/tuote/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimi: "test product",
                    Kuvaus: "tst kuvaus ",
                    Kategoria: "a",
                    Hinta: 100,
                    Kuva: "https://dummyjson.com/image/i/products/1/3.jpg"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done();
                })
            })
        })
        
        it('pitäisi hylätä uuden tuotteen lisäyksen kun login data on väärin', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase123', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(401);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tuote/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimi: "test product",
                    Kuvaus: "tst kuvaus ",
                    Kategoria: "a",
                    Hinta: 100,
                    Kuva: "https://dummyjson.com/image/i/products/1/3.jpg"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    done();
                    })
                })   
            })

        it('pitäisi hylätä uuden tuotteen lisäyksen kun datasta puuttuu kenttiä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tuote/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    //Nimi: "test product",
                    Kuvaus: "tst kuvaus ",
                    Kategoria: "a",
                    Hinta: 100,
                    Kuva: "https://dummyjson.com/image/i/products/1/3.jpg"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })
        it('pitäisi hylätä uuden tuotteen lisäyksen kun datassa vääriä tietotyyppejä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tuote/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimi: "test product",
                    Kuvaus: "tst kuvaus ",
                    Kategoria: 7, //väärä tietotyyppi
                    Hinta: 100,
                    Kuva: "https://dummyjson.com/image/i/products/1/3.jpg"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })
        it('pitäisi hylätä uuden tuotteen lisäyksen kun lähetetään tyhjä pyyntö', function(done) {
            chai.request(serverAddress)
                .post('/login')
                // send user login details
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tuote/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })
        it('pitäisi löytyä lisätty tuote', function(done) {
            //send http request
            chai.request(serverAddress)
            .get('/tuote')
            .end(function(err, res) {
                expect(err).to.be.null;
                // check response status
                expect(res).to.have.status(200);
                
                // check response data structure
                let found = false;
                
                for(let i =0; i<res.body.length; i++){
                    if((res.body[i].Nimi == "test product") && 
                    (res.body[i].Kuvaus == "tst kuvaus ") &&
                    (res.body[i].Kategoria == "a") &&
                    (res.body[i].Hinta == "100") &&
                    (res.body[i].Kuva == "https://dummyjson.com/image/i/products/1/3.jpg") 
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
        it('pitäisi palauttaa kaikki ravintolan tuotteet', function(done) {
            //send http request
            chai.request(serverAddress)
                .get('/tuote/1')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    // check response status
                    expect(res).to.have.status(200);

                    // check response data structure
                    expect(res.body).to.be.jsonSchema(tuoteArrayInfoSchema)
                    done();
                })
        })
        it('pitäisi hylätä uuden tuotteen lisäyksen kun datassa vääriä kenttänimiä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tuote/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Nimiii: "test product", //
                    Kuvaus: "tst kuvaus ",
                    Kategoria: "a",
                    Hintasdf: 100,  //
                    Kuva: "https://dummyjson.com/image/i/products/1/3.jpg"
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
                })
})
})