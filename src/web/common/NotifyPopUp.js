import React from 'react';

const NotifyPopUp = ()=>{
    return (
        <div id="notifyPopup" className='notifyPopup'>
            <div className="closeBtn errCloseBtn" onClick={()=>{document.getElementById("notifyPopup").classList.add("hide")}}>X</div>
            <div>
                <div className='notifyPopupTitle'><b>[공지] N명의수학 서비스 종료 안내</b></div>
                <br/>
                <div className='notifyPopupContents'>
                    <div>지난 2022년 11월 부터 시작한 N명의수학 웹서비스는 폐업으로 인하여 <u><em><b>11월 28일 서비스를 종료 합니다.</b></em></u></div>
                    <br/>
                    <div>N명의수학은 그동안 사용자에게 보다 나은 수학문제 제작 공유환경을 제공하기 위해 서비스를 개선해왔습니다.<br/>
                        허나, N명의수학은 비즈니스 모델을 잡지 못하고 수익성이 개선되지 않아 서비스 운영이 불가능하게 되었습니다.<br/>
                        그동안 N명의수학 서비스를 이용해주신 회원분들께 진심으로 감사의 말씀을 드리고 죄송하다는 말씀 또한 드립니다.<br/>
                    </div>
                    <br/>
                    <div><b>[서비스 종료 공지 일자] : 2023.10.28</b></div>
                    <div><b>[서비스 종료 일자] : 2023.11.28</b></div>
                </div>
            </div>
        </div>
    )
}

export default NotifyPopUp;