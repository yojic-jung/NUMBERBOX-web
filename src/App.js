import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Main from 'web/page/Main'
import Login from 'web/page/Login'
import SignUp from 'web/page/SignUp'
import RegisterQuestion from 'web/contents/register/RegisterQuestion'
import RegisterContents from 'web/contents/register/RegisterContents'
import RegisterResource from 'web/contents/resourceShareMenu/RegisterResource'
import ShareResource from 'web/contents/resourceShareMenu/ShareResource'
import ContentsListEdit from 'web/contents/screen/edit/ContentsListEdit'
import NotFound from 'web/page/NotFound'
import {nb_isLogin} from 'js/common/common_nb.js';
import GraphMake from 'web/contents/resourceShareMenu/GraphMake';

const App = ()=>{
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Main />} />
            <Route exact path="/login" element={nb_isLogin()  ? <Navigate to="/" /> : <Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/registerQuestion" element={nb_isLogin()  ? <RegisterQuestion /> : <Navigate to="/login" />} />
            <Route exact path="/registerContents" element={nb_isLogin()  ? <RegisterContents /> : <Navigate to="/login" />} />
            <Route exact path="/workContentsList" element={nb_isLogin()  ? <ContentsListEdit /> : <Navigate to="/login" />} />
            <Route exact path="/resourceTools" element={nb_isLogin()  ? <GraphMake /> : <Navigate to="/login" />} />
            <Route exact path="/registerResource" element={nb_isLogin()  ?  <RegisterResource /> : <Navigate to="/login" />} />
            <Route exact path="/shareResource" element={<ShareResource />} />
            <Route exact path={"*"} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
