import React, {useState, useEffect} from 'react';
import UnitSelBox from './UnitSelBox';
import TypeSelBox from './TypeSelBox';
import CustomUnitSelBox from './CustomUnitSelBox';
import CustomTypeSelBox from './CustomTypeSelBox';
import {msb_dataFetch} from 'js/common/common_msb.js';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

let i=0;    //useState 리렌더링 문제 해결

export const UnitTypeCombo = () => {
  const [subjectBox, setSubjectBox] = useState(new Array());
  const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
  const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
  const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
  const [quesTypeBox, setQuesTypeBox] = useState(new Array());
  const [quesTypeKey, setQuesTypeKey] = useState();
  

  async function fetchUnitInfo () {
    let jsonObj = await msb_dataFetch('/unitInfo', true);
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
    await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);
  }
  
  
  async function fetchTypeInfo (event) {
    //customUnitSelBox의 cusSelId 파라미터 값 바뀌면 에러남
    if(document.getElementById(event.target.id).parentElement.id!="cusSelThrUnit"){
      setQuesTypeKey(i);
      i++;
      return;
    } 
    let target = document.getElementById("thrUnit");
    let unitUniqNo = target.options[target.selectedIndex].dataset.uniqNo;
    const jsonObj = await msb_dataFetch('/typeInfo?unitUniqNo='+unitUniqNo, true);
    setQuesTypeBox(jsonObj["mathTypeInfo"]);
    setQuesTypeKey(i);
      i++;
  }

  useEffect((event) => {
    fetchUnitInfo(event);
  },[]);

 
 
  return (
    <div>
        <CustomUnitSelBox value={subjectBox} cusSelId="cusSelSub" cusChildId="cusSelFirUnit" childId="firUnit" originSel="subject" parentMethod={()=>{}} title="과목"></CustomUnitSelBox>
        <UnitSelBox value={subjectBox} myId="subject" cusChildId="cusSelFirUnit" childId="firUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
        
        <CustomUnitSelBox value={firUnitSelBox} cusSelId="cusSelFirUnit" cusChildId="cusSelSecUnit" childId="secUnit" originSel="firUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
        <UnitSelBox value={firUnitSelBox} myId="firUnit" cusChildId="cusSelSecUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
        
        <CustomUnitSelBox value={secUnitSelBox} cusSelId="cusSelSecUnit" cusChildId="cusSelThrUnit" childId="thrUnit" originSel="secUnit" parentMethod={()=>{}} title="중단원"></CustomUnitSelBox>
        <UnitSelBox value={secUnitSelBox} myId="secUnit" cusChildId="cusSelThrUnit" childId="thrUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
        
        <CustomUnitSelBox value={thrUnitSelBox} cusSelId="cusSelThrUnit" cusChildId="cusSelQuesType" childId="quesType" originSel="thrUnit" parentMethod={fetchTypeInfo} title="소단원"></CustomUnitSelBox>
        <UnitSelBox value={thrUnitSelBox} myId="thrUnit" cusChildId="cusSelQuesType" childId="quesType" isUnitBubbleEv={false}  parentMethod={fetchTypeInfo}></UnitSelBox>
            
        <CustomTypeSelBox value={quesTypeBox} key={quesTypeKey+"00"} cusSelId="cusSelQuesType" originSel="quesType" ></CustomTypeSelBox>
        <TypeSelBox  value={quesTypeBox} key={quesTypeKey} myId="quesType"></TypeSelBox> 
    </div>
  );
}