import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ResourceMenuBar from 'web/common/ResourceMenuBar';
import RegisterResourceInp from 'web/mathResource/RegisterResourceInp';
import "css/resourceFile/registerResource.css";

const RegisterResource = () => {


    return (
        <>
        <Helmet>
            <title>컨텐츠 등록</title>
            <link rel="canonical" href="https://nsoohak.com/registerResource" />
            <meta property="og:title" content="컨텐츠 등록" />
            <meta property="og:description" content="컨텐츠 등록하여 사용자들과 공유해보세요!" />
        </Helmet>
        <ResourceMenuBar/>
        <div className='bage-ground'>
        <form method="post" id="resourceForm" encType="multipart/form-data">
            <div className='center regResDesc'>컨텐츠를 등록하여 사용자들과 함께 공유 해보세요!</div>
            <RegisterResourceInp isUpdtMode={false}/>
        </form>
        </div>
        
        </>
    );

}

export default RegisterResource;