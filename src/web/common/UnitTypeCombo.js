import React, {useState, useEffect} from 'react';
import UnitSelBox from './UnitSelBox';
import TypeSelBox from './TypeSelBox';
import {msb_dataFetch} from 'js/common/common_msb.js';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

let i=0;    //useState 리렌더링 문제 해결

export const UnitTypeCombo = () => {
  const [subjectBox, setSubjectBox] = useState(new Array());
  const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
  const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
  const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
  const [quesTypeBox, setQuesTypeBox] = useState(new Array());
  const [quesTypeKey, setQuesTypKey] = useState();
  

  async function fetchUnitInfo () {
    let jsonObj = await msb_dataFetch('/unitInfo', false);
    setSubjectBox(jsonObj["mathSubjectInfo"]);
    setfirUnitSelBox(jsonObj["mathFirUnitInfo"]);
    setSecUnitSelBox(jsonObj["mathSecUnitInfo"]);
    setThrUnitSelBox(jsonObj["mathThrUnitInfo"]);
    //setQuesTypeBox(jsonObj["mathTypeInfo"]);

    //초기 단원 및 유형정보 셋팅
    let trigEv = new Object();
    let sub    = new Object();
    trigEv.target= sub;
    trigEv.target.id= "subject";
    await reg_unitTypeChange(trigEv, "firUnit", true);
  }
  
  
  async function fetchTypeInfo () {
    let target = document.getElementById("thrUnit");
    let unitUniqNo = target.options[target.selectedIndex].dataset.uniqNo;
    console.log(target.options[target.selectedIndex].value);
    const jsonObj = await msb_dataFetch('/typeInfo?unitUniqNo='+unitUniqNo, false);
    setQuesTypeBox(jsonObj["mathTypeInfo"]);
    setQuesTypKey(i);
      i++;
      console.log(i);
  }

  useEffect(() => {
    fetchUnitInfo();
  },[]);

 
 
  return (
    <div>
      <div className="mini-title">단원정보</div>
        <UnitSelBox value={subjectBox} myId="subject" childId="firUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
        <UnitSelBox value={firUnitSelBox} myId="firUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
        <UnitSelBox value={secUnitSelBox} myId="secUnit" childId="thrUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
        <UnitSelBox value={thrUnitSelBox} myId="thrUnit" childId="quesType" isUnitBubbleEv={false} parentMethod={fetchTypeInfo}></UnitSelBox>
      <div className="mini-title">유형정보</div>
      <div className="type-box" >
          <TypeSelBox  value={quesTypeBox} key={quesTypeKey}></TypeSelBox> 
      </div>
    </div>
  );
}

