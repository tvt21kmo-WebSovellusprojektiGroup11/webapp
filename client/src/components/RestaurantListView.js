import React from 'react'
import RestaurantItem from './RestaurantItems'

export default function RestaurantListView(props) {
  return (
    <div>
      <div className="restaurantContainer">
        { props.ravintolat.map(r => <RestaurantItem Nimi={r.Nimi} kuva={r.kuva} aukioloaika={r.aukioloaika} tyyppi={r.tyyppi}/>)}
      </div>
    </div>  
  )
}
