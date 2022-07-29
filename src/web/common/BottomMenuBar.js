import React from 'react';
import {Link} from "react-router-dom";
import { Outlet } from "react-router";

const BottomMenuBar = ()=>{
return (
    <>
    <Outlet />
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
                        <li>회사소개</li>
                        <li className='pointer' onClick={()=>{document.getElementById("serviceCenter").classList.remove("hide")}}>고객센터</li>
                    </ul>
                </div>
                <div className='bottom-menu-list'>
                    <ul className='bottom-ul'>
                        <li>이용약관</li>
                        <li>개인정보처리방침</li>
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
        </div>
    </>
    )
}

export default BottomMenuBar;