import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterQuestion from 'web/contents/register/RegisterQuestion'
import RegisterContents from 'web/contents/register/RegisterContents'

const App = ()=>{
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="RegisterQuestion" element={<RegisterQuestion />} />
            <Route path="RegisterContents" element={<RegisterContents />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
