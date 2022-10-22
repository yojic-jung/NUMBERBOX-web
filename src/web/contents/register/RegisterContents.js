import React, { useState } from 'react';
import FormulaEditor from './FormulaEditor'
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";

const RegisterContents = ({contentsClassify})=>{
  return (
    <>
      <div id="registerQuestion">
        <div className="register-div">
          <FormulaEditor contentsClassify={contentsClassify}/>
        </div>
      </div>
    </>
  );
}

export default RegisterContents;