import React from 'react'
import MeetingProviderWrapper from "./MeetinProvider";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MeetingScreen from './MeetingScreen';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      
        
          <Route exact path="/" element={<MeetingProviderWrapper />} />
          <Route exact path="/meetings" element={<MeetingScreen />} />
          
        
      
    </Routes>
    </BrowserRouter>
      {/* <MeetingProviderWrapper /> */}
      
    </div>
  );
}

export default App;
