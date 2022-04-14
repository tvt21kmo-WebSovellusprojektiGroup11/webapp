import React, { useState } from 'react'
import axios from 'axios'
import Constants from '../Constants.json'
import { useNavigate } from 'react-router-dom'


export default function LoginView(props) {

  //Tämän avulla voidaan infota käyttäjää, jos tulee virhe kirjautuessa
  const [ loginProcessState, setLoginProcessState] = useState();

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    setLoginProcessState("processing");

    try {
      const result = await axios.post(Constants.API_ADDRESS + '/login', 
        null, 
        { 
          auth: {
            username: event.target.kayttajatunnus.value,
            password: event.target.salasana.value
          }
        });

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
      setLoginProcessState("loginFailure");
    }
  }

  //Samanlainen switch case rakenne kuin signupissa. Annetaan käyttäjälle tietoa kirjautumistilasta
  let loginUIControls = null;
  switch(loginProcessState){
    case "processing":
      loginUIControls = <span style={{ color: "blue"}}>Suoritetaan.. </span>  
      break;
    
    case "loginFailure":
      loginUIControls = <span style={{ color: "red"}}>Virheellinen käyttäjätunnus tai salasana</span> 
      break;
  }
  

  return (
    <div className="homeBox">
      <h2>Kirjaudu sisään</h2> 
      <form onSubmit={ handleLoginSubmit } >
        <div>
          Käyttäjätunnus <br/>
          <input type="text" name="kayttajatunnus" />
        </div>
        <div>
          Salasana <br/>
          <input type="password" name="salasana" />
        </div>
        <div>
          { loginUIControls }
        </div>
        <div>
          <button type="submit">Kirjaudu</button>
        </div>
      </form>
    </div>
  )
}
