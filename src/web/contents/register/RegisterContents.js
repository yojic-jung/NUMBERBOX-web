import React from 'react';
import FormulaEditor from './FormulaEditor'
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import TopMenuBar from 'web/common/TopMenuBar';

const RegisterContents = ()=>{
  return (
    <>
      <TopMenuBar />
      <div id="registerQuestion">
        <div className="register-div">
          <FormulaEditor />
        </div>
      </div>
    </>
  );
}

export default RegisterContents;