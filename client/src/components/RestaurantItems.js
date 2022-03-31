import React from 'react'

export default function RestautantItems (props) {
  return (
    <div className="restaurantItem">
    <div><h3>{ props.Nimi }</h3></div>
    <img src={ props.kuva } />
    <div>Aukioloajat: {props.aukioloaika}</div>
    </div>);   
}
