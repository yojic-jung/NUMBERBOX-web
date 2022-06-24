import React from 'react';
import { useNavigate  } from 'react-router-dom';
import "css/page/etcPage.css";

const NotFound = ()=>{
    const navigate = useNavigate();
return (
    <>    
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
    </>
    )
}

export default NotFound;