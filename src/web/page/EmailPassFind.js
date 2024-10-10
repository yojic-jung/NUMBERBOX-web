import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // useHistory 추가
import {
  nb_formDataFetch,
  nb_dataFetch,
  nb_getRequest,
} from 'js/common/common_nb.js';
import 'css/main/main.css';
import 'css/page/etcPage.css';

const EmailPassFind = () => {
  const navigate = useNavigate();

  // const [merchantUid, setMerchantUid] = useState(0);
  // const [merchantIdCode, setMerchantIdCode] = useState(0);
  const [isPhoneIdentified, setIsPhoneIdentified] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      let returnData = await nb_dataFetch(
        '/certifications/' + response.imp_uid,
        true
      );
      setIsPhoneIdentified(true);
      // todo 여기서 인증 코드 설정 필요
      setName(returnData.name);
      setPhoneNumber(returnData.phone);
    } else {
      alert(`본인인증 실패: ${error_msg}`);
    }
  }

  useEffect(() => {
    const asyncUseEffect = async () => {
      // let returnObj = await nb_dataFetch('/takeMerchantUid', true);
      // setMerchantUid(returnObj.merchantUid);
      // setMerchantIdCode(returnObj.merchantIdCode);
    };

    asyncUseEffect();
  }, []);

  const findEmail = async () => {
    if (!isPhoneIdentified) {
      alert('휴대폰 인증 후 요청 해주시기 바랍니다..');
      return;
    }
    let formData = new FormData();
    formData.append('userName', name);
    formData.append('phoneNumber', phoneNumber);
    let returnObj = await nb_formDataFetch('/findEmail', formData, true);
    if (returnObj.isExist) {
      alert(
        '고객님의 이메일은 ' +
          returnObj.email +
          '입니다. 로그인을 시도해보세요.'
      );
    } else {
      alert('고객님의 가입정보가 존재하지 않습니다.');
    }
  };

  const findPassword = async () => {
    let email = document.getElementById('emailForPassFind').value;
    let returnObj = await nb_getRequest(
      '/public/member/findPassword?email=' + email,
      true
    );
    if (returnObj.status == 200) {
      alert(
        '해당 이메일로 임시 비밀번호를 보내드렸습니다.\n임시 비밀번호는 오전 06시까지 유효하니 로그인 후 비밀번호를 변경하여 주시기 바랍니다.'
      );
      document.getElementById('emailForPassFind').value = '';
    }
  };

  return (
    <>
      <Helmet>
        <title>계정 찾기</title>
        <meta name='description' content='계정을 잃어버리셨나요?' />
        <link rel='canonical' href='https://nsoohak.com/emailPassFind' />
        <meta property='og:title' content='계정 찾기' />
        <meta property='og:description' content='계정을 잃어버리셨나요?' />
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
            }}
          >
            &lt;뒤로가기
          </span>
        </div>
        <div className='login-signup-desc'>N명의수학에 접속 하세요!</div>
        <div className='login-div minHeight'>
          {false && (
            <div className='emailPassFindDiv'>
              <div className='emailPassFindDesc'>
                가입시 등록하신 휴대폰 번호로 진행 해주세요.
              </div>
              <div className='borderBox emailPassFind'>
                <div
                  id='phoneCertifyBtn'
                  className='phoneCertifyBtn emailPassFind'
                  // onClick={() => {
                  //   onClickCertification();
                  // }}
                >
                  휴대폰 본인인증
                </div>
              </div>
              <div
                className='login-btn emailPassFind'
                onClick={() => {
                  findEmail();
                }}
              >
                이메일 찾기
              </div>
            </div>
          )}
          <div className='emailPassFindDiv'>
            <div className='emailPassFindDesc'>
              이메일 주소로 임시 비밀번호를 보내 드립니다.
            </div>
            <div>
              <input
                id='emailForPassFind'
                className='login-input emailPassFind'
                type='text'
                placeholder='이메일 주소를 입력해주세요.'
              />
            </div>
            <div
              className='login-btn emailPassFind'
              onClick={() => {
                findPassword();
              }}
            >
              비밀번호 찾기
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailPassFind;
