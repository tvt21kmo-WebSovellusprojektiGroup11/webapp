import './App.css';
import Home from './components/Home';
import SignupView from './components/SignupView';
import LoginView from './components/LoginView';
import RestaurantListView from './components/RestaurantListView';
import ProtectedTestView from './components/ProtectedTestView';
import UusiRavintola from './components/UusiRavintola';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Constants from './Constants.json';
import jwt from 'jsonwebtoken';

function App() {

  const [ravintolat, setRavintolat] = useState([]);

  //Haetaan ravintolat ja asetetaan yllä olevaan tilamuuttujaan
  useEffect(() => {
    const getData = async () => {
      const results = await fetch(Constants.API_ADDRESS + '/ravintola').then((res) => res.json());

      setRavintolat(results);
      //setRavintolatconsole.log(results);
    }
    getData();
  }, []);


    //Ravintoloiden haku
    const {search} = window.location;
    const query = new URLSearchParams(search).get('s');

    const filterRavintolat = (ravintolat, query) => {
      //tyhjä haku palauttaa kaikki ravintolat
      if (!query) {
        return ravintolat;
      }
      return ravintolat.filter((r) => {
        const ravintolanNimi = r.Nimi.toLowerCase();
        return ravintolanNimi.includes(query);
      });
    };
    const filteredRavintolat = filterRavintolat(ravintolat, query);
    
    //haun jälkeen navBarista painettaessa palautetaan kaikki ravintolat
    function ravintolatClick() {
      filterRavintolat = () => {
        return ravintolat;
      }
    }
    //Ravintoloiden haku loppu
  

  //ladataan selaimen localstoragesta käyttäjän jwt, jos löytyy
  const jwtFromStorage = window.localStorage.getItem('userJWT');

  //Tallennetaan käyttäjän jwt, jos jwt:tä ei ole, niin näkyy login ja sign up
  const [userJwt, setUserJwt] = useState(jwtFromStorage);

  const decodedToken = jwt.decode(userJwt);
  //console.log(decodedToken.kayttaja.rooli);

  //Alla olevalla tavalla tehty routejen renderöinti 'authRoutes' estää pääsyn protectediin 
  //selaimen osoiteriviltä, jos ei ole kirjautuneena sisään.

  //Jos ei ole logged in näkyy login ja signup
  //Loginista välitetään käyttäjän jwt
  let authRoutes = <>
    <Route path="/login" element={<LoginView login={newJwt => {
      setUserJwt(newJwt)
      //asetetaan jwt selaimen local storageen
      window.localStorage.setItem('userJWT', newJwt)
    }} />} />
    <Route path="/signup" element={<SignupView />} />
    <Route path="/ravintolat" element={<RestaurantListView filteredRavintolat={filteredRavintolat} />} />
  </>

  // Jos login ja 'Omistaja', nii näkee protectedin ja roolin mukaisen näkymän. 
  // Login tarkastetaan jwt:llä, jos ei ole null niin logged in
  if (userJwt != null && decodedToken.Kayttaja.Rooli === "Omistaja") {
    //propsilla välitetään jwt protectediin, muuttamalla userjwt nulliksi kirjaudutaan ulos
    authRoutes = <>
      <Route path="/protected" element={<ProtectedTestView jwt={userJwt} logout={() => {
        setUserJwt(null)
        // tyhjennetään local storage, kun kirjaudutaan ulos
        window.localStorage.removeItem('userJWT');
      }} />} />
      <Route path="/ravintolat" element={<RestaurantListView filteredRavintolat={filteredRavintolat} />} />
      <Route path="/uusiravintola" element={<UusiRavintola jwt={userJwt} />} />
    </>
    // Jos login nii näkee protectedin. Tarkastetaan jwt:llä, jos ei null niin logged in
  } else if (userJwt != null) {
    authRoutes = <>
      <Route path="/protected" element={<ProtectedTestView jwt={userJwt} logout={() => {
        setUserJwt(null)
        // tyhjennetään local storage, kun kirjaudutaan ulos
        window.localStorage.removeItem('userJWT');
      }} />} />
      <Route path="/ravintolat" element={<RestaurantListView filteredRavintolat={filteredRavintolat} />} />
    </>
  }

  //navBarin renderöinti kirjautumistilan ja roolin mukaan
  let authLinks = <>
    <Link to="/login">Kirjaudu sisään</Link>
    <Link to="signup">Luo käyttäjä</Link>
  </>
  if (userJwt != null && decodedToken.Kayttaja.Rooli === "Omistaja") {
    authLinks = <>
      <Link to="/protected">Suojattu tila</Link>
      <Link to="/uusiravintola">Luo ravintola</Link>
    </>
  } else if (userJwt != null) {
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
          <Link to="/ravintolat" onClick={ () => ravintolatClick() }>Ravintolat</Link>
          {authLinks}
        </div>
        <Routes>
          <Route path="/" element={<Home userLoggedIn={userJwt != null} logout={() => {
            setUserJwt(null)
            // tyhjennetään local storage, kun kirjaudutaan ulos
            window.localStorage.removeItem('userJWT');
          }} />} />
          {authRoutes}
          <Route path="*" element={<Home userLoggedIn={userJwt != null} logout={() => {
            setUserJwt(null)
            // tyhjennetään local storage, kun kirjaudutaan ulos
            window.localStorage.removeItem('userJWT');
          }} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
