import './App.css';
import Home from './components/Home';
import SignupView from './components/SignupView';
import LoginView from './components/LoginView';
import RestaurantListView from './components/RestaurantListView';
import ProtectedTestView from './components/ProtectedTestView'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Constants from './Constants.json';
import axios from 'axios';

function App() {

  const [ ravintolat, setRavintolat] = useState([]);

  //Haetaan ravintolat ja asetetaan ylää olevaan tilamuuttujaan
  useEffect(() => {
    const getData = async () => {
      const results = await fetch(Constants.API_ADDRESS+ '/ravintola').then((res) => res.json());
      
      setRavintolat(results);
      //console.log(results);
    }
    getData();
  }, []);

  
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
      <Route path="/ravintolat" element={ <RestaurantListView ravintolat= { ravintolat }/> }/>
  </>

  

  // Jos login nii näkee protectedin. Tarkastetaan jwt:llä, jos ei null niin logged in
  if(userJwt != null) {
                                  //propsilla välitetään jwt protectediin, muuttamalla userjwt nulliksi kirjaudutaan ulos
      authRoutes = <>
      <Route path="/protected" element={ <ProtectedTestView jwt= {userJwt} logout= {() => {
        setUserJwt(null)
        // tyhjennetään local storage, kun kirjaudutaan ulos
        window.localStorage.removeItem('userJWT');
      }}/> } />
      <Route path="/ravintolat" element={ <RestaurantListView ravintolat= { ravintolat }/> }/>
      </>
  }

  //navBarin renderöinti kirjautumistilan mukaan
  let authLinks = <>
    <Link to="/login">Kirjaudu sisään</Link>
    <Link to="signup">Luo käyttäjä</Link>
  </>
  if(userJwt != null) {
    authLinks = <>
    <Link to="/protected">Suojattu tila</Link>
            
     </>   
  }
 


  return (
    <div>
      <div className="banner">
        <h1>Ruokatilaussovellus</h1>
      </div>
      <BrowserRouter> 
      <div className="navbar">
          <Link to="/"><div>Koti</div></Link>
          <Link to="/ravintolat">Ravintolat</Link>
          { authLinks }
          
        </div>
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
