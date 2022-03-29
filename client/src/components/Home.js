import React from 'react'
import { Link } from 'react-router-dom'



export default function Home(props) {
  return (
    <div>
      <h2>Kotisivu</h2>
      <div>
        Kirjautumistila: { props.userLoggedIn ? "kirjautunut sisään" : "ei kirjautunut" }
      </div>
      <div> 
      { // conditional rendering. Jos käyttäjä ei ole kirjautuneena, renderöidään signup ja login linkit. 
      // Jos on, niin tässävaiheessa vain logout nappula ja testausta varten protected View
      props.userLoggedIn ?
        <>
          <Link to="protected"> Mene suojattuun näkymään</Link> <br/>
          <button onClick={ props.logout }>Kirjaudu ulos</button>
        </>
        :
        <>
          <Link to="signup">Luo Käyttäjä</Link> <br/>
          <Link to="login">Kirjaudu sisään</Link>
        </>
      }
      </div>
    </div>
  )
}
