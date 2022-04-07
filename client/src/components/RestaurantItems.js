import React from 'react'

export default function RestautantItems (props) {
  return (
    <div className="restaurantItem">
    <div><h3>{ props.Nimi }</h3></div>
    <img src={ props.Kuva } />
    <div>Aukioloajat: {props.Aukioloaika}</div>
    <div>{ props.Tyyppi }</div>
    </div>);   
}
