import React, {useEffect } from 'react';
import "css/main/main.css";
import "css/common/common.css";
import {Link} from "react-router-dom";
import {nb_isLogin, nb_isManger, nb_isAdmin} from 'js/common/common_nb.js';

const AdminMenuBar = ()=>{

    let isLogin = nb_isLogin();
    //매니저 권한 임시 구현
    let isManger = nb_isManger();
    let isAdmin = nb_isAdmin();
    useEffect(() => {
        
    },[]);

return (
    <>    
        <div className='manager-menu-div'>
            {true &&
            <div><Link className='manager-link' to="/admin/MembersStatistic"><span className='manager-menu-btn'>회원통계</span></Link></div>
            }

            {isManger &&
                <>
                    <div><Link className='manager-link' to="/admin/workContentsList"><span className='manager-menu-btn'>자체문제 작업내역</span></Link></div>
                    <div><Link className='manager-link' to="/admin/registerContents"><span className='manager-menu-btn'>자체문제 만들기</span></Link></div>
                </>
            }

            {isAdmin &&
             <>
                <div><Link className='manager-link' to="/admin/ipsiWorkContentsList"><span className='manager-menu-btn'>수능/모의고사 작업내역</span></Link></div>
                <div><Link className='manager-link' to="/admin/registerIpsiContentsMulti"><span className='manager-menu-btn'>수능/모의고사 문제 만들기</span></Link></div>
                <div><Link className='manager-link' to="/admin/mathTypeCategory"><span className='manager-menu-btn'>유형카테고리</span></Link></div>
                <div><Link className='manager-link' to="/admin/adminSvcCenter"><span className='manager-menu-btn'>관리자센터</span></Link></div>
            </>
            }
        </div>
    </>
    )
}

export default AdminMenuBar;