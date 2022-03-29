import React from 'react'
import axios from 'axios'
import Constants from '../Constants.json'
import { useNavigate } from 'react-router-dom'


export default function LoginView(props) {

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post(Constants.API_ADDRESS + '/login', 
        null, 
        { 
          auth: {
            username: event.target.kayttajatunnus.value,
            password: event.target.salasana.value
          }
        }
        );
      console.log(result);
      //Tallennetaan responsena saatu jwt tokeni
      const recievedJWT = result.data.jwt;

      //Välitetään jwt app.js
      props.login(recievedJWT);
      
      //navikoidaan roottiin, onnistuneella kirjautumisella
      // replace : true estää selaimen takaisinmeno buttonilla pääsyn takaisin formiin
      navigate('/', { replace: true });

    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div>
      <h2>Kirjaudu sisään</h2> 
      <form onSubmit={ handleLoginSubmit } >
        <div>
          Käyttäjätunnus <br/>
          <input type="text" name="kayttajatunnus" />
        </div>
        <div>
          Salasana <br/>
          <input type="text" name="salasana" />
        </div>
        <div>
          <button type="submit">Kirjaudu</button>
        </div>
      </form>
    </div>
  )
}
