import React from 'react'
//import { Link } from 'react-router-dom'



export default function Home(props) {
  return (
    <div className="homeBox">
      {
      props.userLoggedIn ?
      <>
      <button className="btnLogout" onClick={ props.logout }>Kirjaudu ulos</button>
      </>
      :
      <>
      </>
      }
      <h2>Kotisivu</h2>
      <div>
        Kirjautumistila: { props.userLoggedIn ? "kirjautunut sisään" : "ei kirjautunut" }
      </div>
      
      
    </div>
  )
}
