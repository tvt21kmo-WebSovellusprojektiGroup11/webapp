import React, { useState } from 'react'
import axios from 'axios'
import Constants from '../Constants.json'
import { useNavigate } from 'react-router-dom'

export default function SignupView() {

  // tätä käytetään infon antamiseen käyttäjälle napin painamisen jälkeen
  // tila on vakiona "idle", jolloin nappi on näkyvissä
  const [ signupProcessState, setSignupProcessState] = useState("idle");

  const navigate = useNavigate();

  //Tässä tarvitaan async, jotta funktion sisällä voidaan käyttää 'await'iä
  const handleSignupSubmit = async (event) => {
    //prevent default estää selainta päivittämästä sivua, kun nappia painaa
    event.preventDefault();
    //Nappia painettaessa muutetaan tilatietoa, joka poistaa napin käyttäjän näkyvistä
    setSignupProcessState("processing");
    
    console.log(typeof event.target.Saldo.value);
    console.log(typeof Number(event.target.Saldo.value));
    // Tietojen lähetys 
    try {
      const result = await axios.post(Constants.API_ADDRESS + '/rekisteroidy', 
        {
          Etunimi: event.target.Etunimi.value,
          Sukunimi: event.target.Sukunimi.value,
          Osoite: event.target.Osoite.value,
          Paikkakunta: event.target.Paikkakunta.value,
          Puhelinnumero: event.target.Puhelinnumero.value,
          Ika: Number(event.target.Ika.value),
          Saldo: Number(event.target.Saldo.value),
          Kayttajatunnus: event.target.Kayttajatunnus.value,
          Salasana: event.target.Salasana.value,
          Rooli: event.target.Rooli.value,
        });
      console.log(result);

      setSignupProcessState("signupSuccess");
      // navikoidaan automaattisesti loginiin käyttäjän luonnin jälkeen. 
      // replace : true estää selaimen takaisinmeno buttonilla pääsyn takaisin formiin
      // Timeout lisää viiveen, niin käyttäjä kerkeää nähdä ilmoituksen onnistuneesta käyttäjän luonnista
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500)

    } catch (error) {
      console.error(error);
      setSignupProcessState("signupFailure");
    }
  }

  // Switch- case rakenne, jollä määritetään mitä käyttäjä näkee napin painamisen jälkeen
  // nappi poistetaan heti sen painamisen jälkeen, jotta ei voi lähettää vahingossa useasti samoja tietoja
  let signupUIControls = null;
  switch(signupProcessState){
    case "idle": 
      signupUIControls = <button type="submit">Luo käyttäjä</button>
      break;

    case "processing":
      signupUIControls = <span style={{ color: "blue"}}>Suoritetaan.. </span>  
      break;

    case "signupSuccess": 
      signupUIControls = <span style={{ color: "green"}}>Käyttäjä luotu onnistuneesti</span>
      break;
    
    case "signupFailure":
      signupUIControls = <span style={{ color: "red"}}>Tapahtui virhe</span> 
      break;
  }


  return (
    <div className="homeBox">
      <h2>Luo uusi käyttäjä</h2>
      <form onSubmit= { handleSignupSubmit }>
        <div>
          Etunimi <br/>
          <input type="text" name="Etunimi"></input>
        </div>
        <div>
          Sukunimi <br/>
          <input type="text" name="Sukunimi"></input>
        </div>
        <div>
          Osoite <br/>
          <input type="text" name="Osoite"></input>
        </div>
        <div>
          Paikkakunta <br/>
          <input type="text" name="Paikkakunta"></input>
        </div>
        <div>
          Puhelinnumero <br/>
          <input type="text" name="Puhelinnumero"></input>
        </div>
        <div>
          Ikä <br/>
          <input type="number" name="Ika"></input>
        </div>
        <div>
          Saldo <br/>
          <input type="number" name="Saldo" step="0.01"></input>
        </div>
        <div>
          Käyttäjätunnus <br/>
          <input type="text" name="Kayttajatunnus"></input>
        </div>
        <div>
          Salasana <br/>
          <input type="password" name="Salasana"></input>
        </div>
        <div>
        <label for="Rooli">Valitse rooli</label> <br/>
          <select id="Rooli" name="Rooli">
            <option value="Asiakas">Asiakas</option>
            <option value="Omistaja">Omistaja</option>
          </select>
        </div>
        <div>
          { signupUIControls }
        </div>
      </form>
      </div>
  )
}
