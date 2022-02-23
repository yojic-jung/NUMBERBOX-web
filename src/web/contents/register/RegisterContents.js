import React from 'react';
import FormulaEditor from './FormulaEditor'
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";


const RegisterQuestion = ()=>{
  return (
    <>
      <div className="staff-title">문제 만들기</div>
      <div className="register-div">
        <FormulaEditor />
      </div>
    </>
  );
}

export default RegisterQuestion;