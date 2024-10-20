import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom'; // useHistory 추가
import { Link } from 'react-router-dom';
import { nb_postFormToJson, nb_getParameterByName } from 'js/common/common_nb.js';
import 'css/main/main.css';
import 'css/page/etcPage.css';

const Login = () => {
  const navigate = useNavigate();

  const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const { naver } = window;

  var currentUrlNaver = window.location.href;
  var callbackUrlNaver = '';
  if (currentUrlNaver.indexOf('www.nsoohak.com') != -1) {
    callbackUrlNaver = 'https://www.nsoohak.com/loginCallBackNaver';
  } else {
    callbackUrlNaver = 'https://nsoohak.com/loginCallBackNaver';
  }

  //callbackUrlNaver = "http://localhost:3000/loginCallBackNaver";

  const naverLogin = new naver.LoginWithNaverId({
    clientId: 'nHyzlpf4lzeLBMbSC5VL',
    callbackUrl: callbackUrlNaver,
    isPopup: false, // popup 형식으로 띄울것인지 설정
    loginButton: { color: 'white', type: 3, height: '87' }, //버튼의 스타일, 타입, 크기를 지정
  });

  const initializeNaverLogin = () => {
    naverLogin.init();
  };

  useEffect(() => {
    const asyncUseEffect = async () => {
      initializeNaverLogin();
      const urlParams = new URL(window.location.href).searchParams;
      const email = urlParams.get('email');
      const pass = urlParams.get('pass');
      if (email !== null) document.getElementById('email').value = email;
      if (pass !== null) document.getElementById('password').value = pass;
      if (email !== null && pass !== null) {
        fLoginUiVal((new Object().keyCode = 1));
      }
    };

    asyncUseEffect();
  }, []);

  const fLoginUiVal = (event) => {
    let userKeycode = event.keyCode;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (emailRegex.test(email) && password.length > 0) {
      document.getElementById('login-btn').classList.remove('disabled');
    } else {
      document.getElementById('login-btn').classList.add('disabled');
    }

    if (userKeycode === 13 && !document.getElementById('login-btn').classList.contains('disabled')) {
      document.getElementById('login-btn').click();
    }
  };

  /**
   * 로그인 요청
   */
  const fLoginBtnUiVal = async (event) => {
    // 이메일 및 비밀번호 형식 제대로 입력 안한 경우 버튼 비활성화로 요청 불가
    if (document.getElementById(event.target.id).classList.contains('disabled')) {
      event.preventDefault();
      return;
    }

    // 로그인 상태 유지 파라미터 추가
    let param = '';
    if (document.getElementById('emailSave').checked) {
      param = '?loginState=keep';
    }

    // 요청
    let formData = new FormData(document.getElementById('login-form'));
    let returnObj = await nb_postFormToJson('/login/general' + param, formData, true);

    // 성공시 메인 페이지로 이동
    if (returnObj.status == 200) {
      window.location.href = '/';
    }
    // 실패시 에러 메시지 출력
    else {
      document.getElementById('loginErrMsg').classList.remove('hide');
      document.getElementById('loginErrMsg').innerText = returnObj.message;
    }
  };

  const fKeepLoginStateBtn = () => {
    let isChecked = document.getElementById('emailSave').checked;
    if (isChecked) {
      document.getElementById('checkCircle').classList.add('active');
    } else {
      document.getElementById('checkCircle').classList.remove('active');
    }
  };

  const goBack = async () => {
    let param = await nb_getParameterByName('isDirect');
    if (param !== '') {
      navigate(-2);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Helmet>
        <title>로그인</title>
        <meta name='description' content='로그인 후 N명의수학을 이용해보세요!' />
        <link rel='canonical' href='https://nsoohak.com/login' />
        <meta property='og:title' content='로그인' />
        <meta property='og:description' content='로그인 후 N명의수학을 이용해보세요!' />
      </Helmet>
      <div className='bage-ground'>
        <div className='login-menu-title'>
          <Link className='linkNoneCss' to='/'>
            N명<span className='bottom-menu-title2'>의</span>수학
          </Link>
        </div>
        <div className='login-menu-back'>
          <button
            type='button'
            className='pointer none-btn'
            onClick={() => {
              goBack();
            }}>
            &lt;뒤로가기
          </button>
        </div>
        <div className='login-signup-desc'>N명의수학에 접속 하세요!</div>
        <div className='login-div'>
          <form id='login-form' method='post'>
            <div id='passChkValDesc' className='loginValDesc'></div>
            <div className='login-input-div'>
              <input id='email' name='username' className='login-input' type='text' placeholder='이메일을 입력해주세요.' onKeyUp={(event) => fLoginUiVal(event)} />
            </div>
            <div id='passChkValDesc' className='loginValDesc'></div>
            <div className='login-input-div'>
              <input id='password' name='password' className='login-input' type='password' placeholder='비밀번호를 입력해주세요.' onKeyUp={(event) => fLoginUiVal(event)} />
            </div>
            <div id='passChkValDesc' className='loginValDesc'></div>
            <div id='loginErrMsg' className='loginErrMsg hide'></div>
            <button
              id='login-btn'
              type='button'
              className='none-btn login-btn disabled'
              onClick={(event) => {
                fLoginBtnUiVal(event);
              }}>
              로그인
            </button>
            <div className='grid-naver hide' id='naverIdLogin'></div>
            <button
              type='button'
              className='naver-customize none-btn'
              onClick={() => {
                if (document.getElementById('emailSave').checked) {
                  window.localStorage.setItem('loginState', 'keep');
                } else {
                  window.localStorage.setItem('loginState', null);
                }
                naverLogin.init();
                window.location.href = naverLogin.generateAuthorizeUrl();
              }}>
              네이버 아이디로 로그인
            </button>
            <div className='login-etc-info'>
              <div>
                <label>
                  <span id='checkCircle' className='active'></span>
                  <input
                    onChange={() => {
                      fKeepLoginStateBtn();
                    }}
                    type='checkbox'
                    id='emailSave'
                    className='hide'
                    defaultChecked
                  />
                  로그인 상태 유지하기
                </label>
              </div>
              <div id='emailPassFind'>
                <Link className='linkNoneCss' to='/emailPassFind'>
                  비밀번호 찾기
                </Link>
              </div>
            </div>
            <div className='signUpDiv'>
              N명의수학 계정이 없으신가요?{' '}
              <button type='button' className='signUpLink none-btn'>
                <Link className='linkNoneCss' to='/signup'>
                  회원가입
                </Link>
              </button>
            </div>
            <br />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
