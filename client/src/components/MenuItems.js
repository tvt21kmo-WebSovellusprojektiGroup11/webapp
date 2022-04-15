import React from 'react'

export default function MenuItem(props) {
    switch (props.Kategoria) {
        case ("p"):
            tyyppi = "pääruoka"
        case ("j"):
            tyyppi = "jälkiruoka"
        case ("a"):
            tyyppi = "aamupala"
    }
    return (
        <div className="restaurantItem">
            <div><h3>{props.Nimi}</h3></div>
            <img src={props.Kuva} />
            <div>Hinta: {props.Hinta}</div>
            <div>{tyyppi}</div>
            <div>{props.Kuvaus}</div>
        </div>
    );
}
