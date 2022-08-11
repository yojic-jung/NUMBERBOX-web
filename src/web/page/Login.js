import React, {useState, useEffect} from 'react';
import { useNavigate  } from 'react-router-dom'; // useHistory 추가
import {Link} from "react-router-dom";
import {nb_formJsonFetch} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/page/etcPage.css";

const Login = ()=>{
    const navigate = useNavigate ();

    const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const { naver } = window;
    
    var currentUrlNaver = window.location.href;
    var callbackUrlNaver = '';
    if(currentUrlNaver.indexOf("www.nsoohak.com") != -1){
        callbackUrlNaver = "https://www.nsoohak.com/loginCallBackNaver";
    }else{
        callbackUrlNaver = "https://nsoohak.com/loginCallBackNaver";
    }

    callbackUrlNaver = "http://localhost:3000/loginCallBackNaver";

    const naverLogin = new naver.LoginWithNaverId({
        clientId: "nHyzlpf4lzeLBMbSC5VL",
        callbackUrl: callbackUrlNaver, 
        isPopup: false, // popup 형식으로 띄울것인지 설정
        loginButton: { color: 'white', type: 3, height: '47' }, //버튼의 스타일, 타입, 크기를 지정
      });

    const initializeNaverLogin = () => {
        naverLogin.init();
      };

    useEffect(() => {
        const asyncUseEffect = async () =>{
            initializeNaverLogin();
        }

        asyncUseEffect();
    },[]);

    const fLoginUiVal = (event) =>{
        let userKeycode = event.keyCode;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        if(emailRegex.test(email) && password.length >0){
            document.getElementById("login-btn").classList.remove("disabled");
        }else{
            document.getElementById("login-btn").classList.add("disabled");
        }

        if(userKeycode === 13 && !document.getElementById("login-btn").classList.contains("disabled")){
            document.getElementById("login-btn").click();
        }

    }

    const fLoginBtnUiVal = async (event) => {
        if(document.getElementById(event.target.id).classList.contains("disabled")){
            event.preventDefault();
            return;
        }else{
            let formData = new FormData(document.getElementById("login-form"));
            let param = "";
            if(document.getElementById("emailSave").checked){
                param="?loginState=keep"
            }
           
            let returnObj = await nb_formJsonFetch("/loginProcess"+param, formData, true);
            if(returnObj.isLogin){
                window.location.href = "/";
            }else{
                document.getElementById("loginErrMsg").classList.remove("hide");
                document.getElementById("loginErrMsg").innerText=returnObj.customErrMsg;
            }
        }
    }
    
    const fKeepLoginStateBtn = () =>{
       let isChecked =  document.getElementById("emailSave").checked;
       if(isChecked){
            document.getElementById("checkCircle").style.backgroundColor = "rgb(55, 113, 178)";
       }else{
            document.getElementById("checkCircle").style.backgroundColor = "rgb(184, 184, 184)";
       }
    }



return (
        <div className='bage-ground'>
            <div className='login-menu-title'><Link className='linkNoneCss' to="/">N명<span className="bottom-menu-title2">의</span>수학</Link></div>
            <div className='login-menu-back'><span className='pointer' onClick={()=>{navigate(-1);}}>&lt;뒤로가기</span></div>
            <div className='login-signup-desc'>N명의수학에 접속 하세요!</div>
            <div className="login-div">
                <form id="login-form" method="post">
                    <div id="passChkValDesc" className='loginValDesc'></div>
                    <div className='login-input-div'><input id="email" name="username" className="login-input" type="text" placeholder='이메일을 입력해주세요.' onKeyUp={(event)=>fLoginUiVal(event)}/></div>
                    <div id="passChkValDesc" className='loginValDesc'></div>
                    <div className='login-input-div'><input id="password" name="password" className="login-input" type="password" placeholder='비밀번호를 입력해주세요.' onKeyUp={(event)=>fLoginUiVal(event)}/></div>
                    <div id="passChkValDesc" className='loginValDesc'></div>
                    <div id="loginErrMsg" className='loginErrMsg hide'></div>
                    <div id="login-btn" className='login-btn disabled' onClick={(event)=>{fLoginBtnUiVal(event)}}>로그인</div>
                    <div className="grid-naver hide" id='naverIdLogin'></div>
                    <div className="naver-customize" onClick={()=>{if(document.getElementById("emailSave").checked){ window.localStorage.setItem("loginState", "keep");}else{window.localStorage.setItem("loginState", null)} naverLogin.init();window.location.href = naverLogin.generateAuthorizeUrl();}}>
                        네이버 아이디로 로그인
                    </div>
                    <div className='login-etc-info'>
                        <div><label><span id='checkCircle'></span><input onChange={()=>{fKeepLoginStateBtn()}} type="checkbox" id="emailSave" className='hide' />로그인 상태 유지하기</label></div>
                        <div id="emailPassFind"><Link className="linkNoneCss" to="/emailPassFind">아이디/비밀번호 찾기</Link></div>
                    </div>
                    <div className="signUpDiv">N명의수학 계정이 없으신가요? <a className="signUpLink" href="/signup">회원가입</a></div><br/>
                </form>
            </div>
        </div>
    )
}

export default Login;