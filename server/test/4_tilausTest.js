const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);

const serverAddress = "http://localhost:3001";
const tilausArrayInfoSchema = require('../schemas/tilausArray.schema.json');


describe('Tilaus API test', function () {

    before(function(){
        server.start();
    });

    after(function() {
        server.close();
    });

    describe('GET /tilaus', function() {
        it('pitäisi palauttaa käyttäjän tilauksen', function(done) {
            chai.request(serverAddress)
            .post('/login')
            // send user login details
            .auth('testCase', 'testCase')
            .end((err, res) => {
                //console.log('this runs the login part');
                expect(res).to.have.status(200);
                var generatedJWT = res.body.jwt;
                //console.log(generatedJWT); 

            //send http request
            chai.request(serverAddress)
                .get('/tilaus')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    // check response status
                    expect(res).to.have.status(200);

                    // check response data structure
                    expect(res.body).to.be.jsonSchema(tilausArrayInfoSchema)
                    done();
                })
        })
    })

    describe('Uuden tilauksen lisäys', function() {

        it('pitäisi hyväksyä uuden tilauksen lisäyksen kun login ja data on oikein', function(done) {
            chai.request(serverAddress)
                    .post('/login')
                    // send user login details
                    .auth('testCase', 'testCase')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        var generatedJWT = res.body.jwt;
                        //console.log(generatedJWT);  

            chai.request(serverAddress)
                .post('/tilaus/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Toimitusaika: "test tilaus1 15:00",
                    Tuotteet: [1,2]
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    done();
                })
            })
        })
        it('pitäisi hylätä tilauksen kun login data on väärin', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase123', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(401);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tilaus/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Toimitusaika: "test tilaus1 15:00",
                    Tuotteet: [1,2]
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    done();
                    })
                })   
        })
        it('pitäisi hylätä uuden tilauksen kun datasta puuttuu kenttiä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tilaus/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    //Toimitusaika: "test tilaus1 15:00",
                    Tuotteet: [1,2]
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
        })
        it('pitäisi hylätä uuden tilauksen lisäyksen kun datassa vääriä tietotyyppejä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tilaus/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Toimitusaika: "test tilaus1 15:00",
                    Tuotteet: {
                        1:2
                    }
                })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
        })
        it('pitäisi hylätä uuden tilauksen lisäyksen kun lähetetään tyhjä pyyntö', function(done) {
            chai.request(serverAddress)
                .post('/login')
                // send user login details
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tilaus/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    done();
                    })
                })   
        })
        it('pitäisi löytyä tehty tilaus', function(done) {
            chai.request(serverAddress)
                .post('/login')
                // send user login details
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
            
            //send http request
            chai.request(serverAddress)
            .get('/tilaus')
            .set({ "Authorization": `Bearer ${generatedJWT}` })
            .end(function(err, res) {
                expect(err).to.be.null;
                // check response status
                expect(res).to.have.status(200);
                
                // check response data structure
                let found = false;
                
                for(let i =0; i<res.body.length; i++){
                    if((res.body[i].Toimitusaika == "test tilaus1 15:00")
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
        it('pitäisi hylätä uuden tilauksen kun datassa vääriä kenttänimiä', function(done) {
            chai.request(serverAddress)
                .post('/login')
                .auth('testCase', 'testCase')
                .end((err, res) => {
                    expect(res).to.have.status(200);     
                    var generatedJWT = res.body.jwt;
                    //console.log(generatedJWT);
                        
            chai.request(serverAddress)
                .post('/tilaus/uusi')
                .set({ "Authorization": `Bearer ${generatedJWT}` })
                .send({
                    Toimitusaikaasd: "test tilaus1 15:00",  //
                    Tuotteet: [1,2]
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
})