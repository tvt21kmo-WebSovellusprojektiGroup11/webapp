import axios from 'axios'
import React, { useState } from 'react'
import Constants from '../Constants.json'


export default function UusiRavintola(props) {
  const [ravintolaProcessState, setRavintolaProcessState] = useState("idle");
  const lahetaData = async (event) => {
    try {
      event.preventDefault()
      setRavintolaProcessState("processing")
      var response = await axios.post(Constants.API_ADDRESS + '/ravintola/uusi', {
        Nimi: event.target.Nimi.value,
        Osoite: event.target.Osoite.value,
        Paikkakunta: event.target.Paikkakunta.value,
        Saldo: Number(event.target.Saldo.value),
        Kuva: event.target.Kuva.value,
        Kuvaus: event.target.Kuvaus.value,
        Aukioloaika: event.target.Aukioloaika.value,
        Hintataso: event.target.Hintataso.value,
        Tyyppi: event.target.Tyyppi.value
      }, {
        headers: { 'Authorization': 'Bearer ' + props.jwt, 'Content-Type': 'application/json' }
      }
      )
      console.log(response);
      setRavintolaProcessState("lisaysSuccess")
    } catch (err) {
      setRavintolaProcessState("lisaysFailure")
      console.log(err);
    }
  }

  let ravintolaUiControls = null;
  switch (ravintolaProcessState) {
    case "idle":
      ravintolaUiControls = <button type="submit">Luo ravintola</button>
      break;

    case "processing":
      ravintolaUiControls = <span style={{ color: "blue" }}>Suoritetaan.. </span>
      break;

    case "lisaysSuccess":
      ravintolaUiControls = <span style={{ color: "green" }}>Ravintola luotu onnistuneesti</span>
      break;

    case "lisaysFailure":
      ravintolaUiControls = <span style={{ color: "red" }}>Tapahtui virhe</span>
      break;
  }
  return (
    <div className="homeBox">
      <h1>Luo Ravintolallesi profiili</h1>
      <form onSubmit={ev => lahetaData(ev)}>
        Nimi:
        <input name="Nimi" type="text"></input> <br />
        Osoite:
        <input name="Osoite" type="text"></input> <br />
        Paikkakunta:
        <input name="Paikkakunta" type="text"></input> <br />
        Saldo:
        <input name="Saldo" type="number"></input> <br />
        Kuva:
        <input name="Kuva" type="text"></input> <br />
        Kuvaus:
        <input name="Kuvaus" type="text"></input> <br />
        Aukioloaika:
        <input name="Aukioloaika" type="text"></input> <br />
        Hintataso:
        <select name="Hintataso" type="text">
          <option value="e">€</option>
          <option value="ee">€€</option>
          <option value="eee">€€€</option>
          <option value="eeee">€€€€</option>
        </select> <br />
        Tyyppi:
        <select name="Tyyppi" type="text">
          <option value="b">Buffet</option>
          <option value="ff">Fast food</option>
          <option value="fc">Fast casual</option>
          <option value="cd">Casual dining</option>
          <option value="fd">Fine dining</option>
        </select> <br />
        <div>
          {ravintolaUiControls}
        </div>
      </form>
    </div>
  )
}
