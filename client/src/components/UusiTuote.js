import React, { useState } from 'react'
import axios from 'axios'
import Constants from '../Constants.json'


export default function UusiTuote(props) {

  // tätä käytetään infon antamiseen käyttäjälle napin painamisen jälkeen
  // tila on vakiona "idle", jolloin nappi on näkyvissä
  const [ tuoteProcessState, setTuoteProcessState] = useState("idle");

  

  //Tässä tarvitaan async, jotta funktion sisällä voidaan käyttää 'await'iä
  const handleTuoteSubmit = async (event) => {
    //prevent default estää selainta päivittämästä sivua, kun nappia painaa
    event.preventDefault();
    //Nappia painettaessa muutetaan tilatietoa, joka poistaa napin käyttäjän näkyvistä
    setTuoteProcessState("processing");
    
    // Tietojen lähetys 
    try {
      const result = await axios.post(Constants.API_ADDRESS + '/tuote/uusi', 
        {
          nimi: event.target.nimi.value,
          kuvaus: event.target.kuvaus.value,
          kategoria: event.target.kategoria.value,
          hinta: event.target.hinta.value,
          kuva: event.target.kuva.value
        }, {
            headers: { 'Authorization': 'Bearer ' + props.jwt, 'Content-Type': 'application/json' }
          });
      //console.log(result);

      setTuoteProcessState("tuoteSuccess");

    } catch (error) {
      console.error(error);
      setTuoteProcessState("tuoteFailure");
    }
  }

  // Switch- case rakenne, jollä määritetään mitä käyttäjä näkee napin painamisen jälkeen
  // nappi poistetaan heti sen painamisen jälkeen, jotta ei voi lähettää vahingossa useasti samoja tietoja
  let tuoteUIControls = null;
  switch(tuoteProcessState){
    case "idle": 
        tuoteUIControls = <button type="submit">Lisää tuote</button>
      break;

    case "processing":
        tuoteUIControls = <span style={{ color: "blue"}}>Suoritetaan.. </span>  
      break;

    case "tuoteSuccess": 
        tuoteUIControls = <span style={{ color: "green"}}>Tuote lisätty onnistuneesti</span>
      break;
    
    case "tuoteFailure":
        tuoteUIControls = <span style={{ color: "red"}}>Tapahtui virhe</span> 
      break;
  }


  return (
    <div className="homeBox">
      <h2>Lisää uusi tuote</h2>
      <form onSubmit= { handleTuoteSubmit }>
        <div>
          Nimi <br/>
          <input type="text" name="nimi"></input>
        </div>
        <div>
          Kuvaus <br/>
          <input type="text" name="kuvaus"></input>
        </div>
        <div>
        <label for="kategoria">Kategoria</label> <br/>
          <select id="kategoria" name="kategoria">
            <option value="a">Alkuruoka</option>
            <option value="p">Pääruoka</option>
            <option value="j">Jälkiruoka</option>
          </select>
        </div>
        <div>
          Hinta <br/>
          <input type="number" name="hinta" step="0.01"></input>
        </div>
        <div>
          Kuva <br/>
          <input type="text" name="kuva"></input>
        </div>
        <div>
          { tuoteUIControls }
        </div>
      </form>
      </div>
  )
}
