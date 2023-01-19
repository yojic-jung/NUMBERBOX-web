import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import FormulaEditorMulti from './FormulaEditorMulti'
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";

const RegisterContentsMulti = ({contentsClassify})=>{
  return (
    <>
      <Helmet>
          <title>문제 일괄 등록</title>
          <meta name="description" content="편리한 수식편집기로 수학문제를 만들어보세요!"/>
          <link rel="canonical" href="https://nsoohak.com/registerIpsiContentsMulti" />
          <meta property="og:title" content="문제 일괄 등록" />
          <meta property="og:description" content="편리한 수식편집기로 수학문제를 만들어보세요!" />
      </Helmet>
      <div id="registerQuestion">
        <div className="register-div">
          <FormulaEditorMulti contentsClassify={contentsClassify}/>
        </div>
      </div>
    </>
  );
}

export default RegisterContentsMulti;