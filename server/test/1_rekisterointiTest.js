const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);

const serverAddress = "http://localhost:3001";



describe('Rekisteröinti API test', function () {

    before(function(){
        server.start();
    });

    after(function() {
        server.close();
    });

    describe('Uuden käyttäjän datan lisäys', function() {

        it('pitäisi hyväksyä uuden käyttäjän lisäyksen kun data on oikein', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimi: "Testi",
                Sukunimi: "Teppo",
                Osoite: "Testikuja 58 A 1",
                Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                Ika: 55,
                Saldo: 77,
                Kayttajatunnus: "testCase",
                Salasana: "testCase",
                Rooli: "Omistaja"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            })
        })

        it('pitäisi hylätä pyynnön, kun pyynnöstä puuttuu data kenttä', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimi: "Testi",
                Sukunimi: "Teppo",
                Osoite: "Testikuja 58 A 1",
                Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                Ika: 55,
                Saldo: 77,
                Kayttajatunnus: "testCase",
                Salasana: "testCase"
                //Rooli: "asiakas"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

        it('pitäisi hylätä pyynnön, kun pyynnöstä puuttuu data kenttä', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimi: "Testi",
                Sukunimi: "Teppo",
                //Osoite: "Testikuja 58 A 1",
                Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                Ika: 55,
                Saldo: 77,
                Kayttajatunnus: "testCase",
                Salasana: "testCase",
                Rooli: "asiakas"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

        it('pitäisi hylätä pyynnön, kun pyynnöstä puuttuu data kenttä', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimi: "Testi",
                Sukunimi: "Teppo",
                Osoite: "Testikuja 58 A 1",
                //Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                //Ika: 55,
                Saldo: 77,
                //Kayttajatunnus: "testCase",
                Salasana: "testCase",
                Rooli: "asiakas"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

        it('pitäisi hylätä pyynnön, kun pyynnössä vääriä datatyyppejä ', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimi: "Testi",
                Sukunimi: 5,
                Osoite: "Testikuja 58 A 1",
                Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                Ika: 55,
                Saldo: 77,
                Kayttajatunnus: "testCase",
                Salasana: "testCase",
                Rooli: "asiakas"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

        it('pitäisi hylätä pyynnön, kun pyynnössä vääriä datatyyppejä ', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimi: "Testi",
                Sukunimi: "5",
                Osoite: "Testikuja 58 A 1",
                Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                Ika: "55",
                Saldo: 77,
                Kayttajatunnus: "testCase",
                Salasana: "testCase",
                Rooli: "asiakas"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

        it('pitäisi hylätä pyynnön, kun pyynnössä vääriä kenttänimiä ', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .send({
                Etunimiii: "Testi",
                Sukunimi: "5",
                Osoite: "Testikuja 58 A 1",
                Paikkakunta: "Oulu",
                Puhelinnumero: "045666",
                Ika: "55",
                Saldo: 77,
                Kayttajatunnus: "testCase",
                Salasana: "testCase",
                Rooli: "asiakas"
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

        it('pitäisi hylätä tyhjä pyyntö ', function(done) {
            chai.request(serverAddress)
            .post('/rekisteroidy')
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })

    })
})