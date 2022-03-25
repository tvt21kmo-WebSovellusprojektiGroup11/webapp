import './App.css';
import Home from './components/Home';
import SignupView from './components/SignupView';
import LoginView from './components/LoginView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Ruokatilaussovellus</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/login" element={ <LoginView/> } />
          <Route path="/signup" element={ <SignupView/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
