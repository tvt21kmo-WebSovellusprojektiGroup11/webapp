import React, { Component } from 'react'
import RestaurantItem from './RestaurantItems'
import MenuItem from './MenuItems';
import Haku from './Haku';
import { useState } from 'react'
import axios from 'axios';
import Constants from '../Constants.json'

export default function RestaurantListView(props) {
  const [menuItem, setMenuItem] = useState();
  let getMenuData = async (idRavintola) => {
    await axios.get(Constants.API_ADDRESS + '/tuote/' + idRavintola).then(
      t => setMenuItem(t.data)
    )
  }
  const [ostosKarry, setKarryyn] = useState({ Tuotteet: new Array });
  function handleKarry(idTuote) {
    var uusikarry = ostosKarry
    uusikarry.Tuotteet.push(idTuote);
    setKarryyn(uusikarry);
  }

  async function hanskaaTilaus() {
    console.log(ostosKarry.Tuotteet);
    var response = await axios.post(Constants.API_ADDRESS + '/tilaus/uusi', {
      Tuotteet: ostosKarry.Tuotteet
    }, {
      headers: { 'Authorization': 'Bearer ' + props.jwt, 'Content-Type': 'application/json' }
    }
    )
    console.log(response);
    setKarryyn({ Tuotteet: new Array });
    alert("Tilaus lähetetty.");
  }

  console.log(props.jwt)
  if (menuItem)
    return (
      <div>
        <div className="menuContainer">
          {(menuItem).map(t => <MenuItem key={t.idTuote} Nimi={t.Nimi} Kuva={t.Kuva} Hinta={t.Hinta} Kategoria={t.Kategoria} Kuvaus={t.Kuvaus} onKarryClick={() => handleKarry(t.idTuote)} />)}

        </div>
        <div className='menuButtonContainer'>
          <button onClick={() => hanskaaTilaus()}> Lähetä tilaus</button>
          <button onClick={() => setMenuItem(NaN)}>Palaa selaamaan ravintoloita</button>
        </div>
      </div>
    )
  if (!props.jwt)
    return (
      <div>
        <div className="haku">
          <Haku />
        </div>
        <div className="restaurantContainer">
          {props.filteredRavintolat.map(r => <RestaurantItem key={r.idRavintola} Nimi={r.Nimi} Kuva={r.Kuva} Aukioloaika={r.Aukioloaika} Tyyppi={r.Tyyppi} Hintataso={r.Hintataso} />)}
        </div>
        <div>
          <button>

          </button>
        </div>
      </div>
    )
  else if (props.jwt)
    return (
      <div>
        <div className="haku">
          <Haku />
        </div>
        <div className="restaurantContainer">
          {props.filteredRavintolat.map(r => <RestaurantItem key={r.idRavintola} Nimi={r.Nimi} Kuva={r.Kuva} Aukioloaika={r.Aukioloaika} Tyyppi={r.Tyyppi} Hintataso={r.Hintataso} jwt={props.jwt} renderMenu={() => getMenuData(r.idRavintola)} />)}
        </div>
        <div>
          <button>

          </button>
        </div>
      </div>
    )
}
