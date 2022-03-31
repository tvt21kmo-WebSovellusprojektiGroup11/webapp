import React from 'react'
import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Constants from '../Constants.json';
import { useState } from 'react';

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


  return (
    <div className="homeBox">
        <h2>ProtectedTestView</h2>
        <div>
            Decoded jwt data payloadista: <br/>
            Käyttäjän id: {decodedToken.kayttaja.idKayttaja}<br/>
            Etunimi: {decodedToken.kayttaja.Etunimi}<br/>
            Sukunimi: {decodedToken.kayttaja.Sukunimi}<br/>
            P-numero: {decodedToken.kayttaja.Puhelinnumero}<br/>
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
