import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';


import Landing from './Pages/Landing';
import Main from './Pages/Main';
import Footer from './Components/Footer';

// TO-DO Migrate GCE flex env to python3.11 using a custom docker file and runtime: custom in app.yaml
// TO-DO MOBILE BLOCKER -> For future development
// TO-DO (Future) Kobold customization!
// TO-DO (Future) Best kobold gets to wear a crown!
// TO-DO (Future) Add a throwing animation?

function App() {

  const [webState, setWebState] = useState("landing");
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentCoinCount, setCurrentCoinCount] = useState(-1);
  
  return (

    <div className="App">

      {/* Developed by Todd Goldfarb */}
      {/* https://github.com/Todd-C-Goldfarb */}

      {webState === "landing" && <Landing setWebState={setWebState} setCurrentUsername={setCurrentUsername} setCurrentCoinCount={setCurrentCoinCount} />}
      {webState === "main" && <Main setWebState={setWebState} currentUsername={currentUsername} currentCoinCount={currentCoinCount} setCurrentCoinCount={setCurrentCoinCount} />}

    
      <Footer />
    </div>
  );
}

export default App;
