import React from 'react';
import UnitTypeCombo from 'web/common/UnitTypeCombo'
import LatexConverter from './LatexConverter'
import FormularShortCutKey from './FormularShortCutKey'
import "css/staff/staff.css";

const RegisterQuestion = ()=>{
  return (
    <>
      <div className="staff-title">문제 등록</div>
      <div className="register-div">
        <UnitTypeCombo />
        <FormularShortCutKey />
        <LatexConverter />
      </div>
    </>
  );
}


export default RegisterQuestion;