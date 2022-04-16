import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function RestautantItems(props) {

  let tyyppi = null;
  switch (props.Tyyppi) {
    case "b":
      tyyppi = "Buffet";
      break;

    case "ff":
      tyyppi = "Fast food";
      break;

    case "fc":
      tyyppi = "Fast casual";
      break;

    case "cd":
      tyyppi = "Casual dining";
      break;

    case "fd":
      tyyppi = "Fine dining";
      break;
  }

  let hintataso = null;
  switch (props.Hintataso) {
    case "e":
      hintataso = "€";
      break;

    case "ee":
      hintataso = "€€";
      break;

    case "eee":
      hintataso = "€€€";
      break;

    case "eeee":
      hintataso = "€€€€";
      break;
  }

  var conditionaali;
  if (props.jwt) {
    conditionaali = <button onClick={() => props.renderMenu()}> Katso Menu</button>
  } else {
    conditionaali = <button disabled>Kirjaudu sisään tilataksesi</button>
  }



  if (props.Tyyppi)
    return (
      <div className="restaurantItem">
        <div><h3>{props.Nimi}</h3></div>
        <img src={props.Kuva} />
        <div>Aukioloaika: {props.Aukioloaika}</div>
        <div>{tyyppi}</div>
        <div>Hintataso: {hintataso}</div>
        {conditionaali}
      </div>
    );
}
