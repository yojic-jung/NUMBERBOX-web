import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterQuestion from 'web/contents/register/RegisterQuestion'
import RegisterContents from 'web/contents/register/RegisterContents'
import ContentsListEdit from 'web/contents/screen/edit/ContentsListEdit'

const App = ()=>{
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="registerQuestion" element={<RegisterQuestion />} />
            <Route path="registerContents" element={<RegisterContents />} />
            <Route path="workContentsList" element={<ContentsListEdit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
