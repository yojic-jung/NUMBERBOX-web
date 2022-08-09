import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {nb_formJsonFetch} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/page/etcPage.css";

const Login = ()=>{

    const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const { naver } = window;
    
    var currentUrlNaver = window.location.href;
    var callbackUrlNaver = '';
    if(currentUrlNaver.indexOf("www.nsoohak.com") != -1){
        callbackUrlNaver = "https://www.nsoohak.com/loginCallBackNaver";
    }else{
        callbackUrlNaver = "https://nsoohak.com/loginCallBackNaver";
    }

    const naverLogin = new naver.LoginWithNaverId({
        clientId: "nHyzlpf4lzeLBMbSC5VL",
        callbackUrl: "http://localhost:3000/loginCallBackNaver", 
        isPopup: false, // popup 형식으로 띄울것인지 설정
        loginButton: { color: 'white', type: 1, height: '47' }, //버튼의 스타일, 타입, 크기를 지정
        
      });

    const initializeNaverLogin = () => {
        naverLogin.init();
      };

    useEffect(() => {
        const asyncUseEffect = async () =>{
            initializeNaverLogin();
            window.addEventListener('load', function () {
                naverLogin.getLoginStatus(function (status) {
                    console.log(naverLogin);
                    if (status) {
                        /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
                        console.log(naverLogin.user);
                        var email = naverLogin.user.getEmail();
                        var name = naverLogin.user.getName();
                        var mobile = naverLogin.user.getMobile();
                        var birthyear = naverLogin.user.getBirthyear();
                        var birthday = naverLogin.user.getBirthday();
                        if( email == undefined || email == null) {
                            alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( name == undefined || name == null) {
                            alert("이름은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( mobile == undefined || mobile == null) {
                            alert("휴대폰번호는 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( birthyear == undefined || birthyear == null) {
                            alert("생년월일은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( birthday == undefined || birthday == null) {
                            alert("생년월일은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        
                        console.log("네이버 로그인")
                        var token = naverLogin.accessToken+"";
                        var fake = token.split(".");
                        var fakeToken= fake[1]+"";
                        
                    } else {
                        console.log("callback 처리에 실패하였습니다.");
                        alert("죄송합니다. 서버 오류로 로그인에 실패하였습니다. 다시 시도해주시기 바랍니다.\n지속적으로 로그인에 실패하실  주소창에 coksabu.com 을 입력하여 접속 후 다시 시도해주시기 바랍니다.");
                         window.history.back();
                    }
                });
            });
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
                    <div className="grid-naver" id='naverIdLogin'></div>
                    <div className='login-etc-info'>
                        <div><label><span id='checkCircle'></span><input onChange={()=>{fKeepLoginStateBtn()}} type="checkbox" id="emailSave" className='hide' />로그인 상태 유지하기</label></div>
                        <div id="emailPassFind"><a className="emailPassFind" href="#">아이디/비밀번호 찾기</a></div>
                    </div>
                    <div className="signUpDiv">N명의수학 계정이 없으신가요? <a className="signUpLink" href="/signup">회원가입</a></div><br/>
                </form>
            </div>
        </div>
    )
}

export default Login;