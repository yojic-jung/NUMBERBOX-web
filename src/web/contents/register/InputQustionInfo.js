import {React, useEffect} from 'react';
import {UnitTypeCombo} from 'web/common/UnitTypeCombo';
import CustomSelBoxUp from 'web/common/CustomSelBoxUp'
import {nb_closeBtn, nb_completeBlueBox, nb_fCustomSelClose, nb_formDataFetch, nb_fadeInOut} from 'js/common/common_nb.js';
import {reg_quesAnsTabClkEv} from 'js/contents/register/contents_reg';

const InputQustionInfo = ({parentMethod})=>{

    useEffect(() => {
		document.body.addEventListener('click',(event)=>nb_fCustomSelClose(event));
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

		if(originNo.value.length>4){
			alert("원본 문제번호는 9999번 보다 작게 입력해주시기 바랍니다.");
			return false;
		}
		
		let formData = new FormData(document.getElementById("contentsForm"));
		formData.append("unitUniqNo", thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
		formData.append("typeNo", quesType[quesType.selectedIndex].dataset.typeNo);

		// FormData의 값 확인
		/*
		for (var pair of formData.entries()) {
			console.log(pair[0]+ ': ' + pair[1]);
		}
		*/
			
		let returnObj = await nb_formDataFetch("/registerContents",formData, true);
		if(returnObj.error!=undefined){
			alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
		}

		if(returnObj["saveSuccess"]){
			
			//유형, 난이도, 원본문제 초기화
			customQuesType.innerText="유형정보"
			quesType.selectedIndex=0;
			document.getElementById("cusSelQuesTypeDiv").classList.remove("nbCustomSelected");
	
			cusQuesLevel.innerText="문제 난이도"
			quesLevel.selectedIndex=0;
			document.getElementById("cusQuesSelDiv").classList.remove("nbCustomSelected");
	
			originNo.value="";
			originNo.classList.remove("customBlueBoxComplete");
			await nb_closeBtn("contentsInfo")

			//문제,해설, 이미지, 객관식 정보 초기화
			document.getElementById("contentsFormulaEditor").innerHTML = "";
			document.getElementById("solutionFormulaEditor").innerHTML = "";
			document.getElementById("firNoFormulaEditor").innerHTML = "";
			document.getElementById("secNoFormulaEditor").innerHTML = "";
			document.getElementById("thrNoFormulaEditor").innerHTML = "";
			document.getElementById("fourNoFormulaEditor").innerHTML = "";
			document.getElementById("fifNoFormulaEditor").innerHTML = "";
			document.getElementById("answerFormulaEditor").innerHTML = "";
			//textarea,input 초기화
			await parentMethod();
			//객관식정답 초기화
			let choiceAnswerChkBox = document.getElementsByName("choiceAnswer")
			for(let i=0; i< choiceAnswerChkBox.length; i++){
				choiceAnswerChkBox[i].checked = false;
			}

			//문제,정답 이미지 초기화
			document.getElementById("contentsImg").value= "";
			let contentsImg = document.getElementById("contentsImgOutput");
			contentsImg.src = "";
			contentsImg.classList.add('hide');

			document.getElementById("solutionImg").value= "";
			let solutionImg = document.getElementById("solutionImgOutput");
			solutionImg.src = "";
			solutionImg.classList.add('hide');

			//contents-show 객관식 번호 초기화
			document.getElementById("firNoShow").classList.add('hide');
			document.getElementById("secNoShow").classList.add('hide');
			document.getElementById("thrNoShow").classList.add('hide');
			document.getElementById("fourNoShow").classList.add('hide');
			document.getElementById("fifNoShow").classList.add('hide');

			//문제입력 탭 클릭상태
			let trigEv = new Object();
			let sub    = new Object();
			trigEv.target= sub;
			trigEv.target.id= "quesTab";
			await reg_quesAnsTabClkEv(trigEv);
			await nb_fadeInOut("컨텐츠가 정상적으로 등록되었습니다.");
		}
	  }

  return (
    <>
		<div id="notifyBox" className='notifyBox'></div>
		<div className="blindBox hide"></div>
		<div id="contentsInfo" className="contentsInfo hide">
				<div className="closeBtn" onClick={ () => nb_closeBtn("contentsInfo")}>&#88;</div>
				<div className="mini-title3">문제 단원 및 유형 정보를 입력해주세요.</div>
				<input id="workMem"  name="workMem" type="text" className="customBlueBox" placeholder="이름을 적어주세요..." onBlur={event => nb_completeBlueBox(event, 2)}/>
				
				<UnitTypeCombo />
				
				<div>
					<CustomSelBoxUp value={[{"value":"하", "originVal":"1"},{"value":"중하", "originVal":"2"},{"value":"중", "originVal":"3"},{"value":"중상", "originVal":"4"},{"value":"상", "originVal":"5"}]} cusSelId="cusQuesSel" originSel="quesLevel" title="문제 난이도"></CustomSelBoxUp>
					<CustomSelBoxUp value={[{"value":"쎈수학", "originVal":"쎈수학"}, {"value":"RPM", "originVal":"RPM"}]} cusSelId="cusOrgRefSel" originSel="originRef" title="원본교재"></CustomSelBoxUp>

					<input id="originNo" name ="originNo" type="number" className="customBlueBox" placeholder="원본 문제 번호" onBlur={event => nb_completeBlueBox(event, 1)} />
					
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