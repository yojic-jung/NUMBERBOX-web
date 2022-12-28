import React, {useEffect} from 'react';
import {UnitTypeCombo} from 'web/common/UnitTypeCombo';
import LicenseUi from 'web/common/LicenseUi.js';
import { useLocation } from 'react-router-dom';
import CustomSelBoxDown from 'web/common/CustomSelBoxDown'
import licensePublic from 'img/license-public.png'
import licensePrivate from 'img/license-private.png'
import {nb_closeBtn, nb_completeBlueBox, nb_fCustomSelClose, nb_formDataFetch, nb_fadeInOut} from 'js/common/common_nb.js';
import {reg_quesAnsTabClkEv, reg_undoRedoInitialize, reg_undoRedoSetting, reg_convertSpanToNoTag, reg_removeStyleAttribute, reg_removeResizeFrame} from 'js/contents/register/contents_reg';
import { cvt_convertHtmlToTex} from 'js/convertGrammer/nbToTexConvert_cvt.js';
const RegisterContentsInfo = ({parentMethod, updateModeUniqNo, contentsClassify, isOnlyImgReg})=>{
	let urlPath = useLocation().pathname;
    useEffect(() => {
		document.body.addEventListener('click',(event)=>nb_fCustomSelClose(event));
		if(isOnlyImgReg){ document.getElementById("transLicenseDesc").classList.add("hide");}
      },[]);

	  // 문제 및 해설, 객관식, 주관식 정답 마지막 공백 제거(줄바꿈)
	  const trimRegisterContents = async function() {
		let targetId = ["contentsFormulaEditor", "solutionFormulaEditor" ,"firNoFormulaEditor" , "secNoFormulaEditor", "thrNoFormulaEditor", "fourNoFormulaEditor", "fifNoFormulaEditor", "answerFormulaEditor"];
		let targetHtml = ["contents", "solution" ,"firNo" , "secNo", "thrNo", "fourNo", "fifNo", "answer"];

		document.getElementById("contentsOptBox").classList.remove("hide");
		for(let i=0; i<targetId.length; i++){
			document.getElementById(targetId[i]).classList.remove("hide");
			let whileIdx=0;
			while(document.getElementById(targetId[i]).innerText.substr(-2) === "\n\n"){
			// 띄어쓰기는 제거안함
			//while(document.getElementById(targetId[i]).innerText.substr(-2) === "\n\n" || encodeURI(document.getElementById(targetId[i]).innerText.substr(-1)) === '%C2%A0'){
				whileIdx++
				if(whileIdx>500){
					alert("[무한루프 에러] 공백문자 제거 도중 에러 발생");
					break;
				}
				if(document.getElementById(targetId[i]).innerText.substr(-2) === "\n\n"){
					let brTag = document.getElementById(targetId[i]).querySelectorAll("br");
					if(brTag.length !== 0){
						if(brTag[brTag.length-1].closest(".nbBox") === null){
							brTag[brTag.length-1].remove();
							document.getElementById(targetHtml[i]).innerHTML = document.getElementById(targetId[i]).innerHTML;
						} else{
							break;
						}
					}else{
						break;
					}
				}
			}

			//span 태그 없애기
			await reg_convertSpanToNoTag(targetId[i]);

			//수식요소 및 div 태그 스타일 직접 적용된 경우 제거
			await reg_removeStyleAttribute(targetId[i]);

			
			document.getElementById(targetHtml[i]).value = document.getElementById(targetId[i]).innerHTML;

		}
	  }
	
	  const getByteLengthOfString = function(s,b,i,c){
		for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
		return b;
	  };

	  const shareSttsChange = async function(shareStts){
		if(shareStts){
			document.getElementById("licOptDiv").classList.remove("lowerOpacity");
			document.getElementById("onlineLicStts").checked = false;
			document.getElementById("onlineLicStts").disabled = false;

			document.getElementById("perLicStts").checked = false;
			document.getElementById("perLicStts").disabled = false;
			
			document.getElementById("entLicStts").checked = false;
			document.getElementById("entLicStts").disabled = false;
		}else{
			document.getElementById("licOptDiv").classList.add("lowerOpacity");
			document.getElementById("onlineLicStts").disabled = true;
			document.getElementById("perLicStts").disabled = true;
			document.getElementById("entLicStts").disabled = true;
		}
	  }



	  const contentsFinalValidation = async function(){
		 let customSubject = document.getElementById("cusSelSubTitle");
		 let subject = document.getElementById("subject");
		 //let customFirUnit = document.getElementById("cusSelFirUnitTitle");
		 //let firUnit = document.getElementById("firUnit");
		 let customSecUnit = document.getElementById("cusSelSecUnitTitle");
		 let secUnit = document.getElementById("secUnit");
		 let customThrUnit = document.getElementById("cusSelThrUnitTitle");
		 let thrUnit = document.getElementById("thrUnit");
		 let customQuesType = document.getElementById("cusSelQuesTypeTitle");
		 let quesType = document.getElementById("quesType");
		 let cusQuesLevel = document.getElementById("cusQuesSelTitle");
		 let quesLevel = document.getElementById("quesLevel");
		 let cusOrgSrcRef = document.getElementById("cusOrgRefSelTitle");
		 let orgSrcRef = document.getElementById("orgSrcRef");
		 let orgSrcNo = document.getElementById("orgSrcNo");
		 let orgSrcPage = document.getElementById("orgSrcPage");
		 let copyrightYear = document.getElementById("copyrightYear");
		 let mathTypeClassify = document.getElementById("mathTypeClassify");
		 let cusMathClassifySelTitle = document.getElementById("cusMathClassifySelTitle");


		 if(!isOnlyImgReg){
			let totalFileSize = getByteLengthOfString(document.getElementById("contentsFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("solutionFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("firNoFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("secNoFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("thrNoFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("fourNoFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("fifNoFormulaEditor").innerHTML)
				+getByteLengthOfString(document.getElementById("answerFormulaEditor").innerHTML)
			if(totalFileSize/1000 > 5000){
				alert("등록하신 문제의 용량이 너무 큽니다.\n문제 및 해설, 객관식, 정답 입력란의 텍스트 및 이미지는 최대 5MB까지 등록가능합니다.\n고화질 이미지를 등록한 경우 문제 등록이 불가할 수 있습니다.");
				return false;
			}
		 }
		

		 if(customSubject.innerText=="과목" || subject.selectedIndex==0){
			 alert("과목을 선택해주세요.");
			 return false;
		 }
		 /*
		if(customFirUnit.innerText=="대단원" || firUnit.selectedIndex==0){
			 alert("대단원을 선택해주세요.");
			 return false;
		 }
		 */

		if(customSecUnit.innerText==="대단원" || secUnit.selectedIndex===0){
			alert("대단원을 선택해주세요.");
			return false;
		}
		if(customThrUnit.innerText==="중단원" || thrUnit.selectedIndex===0){
			alert("중단원을 선택해주세요.");
			return false;
		}
		if(customQuesType.innerText === "유형정보" || quesType.selectedIndex===0){
			alert("유형정보를 선택해주세요.");
			return false;
		}
		if(cusQuesLevel.innerText === "문제 난이도" || quesLevel.selectedIndex===0){
			alert("문제 난이도를 선택해주세요.");
			return false;
		}
		
		if(contentsClassify===0){	//N명의수학 제작만 아래 validation 체크
			if(cusOrgSrcRef.innerText == "유사 문제 교재" || orgSrcRef.selectedIndex==0){
				alert("유사 문제 교재를 선택해주세요.");
				return false;
			}
	
			if(orgSrcRef.value === "쎈수학" || orgSrcRef.value === "RPM" || orgSrcRef.value === "수학의 힘(베타)" || orgSrcRef.value === "해결의법칙" ){
				if(orgSrcNo.value.length===0){
					alert("유사 문제번호를 적어주세요.");
					return false;
				}else if(orgSrcNo.value.length>4){
					alert("유사 문제번호는 9999번 보다 작게 입력해주시기 바랍니다.");
					return false;
				}
	
				if(copyrightYear.value==="" || copyrightYear.value.length > 10){
					alert("발행일(출판연월)를 입력 해주세요.(10글자 미만)");
					return false;
				}
				orgSrcPage.value = 0;
			}else if(orgSrcRef.value === "교과서" ){
				if(orgSrcNo.value.length===0){
					alert("유사 문제 번호를 적어주세요.");
					return false;
				}else if(orgSrcNo.value.length>4){
					alert("유사 문제번호는 9999번 보다 작게 입력해주시기 바랍니다.");
					return false;
				}
	
				if(orgSrcPage.value.length===0 || orgSrcPage.value.length>3){
					alert("유사 문제 페이지를 적어주세요.(999 미만)");
					return false;
				}
	
				if(copyrightYear.value==="" || copyrightYear.value.length > 10){
					alert("발행일(출판연월)를 입력 해주세요.(10글자 미만)");
					return false;
				}
			}else if(orgSrcRef.value === "창작" ){
				orgSrcNo.value = 0;
				orgSrcPage.value = 0;
				copyrightYear.value = "";
			}
	
			if(cusMathClassifySelTitle.innerText === "문제 구분" || mathTypeClassify.selectedIndex === 0){
				alert("문제 구분탭에서 구분 유형을 선택 해주세요.");
				return false;
			}
		}
		
		if(!isOnlyImgReg){
			//이미지 사이즈 변경 틀 제거
			await reg_removeResizeFrame()

			// 문제 및 해설, 객관식, 주관식 정답 마지막 공백 제거(줄바꿈, 띄어쓰기)
			// style 속성 제거
			// span 태그 제거
			await trimRegisterContents();
		}
		


		let formData = new FormData(document.getElementById("contentsForm"));
		formData.append("unitUniqNo", thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
		formData.append("typeNo", quesType[quesType.selectedIndex].dataset.typeNo);
		let targetId = ["contentsFormulaEditor", "solutionFormulaEditor" ,"firNoFormulaEditor" , "secNoFormulaEditor", "thrNoFormulaEditor", "fourNoFormulaEditor", "fifNoFormulaEditor", "answerFormulaEditor"];
		for(let i=0; i<targetId.length; i++){
			let allImgDom = document.getElementById(targetId[i]).querySelectorAll("img");
			for(let j=0; j<allImgDom.length; j++){
				formData.append("imgTagSrc", allImgDom[j].src);
			}
		}
		//undo 초기화
		await reg_undoRedoInitialize();
		//수정모드로 들어온 경우
		if(updateModeUniqNo!==""){
			let contentsNo = updateModeUniqNo.split(",");
			formData.append("contentsNo", contentsNo[2]);
			if(contentsClassify === 0) formData.append("mathContentsCompSeqNo", contentsNo[3]);	
		}
		// FormData의 값 확인
		/*
		for (var pair of formData.entries()) {
			console.log(pair[0]+ ': ' + pair[1]);
		}
		*/
		let returnObj;
		if(contentsClassify === 0){
			returnObj = await nb_formDataFetch("/mathInfo/registerContents",formData, true);
		}else{
			if(urlPath === "/contentsList" || urlPath === "/myRepository"){		//변형으로 셋팅
				let contentsNo = updateModeUniqNo.split(",");
				formData.delete("contentsNo");
				formData.append("orgContentsNo", contentsNo[2]);
			}
			if(isOnlyImgReg){
				formData.append("contents", "");
				formData.append("firNo", "");
				formData.append("secNo", "");
				formData.append("thrNo", "");
				formData.append("fourNo", "");
				formData.append("fifNo", "");
			}
			formData.append("contentsClassify", contentsClassify);
			returnObj = await nb_formDataFetch("/mathInfo/makeContents",formData, true);
		}
		if(updateModeUniqNo!=="") window.mathContents = returnObj.mathContents;	//수정 모드일때만, 윈도우 전역변수로 객체 전달
		if(returnObj.error!=undefined){
			alert("["+returnObj.status+" "+returnObj.error+"]\n메시지 : "+returnObj.message);
		}
		if(returnObj["saveSuccess"]){
			//컨텐츠 문법 등록[strt]
			let contentGrammer = document.createElement("div")
			let contentsTitle = ["contents", "firNo", "secNo", "thrNo", "fourNo", "fifNo", "solution", "answer"]
			for(let i=0; i<contentsTitle.length; i++){
				let tmpData = formData.get(contentsTitle[i])
				let tmpDocument = document.createElement("div");
				tmpDocument.innerHTML = tmpData;
				contentGrammer.append(tmpDocument);
			}
			let innerTbTd = contentGrammer.querySelectorAll(".innerTbTd");
			for(let i=0;i<innerTbTd.length; i++){
				innerTbTd[i].append(document.createTextNode("\n"));
			}
			let contentsDiv = await cvt_convertHtmlToTex(contentGrammer);

			let breakPara = contentsDiv.querySelectorAll(".breakParaSpan");
			while(breakPara.length !== 0){
				breakPara[0].outerHTML = "\n"
				breakPara = contentsDiv.querySelectorAll(".breakParaSpan");
			}

			let imgDom = contentsDiv.querySelectorAll("img");
			while(imgDom.length !== 0){
				imgDom[0].remove();
				imgDom = contentsDiv.querySelectorAll("img");
			}

			let allDom = contentsDiv.querySelectorAll("*");
			while(allDom.length !== 0){
				allDom[0].outerHTML = allDom[0].innerText;
				allDom = contentsDiv.querySelectorAll("*");
			}
			let newFormData = new FormData();
			newFormData.append("contentsNo", returnObj["contentsNo"]);
			newFormData.append("contentsGram", contentsDiv.innerText);
			nb_formDataFetch("/mathInfo/registerContentsGrammer",newFormData, false);
			//컨텐츠 문법 등록[end]
			
			
			//유형, 난이도, 유사 문제, 유사 문제 페이지 초기화
			customQuesType.innerText="유형정보"
			quesType.selectedIndex=0;
			document.getElementById("cusSelQuesTypeDiv").classList.remove("nbCustomSelected");
	
			cusQuesLevel.innerText="문제 난이도"
			quesLevel.selectedIndex=0;
			document.getElementById("cusQuesSelDiv").classList.remove("nbCustomSelected");
	
			if(contentsClassify === 0){		// N명의수학 문제 유사문제 초기화
				orgSrcPage.value = null;
				orgSrcPage.classList.remove("customBlueBoxComplete");

				orgSrcNo.value="";
				orgSrcNo.classList.remove("customBlueBoxComplete");
			}
			

			
			await nb_closeBtn("contentsInfo")
			
			if(!isOnlyImgReg){
				//문제,해설, 이미지, 객관식 정보 초기화
				document.getElementById("contentsFormulaEditor").innerHTML = "";
				document.getElementById("solutionFormulaEditor").innerHTML = "";
				document.getElementById("firNoFormulaEditor").innerHTML = "";
				document.getElementById("secNoFormulaEditor").innerHTML = "";
				document.getElementById("thrNoFormulaEditor").innerHTML = "";
				document.getElementById("fourNoFormulaEditor").innerHTML = "";
				document.getElementById("fifNoFormulaEditor").innerHTML = "";
			}
			document.getElementById("answerFormulaEditor").innerHTML = "";
			
			//textarea,input 초기화
			await parentMethod();
			
			//객관식정답 초기화
			let choiceAnswerChkBox = document.getElementsByName("choiceAnswer")
			for(let i=0; i< choiceAnswerChkBox.length; i++){
				choiceAnswerChkBox[i].checked = false;
			}
			if(isOnlyImgReg) return;

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
			document.getElementById("firDiv").classList.add('hide');
			document.getElementById("secDiv").classList.add('hide');
			document.getElementById("thrDiv").classList.add('hide');
			document.getElementById("fourDiv").classList.add('hide');
			document.getElementById("fifDiv").classList.add('hide');

			//문제입력 탭 클릭상태
			let trigEv = new Object();
			let sub    = new Object();
			trigEv.target= sub;
			trigEv.target.id= "quesTab";
			await reg_quesAnsTabClkEv(trigEv);

			// 수정모드인 경우 자동종료
			if(updateModeUniqNo!=="") {
				if(urlPath ===  "/contentsList" || urlPath === "/myRepository"){
					await nb_fadeInOut("정상적으로 등록되었습니다.\n나의 제작문제 페이지에서 확인할 수 있습니다.", 2500);
				}else if(urlPath ===  "/myContentsList"){
					await nb_fadeInOut("컨텐츠가 정상적으로 수정되었습니다.", 2000);
				}else {
					await nb_fadeInOut("컨텐츠가 정상적으로 등록되었습니다.", 2000);
				}
				document.getElementById("modalFormulCloseBtn").click();
			}
			else{
				if(urlPath === "/makeContents"){
					await nb_fadeInOut("정상적으로 등록되었습니다.\n나의 제작문제 페이지에서 확인할 수 있습니다.", 2500);
				}else{
					await nb_fadeInOut("컨텐츠가 정상적으로 등록되었습니다.", 2000);
				}
				document.getElementById("contentsFormulaEditor").focus()
				await reg_undoRedoSetting();
			} 
		}else{
			//문제입력 탭 클릭상태
			let trigEv = new Object();
			let sub    = new Object();
			trigEv.target= sub;
			trigEv.target.id= "quesTab";
			await reg_quesAnsTabClkEv(trigEv);
		}
	  }
  return (
    <>
		<div id="formulaEditBlindBox" className="blindBox hide"></div>
		<div id="contentsInfo" className="contentsInfo hide">
				<div className="closeBtn" onClick={ () => nb_closeBtn("contentsInfo")}>&#88;</div>
				<div className="mini-title3">문제 단원 및 유형 정보를 입력해 주세요.</div>
				
				<UnitTypeCombo updateModeUniqNo={updateModeUniqNo} />
				
				<div>
					<CustomSelBoxDown value={[{"value":"하", "originVal":"1"},{"value":"중하", "originVal":"2"},{"value":"중", "originVal":"3"},{"value":"중상", "originVal":"4"},{"value":"상", "originVal":"5"}]} cusSelId="cusQuesSel" originSel="quesLevel" title="문제 난이도"></CustomSelBoxDown>
					<select id="quesLevel" name="quesLevel" className="hide">
						<option value="0">문제 난이도</option>
						<option value="1">하</option>
						<option value="2">중하</option>
						<option value="3">중</option>
						<option value="4">중상</option>
						<option value="5">상</option>
					</select>
					
					{contentsClassify === 0 &&
					<>
						<CustomSelBoxDown value={[{"value":"쎈수학", "originVal":"쎈수학"}, {"value":"RPM", "originVal":"RPM"},{"value":"수학의 힘(베타)", "originVal":"수학의 힘(베타)"},{"value":"해결의법칙", "originVal":"해결의법칙"},{"value":"교과서", "originVal":"교과서"},{"value":"창작", "originVal":"창작"}]} cusSelId="cusOrgRefSel" originSel="orgSrcRef" title="유사 문제 교재"></CustomSelBoxDown>
						<select id="orgSrcRef" name="orgSrcRef" className="hide" >
							<option value="0">유사 문제 교재</option>
							<option value="쎈수학">쎈수학</option>
							<option value="RPM">RPM</option>
							<option value="수학의 힘(베타)">수학의 힘(베타)</option>
							<option value="해결의법칙">해결의법칙</option>
							<option value="교과서">교과서</option>
							<option value="창작">창작</option>
						</select>

						<input id="orgSrcNo" name ="orgSrcNo" type="number" className="customBlueBox" placeholder="유사 문제 번호" onBlur={event => nb_completeBlueBox(event, 1)} />
						<input id="orgSrcPage" name ="orgSrcPage" type="number" className="customBlueBox" placeholder="유사 문제 페이지" onBlur={event => nb_completeBlueBox(event, 1)} />
						<input id="copyrightYear" name ="copyrightYear" type="text" className="customBlueBox" placeholder="발행일(출판연월)" onBlur={event => nb_completeBlueBox(event, 1)} />

						<CustomSelBoxDown value={[{"value":"단순계산", "originVal":"단순계산"}, {"value":"응용", "originVal":"응용"}]} cusSelId="cusMathClassifySel" originSel="mathTypeClassify" title="문제 구분"></CustomSelBoxDown>

						<select id="mathTypeClassify" name="mathTypeClassify" className="hide">
							<option value="0">문제 구분</option>
							<option value="단순계산">단순계산</option>
							<option value="응용">응용</option>
						</select>
					</>
					}
				</div>
				{contentsClassify ===1 &&
				<div id="licenseRootDiv">
					<div className="mini-title7">라이선스 범위를 설정해 주세요.</div>
					<div className='licenseWrapDiv'>
						<table className="licTable">
							<tbody>
								<tr>
									<td><label><input id='shareSttsPublic' type="radio" value="1" name="shareStts" className='licensePublicBtn' onChange={()=>{shareSttsChange(true)}} defaultChecked/><img src={licensePublic} className="licensePublicImg" alt="license-public"/><span className='licPublicTitle'>공개</span></label></td>
									<td><span className='licDesc'>플랫폼 내 모든 사용자에게 공개<br/> 
									<span id="transLicenseDesc">플랫폼 내 '변형문제 만들기' 서비스를 통한 2차 저작물 제작 허용<br/></span>
									공교육 및 사교육 기관에서 상업용 판매 목적 없는 학습 자료로서 사용 허용</span></td>
								</tr>
								<tr>
									<td><label><input id='shareSttsPrivate' type="radio" value="0" name="shareStts" className='licensePrivateBtn' onChange={()=>{shareSttsChange(false)}}/><img src={licensePrivate} className="licensePrivateImg" alt="license-public"/><span className='licPrivateTitle'>비공개</span></label></td>
									<td><span className='licDesc'>사용자 공유 X</span></td>
								</tr>
							</tbody>
						</table>
						<div id="licOptDiv">
						<div className='licDivFir'><label><input id="onlineLicStts" type="checkbox" name="onlineLicStts" value="1"/> 인터넷 강의 허용</label><span className='licDesc'>&nbsp;(외부 동영상 플랫폼에서 출처 표시 하에 문제 사용 및 노출 허용)</span></div> 
							<div className='licDiv'><label><input id="perLicStts" type="checkbox" name="perLicStts" value="1" /> 개인 강사 교재 허용</label><span className='licDesc'>&nbsp;(기업용 출판이 아닌 개인 강사 교재에 문제 수록 허용)</span></div> 
							<div className='licDiv'><label><input id="entLicStts" type="checkbox" name="entLicStts" value="1"/> 출판사 교재 허용</label><span className='licDesc'>&nbsp;(기업용 출판 교재에 문제 수록 허용)</span></div>
						</div>
					</div>
				</div>
				}
				{contentsClassify === 2 &&
				<>
					<LicenseUi />
					<div className='transConDesc'>
						변형문제의 저작권은 원작자에게 있으며<br/>
						비영리적 라이선스는 원작자의 라이선스 범위와 동일하게 적용됩니다.<br/>
						(영리 목적 사용 제한)
					</div>
				</>
				}
				<div className='saveContentsDiv'>
					<span id="saveContents" className='saveContents' onClick={()=>{contentsFinalValidation()}}>문제 등록</span>
				</div>
			</div>
    </>
  );
}

export default RegisterContentsInfo;