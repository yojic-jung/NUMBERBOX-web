import React, {useState, useEffect} from 'react';
import UnitSelBox from './UnitSelBox';
import TypeSelBox from './TypeSelBox';
import {unitTypeChange} from 'js/common/common.js';

function UnitTypeCombo() {
  const [subjectBox, setSubjectBox] = useState(new Array());
  const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
  const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
  const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
  const [quesTypeBox, setQuesTypeBox] = useState(new Array());
  

  useEffect(() => {
    fetch('/unitTypeInfo')
    .then(response => response.text() )
    .then(data => { 
      var jsonObj = JSON.parse(data)
      
      setSubjectBox(jsonObj["mathSubjectInfo"]);
      setfirUnitSelBox(jsonObj["mathFirUnitInfo"]);
      setSecUnitSelBox(jsonObj["mathSecUnitInfo"]);
      setThrUnitSelBox(jsonObj["mathThrUnitInfo"]);
      setQuesTypeBox(jsonObj["mathTypeInfo"]);

      //초기 단원 및 유형정보 셋팅
      var trigEv = new Object();
      var sub    = new Object();
      trigEv.target= sub;
      trigEv.target.id= "subject";
      unitTypeChange(trigEv);
      
      trigEv.target.id= "firUnit";
      unitTypeChange(trigEv);
    
      trigEv.target.id= "secUnit";
      unitTypeChange(trigEv);
      
      trigEv.target.id= "thrUnit";
      unitTypeChange(trigEv);
    });
  },[]);

  return (
    <div>
      <div className="unit-title">단원정보</div>
        <UnitSelBox value={subjectBox} childId="subject"></UnitSelBox>
        <UnitSelBox value={firUnitSelBox} childId="firUnit"></UnitSelBox>
        <UnitSelBox value={secUnitSelBox} childId="secUnit"></UnitSelBox>
        <UnitSelBox value={thrUnitSelBox} childId="thrUnit"></UnitSelBox>
      <div className="type-title">유형정보 <span>유형을 선택해주세요.</span></div>
      <div className="type-box" >
          <TypeSelBox value={quesTypeBox}></TypeSelBox> 
      </div>
    </div>
  );
}

export default UnitTypeCombo;