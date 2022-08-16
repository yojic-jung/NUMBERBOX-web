import React from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import {Link} from "react-router-dom";
import { Outlet } from "react-router";
import ServicePolicy from 'web/page/ServicePolicy'
import PrivacyPolicy from 'web/page/PrivacyPolicy'

const BottomMenuBar = ()=>{
    return (
    <>
    <Outlet />
    <BrowserView>
        <div id="bottom-div" className='bottom-div'>
            <div className='bi-jutify-align'>
                <div className='bottom-menu-title'><Link className='linkNoneCss' to="/">N명<span className='bottom-menu-title2'>의</span>수학</Link></div>
                <div>
                    <ul className='bottom-ul'>
                        <li>
                        함께 만들어 모두 가져가세요.<br/>
                        Build together, take everything
                        </li>
                    </ul>
                </div>
                <div className='bottom-menu-list'>
                    <ul className='bottom-ul'>
                        <Link className='linkNoneCss' to="/contentsList"><li>문제 검색</li></Link>
                        <Link className='linkNoneCss' to="/makeMathDocs"><li>학습지 만들기</li></Link>
                        <Link className='linkNoneCss' to="/resourceTools"> <li>그래프만들기</li></Link>
                        <Link className='linkNoneCss' to="/makeContents"><li>문제만들기</li></Link>
                    </ul>
                </div>
                <div className='bottom-menu-list'>
                    <ul className='bottom-ul'>
                        <li className='pointer' onClick={()=>{document.getElementById("serviceCenter").classList.remove("hide");document.getElementById("servicePolicyTab").click();}}>운영정책</li>
                        <li className='pointer' onClick={()=>{document.getElementById("serviceCenter").classList.remove("hide");document.getElementById("serviceQuestionTab").click();}}>고객센터</li>
                    </ul>
                </div>
                <div className='bottom-menu-list'>
                    <ul className='bottom-ul'>
                        <li><span className='pointer' onClick={()=>{document.getElementById("servicePolicyState").classList.remove("hide");}}>이용약관</span></li>
                        <li><span className='pointer' onClick={()=>{document.getElementById("privacyPolicyState").classList.remove("hide");}}>개인정보처리방침</span></li>
                    </ul>
                </div>
            </div>
            <div className='bottom-company-info'>
                <div className='comp-info-div'>
                    상호 <span className='comp-info-title'>N명의수학</span>
                    대표자 <span className='comp-info-title'>정요직</span>
                    개인정보보호담당자 <span className='comp-info-title'>정요직</span>
                </div>
                <div className='comp-info-div'>
                    사업자 등록번호 <span className='comp-info-title'>654-19-01069</span>
                    통신판매업 신고 <span className='comp-info-title'>2019-서울동대문-0997호</span>
                </div>   
                <div className='comp-info-div'>
                    <span className='comp-info-title'>서울특별시 관악구 남부순환로 249길 18-5 &nbsp; | &nbsp; TEL. 02-878-1176 &nbsp; | &nbsp; EMAIL. dywlr74@naver.com</span>
                </div>
                <div className='comp-info-div'>
                    <span className='comp-info-title'>Copyright(c) N명의수학. All Rights Reserved.</span>
                </div>
                        
                </div>
                <ServicePolicy />
                <PrivacyPolicy />
        </div>
        </BrowserView>
        <MobileView>
        <div id="bottom-div" className='bottom-div'>
            <div className='bi-jutify-align mobile'>
                <div className='bottom-menu-title mobile'><Link className='linkNoneCss' to="/">N명<span className='bottom-menu-title2 mobile'>의</span>수학</Link></div>
                <div>
                    <ul className='bottom-ul mobile'>
                        <li>
                        함께 만들어 모두 가져가세요.<br/>
                        Build together, take everything
                        </li>
                    </ul>
                </div>
            </div>
            <div className='bottom-company-info'>
                <div className='comp-info-div'>
                    상호 <span className='comp-info-title'>N명의수학</span>
                    대표자 <span className='comp-info-title'>정요직</span><br/>
                    개인정보보호담당자 <span className='comp-info-title'>정요직</span>
                </div>
                <div className='comp-info-div'>
                    사업자 등록번호 <span className='comp-info-title'>654-19-01069</span><br/>
                    통신판매업 신고 <span className='comp-info-title'>2019-서울동대문-0997호</span>
                </div>   
                <div className='comp-info-div'>
                    <span className='comp-info-title'>서울특별시 관악구 남부순환로 249길 18-5 203호<br/>| &nbsp; TEL. 02-878-1176 &nbsp; | &nbsp; EMAIL. dywlr74@naver.com</span>
                </div>
                <div className='comp-info-div'>
                    <span className='comp-info-title'>Copyright(c) N명의수학. All Rights Reserved.</span>
                </div>
                        
                </div>
        </div>
        </MobileView>
    </>
    )
}

export default BottomMenuBar;