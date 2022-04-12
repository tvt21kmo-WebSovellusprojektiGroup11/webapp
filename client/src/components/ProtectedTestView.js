import React from 'react'
import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Constants from '../Constants.json';
import { useState } from 'react';

//jwt tokenista datanluku testailua. Muutettu käyttäjätiedoksi. Voi halutessaan poistaa

export default function ProtectedTestView(props) {

    const [testInfo, setTestInfo] = useState();

    const decodedToken = jwt.decode(props.jwt);
    console.log(decodedToken);

    const loadDataWithJWT = async() => {
        try {
          const result = await axios.get(
            Constants.API_ADDRESS + '/jwt-protected',
            {
              headers: {
                'Authorization': 'Bearer ' + props.jwt
              }
            })
          console.log(result);
          setTestInfo(result.data);
        } catch (error) {
          console.log(error);
        }
  
      }

// Käyttäjän id: {decodedToken.Kayttaja.idKayttaja}<br/>

  return (
    <div className="homeBox">
        <h2>Käyttäjän tiedot</h2>
        <div>
            
            Etunimi: {decodedToken.Kayttaja.Etunimi}<br/>
            Sukunimi: {decodedToken.Kayttaja.Sukunimi}<br/>
            Osoite: {decodedToken.Kayttaja.Osoite}<br/>
            Paikkakunta: {decodedToken.Kayttaja.Paikkakunta}<br/>
            Puhelinnumero: {decodedToken.Kayttaja.Puhelinnumero}<br/>
            Ika: {decodedToken.Kayttaja.Ika}<br/>
            Käyttäjän saldo: {decodedToken.Kayttaja.Saldo}<br/>
            Rooli: {decodedToken.Kayttaja.Rooli}<br/>
            <br/>
        <div>
          <button onClick={ loadDataWithJWT }>Klikkaa saadaksesi response 'jwt-protected' reitiltä</button>
        </div>
        <div>
            {testInfo}
        </div>
        </div>
        <Link to="/">Takaisin kotisivulle</Link>
        <div>
            <button onClick={ props.logout }>Kirjaudu ulos</button>
        </div>
    </div>
  )
}
