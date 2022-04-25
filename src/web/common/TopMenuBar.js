import React from 'react';
import {Link} from "react-router-dom";
import {nb_isLogin} from 'js/common/common_nb.js';

const TopMenuBar = (isMain)=>{
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

    let isLogin = nb_isLogin();
return (
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
                            <td><Link className='linkNoneCss' to="/workContentsList">작업내역</Link></td>
                            <td><Link className='linkNoneCss' to="/registerContents">문제만들기</Link></td>
                            <td><span className='pointer' onClick={()=>logoutFunction()}>로그아웃</span></td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default TopMenuBar;