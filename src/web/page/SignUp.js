import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ServicePolicy from 'web/page/ServicePolicy';
import PrivacyPolicy from 'web/page/PrivacyPolicy';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // useHistory 추가
import { nb_postFormToJson, nb_dataFetch, nb_postRequest } from 'js/common/common_nb.js';
import 'css/main/main.css';
import 'css/page/etcPage.css';

const SignUp = () => {
  const navigate = useNavigate();

  // const [merchantUid, setMerchantUid] = useState(0);
  // const [merchantIdCode, setMerchantIdCode] = useState(0);
  const [isPhoneIdentified, setIsPhoneIdentified] = useState(false);
  const [isEmailIdentified, setIsEmailIdentified] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birth, setBirth] = useState('');

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
      // let returnObj = await nb_dataFetch('/takeMerchantUid', true);
      // setMerchantUid(returnObj.merchantUid);
      // setMerchantIdCode(returnObj.merchantIdCode);
    };

    asyncUseEffect();
  }, []);

  // function onClickCertification() {
  //   /* 1. 가맹점 식별하기 */
  //   const { IMP } = window;
  //   IMP.init(merchantIdCode);

  //   /* 2. 본인인증 데이터 정의하기 */
  //   const data = {
  //     merchant_uid: merchantUid + new Date(),
  //     popup: false,
  //   };

  //   /* 4. 본인인증 창 호출하기 */
  //   IMP.certification(data, callback);
  // }

  /* 3. 콜백 함수 정의하기 */
  async function callback(response) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      alert('본인인증 성공');
      let returnData = await nb_dataFetch('/certifications/' + response.imp_uid, true);
      document.getElementById('phoneCertifyBtn').classList.remove('loginValDescUI');
      document.getElementById('phoneCertiValDesc').innerText = '';
      setIsPhoneIdentified(true);
      setName(returnData.name);
      setPhoneNumber(returnData.phone);
      setBirth(returnData.birth);
    } else {
      alert(`본인인증 실패: ${error_msg}`);
    }
  }

  const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const passRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/; //패스워드 문자 숫자 특수문자 8-15자
  const emailIdentifyRegex = /^.{36}$/;

  const fagreeStateBtn = () => {
    let isChecked = document.getElementById('agreeChk').checked;
    if (isChecked) {
      document.getElementById('agreeValDesc').innerText = '';
      document.getElementById('checkCircle').classList.add('active');
    } else {
      document.getElementById('checkCircle').classList.remove('active');
    }
  };

  const enterKeyEv = async (event) => {
    let userKeycode = event.keyCode;
    if (userKeycode === 13) {
      sigupRequest();
    }
  };

  const sigUpValidEffect = (event) => {
    let targetId = event.target.id;
    let targetValue = document.getElementById(targetId).value;
    if (targetId === 'email') {
      if (targetValue.length === 0) {
        document.getElementById('emailValDesc').innerText = '';
        document.getElementById('emailValDesc').classList.remove('blueText');
        document.getElementById('emailValDesc').classList.remove('redText');
      } else if (!emailRegex.test(targetValue)) {
        document.getElementById('emailValDesc').innerText = '올바른 이메일 주소를 입력해주세요.';
        document.getElementById('emailValDesc').classList.remove('blueText');
        document.getElementById('emailValDesc').classList.add('redText');
      } else {
        document.getElementById('emailValDesc').innerText = '유효한 이메일입니다.';
        document.getElementById('emailValDesc').classList.remove('redText');
        document.getElementById('emailValDesc').classList.add('blueText');
      }
    } else if (targetId === 'password') {
      if (targetValue.length === 0) {
        document.getElementById('passValDesc').innerText = '';
        document.getElementById('passValDesc').classList.remove('blueText');
        document.getElementById('passValDesc').classList.remove('redText');
      } else if (!passRegex.test(targetValue)) {
        document.getElementById('passValDesc').innerText = '사용불가';
        document.getElementById('passValDesc').classList.remove('blueText');
        document.getElementById('passValDesc').classList.add('redText');
      } else {
        document.getElementById('passValDesc').innerText = '사용가능';
        document.getElementById('passValDesc').classList.remove('redText');
        document.getElementById('passValDesc').classList.add('blueText');
        if (targetValue === document.getElementById('passwordChk').value) {
          document.getElementById('passChkValDesc').innerText = '일치';
          document.getElementById('passChkValDesc').classList.remove('redText');
          document.getElementById('passChkValDesc').classList.add('blueText');
        } else if (document.getElementById('passwordChk').value.length !== 0) {
          document.getElementById('passChkValDesc').innerText = '불일치';
          document.getElementById('passChkValDesc').classList.remove('blueText');
          document.getElementById('passChkValDesc').classList.add('redText');
        }
      }
    } else if (targetId === 'passwordChk') {
      if (targetValue.length === 0) {
        document.getElementById('passChkValDesc').innerText = '';
        document.getElementById('passChkValDesc').classList.remove('blueText');
        document.getElementById('passChkValDesc').classList.remove('redText');
      } else if (targetValue !== document.getElementById('password').value) {
        document.getElementById('passChkValDesc').innerText = '불일치';
        document.getElementById('passChkValDesc').classList.remove('blueText');
        document.getElementById('passChkValDesc').classList.add('redText');
      } else {
        document.getElementById('passChkValDesc').innerText = '일치';
        document.getElementById('passChkValDesc').classList.remove('redText');
        document.getElementById('passChkValDesc').classList.add('blueText');
      }
    } else if (targetId === 'emailIdCode') {
      if (emailIdentifyRegex.test(targetValue)) {
        document.getElementById('emailCertifyBtn').classList.remove('disable');
      } else {
        document.getElementById('emailCertifyBtn').classList.add('disable');
      }
    }
  };

  /*
    * 이메일 유효성 검사(onKeyUp) : 이미 한번 입력되어 있는 경우에는 onKeyUp에서 발생,
                                    처음 입력시에는 입력시마다 유효성검사 진행하면 ui적으로 좋지 않아 적용 안함.
    */
  const emailKeyUpVal = (event) => {
    let targetId = event.target.id;
    if (document.getElementById('emailValDesc').classList.contains('redText') || document.getElementById('emailValDesc').classList.contains('blueText')) {
      let targetValue = document.getElementById(targetId).value;
      if (targetValue.length === 0) {
        document.getElementById('emailValDesc').innerText = '';
        document.getElementById('emailValDesc').classList.remove('blueText');
        document.getElementById('emailValDesc').classList.remove('redText');
      } else if (!emailRegex.test(targetValue)) {
        document.getElementById('emailValDesc').innerText = '올바른 이메일 주소를 입력해주세요.';
        document.getElementById('emailValDesc').classList.remove('blueText');
        document.getElementById('emailValDesc').classList.add('redText');
      } else {
        document.getElementById('emailValDesc').innerText = '유효한 이메일입니다.';
        document.getElementById('emailValDesc').classList.remove('redText');
        document.getElementById('emailValDesc').classList.add('blueText');
      }
    }
  };

  /*
   * 포커스 시 validation에 걸린 loginValDescUI제거
   */
  const removeLoginValDescUI = async () => {
    document.activeElement.classList.remove('loginValDescUI');
  };

  /*
   * 회원가입 유효성 검사
   */
  const sigupRequest = async () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordChk = document.getElementById('passwordChk').value;
    let agreeChk = document.getElementById('agreeChk').checked;

    let isValid = true;

    if (!agreeChk) {
      document.getElementById('agreeValDesc').classList.add('redText');
      document.getElementById('agreeValDesc').innerText = '이용약관 개인정보보호 방침에 동의해주세요.';
      isValid = false;
    }

    /*
        if(!isPhoneIdentified){
            document.getElementById("phoneCertiValDesc").innerText = "휴대폰 본인인증을 진행 해주세요.";
            document.getElementById("phoneCertiValDesc").classList.remove("blueText");
            document.getElementById("phoneCertiValDesc").classList.add("redText");
            document.getElementById("phoneCertifyBtn").classList.add("loginValDescUI");
            window.scroll(0, document.getElementById("phoneCertifyBtn"));
            isValid = false;
        }
        */

    if (password !== passwordChk) {
      document.getElementById('passChkValDesc').innerText = '비밀번호가 일치하지 않습니다.';
      document.getElementById('passChkValDesc').classList.remove('blueText');
      document.getElementById('passChkValDesc').classList.add('redText');
      document.getElementById('passwordChk').classList.add('loginValDescUI');
      window.scroll(0, document.getElementById('passwordChk'));
      isValid = false;
    }
    if (passwordChk.length === 0) {
      document.getElementById('passChkValDesc').innerText = '비밀번호를 한번 더 입력해주세요.';
      document.getElementById('passChkValDesc').classList.remove('blueText');
      document.getElementById('passChkValDesc').classList.add('redText');
      document.getElementById('passwordChk').classList.add('loginValDescUI');
      window.scroll(0, document.getElementById('passwordChk'));
      isValid = false;
    }
    if (!passRegex.test(password)) {
      document.getElementById('passValDesc').innerText = '영문, 숫자, 특수문자 포함 8-15자리 비밀번호를 입력해주세요.';
      document.getElementById('passValDesc').classList.remove('blueText');
      document.getElementById('passValDesc').classList.add('redText');
      document.getElementById('password').classList.add('loginValDescUI');
      window.scroll(0, document.getElementById('password'));
      isValid = false;
    }
    if (!emailRegex.test(email)) {
      document.getElementById('emailValDesc').innerText = '올바른 이메일 주소를 입력해주세요.';
      document.getElementById('emailValDesc').classList.remove('blueText');
      document.getElementById('emailValDesc').classList.add('redText');
      document.getElementById('email').classList.add('loginValDescUI');
      window.scroll(0, document.getElementById('email'));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    emailCertify();
  };

  const emailCertify = async () => {
    document.getElementById('emailIdCode').value = '';

    //이메일 인증코드 생성 메일 날리기
    let email = document.getElementById('email').value;
    let jsonData = new Object();
    jsonData.email = email;
    jsonData.codeType = 'SignUp';
    let returnVal = await nb_postRequest('/public/member/signup/verifyCode', jsonData, true);
    if (returnVal.status == 200) {
      document.getElementById('userInpEmail').innerText = email;
      document.getElementById('emailCertify').classList.remove('hide');
    }
  };

  const signupFinalReq = async (event) => {
    //이메일 인증코드 입력하기
    //인증코드 검증
    if (event.target.classList.contains('disable')) return;

    let formData = new FormData(document.getElementById('signup-form'));
    formData.append('emailVerifyCode', document.getElementById('emailIdCode').value);

    let returnObj = await nb_postFormToJson('/public/member/signup', formData, true);
    if (returnObj.status == 200) {
      window.location.href = '/?succeedSignUp=1';
    }
  };

  return (
    <>
      <Helmet>
        <title>회원가입</title>
        <meta name='description' content='회원가입 후 N명의수학을 이용해보세요!' />
        <link rel='canonical' href='https://nsoohak.com/signup' />
        <meta property='og:title' content='회원가입' />
        <meta property='og:description' content='회원가입 후 N명의수학을 이용해보세요!' />
      </Helmet>
      <div className='bage-ground'>
        <div className='login-menu-title'>
          <Link className='linkNoneCss' to='/'>
            N명<span className='bottom-menu-title2'>의</span>수학
          </Link>
        </div>
        <div className='login-menu-back'>
          <span
            className='pointer'
            onClick={() => {
              navigate(-1);
            }}>
            &lt;뒤로가기
          </span>
        </div>
        <div className='login-signup-desc'>N명의수학에 오신 것을 환영합니다!</div>
        <div id='emailCertify' className='blindBox hide'>
          <div className='emailCertifyDiv'>
            <div
              className='closeBtn2'
              onClick={() => {
                document.getElementById('emailCertify').classList.add('hide');
              }}>
              X
            </div>
            <div className='emailCertifyTitle'>이메일 인증</div>
            <div className='alignLeft marginBTwoZero'>
              입력하신 <span id='userInpEmail' className='userInpEmail'></span>
              로 인증코드를 보내드렸습니다.
              <br />
              아래 입력창에 인증코드를 입력하여 주시기 바랍니다.
            </div>
            <div className='alignCenter'>
              <input
                id='emailIdCode'
                className='login-input emailCertifyInp'
                type='text'
                name='emailVerifyCode'
                placeholder='인증코드 입력...'
                onFocus={() => {
                  removeLoginValDescUI();
                }}
                onKeyUp={(event) => {
                  sigUpValidEffect(event);
                }}
                onBlur={(event) => {
                  sigUpValidEffect(event);
                }}
              />
              &nbsp;&nbsp;&nbsp;
              <span
                id='emailCertifyBtn'
                className='emailCertifyBtn disable'
                onClick={(event) => {
                  signupFinalReq(event);
                }}>
                확인
              </span>
            </div>
          </div>
        </div>
        <div className='login-div'>
          <form id='signup-form' method='post'>
            <div className='login-input-div'>
              이메일 <br />
              <input
                id='email'
                name='email'
                className='login-input'
                type='text'
                placeholder='이메일을 입력해주세요'
                onFocus={() => {
                  removeLoginValDescUI();
                }}
                onKeyUp={(event) => {
                  emailKeyUpVal(event);
                  enterKeyEv(event);
                }}
                onBlur={(event) => {
                  sigUpValidEffect(event);
                }}
              />
            </div>

            <div id='emailValDesc' className='loginValDesc'></div>
            <div className='login-input-div'>
              비밀번호
              <br />
              <input
                id='password'
                name='password'
                className='login-input'
                type='password'
                placeholder='영문, 숫자, 특수문자 포함 8-15자리'
                onFocus={() => {
                  removeLoginValDescUI();
                }}
                onKeyUp={(event) => {
                  sigUpValidEffect(event);
                  enterKeyEv(event);
                }}
              />
            </div>
            <div id='passValDesc' className='loginValDesc'></div>
            <div className='login-input-div'>
              비밀번호 확인
              <br />
              <input
                id='passwordChk'
                name='confirmPassword'
                className='login-input'
                type='password'
                placeholder='비밀번호를 다시 입력해주세요'
                onFocus={() => {
                  removeLoginValDescUI();
                }}
                onKeyUp={(event) => {
                  sigUpValidEffect(event);
                  enterKeyEv(event);
                }}
              />
            </div>
            <div id='passChkValDesc' className='loginValDesc'></div>
            {false && (
              <div className='login-input-div'>
                <div
                  id='phoneCertifyBtn'
                  className='phoneCertifyBtn'
                  // onClick={() => {
                  //   onClickCertification();
                  // }}
                >
                  휴대폰 본인인증
                </div>
                <div id='phoneCertiValDesc' className='loginValDesc'></div>
              </div>
            )}

            <div>
              <div className='login-input-div'>
                <label>
                  <span id='checkCircle'></span>
                  <input
                    onChange={() => {
                      fagreeStateBtn();
                    }}
                    type='checkbox'
                    id='agreeChk'
                    className='hide'
                  />
                </label>
                회사의{' '}
                <span
                  className='agreeState'
                  onClick={() => {
                    document.getElementById('servicePolicyState').classList.remove('hide');
                  }}>
                  이용약관
                </span>
                과{' '}
                <span
                  onClick={() => {
                    document.getElementById('privacyPolicyState').classList.remove('hide');
                  }}
                  className='agreeState'>
                  개인정보보호 방침
                </span>
                에 동의합니다.
              </div>
              <div id='agreeValDesc' className='loginValDesc'></div>
            </div>
            <div
              className='login-btn'
              onClick={() => {
                sigupRequest();
              }}>
              가입완료
            </div>
            <div className='grid-naver hide' id='naverIdLogin'></div>
            <div
              className='naver-customize'
              onClick={() => {
                naverLogin.init();
                window.location.href = naverLogin.generateAuthorizeUrl();
              }}>
              네이버 아이디로 회원가입
            </div>
          </form>
        </div>
        <ServicePolicy />
        <PrivacyPolicy />
      </div>
    </>
  );
};

export default SignUp;
