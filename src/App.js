import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Main from 'web/page/Main'
import Login from 'web/page/Login'
import EmailPassFind from 'web/page/EmailPassFind'
import NaverLoginSuccess from 'web/page/NaverLoginSuccess'
import SignUp from 'web/page/SignUp'
import MathDocsMaker from 'web/contents/mathDocs/MathDocsMaker'
import RegisterQuestion from 'web/contents/register/RegisterQuestion'
import RegisterContents from 'web/contents/register/RegisterContents'
import RegisterContentsForImg from 'web/contents/register/RegisterContentsForImg'
import RegisterResource from 'web/mathResource/RegisterResource'
import ShareResource from 'web/mathResource/ShareResource'
import ContentsList from 'web/contents/list/ContentsList'
import MyProfile from 'web/contents/list/MyProfile'
import MyAccountDrop from 'web/contents/list/MyAccountDrop'
import MyPageWrap from 'web/contents/list/MyPageWrap'
import UserProfileWrap from 'web/contents/list/UserProfileWrap'
import WorkContentsList from 'web/contents/list/WorkContentsList'
import NotFound from 'web/page/NotFound'
import {nb_isLogin} from 'js/common/common_nb.js';
import GraphMake from 'web/mathResource/GraphMake';
import TopMenuBar from 'web/common/TopMenuBar';
import BottomMenuBar from 'web/common/BottomMenuBar';
import AdminSvcCenter from 'web/admin/AdminSvcCenter';
import MathTypeCategory from 'web/admin/MathTypeCategory';

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
            <Route exact path="/emailPassFind" element={nb_isLogin()  ? <Navigate to="/" /> : <EmailPassFind />} />
            <Route exact path="/loginCallBackNaver" element={<NaverLoginSuccess />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route element={<TopMenuBar/>}>
              <Route exact path="/resourceTools" element={<GraphMake />} />
              <Route exact path="/makeMathDocs" element={<MathDocsMaker /> } />
              <Route exact path="/adminSvcCenter" element={nb_isLogin()  ?  <AdminSvcCenter /> : <Navigate to="/login?isDirect=false" />} />
              <Route exact path="/mathTypeCategory" element={nb_isLogin()  ?  <MathTypeCategory /> : <Navigate to="/login?isDirect=false" />} />
              <Route element={<BottomMenuBar/>}>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/registerQuestion" element={nb_isLogin()  ? <RegisterQuestion /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/makeContents" element={<RegisterContents contentsClassify={1} />} />
                <Route exact path="/makeContentsForImg" element={<RegisterContentsForImg />} />
                <Route exact path="/registerContents" element={nb_isLogin()  ? <RegisterContents contentsClassify={0} /> : <Navigate to="/login" />} />
                <Route exact path="/contentsList" element={<ContentsList /> } />
                <Route exact path="/myProfile" element={nb_isLogin()  ? <MyProfile /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/myAccountDrop" element={nb_isLogin()  ? <MyAccountDrop /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/myContentsList" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/myRepository" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/myMathDocs" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/myResource" element={nb_isLogin()  ? <MyPageWrap /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/userProfile" element={nb_isLogin()  ? <UserProfileWrap /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/workContentsList" element={nb_isLogin()  ? <WorkContentsList /> : <Navigate to="/login?isDirect=false" />} />
                <Route exact path="/registerResource" element={nb_isLogin()  ?  <RegisterResource /> : <Navigate to="/login?isDirect=false" />} />
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
