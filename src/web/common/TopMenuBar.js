import React, {useState, useEffect } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import {Link} from "react-router-dom";
import {nb_isLogin, nb_isManger, nb_isAdmin, nb_dataFetch} from 'js/common/common_nb.js';
import defaultProfileImg from 'img/defaultProfile.png';
import warningImg from 'img/warning.png';
import { Outlet } from "react-router";
import ServiceCenter from 'web/common/ServiceCenter';

const TopMenuBar = (isMain)=>{
    const [imgPath, setImgPath] = useState(null);
    const [myNickName, setMyNickName] = useState(null);
    const [notApplyBrowser, setNotApplyBrowser] = useState(false);

    let isLogin = nb_isLogin();
    //매니저 권한 임시 구현
    let isManger = nb_isManger();
    let isAdmin = nb_isAdmin();

    useEffect(() => {
        if (!(window.navigator.userAgent.toLocaleLowerCase().indexOf("chrome")>-1 ||
        window.navigator.userAgent.toLocaleLowerCase().indexOf("edge")>-1)) {
            setNotApplyBrowser(true);
        }
        window.addEventListener("click", closeMyServiceTap);
        if(isLogin){
            const asyncUseEffect = async function(){
                let jsonObj = await nb_dataFetch('/takeProfile', true);
                if(jsonObj.isSuccess){
                    setMyNickName(jsonObj.profile.nickname);
                    if(jsonObj.profile.profileImgPath !== null && jsonObj.profile.profileImgName !== null){
                        setImgPath(process.env.REACT_APP_SERVER_STATIC_HOST+jsonObj.profile.profileImgPath+jsonObj.profile.profileImgName);
                    }
                }
            }
            asyncUseEffect();
        }
    },[]);

    let titleClass = "menu-title";
    let listClass = "menu-list";
    if(isMain.isMain){
        titleClass = "menu-title";
        listClass = "menu-list";
    }else{
        titleClass = "menu-title-etc";
        listClass = "menu-list-etc";
    }

    const logoutFunction = async () => {
        await nb_dataFetch("/delRefreshToken", false);  //서버에서 refresh쿠키 및 db정보 삭제
        window.localStorage.removeItem("access-token");
        window.localStorage.removeItem("role");
        window.location.href="/";
    }

    const closeMyServiceTap = async(event) => {
        if(event.target.id === "myService-wrap" || event.target.id === "topMenuProfileImg") return;
        let myServiceTap = document.getElementsByClassName("myService-list")[0];
        if(myServiceTap !== undefined){
            myServiceTap.classList.add("hide");;
        }
    }

    const activeMyServiceTap = async() => {
        let myServiceTap = document.getElementsByClassName("myService-list")[0];
        let isHide = myServiceTap.classList.contains("hide");
        if(isHide){
            myServiceTap.classList.remove("hide");
        }else{
            myServiceTap.classList.add("hide");
        }
    }

   
return (
    <>
    <BrowserView>
    {notApplyBrowser && <div className='browserWarningDiv'>
        <img src={warningImg} className="browserWarningImg" alt="warningImg" />
        <div className='browserWarningDesc'>
        n명의 수학은 <b>크롬, 엣지, 오페라, 네이버 웨일 브라우저</b>에서 최적화 되어있습니다. <br/>
        <b>위 브라우저를 통해 접속하여 주시기 바랍니다.</b>
        </div>
        </div>}
    <div  id="topMenuBar" className='top-div'>
        <div className='bi-jutify-align'>
            <div className={titleClass}><Link className='linkNoneCss' to="/">N명<span className='menu-title-etc2'>의</span>수학</Link></div>
            <div className={listClass}>
                <table className='menu-list-table'>
                    <tbody>
                        {!isLogin && <tr>
                            <td><Link className='linkNoneCss' to="/makeMathDocs">학습지생성</Link></td>
                            <td><Link className='linkNoneCss' to="/contentsList">문제검색</Link></td>
                            <td><Link className='linkNoneCss' to="/makeContents">문제만들기</Link></td>
                            <td><Link className='linkNoneCss' to="/shareResource?mainCateNo=1&pageNum=1">컨텐츠</Link></td>
                            <td><span className='pointer' onClick={()=>{window.open("/fileConvert")}}>파일변환</span></td>
                            <td><Link className='linkNoneCss signLoginBtn' to="/login">로그인/회원가입</Link></td>
                        </tr>}
                        {isLogin && <tr>
                            <td><Link className='linkNoneCss' to="/makeMathDocs">학습지생성</Link></td>
                            <td><Link className='linkNoneCss' to="/contentsList">문제검색</Link></td>
                            <td><Link className='linkNoneCss' to="/makeContents">문제만들기</Link></td>
                            <td><Link className='linkNoneCss' to="/shareResource?mainCateNo=1&pageNum=1">컨텐츠</Link></td>
                            <td><span className='pointer' onClick={()=>{window.open("/fileConvert")}}>파일변환</span></td>
                            <td id="myService-wrap" className='myService-wrap' onClick={()=>{activeMyServiceTap()}}>
                                {imgPath === null ?
                                    <img id="topMenuProfileImg" alt="." src={defaultProfileImg} className="topMenuProfileImg"/> 
                                    : <img id="topMenuProfileImg" alt="." src={imgPath} className="topMenuProfileImg"/> 
                                }
                                
                                <ul className="myService-list hide">
                                    <Link className='linkNoneCss' to="/myProfile"><li>프로필</li></Link>
                                    <Link className='linkNoneCss' to="/myContentsList"><li>나의 제작문제</li></Link>
                                    <Link className='linkNoneCss' to="/myRepository"><li>나의 저장소</li></Link>
                                    <Link className='linkNoneCss' to="/myMathDocs?pageNum=1"><li>나의 학습지</li></Link>
                                    <Link className='linkNoneCss' to="/myResource?pageNum=1"><li>나의 컨텐츠</li></Link>
                                    <li onClick={()=>{document.getElementById("serviceCenter").classList.remove("hide")}}>고객센터</li>
                                    <li><div onClick={()=>logoutFunction()}>로그아웃</div></li>
                                </ul>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <ServiceCenter myNickName={myNickName} />
    
    {isManger && <div className='manager-menu'>
        <div className='bi-jutify-align'>
            <div>매니저 메뉴</div>
            <div>
                <table className='menu-list-table'>
                    <tbody>
                        <tr>
                            <td><Link className='manager-link' to="/admin/adminMenuBar">관리자 메뉴</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>}
    </BrowserView>
    <MobileView>
        <div  id="topMenuBar" className='top-div mobile'>
            <div className='mobile'>
                <div className={titleClass}><Link className='linkNoneCss' to="/">N명<span className='menu-title-etc2'>의</span>수학</Link></div>
            </div>
        </div>
        
        <ServiceCenter myNickName={myNickName} />
        
        {isManger && <div className='manager-menu'>
            <div className='bi-jutify-align mobile'>
                <div>매니저 메뉴</div>
                <div>
                    <table className='menu-list-table'>
                        <tbody>
                            <tr>
                                <td><Link className='manager-link' to="/admin/workContentsList">작업내역</Link></td>
                                <td><Link className='manager-link' to="/admin/registerContents">문제만들기</Link></td>
                                {isAdmin && <td><Link className='manager-link' to="/admin/adminSvcCenter">관리자센터</Link></td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>}
    </MobileView>
    <Outlet />
    </>
    )
}

export default TopMenuBar;