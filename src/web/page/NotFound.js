import React, { useEffect } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import "css/page/etcPage.css";

const NotFound = ()=>{
    let location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(location.pathname === "/makeMathDocsTwoStep"){
            window.history.back();
        }
    },[]);

return (
    <div className='marginSevenZero'>    
        <div className='errorCircle'>
            <div className="errorCircleContents">404</div>
        </div>
        <div className='errorContents'>
            페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.<br/>
            주소가 올바른지 다시 한번 확인해주세요.
        </div>
        <div>
            <div className='goBackBtn' onClick={ () => {navigate(-1);}}>뒤로가기</div>
        </div>
    </div>
    )
}

export default NotFound;