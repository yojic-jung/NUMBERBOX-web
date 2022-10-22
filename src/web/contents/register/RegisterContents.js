import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import FormulaEditor from './FormulaEditor'
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";

const RegisterContents = ({contentsClassify})=>{
  return (
    <>
      <Helmet>
          <title>문제 만들기</title>
          <link rel="canonical" href="https://nsoohak.com/makeContents" />
          <meta property="og:title" content="문제 만들기" />
          <meta property="og:description" content="편리한 수식편집기로 수학문제를 만들어보세요!" />
      </Helmet>
      <div id="registerQuestion">
        <div className="register-div">
          <FormulaEditor contentsClassify={contentsClassify}/>
        </div>
      </div>
    </>
  );
}

export default RegisterContents;