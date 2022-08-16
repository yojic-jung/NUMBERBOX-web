import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory 추가
import { nb_formDataFetch, nb_dataFetch} from 'js/common/common_nb.js';

const MyAccountDrop = () => {
    const navigate = useNavigate ();

    const [merchantUid, setMerchantUid] = useState(0);
    const [merchantIdCode, setMerchantIdCode] = useState(0);
    const [isPhoneIdentified, setIsPhoneIdentified] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birth, setBirth] = useState("");

    const backToPreviousPage = async () => {
        navigate(-1)
    }

    const removeAddedEvent = async ()=>{
        window.removeEventListener('popstate', backToPreviousPage);
    }
    
    function onClickCertification() {
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init(merchantIdCode);
  
        /* 2. 본인인증 데이터 정의하기 */
        const data = {
          merchant_uid: merchantUid+new Date(), 
          popup : false 
        };
  
        /* 4. 본인인증 창 호출하기 */
        IMP.certification(data, callback);
      }
  
      /* 3. 콜백 함수 정의하기 */
      async function callback(response) {
        const {
          success,
          merchant_uid,
          error_msg,
        } = response;
  
        if (success) {
          alert('본인인증 성공');
          let returnData = await nb_dataFetch("/certifications/"+response.imp_uid, true);
          setIsPhoneIdentified(true)
          setName(returnData.name);
          setPhoneNumber(returnData.phone);
          setBirth(returnData.birth);
        } else {
          alert(`본인인증 실패: ${error_msg}`);
        }
      }

    const myAccountDrop = async () => {
        if(!document.getElementById("dropAgreeCheck").checked){
            alert("탈퇴 처리사항 안내 확인에 동의 해주세요.")
            return;
        }

        if(document.getElementById("email").value.length === 0){
            alert("이메일을 입력 해주세요.")
            return;
        }

        if(document.getElementById("password").value.length === 0){
            alert("비밀번호를 입력 해주세요.")
            return;
        }

        if(!isPhoneIdentified){
            alert("휴대폰 본인인증을 진행해주세요.")
            return;
        }
        
        let formData = new FormData(document.getElementById("accountDropForm"));
        formData.append("userName", name);
        formData.append("phoneNumber", phoneNumber);
        formData.append("birth", birth);
        let returnVal = await nb_formDataFetch("/myAccountDrop", formData, true);
        if(returnVal.isSuccess){
            alert("탈퇴 요청이 정상 처리되었습니다. 14~15일 이후 정상적으로 탈퇴 처리됩니다.\n탈퇴를 취소하고 싶은 경우 재 로그인하면 자동 취소 됩니다.");
            document.cookie = "refresh-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            window.localStorage.setItem("access-token", null);
            window.location.href="/";
        }
    }

    useEffect(() => {
        const asyncUseEffect = async function(){
            let returnObj = await nb_dataFetch("/takeMerchantUid", true);
            setMerchantUid(returnObj.merchantUid);
            setMerchantIdCode(returnObj.merchantIdCode);
            window.addEventListener('popstate', backToPreviousPage);
        }
        asyncUseEffect();
        return ()=>removeAddedEvent();
    }, []);

    return (
        <>
        <div className='myProfileWrap'>
            <div className='myProfileTitle'>회원탈퇴</div>
            <hr/>
            <div className='mini-title3'>N명의수학 서비스를 이용하시는데 불편함이 있으셨나요?</div>
            <div className='mini-title3'>이용 불편 및 각종 문의 사항은 고객센터로 문의 주시면 적극적으로 해결하고 이에 대한 성심 성의있는 답변 드리겠습니다.</div>
            <div className='myAccountDropDiv'>
                <div className='myAccountDropTitle'>회원 탈퇴 전 , 유의사항을 확인해 주시기 바랍니다.</div>
                <ul>
                    <li>회원 탈퇴는 탈퇴 요청 후 14~15일 후에 처리됩니다. 14~15일 이전에 로그인 한 경우 자동으로 탈퇴 요청은 취소 됩니다.</li>
                    <li>
                        N명의수학에서 저작물(ex. 제작문제)을 생산하고 이 저작물에 대해 다른 사용자가 2차 저작물(ex. 변형문제)을 생산한 경우 원본 저작물에 대한 라이선스 정보는 삭제되지 않습니다.<br/>
                        (2차 저작물 생산 사용자에게는 원본문제의 저작권이 여전히 원본문제 제작자에게 존재함이 표시됩니다.)
                    </li>
                    <li>회원 탈퇴 처리 후 N명의수학에 저장 되어있는 사용자의 개인정보는 모두 파기됩니다.</li>
                    <li>탈퇴 이후 탈퇴한 회원의 이메일로는 계정을 만들 수 없습니다. 서비스 탈퇴 후 재 가입을 원할시 새로운 이메일 계정으로 가입하여 서비스를 이용 바랍니다.</li>
                </ul>
            </div>
            <div className='myAccountDropAgree'><input id="dropAgreeCheck" type="checkbox" />상기 회원탈퇴 처리사항 안내를 확인하고 이에 동의합니다.</div>
            <div className='myAccountDropDiv2'>
                <div>보안을 위해 회원님의 이름, 계정 이메일 및 비밀번호를 한번 더 확인합니다.</div>
                <form method="post" id="accountDropForm">
                    <table className='myAccountDropTb'>
                        <tbody>
                            <tr>
                                <td>이메일 : </td>
                                <td><input id="email" name="email" type="text" /></td>
                                <td>비밀번호 : </td>
                                <td><input id="password" name="password" type="password" /></td>
                                <td><span className='customBtn' onClick={()=>{onClickCertification()}}>휴대폰 본인 인증</span></td>
                                <td><span className='customBtn' onClick={()=>(myAccountDrop())}>탈퇴요청</span></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
            <div className='alignCenter'><span id='memberInfoConfirmBtn' className='customBtn2' onClick={()=>{navigate(-1);}}>뒤로가기</span></div>
        </div>
        </>
        
    );

}

export default MyAccountDrop;