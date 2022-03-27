import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      Kotisivu
      <div>
        <Link to="signup">Luo Käyttäjä</Link> <br/>
        <Link to="login">Kirjaudu sisään</Link>
      </div>
    </div>
  )
}
