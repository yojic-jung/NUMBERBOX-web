import React, {useEffect } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import {Link} from "react-router-dom";
import {nb_isLogin} from 'js/common/common_nb.js';

const ResourceMenuBar = ()=>{

    let isLogin = nb_isLogin();
return (
    <>
    <BrowserView>
        <div className='resourceMenuWrap'>
            <div  className='resourceMenuDiv'>
                <span id="shareResource" className='resourceMenuBtn'><Link className='linkNoneCss' to="/shareResource?mainCateNo=1">컨텐츠 목록</Link></span>
                <span id="resourceTools" className='resourceMenuBtn'><Link className='linkNoneCss' to="/resourceTools">컨텐츠 도구</Link></span>
                {isLogin && <span id="registerResource" className='resourceMenuBtn'><Link className='linkNoneCss' to="/registerResource">컨텐츠 등록</Link></span>}
            </div>
        </div>
    </BrowserView>
    <MobileView>
        <div className='resourceMenuWrap'>
            <div  className='resourceMenuDiv mobile'>
                <span id="shareResource" className='resourceMenuBtn'><Link className='linkNoneCss' to="/shareResource?mainCateNo=1">컨텐츠 목록</Link></span>
                <span id="resourceTools" className='resourceMenuBtn'><Link className='linkNoneCss' to="/resourceTools">컨텐츠 도구</Link></span>
                {isLogin && <span id="registerResource" className='resourceMenuBtn'><Link className='linkNoneCss' to="/registerResource">컨텐츠 등록</Link></span>}
            </div>
        </div>
    </MobileView>
    </>
    )
}

export default ResourceMenuBar;