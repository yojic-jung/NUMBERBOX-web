import React from 'react';
import LatexConverter from './LatexConverter'
import FormularShortCutKey from './FormularShortCutKey'
import "css/common/common.css";
import "css/staff/staff.css";

const RegisterQuestion = ()=>{
  return (
    <>
      <div className="staff-title">문제 등록</div>
      <div className="register-div">
        <FormularShortCutKey />
        <LatexConverter />
      </div>
    </>
  );
}


export default RegisterQuestion;