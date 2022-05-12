import React from 'react';
import {Link} from "react-router-dom";
import {nb_formJsonFetch} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/page/etcPage.css";

const Login = ()=>{

    const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

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
            <div className='login-menu-title'><Link className='linkNoneCss' to="/">넘버링크</Link></div>
            <div className='login-signup-desc'>넘버링크에 접속 하세요!</div>
            <div className="login-div">
                <form id="login-form" method="post">
                    <div id="passChkValDesc" className='loginValDesc'></div>
                    <div className='login-input-div'><input id="email" name="username" className="login-input" type="text" placeholder='이메일을 입력해주세요.' onKeyUp={(event)=>fLoginUiVal(event)}/></div>
                    <div id="passChkValDesc" className='loginValDesc'></div>
                    <div className='login-input-div'><input id="password" name="password" className="login-input" type="password" placeholder='비밀번호를 입력해주세요.' onKeyUp={(event)=>fLoginUiVal(event)}/></div>
                    <div id="passChkValDesc" className='loginValDesc'></div>
                    <div id="loginErrMsg" className='loginErrMsg hide'></div>
                    <div id="login-btn" className='login-btn disabled' onClick={(event)=>{fLoginBtnUiVal(event)}}>로그인</div> 
                    <div className='login-etc-info'>
                        <div><label><span id='checkCircle'></span><input onChange={()=>{fKeepLoginStateBtn()}} type="checkbox" id="emailSave" className='hide' />로그인 상태 유지하기</label></div>
                        <div id="emailPassFind"><a className="emailPassFind" href="#">아이디/비밀번호 찾기</a></div>
                    </div>
                    <div className="signUpDiv">넘버링크 계정이 없으신가요? <a className="signUpLink" href="/signup">회원가입</a></div><br/>
                </form>
            </div>
        </div>
    )
}

export default Login;