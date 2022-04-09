import React from 'react'
import RestaurantItem from './RestaurantItems'
import Haku from './Haku';



export default function RestaurantListView(props) {
  return (
    <div>
      <div className="haku">
        <Haku/>
      </div>
      <div className="restaurantContainer">
        { props.filteredRavintolat.map(r => <RestaurantItem Nimi={r.Nimi} Kuva={r.Kuva} Aukioloaika={r.Aukioloaika} Tyyppi={r.Tyyppi}/>)}
      </div>
    </div>  
  )
}
