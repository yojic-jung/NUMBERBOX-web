import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterQuestion from 'web/staff/produce/RegisterQuestion'


const App = ()=>{
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="registerQuestion" element={<RegisterQuestion />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
