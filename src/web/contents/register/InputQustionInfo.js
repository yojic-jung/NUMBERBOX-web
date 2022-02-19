import {React, useEffect} from 'react';
import {UnitTypeCombo} from 'web/common/UnitTypeCombo';
import CustomSelBoxUp from 'web/common/CustomSelBoxUp'
import {msb_closeBtn, msb_completeBlueBox, msb_fCustomSelClose} from 'js/common/common_msb.js';


const InputQustionInfo = ()=>{

    useEffect(async () => {
		document.body.addEventListener('click',(event)=>msb_fCustomSelClose(event));
      },[]);


  return (
    <>
		<div className="blindBox hide"></div>
		<div id="contentsInfo" className="contentsInfo hide">
				<div className="closeBtn" onClick={event => msb_closeBtn(event)}>&#88;</div>
				<div className="mini-title3">문제 단원 및 유형 정보를 입력해주세요.</div>
				<input id="workMem"  name="workMem" type="text" className="customBlueBox" placeholder="이름을 적어주세요..." onBlur={event => msb_completeBlueBox(event, 2)}/>
				
				<UnitTypeCombo />
				
				<div>
					<CustomSelBoxUp value={[{"value":"하"},{"value":"중하"},{"value":"중"},{"value":"중상"},{"value":"상"}]} cusSelId="cusQuesSel" originSel="quesLevel" title="문제 난이도"></CustomSelBoxUp>
					<CustomSelBoxUp value={[{"value":"쎈수학"},{"value":"RPM"}]} cusSelId="cusOrgRefSel" originSel="originRef" title="원본교재"></CustomSelBoxUp>

					<input id="originNo" name ="originNo" type="number" className="customBlueBox" placeholder="원본 문제 번호" onBlur={event => msb_completeBlueBox(event, 1)} />
					
					<select id="originRef" name="originRef" className="hide" >
						<option value="0">원본교재</option>
						<option value="쎈수학">쎈수학</option>
						<option value="RPM">RPM</option>
					</select>

					<select id="quesLevel" name="quesLevel" className="hide">
						<option value="0">--선택--</option>
						<option value="1">하</option>
						<option value="2">중하</option>
						<option value="3">중</option>
						<option value="4">중상</option>
						<option value="5">상</option>
					</select>
					
				</div>
			</div>
    </>
  );
}

export default InputQustionInfo;