import React from 'react'
import RestaurantItem from './RestaurantItems'

export default function RestaurantListView(props) {
  return (
    <div>
      <div className="restaurantContainer">
        { props.ravintolat.map(r => <RestaurantItem Nimi={r.Nimi} Kuva={r.Kuva} Aukioloaika={r.Aukioloaika} Tyyppi={r.Tyyppi}/>)}
      </div>
    </div>  
  )
}
