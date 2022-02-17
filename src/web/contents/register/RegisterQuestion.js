import React from 'react';
import FormularEditorLatex from './FormularEditorLatex'
import "css/common/common.css";
import "css/staff/staff.css";


const RegisterQuestion = ()=>{
  return (
    <>
      <div className="staff-title">문제 등록</div>
      <div className="register-div">
        <FormularEditorLatex />
      </div>
    </>
  );
}

export default RegisterQuestion;