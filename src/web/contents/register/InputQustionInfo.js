import {React, useEffect} from 'react';
import {UnitTypeCombo} from 'web/common/UnitTypeCombo';
import CustomSelBoxUp from 'web/common/CustomSelBoxUp'
import {msb_closeBtn, msb_completeBlueBox, msb_fCustomSelClose} from 'js/common/common_msb.js';


const InputQustionInfo = ()=>{

    useEffect(async () => {
		document.body.addEventListener('click',(event)=>msb_fCustomSelClose(event));
      },[]);

	  const contentsFinalValidation = async function(){
		 let customSubject = document.getElementById("cusSelSubTitle");
		 let subject = document.getElementById("subject");
		 let customFirUnit = document.getElementById("cusSelFirUnitTitle");
		 let firUnit = document.getElementById("firUnit");
		 let customSecUnit = document.getElementById("cusSelSecUnitTitle");
		 let secUnit = document.getElementById("secUnit");
		 let customThrUnit = document.getElementById("cusSelThrUnitTitle");
		 let thrUnit = document.getElementById("thrUnit");
		 let customQuesType = document.getElementById("cusSelQuesTypeTitle");
		 let quesType = document.getElementById("quesType");
		 let cusQuesLevel = document.getElementById("cusQuesSelTitle");
		 let quesLevel = document.getElementById("quesLevel");
		 let cusOriginRef = document.getElementById("cusOrgRefSelTitle");
		 let originRef = document.getElementById("originRef");
		 let originNo = document.getElementById("originNo");

		 if(document.getElementById("workMem").value.length<2){
			 alert("이름을 적어주세요.")
			 return false;
		 }

		 if(customSubject.innerText=="과목" || subject.selectedIndex==0){
			 alert("과목을 선택해주세요.");
			 return false;
		 }
		if(customFirUnit.innerText=="대단원" || firUnit.selectedIndex==0){
			 alert("대단원을 선택해주세요.");
			 return false;
		 }
		if(customSecUnit.innerText=="중단원" || secUnit.selectedIndex==0){
			alert("중단원을 선택해주세요.");
			return false;
		}
		if(customThrUnit.innerText=="소단원" || thrUnit.selectedIndex==0){
			alert("소단원을 선택해주세요.");
			return false;
		}
		if(customQuesType.innerText == "유형정보" || quesType.selectedIndex==0){
			alert("유형정보를 선택해주세요.");
			return false;
		}
		if(cusQuesLevel.innerText == "문제 난이도" || quesLevel.selectedIndex==0){
			alert("문제 난이도를 선택해주세요.");
			return false;
		}
		if(cusOriginRef.innerText == "원본교재" || originRef.selectedIndex==0){
			alert("원본교재를 선택해주세요.");
			return false;
		}

		if(originNo.value.length==0){
			alert("원본 문제번호를 적어주세요.");
			return false;
		}
		
		let formData = new FormData(document.getElementById("contentsForm"));
		formData.append("unitUniqNo", thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
		formData.append("typeNo", quesType[quesType.selectedIndex].dataset.typeNo);

		
		let a = await dataTransfer(formData);
		console.log(a);
		//callback에서 구현
		customQuesType.innerText="유형정보"
		quesType.selectedIndex=0;
		document.getElementById("cusSelQuesTypeDiv").classList.remove("msbCustomSelected");

		cusQuesLevel.innerText="문제 난이도"
		quesLevel.selectedIndex=0;
		document.getElementById("cusQuesSelDiv").classList.remove("msbCustomSelected");

		originNo.value="";
		originNo.classList.remove("customBlueBoxComplete");
	  }

	  const dataTransfer = (formData) => {
		fetch('/registerContents', {	// fetch를 통해 Ajax통신을 한다.
		  method: 'post',	// 방식은 post
		  headers: {
		  },
		  body: formData	// body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
		})
		  .then(res => res.json())
		  .then(obj => {	// obj에는 서버사이드에서 전송해준 DB등록 성공여부가 담겨있다.
		  });
		}
  return (
    <>
		<div className="blindBox hide"></div>
		<div id="contentsInfo" className="contentsInfo hide">
				<div className="closeBtn" onClick={event => msb_closeBtn(event)}>&#88;</div>
				<div className="mini-title3">문제 단원 및 유형 정보를 입력해주세요.</div>
				<input id="workMem"  name="workMem" type="text" className="customBlueBox" placeholder="이름을 적어주세요..." onBlur={event => msb_completeBlueBox(event, 2)}/>
				
				<UnitTypeCombo />
				
				<div>
					<CustomSelBoxUp value={[{"value":"하", "originVal":"1"},{"value":"중하", "originVal":"2"},{"value":"중", "originVal":"3"},{"value":"중상", "originVal":"4"},{"value":"상", "originVal":"5"}]} cusSelId="cusQuesSel" originSel="quesLevel" title="문제 난이도"></CustomSelBoxUp>
					<CustomSelBoxUp value={[{"value":"쎈수학", "originVal":"쎈수학"}, {"value":"RPM", "originVal":"RPM"}]} cusSelId="cusOrgRefSel" originSel="originRef" title="원본교재"></CustomSelBoxUp>

					<input id="originNo" name ="originNo" type="number" className="customBlueBox" placeholder="원본 문제 번호" onBlur={event => msb_completeBlueBox(event, 1)} />
					
					<select id="originRef" name="originRef" className="hide" >
						<option value="0">원본교재</option>
						<option value="쎈수학">쎈수학</option>
						<option value="RPM">RPM</option>
					</select>

					<select id="quesLevel" name="quesLevel" className="hide">
						<option value="0">문제 난이도</option>
						<option value="1">하</option>
						<option value="2">중하</option>
						<option value="3">중</option>
						<option value="4">중상</option>
						<option value="5">상</option>
					</select>
				</div>
				<div className='saveContentsDiv'>
					<span id="saveContents" className='saveContents' onClick={()=>{contentsFinalValidation()}}>문제 등록</span>
				</div>
			</div>
    </>
  );
}

export default InputQustionInfo;