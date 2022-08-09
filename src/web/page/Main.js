import React, {useEffect} from 'react';
import {nb_getParameterByName, nb_fadeInOutA} from 'js/common/common_nb.js';
import "css/main/main.css";
import "css/common/common.css";

const Main = ()=>{

    useEffect(function(){
        let param = nb_getParameterByName("succeedSignUp");
        if(param !== ""){
            nb_fadeInOutA("감사합니다. 회원가입이 정상적으로 완료 되었습니다.", 2000);
            window.history.pushState("", "N명의 수학", '/');
        }
    })

    

return (
    <>
        <div className='back'></div>
    </>
    )
}

export default Main;