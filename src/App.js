import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Main from 'web/page/Main'
import Login from 'web/page/Login'
import SignUp from 'web/page/SignUp'
import MathDocsMaker from 'web/contents/mathDocs/MathDocsMaker'
import RegisterQuestion from 'web/contents/register/RegisterQuestion'
import RegisterContents from 'web/contents/register/RegisterContents'
import RegisterResource from 'web/mathResource/RegisterResource'
import ShareResource from 'web/mathResource/ShareResource'
import ContentsList from 'web/contents/list/ContentsList'
import MyPageWrap from 'web/contents/list/MyPageWrap'
import UserProfileWrap from 'web/contents/list/UserProfileWrap'
import WorkContentsList from 'web/contents/list/WorkContentsList'
import NotFound from 'web/page/NotFound'
import {nb_isLogin} from 'js/common/common_nb.js';
import GraphMake from 'web/mathResource/GraphMake';
import TopMenuBar from 'web/common/TopMenuBar';
import BottomMenuBar from 'web/common/BottomMenuBar';
import AdminSvcCenter from 'web/admin/AdminSvcCenter';

const App = ()=>{
  return (
    <>
            <div id="notifyBox" className='notifyBox'></div>
            <div id="notifyBoxA" className='notifyBoxA'></div>
            <div id="notifyBoxB" className='notifyBoxB'></div>
            <div id="notifyBoxC" className='notifyBoxC'>
              <div id="notifyBoxC-desc"></div>
              <div className='alignCenter'>
                <span className='notifyBoxC-Ok' onClick={()=>{document.getElementById("notifyBoxC").style.display = "none"}}>[확인]</span>
              </div>
            </div>
      <BrowserRouter>
          <Routes>
            <Route exact path="/login" element={nb_isLogin()  ? <Navigate to="/" /> : <Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route element={<TopMenuBar/>}>
              <Route exact path="/resourceTools" element={nb_isLogin()  ? <GraphMake /> : <Navigate to="/login" />} />
              <Route exact path="/makeMathDocs" element={nb_isLogin()  ? <MathDocsMaker /> : <Navigate to="/login" />} />
              <Route exact path="/adminSvcCenter" element={nb_isLogin()  ?  <AdminSvcCenter /> : <Navigate to="/login" />} />
              <Route element={<BottomMenuBar/>}>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/registerQuestion" element={nb_isLogin()  ? <RegisterQuestion /> : <Navigate to="/login" />} />
                <Route exact path="/makeContents" element={nb_isLogin()  ? <RegisterContents contentsClassify={1} /> : <Navigate to="/login" />} />
                <Route exact path="/registerContents" element={nb_isLogin()  ? <RegisterContents contentsClassify={0} /> : <Navigate to="/login" />} />
                <Route exact path="/contentsList" element={nb_isLogin()  ? <ContentsList /> : <Navigate to="/login" />} />
                <Route exact path="/myContentsList" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login" />} />
                <Route exact path="/myRepository" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login" />} />
                <Route exact path="/myMathDocs" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login" />} />
                <Route exact path="/myResource" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login" />} />
                <Route exact path="/userProfile" element={nb_isLogin()  ? <UserProfileWrap /> : <Navigate to="/login" />} />
                <Route exact path="/workContentsList" element={nb_isLogin()  ? <WorkContentsList /> : <Navigate to="/login" />} />
                <Route exact path="/registerResource" element={nb_isLogin()  ?  <RegisterResource /> : <Navigate to="/login" />} />
                <Route exact path="/shareResource" element={<ShareResource />} />
                <Route exact path={"*"} element={<NotFound />} />
              </Route>
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
