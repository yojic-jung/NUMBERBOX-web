import React, {useEffect} from 'react';
import {nb_formJsonFetch} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/common/common.css";

const NaverLoginSuccess = ()=>{

      useEffect(function(){
                const { naver } = window;
                
                var currentUrlNaver = window.location.href;
                var callbackUrlNaver = '';
                if(currentUrlNaver.indexOf("www.nsoohak.com") != -1){
                    callbackUrlNaver = "https://www.nsoohak.com/loginCallBackNaver";
                }else{
                    callbackUrlNaver = "https://nsoohak.com/loginCallBackNaver";
                }

                //callbackUrlNaver = "http://localhost:3000/loginCallBackNaver";

                const naverLogin = new naver.LoginWithNaverId({
                    clientId: "nHyzlpf4lzeLBMbSC5VL",
                    callbackUrl: callbackUrlNaver, 
                    isPopup: false, // popup 형식으로 띄울것인지 설정
                    loginButton: { color: 'white', type: 1, height: '47' }, //버튼의 스타일, 타입, 크기를 지정
                });

                naverLogin.init();
                naverLogin.getLoginStatus(async function (status) {
                    if (status) {
                        /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
                        let email = naverLogin.user.getEmail();
                        let name = naverLogin.user.getName();
                        let mobile = naverLogin.user.getMobile();
                        let birthyear = naverLogin.user.getBirthyear();
                        let birthday = naverLogin.user.getBirthday();
                        if( email === undefined || email === null) {
                            alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( name === undefined || name === null) {
                            alert("이름은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( mobile === undefined || mobile === null) {
                            alert("휴대폰번호는 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( birthyear === undefined || birthyear === null) {
                            alert("출생연도는 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
                        if( birthday === undefined || birthday === null) {
                            alert("생일은 필수정보입니다. 정보제공을 동의해주세요.");
                            /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                            naverLogin.reprompt();
                            return;
                        }
        
                        let formData = new FormData();
                        formData.append("email", email);
                        formData.append("userName", name);
                        formData.append("phoneNumber", mobile.replaceAll("-", ""));
                        formData.append("birth", birthyear.slice(2)+birthday.replaceAll("-", ""));
                        let returObj = await nb_formJsonFetch("/naverLogin", formData, true);
                        if(returObj.isSuccess !== undefined){
                            if(returObj.isSuccess === "signUpSuccess"){
                                window.location.href = "/?succeedSignUp=1";
                            }else if(returObj.isSuccess === "loginSuccess"){
                                window.location.href = "/";
                            }else if(returObj.isSuccess === "existsPhone"){
                                alert("이미 가입된 휴대폰 번호입니다. ");
                                window.history.back();
                            }else{
                                alert("에러 ["+returObj.error+"]");
                                window.history.back();
                            }
                        }else{
                            alert("에러 ["+returObj.error+"]");
                            window.history.back();
                        }

                    } else {
                        alert("죄송합니다. 서버 오류로 로그인에 실패하였습니다. 다시 시도해주시기 바랍니다.\n지속적으로 로그인에 실패하실  주소창에 nsoohak.com 을 입력하여 접속 후 다시 시도해주시기 바랍니다.");
                        window.history.back();
                    }
                });
      },[])
    
return (
    <>
    <div className="grid-naver hide" id='naverIdLogin'></div>
    </>
    )
}

export default NaverLoginSuccess;