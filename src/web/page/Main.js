import React from 'react';
import "css/main/main.css";
import "css/common/common.css";
import TopMenuBar from 'web/common/TopMenuBar';
import BottomMenuBar from 'web/common/BottomMenuBar';

const Main = ()=>{
return (
    <>    
        <TopMenuBar isMain={true} />
        <div className='back'></div>
        <BottomMenuBar></BottomMenuBar>
    </>
    )
}

export default Main;