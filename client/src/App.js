import './App.css';
import Home from './components/Home';
import SignupView from './components/SignupView';
import LoginView from './components/LoginView';
import ProtectedTestView from './components/ProtectedTestView'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'

function App() {

  //ladataan selaimen localstoragesta käyttäjän jwt, jos löytyy
  const jwtFromStorage = window.localStorage.getItem('userJWT');

  //Tallennetaan käyttäjän jwt, jos jwt:tä ei ole, niin näkyy login ja sign up
  const [userJwt, setUserJwt] = useState(jwtFromStorage);

  //Alla olevalla tavalla tehty routejen renderöinti estää pääsyn protectediin selaimen osoiteriviltä, 
  //jos ei ole kirjautuneena sisään.

  //Jos ei ole logged in näkyy login ja signup
  //Loginista välitetään käyttäjän jwt
  let authRoutes = <>
      <Route path="/login" element={ <LoginView login={ newJwt => 
        {setUserJwt(newJwt)
          //asetetaan jwt selaimen local storageen
          window.localStorage.setItem('userJWT', newJwt)
        
        }}/> } />
      <Route path="/signup" element={ <SignupView/> } />
  </>

  // Jos login nii näkee protectedin. Tarkastetaan jwt:llä, jos ei null niin logged in
  if(userJwt != null) {
                                  //propsilla välitetään jwt protectediin, muuttamalla userjwt nulliksi kirjaudutaan ulos
      authRoutes = <Route path="/protected" element={ <ProtectedTestView jwt= {userJwt} logout= {() => {
        setUserJwt(null)
        // tyhjennetään local storage, kun kirjaudutaan ulos
        window.localStorage.removeItem('userJWT');
      }}/> } />
  }
 


  return (
    <div>
      <h1>Ruokatilaussovellus</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home userLoggedIn= { userJwt != null } logout= {() => {
              setUserJwt(null)
              // tyhjennetään local storage, kun kirjaudutaan ulos
              window.localStorage.removeItem('userJWT');
              }}/> } />
          { authRoutes }
          <Route path="*" element={ <Home userLoggedIn= { userJwt != null } logout= {() => {
              setUserJwt(null)
              // tyhjennetään local storage, kun kirjaudutaan ulos
              window.localStorage.removeItem('userJWT');
          }}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
