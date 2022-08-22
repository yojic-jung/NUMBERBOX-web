import React, {useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import { useNavigate  } from 'react-router-dom'; // useHistory 추가
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import ProfileComponent from 'web/common/ProfileComponent';
import {nb_dataFetch, nb_formDataFetch, nb_fadeInOutA, nb_fadeInOutB} from 'js/common/common_nb.js';

const MyProfile = ()=>{
    const navigate = useNavigate ();

    const [email, setEmail] = useState("");
    const [certified, setCertified] = useState(false);

    const [merchantUid, setMerchantUid] = useState(0);
    const [merchantIdCode, setMerchantIdCode] = useState(0);
    
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");


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
          let returnData = await nb_dataFetch("/certifications/"+response.imp_uid, true);
          let formData = new FormData();
          formData.append("userName", returnData.name);
          formData.append("birth", returnData.birth);
          formData.append("phoneNumber", returnData.phone);
          let returnObj = await nb_formDataFetch("/changePhoneNumber", formData, true);
          if(returnObj.isChanged){
                nb_fadeInOutA("휴대폰 번호가 변경 되었습니다.", 2000);
                document.getElementById("memberInfoConfirmBtn").click();
          }else{
                nb_fadeInOutB("사용자 정보가 이미 등록되어 있는 정보와 달라 휴대폰 번호가 변경 되지 않았습니다.", 2000);
          }
        } else {
          alert(`본인인증 실패: ${error_msg}`);
        }
      }

    useEffect(()=>{
        const asyncUseEffect = async function(){
            let returnObj = await nb_dataFetch("/takeMerchantUid", true);
            setMerchantUid(returnObj.merchantUid);
            setMerchantIdCode(returnObj.merchantIdCode);

            let myEmail = await nb_dataFetch("/takeMyEmail", true);
            setEmail(myEmail.email);

        }
        asyncUseEffect();
    },[]);

    const confirmPassword = async () => {
        let formData = new FormData();
        formData.append("password", document.getElementById("confirmPassword").value);
        let isCertified = await nb_formDataFetch("/confirmPassword", formData, true);
        if(isCertified.isCertified){
            setCertified(true);
            window.history.pushState("", "나의 프로필 사항", '/myProfileDetail');
            setName(isCertified.memberInfo.userName);
            setPhone(isCertified.memberInfo.phoneNumber);
        }else{
            setCertified(false);
            nb_fadeInOutB("비밀번호가 일치하지 않습니다.", 2000);
        }
    }
    const passRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;//패스워드 문자 숫자 특수문자 8-15자

    const passChange = async () => {
        if(!passRegex.test(document.getElementById("newPassword").value)){
            nb_fadeInOutB("영문, 숫자, 특수문자 포함 8-15자리 비밀번호를 입력해주세요.", 2000);
            return;
        }

        if(document.getElementById("newPassword").value !== document.getElementById("newPasswordConfirm").value){
            nb_fadeInOutB("입력하신 새 비밀번호가 일치하지 않습니다.", 2000);
            return;
        }

        let formData = new FormData();
        formData.append("oldPassword", document.getElementById("currentPassword").value);
        formData.append("newPassword", document.getElementById("newPassword").value);
        let returnObj = await nb_formDataFetch("/changePassword", formData, true);
        if(returnObj.isPassChanged){
            nb_fadeInOutA("비밀번호가 변경 되었습니다.", 2000);
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newPasswordConfirm").value = "";
            document.getElementById("memberInfoConfirmBtn").click();
        }else{
            nb_fadeInOutB("현재 비밀번호가 틀렸습니다. 다시 시도 해주세요.", 2000);
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newPasswordConfirm").value = "";
        }
        
        
    }

  return (
    <>
        <ProfileComponent isMine={true} />
        <div>
            <div className='myProfileWrap'>
                {certified ?
                <>
                <div className='myProfileTitle'>회원정보 수정</div>
                <table className='myProfileConfirmTable update'>
                    <tbody>
                        <tr>
                            <td>이메일</td>
                            <td><span className='bolder'>{email}</span></td>
                        </tr>
                        <tr>
                            <td>이름</td>
                            <td className='bolder'>{name}</td>
                        </tr>
                        <tr>
                            <td>휴대폰 번호</td>
                            <td>
                                <span className='bolder'>{phone}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='customBtn' onClick={()=>onClickCertification()}>휴대폰 번호 변경</span>
                            </td>
                        </tr>
                        <tr>
                            <td>비밀번호 변경</td>
                            <td>
                                <table className='marginLTwoZero'>
                                    <tbody>
                                        <tr>
                                            <td>현재 비밀번호</td>
                                            <td><input id="currentPassword" className='confirmPassword detail' type="password" /></td>
                                        </tr>
                                        <tr>
                                            <td>새 비밀번호</td>
                                            <td><input id="newPassword" className='confirmPassword detail' type="password" /></td>
                                        </tr>
                                        <tr>
                                            <td>비밀번호 확인</td>
                                            <td><input id="newPasswordConfirm" className='confirmPassword detail' type="password" onKeyDown={(event)=>{if(event.keyCode === 13) document.getElementById("passChangeBtn").click();}}/></td>
                                        </tr>
                                        <tr>
                                            <td className='alignCenter' colSpan={2}><span id="passChangeBtn" className='customBtn' onClick={()=>{passChange()}}>비밀번호 변경</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='alignRight'><span className='customBtn2'><Link className='linkNoneCss' to="/myAccountDrop">회원탈퇴</Link></span></div>
                <div className='alignCenter'><span id='memberInfoConfirmBtn' className='customBtn2' onClick={()=>{navigate(-1);setCertified(false);}}>뒤로가기</span></div>
                </>
                : <>
                <div className='myProfileTitle'>회원정보 확인</div>
                <div className='myProfileDesc'>회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 입력 해주시기 바랍니다.</div>
                <table className='myProfileConfirmTable'>
                    <tbody>
                        <tr>
                            <td>이메일</td>
                            <td><span>{email}</span></td>
                        </tr>
                        <tr>
                            <td>비밀번호</td>
                            <td><input id="confirmPassword" className='confirmPassword' type="password" onKeyDown={(event)=>{if(event.keyCode === 13) document.getElementById("memberInfoDetailBtn").click();}}/></td>
                        </tr>
                    </tbody>
                </table>
                <div className='alignCenter'><span id="memberInfoDetailBtn" className='customBtn' onClick={()=>{confirmPassword()}}>확인</span></div>
                </>}
            </div>
        </div>
    </>
  );
}

export default MyProfile;