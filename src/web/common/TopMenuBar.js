import React, {useEffect } from 'react';
import {Link} from "react-router-dom";
import {nb_isLogin, nb_isManger, nb_isAdmin} from 'js/common/common_nb.js';

const TopMenuBar = (isMain)=>{
    
    useEffect((event) => {
        window.addEventListener("click", closeMyServiceTap);
    });

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
        document.cookie = "refresh-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.localStorage.setItem("access-token", null);
        window.location.href="/";
    }

    const closeMyServiceTap = async(event) => {
        if(event.target.id === "myService-wrap") return;
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

    let isLogin = nb_isLogin();
    //매니저 권한 임시 구현
    let isManger = nb_isManger();
    let isAdmin = nb_isAdmin();
return (
    <>
    <div className='top-div'>
        <div className='bi-jutify-align'>
            <div className={titleClass}><Link className='linkNoneCss' to="/">넘버링크</Link></div>
            <div className={listClass}>
                <table className='menu-list-table'>
                    <tbody>
                        {!isLogin && <tr>
                            <td><Link className='linkNoneCss signLoginBtn' to="/login">로그인/회원가입</Link></td>
                        </tr>}
                        {isLogin && <tr>
                            <td>학습지생성</td>
                            <td>문제검색</td>
                            <td>문제만들기</td>
                            <td><Link className='linkNoneCss' to="/shareResource">컨텐츠</Link></td>
                            <td id="myService-wrap" className='myService-wrap' onClick={()=>{activeMyServiceTap()}}>
                                <span id="myService" className="myService" ></span>
                                <ul className="myService-list hide">
                                    <li>프로필</li>
                                    <li>나의 저장소</li>
                                    <li>나의 제작문제</li>
                                    <li>나의 학습지</li>
                                    <li><div onClick={()=>logoutFunction()}>로그아웃</div></li>
                                </ul>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    {isManger && <div className='manager-menu'>
        <div className='bi-jutify-align'>
            <div>매니저 메뉴</div>
            <div>
                <table className='menu-list-table'>
                    <tbody>
                        <tr>
                            <td><Link className='manager-link' to="/workContentsList">작업내역</Link></td>
                            <td><Link className='manager-link' to="/registerContents">문제만들기</Link></td>
                            {isAdmin && <td>컨텐츠 등록</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>}
    </>
    )
}

export default TopMenuBar;