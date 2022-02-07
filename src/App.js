import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterContents from 'web/contents/register/RegisterContents'


const App = ()=>{
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="registerContents" element={<RegisterContents />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
