import React, { useState, useEffect} from "react";
import licensePublic from 'img/license-public.png'
import licensePrivate from 'img/license-private.png'
import NbWebEditor from 'web/contents/register/NbWebEditor'
import {nb_isLogin, nb_topMenuFixed, nb_dataFetch, nb_formDataFetch, nb_extensionCheck2, nb_base64ImgRegisterToS3,nb_completeBlueBoxMulti,
	    nb_multiChoiceGridSet, nb_module_handleImageUpload, nb_fadeInOutA} from 'js/common/common_nb.js';
import {reg_preventKeyEvent, reg_dressYellowBox, reg_selectCheck, reg_convertFigureTagRemove,
		reg_dressSelectionBackColor,  reg_tbPasteInPastePrevent, reg_tbCellKeyUp, reg_oneLineOneDiv,
		reg_tbPastePrevent, reg_nbComplie, reg_undoRedoInitialize, reg_undoRedoSetting, reg_imageCopy} from 'js/contents/register/contents_reg';
import { event } from "jquery";

let shortCutKeyList;
let multiImgTargetId;
const FormulaEditorUnitForMulti = ({contentsClassify, customId, ordinalNum, classNames, idx, mathUnitInfo}) => {
	const [isMyContents, setIsMyContents] = useState(true);
	const [contentsText, setContentsText] = useState("");	// 사용자 입력 문제
	const [solutionText, setSolutionText] = useState("");	// 사용자 입력 해설
	const [answerText, setAnswerText] = useState("");		// 사용자 입력 정답
	const [multiAnswerText, setMultiAnswerText] = useState("");		// 사용자 입력 객관식 정답
	const [firNo, setFirNo] = useState("");
	const [secNo, setSecNo] = useState("");
	const [thrNo, setThrNo] = useState("");
	const [fourNo, setFourNo] = useState("");
	const [fifNo, setFifNo] = useState("");
	const [editorIdx, setEditorIdx] = useState(idx);

	const[updateModeUniqNo, setUpdateModeUniqNo] = useState("");
	const [subjectBox, setSubjectBox] = useState(new Array());
	//const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
	const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
	const [secUnitSelOptBox, setSecUnitSelOptBox] = useState(new Array());
	const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
	const [thrUnitSelOptBox, setThrUnitSelOptBox] = useState(new Array());

	const [quesTypeBox, setQuesTypeBox] = useState(new Array());

	useEffect(() => {
		const asyncUseEffect = async function(){
			setSubjectBox(mathUnitInfo["mathSubjectInfo"]);
			setSecUnitSelBox(mathUnitInfo["mathSecUnitInfo"]);
			setThrUnitSelBox(mathUnitInfo["mathThrUnitInfo"]);
		}
		asyncUseEffect();
	}, []);

	const getCheckedVal = async function(event){
	}

	const multiChoiceImageFile = async (event) =>{
		if(event.target.files[0] !== undefined){
			//이미지 업로드
			let formData = new FormData();
			formData.append("actionId", 10);
      		formData.append("imgPath", "editorImgUpld");
			formData.append("multipartFile", event.target.files[0]);
			let returnObj = await nb_formDataFetch("/common/imgUpload", formData, true);

			let img=document.createElement("img");
			img.src=returnObj.s3ImgUrl;
			img.style.width=100+"px";
			event.target.closest(".multiChoiceBox").querySelector("#"+multiImgTargetId).append(img);

			/*
			reader.onload = async () => {
			   img.src=reader.result;
			   if(multiImgTargetId.indexOf("firNoFormulaEditor") > -1){
					contentEditClass = event.target.closest(".multiChoiceBox").querySelector("#"+multiImgTargetId);
					event.target.closest(".multiChoiceBox").querySelector("#firNo").value = contentEditClass.innerHTML;

				}else if(multiImgTargetId.indexOf("secNoFormulaEditor")){
					contentEditClass = event.target.closest(".multiChoiceBox").querySelector("#"+multiImgTargetId);
					event.target.closest(".multiChoiceBox").querySelector("#secNo").value = contentEditClass.innerHTML;

				}else if(multiImgTargetId.indexOf("thrNoFormulaEditor")){
					contentEditClass = event.target.closest(".multiChoiceBox").querySelector("#"+multiImgTargetId);
					event.target.closest(".multiChoiceBox").querySelector("#thrNo").value = contentEditClass.innerHTML;

				}else if(multiImgTargetId.indexOf("fourNoFormulaEditor")){
					contentEditClass = event.target.closest(".multiChoiceBox").querySelector("#"+multiImgTargetId);
					event.target.closest(".multiChoiceBox").querySelector("#fourNo").value = contentEditClass.innerHTML;

				}else if(multiImgTargetId.indexOf("fifNoFormulaEditor")){
					contentEditClass = event.target.closest(".multiChoiceBox").querySelector("#"+multiImgTargetId);
					event.target.closest(".multiChoiceBox").querySelector("#fifNo").value = contentEditClass.innerHTML;
				}
			}; 
			*/

			event.target.value= "";
			return;
		}
	  }

	  const copyPreventEv = async (event) =>{
		if(!isMyContents){
			if(!window.getSelection().isCollapsed){
				if(!document.getSelection().isCollapsed && event.ctrlKey && (event.keyCode === 67 || event.keyCode === 88) && !event.altKey) {
					await nb_fadeInOutA("다른 사용자의 문제(변형문제 포함)는 복사가 불가합니다.", 2000);
					return;
				}
			}
		}
	  }
	  
	const removeRedBoxValid = async (event) =>{
		event.target.classList.remove("redBoxValid2");
	}
	const removeRedBoxValidAll = async (event) =>{
		let redBoxValid2 = event.target.closest(".contentsOptBox").querySelectorAll(".redBoxValid2");
		for(let i=0; i<redBoxValid2.length; i++){
			redBoxValid2[i].classList.remove("redBoxValid2")
		}
	}


	const multiChoiceImgAdd = (targetId, event) =>{
		multiImgTargetId = targetId;
		event.target.closest(".multiChoiceBox").querySelector("#multiChoiceImageFile").click();
		//document.getElementById("multiChoiceImageFile").click();
	}

	const subjectOptionBox = subjectBox.map((contentsMap, idx) => {
		return <option key={idx} value={contentsMap.unitUniqNo} data-main-val={contentsMap.mainVal} dangerouslySetInnerHTML={{__html:contentsMap.mainVal}}></option>
	});

	const secUnitSelShowBox = secUnitSelOptBox.map((contentsMap, idx) => {
		return <option key={idx}  value={contentsMap.unitUniqNo} data-main-val={contentsMap.mainVal} dangerouslySetInnerHTML={{__html:contentsMap.mainVal}}></option>
	});

	const initSecUnitOptBox = async (event) => {
		event.target.closest(".contentsInfo-multi").querySelector("#secUnit").value="0";
		event.target.closest(".contentsInfo-multi").querySelector("#secUnit").classList.remove("nbCustomSelected2");

		event.target.closest(".contentsInfo-multi").querySelector("#thrUnit").value="0";
		event.target.closest(".contentsInfo-multi").querySelector("#thrUnit").classList.remove("nbCustomSelected2");

		event.target.closest(".contentsInfo-multi").querySelector("#quesType").value="0";
		event.target.closest(".contentsInfo-multi").querySelector("#quesType").classList.remove("nbCustomSelected2");

		let secOptBox = secUnitSelBox.filter((contentsMap, idx) => {
			return contentsMap.parentVal === event.target.options[event.target.selectedIndex].dataset.mainVal;
		});
		setSecUnitSelOptBox(secOptBox);
	}

	const thrUnitOptionBox = thrUnitSelOptBox.map((contentsMap, idx) => {
		return <option key={idx}  value={contentsMap.unitUniqNo} data-main-val={contentsMap.mainVal} dangerouslySetInnerHTML={{__html:contentsMap.mainVal}}></option>
	});

	const initThrUnitOptBox = async (event) => {
		event.target.closest(".contentsInfo-multi").querySelector("#thrUnit").value="0";
		event.target.closest(".contentsInfo-multi").querySelector("#thrUnit").classList.remove("nbCustomSelected2");

		event.target.closest(".contentsInfo-multi").querySelector("#quesType").value="0";
		event.target.closest(".contentsInfo-multi").querySelector("#quesType").classList.remove("nbCustomSelected2");

		let thrOptBox = thrUnitSelBox.filter((contentsMap, idx) => {
			return contentsMap.parentVal === event.target.options[event.target.selectedIndex].dataset.mainVal;
		});
		setThrUnitSelOptBox(thrOptBox);
	}

	const fetchTypeInfo = async (event) => {
		event.target.closest(".contentsInfo-multi").querySelector("#quesType").value="0";
		event.target.closest(".contentsInfo-multi").querySelector("#quesType").classList.remove("nbCustomSelected2");

		let unitUniqNo = event.target.options[event.target.selectedIndex].value;
		const jsonObj = await nb_dataFetch('/mathInfo/typeInfo?unitUniqNo='+unitUniqNo, true);
		setQuesTypeBox(jsonObj["mathTypeInfo"]);
	  }

	
	const quesTypeOptBox = quesTypeBox.map((contentsMap, idx) => {
		return <option key={idx} data-type-no={contentsMap.mathTypeDomain.typeNo} value={contentsMap.mathTypeDomain.typeNo} dangerouslySetInnerHTML={{__html:contentsMap.quesType}}></option>
	});
	let a_array = new Array();
	const GetText = async (tag) =>{
		if(tag.hasChildNodes()) {
			var i;
			for(i = 0; i < tag.childNodes.length; i ++) {
				if(tag.childNodes[i].nodeType == 3) {
					a_array.push(tag.childNodes[i]);
				} else {
					await GetText(tag.childNodes[i]);
				}
			}
		}
		if(tag.nodeType == 3) {
			a_array.push(tag);
		}
	}

	let isPressedCtrlV = false
	const multiChoicDefaultSetFunc = async (event) => {
		if(event.type === "keydown"){
			if(event.ctrlKey && event.keyCode === 86){
				isPressedCtrlV=true;
			}else{
				isPressedCtrlV=false;
			}
			return;
		}
		if(isPressedCtrlV){
			if(event.target.innerHTML.indexOf("①") > -1 && event.target.innerHTML.indexOf("②") > -1 
			&& event.target.innerHTML.indexOf("③") > -1 && event.target.innerHTML.indexOf("④") > -1 
			&& event.target.innerHTML.indexOf("⑤") > -1){
				let lastEndIdx = -1;
				let multiChoiceView = event.target.closest(".contentsRootDiv").querySelectorAll(".multiChoiceView");
				for(let i=0; i<multiChoiceView.length; i++){
					if(multiChoiceView[i].id.indexOf("firNoFormulaEditor")>-1){
						multiChoiceView[i].innerHTML = event.target.innerHTML.substring(event.target.innerHTML.lastIndexOf("①")+1, event.target.innerHTML.lastIndexOf("②"));
						multiChoiceView[i].focus();
						await reg_oneLineOneDiv();
						a_array = new Array();
						await GetText(document.getElementById(document.activeElement.id));
						//마지막 노드 &nbsp인 경우 제거
						if(a_array[a_array.length-1].nodeValue === " "){
							a_array[a_array.length-1].remove();
						}
						//첫번째 노드 &nbsp인 경우 제거
						if(a_array[0].nodeValue === " "){
							a_array[0].remove();
						}
					}else if(multiChoiceView[i].id.indexOf("secNoFormulaEditor")>-1){
						multiChoiceView[i].innerHTML = event.target.innerHTML.substring(event.target.innerHTML.lastIndexOf("②")+1, event.target.innerHTML.lastIndexOf("③"));
						multiChoiceView[i].focus();
						await reg_oneLineOneDiv();
						a_array = new Array();
						await GetText(document.getElementById(document.activeElement.id));
						//마지막 노드 &nbsp인 경우 제거
						if(a_array[a_array.length-1].nodeValue === " "){
							a_array[a_array.length-1].remove();
						}
						//첫번째 노드 &nbsp인 경우 제거
						if(a_array[0].nodeValue === " "){
							a_array[0].remove();
						}
					}else if(multiChoiceView[i].id.indexOf("thrNoFormulaEditor")>-1){
						multiChoiceView[i].innerHTML = event.target.innerHTML.substring(event.target.innerHTML.lastIndexOf("③")+1, event.target.innerHTML.lastIndexOf("④"));
						multiChoiceView[i].focus();
						await reg_oneLineOneDiv();
						a_array = new Array();
						await GetText(document.getElementById(document.activeElement.id));
						//마지막 노드 &nbsp인 경우 제거
						if(a_array[a_array.length-1].nodeValue === " "){
							a_array[a_array.length-1].remove();
						}
						//첫번째 노드 &nbsp인 경우 제거
						if(a_array[0].nodeValue === " "){
							a_array[0].remove();
						}
					}else if(multiChoiceView[i].id.indexOf("fourNoFormulaEditor")>-1){
						multiChoiceView[i].innerHTML = event.target.innerHTML.substring(event.target.innerHTML.lastIndexOf("④")+1, event.target.innerHTML.lastIndexOf("⑤"));
						multiChoiceView[i].focus();
						await reg_oneLineOneDiv();
						a_array = new Array();
						await GetText(document.getElementById(document.activeElement.id));
						//마지막 노드 &nbsp인 경우 제거
						if(a_array[a_array.length-1].nodeValue === " "){
							a_array[a_array.length-1].remove();
						}
						//첫번째 노드 &nbsp인 경우 제거
						if(a_array[0].nodeValue === " "){
							a_array[0].remove();
						}
					}else if(multiChoiceView[i].id.indexOf("fifNoFormulaEditor")>-1){
						let fifthIdx = event.target.innerHTML.lastIndexOf("⑤");
						if(event.target.innerHTML.substr(fifthIdx).indexOf("</div>")>-1){
							lastEndIdx = fifthIdx+event.target.innerHTML.substr(fifthIdx).indexOf("</div>");
							multiChoiceView[i].innerHTML = event.target.innerHTML.substring(event.target.innerHTML.lastIndexOf("⑤")+1, lastEndIdx);
							multiChoiceView[i].focus();
							await reg_oneLineOneDiv();
							a_array = new Array();
							await GetText(document.getElementById(document.activeElement.id));
							//마지막 노드 &nbsp인 경우 제거
							if(a_array[a_array.length-1].nodeValue === " "){
								a_array[a_array.length-1].remove();
							}
							//첫번째 노드 &nbsp인 경우 제거
							if(a_array[0].nodeValue === " "){
								a_array[0].remove();
							}
						}
					}
				}

				event.target.innerHTML = event.target.innerHTML.substring(0, event.target.innerHTML.lastIndexOf("①"))+event.target.innerHTML.substring(lastEndIdx+6)
				event.target.focus();
				await reg_oneLineOneDiv();
				window.getSelection().selectAllChildren(document.activeElement);
				window.getSelection().collapseToEnd()
			}
		}
	}

	const shareSttsChange = async function(event, shareStts){
		if(shareStts){
			event.target.closest(".licenseWrapDiv").querySelector("#licOptDiv").classList.remove("lowerOpacity");
			event.target.closest(".licenseWrapDiv").querySelector("#onlineLicStts").checked = false;
			event.target.closest(".licenseWrapDiv").querySelector("#onlineLicStts").disabled = false;

			event.target.closest(".licenseWrapDiv").querySelector("#perLicStts").checked = false;
			event.target.closest(".licenseWrapDiv").querySelector("#perLicStts").disabled = false;

			event.target.closest(".licenseWrapDiv").querySelector("#entLicStts").checked = false;
			event.target.closest(".licenseWrapDiv").querySelector("#entLicStts").disabled = false;
		}else{
			event.target.closest(".licenseWrapDiv").querySelector("#licOptDiv").classList.add("lowerOpacity");
			event.target.closest(".licenseWrapDiv").querySelector("#onlineLicStts").disabled = true;
			event.target.closest(".licenseWrapDiv").querySelector("#perLicStts").disabled = true;
			event.target.closest(".licenseWrapDiv").querySelector("#entLicStts").disabled = true;
		}
	  }

	const formulaConvert = async (event) => {
		let evIdName = event.target.id
		event.stopPropagation();
		await reg_dressYellowBox();
		if(evIdName == "multi-answer"){		//객관식 정답 선택 이벤트의 경우 단축키 이벤트 없이 진행
			let selBox = document.getElementById(evIdName);
			let selIdx = selBox.selectedIndex;
			let selectValue = selBox.options[selBox.selectedIndex].value;
			if(selIdx == 0){
				selectValue = "";
			}
			setAnswerText(selectValue);
			return;
		}

	}

	const selChanged = async (event, evType) => {
		if(Number(event.target.value) !== 0){
			event.target.classList.add("nbCustomSelected2");
			if(evType === "thrUnit"){
				event.target.closest("div").querySelector("#unitUniqNo").value = event.target.value;
			}else if(evType === "quesType"){
				event.target.closest("div").querySelector("#typeNo").value = event.target.value;
			}
		}else{
			event.target.classList.remove("nbCustomSelected2");
		}
	}

	const allCheckFunction = async (event, successDescId, targetId, targetId2, addClassName) => {
		let contentsRootDiv = document.querySelectorAll(".contentsRootDiv");
		
		if(targetId === "shareSttsPublic"){
			for(let i=0; i<contentsRootDiv.length; i++){
				if(contentsRootDiv[0].querySelector("#shareSttsPublic").checked){
					contentsRootDiv[i].querySelector("#shareSttsPublic").checked=contentsRootDiv[0].querySelector("#shareSttsPublic").checked;
					contentsRootDiv[i].querySelector("#shareSttsPrivate").checked= !contentsRootDiv[0].querySelector("#shareSttsPublic").checked;
					contentsRootDiv[i].querySelector("#licOptDiv").classList.remove("lowerOpacity");
					contentsRootDiv[i].querySelector("#onlineLicStts").disabled = false;
					contentsRootDiv[i].querySelector("#perLicStts").disabled = false;
					contentsRootDiv[i].querySelector("#entLicStts").disabled = false;

					contentsRootDiv[i].querySelector("#onlineLicStts").checked = contentsRootDiv[0].querySelector("#onlineLicStts").checked
					contentsRootDiv[i].querySelector("#perLicStts").checked = contentsRootDiv[0].querySelector("#perLicStts").checked
					contentsRootDiv[i].querySelector("#entLicStts").checked = contentsRootDiv[0].querySelector("#entLicStts").checked
				}
				if(contentsRootDiv[0].querySelector("#shareSttsPrivate").checked){
					contentsRootDiv[i].querySelector("#licOptDiv").classList.add("lowerOpacity");
					contentsRootDiv[i].querySelector("#shareSttsPrivate").checked=contentsRootDiv[0].querySelector("#shareSttsPrivate").checked;
					contentsRootDiv[i].querySelector("#shareSttsPublic").checked= !contentsRootDiv[0].querySelector("#shareSttsPrivate").checked;
					
					contentsRootDiv[i].querySelector("#onlineLicStts").checked = false;
					contentsRootDiv[i].querySelector("#perLicStts").checked = false;
					contentsRootDiv[i].querySelector("#entLicStts").checked = false;
					
					contentsRootDiv[i].querySelector("#onlineLicStts").disabled = true;
					contentsRootDiv[i].querySelector("#perLicStts").disabled = true;
					contentsRootDiv[i].querySelector("#entLicStts").disabled = true;
				}
			}
		}else{
			if(Number(contentsRootDiv[0].querySelector("#"+targetId).value) === 0) return;
			for(let i=0; i<contentsRootDiv.length; i++){
				if(!contentsRootDiv[0].querySelector("#"+targetId).classList.contains("active")){
					contentsRootDiv[i].querySelector("#"+targetId).value = contentsRootDiv[0].querySelector("#"+targetId).value;
					contentsRootDiv[i].querySelector("#"+targetId).classList.add(addClassName)
				}
			}
		}
		
		if(targetId2 !== undefined){
			if(contentsRootDiv[0].querySelector("#"+targetId2).value === 0 || contentsRootDiv[0].querySelector("#"+targetId2).value === "") return;
			for(let i=0; i<contentsRootDiv.length; i++){
				if(!contentsRootDiv[0].querySelector("#"+targetId2).classList.contains("active")){
					contentsRootDiv[i].querySelector("#"+targetId2).value = contentsRootDiv[0].querySelector("#"+targetId2).value;
					contentsRootDiv[i].querySelector("#"+targetId2).classList.add(addClassName)
				}
			}
		}

		document.getElementById(successDescId).classList.add("active")
		event.target.querySelector(".allCheckBtnDesc").classList.add("allCheckBtnTmp");
		event.target.querySelector(".allCheckBtnTmp").classList.remove("allCheckBtnDesc");
		setTimeout(function(){
			document.getElementById(successDescId).classList.remove("active")
			event.target.querySelector(".allCheckBtnTmp").classList.add("allCheckBtnDesc");
			event.target.querySelector(".allCheckBtnDesc").classList.remove("allCheckBtnTmp");
		}, 1000)

	}
  return (
	<>
		{ordinalNum !=="1st" &&
			<div className={"contentsRootPaddingDiv "+classNames} ></div>
		}
		<div id={customId} className={"contentsRootDiv multiContents "+classNames}>
			<div className="contentsInfo-multi">
				<div className="contentsInfo-idx">
					{ordinalNum} 
				</div>
				<div className="mini-title10">단원/유형 정보</div>
				<select id="subject" name={"mathContents["+idx+"].subject"} className="customBlueBox marginFive" onChange={(event)=>{selChanged(event);initSecUnitOptBox(event);removeRedBoxValid(event)}} >
					<option value="0">과목</option>
					{subjectOptionBox}
				</select>
				<br/>
				<select id="secUnit" name={"mathContents["+idx+"].secUnit"} className="customBlueBox marginFive" onChange={(event)=>{selChanged(event);initThrUnitOptBox(event);removeRedBoxValid(event)}}>
					<option value="0">대단원</option>
					{secUnitSelShowBox}
				</select>
				<br/>
				<select id="thrUnit" name={"mathContents["+idx+"].thrUnit"} className="customBlueBox marginFive" onChange={(event)=>{selChanged(event, "thrUnit");fetchTypeInfo(event);removeRedBoxValid(event)}}>
					<option value="0">중단원</option>
					{thrUnitOptionBox}
				</select>
				<input id="unitUniqNo" type="number" name={"mathContents["+idx+"].unitUniqNo"} className="hide" />
				<br/>
				<select id="quesType" name={"mathContents["+idx+"].quesType"} className="customBlueBox marginFive" onChange={(event)=>{selChanged(event, "quesType");removeRedBoxValid(event)}}>
					<option value="0">유형정보</option>
					{quesTypeOptBox}
				</select>
				<input id="typeNo" type="number" name={"mathContents["+idx+"].typeNo"} className="hide" />
				
				{contentsClassify === 1 && 
					<>
						<select id="quesLevel" name={"mathContents["+idx+"].quesLevel"} className="customBlueBox marginFive" onChange={(event)=>{selChanged(event);removeRedBoxValid(event)}}>
							<option value="0">문제 난이도</option>
							<option value="1">하</option>
							<option value="2">중하</option>
							<option value="3">중</option>
							<option value="4">중상</option>
							<option value="5">상</option>
						</select>
						<br/>
						<br/>
						<div id="licenseRootDiv">
							<div className="mini-title10">
								라이선스
								{ordinalNum ==="1st" && 
								<span id="shareSttsAllCheck" className="allCheckBtn" onClick={(event)=>{allCheckFunction(event, "shareSttsSuccess", "shareSttsPublic", undefined, "nbCustomSelected2")}}>
									일괄적용
									<div id="shareSttsSuccess" className="allCheckBtnSuccess">일괄적용 완료</div>
									<div className="allCheckBtnDesc">모든 문항에 라이선스 범위 일괄적용</div>
								</span>
								}
							</div>
							<div className='licenseWrapDiv'>
								<table className="licTable">
									<tbody>
										<tr>
											<td>
												<label className="licChkBtn">
													<input id='shareSttsPublic' type="radio" value="1" name={"mathContents["+idx+"].shareStts"} className='licensePublicBtn' onChange={(event)=>{shareSttsChange(event, true)}}/><img src={licensePublic} className="licensePublicImg" alt="license-public"/>
													<span className='licPublicTitle'>공개</span>
													<div className="licChkBtnDesc multi">
														<div>플랫폼 내 모든 사용자에게 공개</div>
														<div>'변형문제 만들기' 서비스를 통한 2차 저작물 제작 허용</div>
														<div>교육 기관에서 비영리목적의 학습 자료로서 사용 허용</div>
													</div>
												</label>
											</td>
											
										</tr>
										<tr>
											<td>
												<label>
													<input id='shareSttsPrivate' type="radio" value="0" name={"mathContents["+idx+"].shareStts"} className='licensePrivateBtn' onChange={(event)=>{shareSttsChange(event, false)}} defaultChecked/><img src={licensePrivate} className="licensePrivateImg" alt="license-public"/><span className='licPrivateTitle'>비공개</span>
												</label>
											</td>
										</tr>
									</tbody>
								</table>
								<div id="licOptDiv" className="lowerOpacity">
									<div className='licDivFir'>
										<label className="licChkBtn">
											<input id="onlineLicStts" type="checkbox" name={"mathContents["+idx+"].onlineLicStts"} value="1" disabled/> 인터넷 강의 허용
											<span className='licChkBtnDesc'>외부 동영상 플랫폼에서 출처 표시 하에 문제 사용 및 노출 허용</span>
										</label>
									</div> 
									<div className='licDiv'>
										<label className="licChkBtn">
											<input id="perLicStts" type="checkbox" name={"mathContents["+idx+"].perLicStts"} value="1" disabled/> 개인 강사 교재 허용
											<span className='licChkBtnDesc'>기업용 출판이 아닌 개인 강사 교재에 문제 수록 허용</span>
										</label>
									</div> 
									<div className='licDiv'>
										<label className="licChkBtn">
											<input id="entLicStts" type="checkbox" name={"mathContents["+idx+"].entLicStts"} value="1" disabled/> 출판사 교재 허용
											<span className='licChkBtnDesc'>기업용 출판 교재에 문제 수록 허용</span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</>
				}
				{contentsClassify === 4 && 
					<>
						<div className="mini-title10">출제기관
							{ordinalNum ==="1st" && 
							<span id="manageInsAllCheck" className="allCheckBtn" onClick={(event)=>{removeRedBoxValid(event);allCheckFunction(event, "manageInsSuccess", "manageIns", undefined, "nbCustomSelected2")}}>
								일괄적용
								<div id="manageInsSuccess" className="allCheckBtnSuccess">일괄적용 완료</div>
								<div className="allCheckBtnDesc">모든 문항에 출제기관 일괄적용</div>
							</span>}
						</div>
						<select id="manageIns" name={"mathContents["+idx+"].manageIns"} className="customBlueBox marginFive"onChange={(event)=>{selChanged(event);removeRedBoxValid(event)}}>
							<option value="0">선택</option>
							<option value="1">평가원</option>
							<option value="2">교육청</option>
						</select>
						<div className="mini-title10">가/나형 구분
							{ordinalNum ==="1st" && 
							<span id="paperTypeAllCheck" className="allCheckBtn" onClick={(event)=>{removeRedBoxValid(event);allCheckFunction(event, "paperTypeSuccess", "paperType", undefined, "nbCustomSelected2")}}>
								일괄적용
								<div className="allCheckBtnDesc long">모든 문항에 가/나형 구분 일괄적용</div>
								<div id="paperTypeSuccess" className="allCheckBtnSuccess">일괄적용 완료</div>
							</span>}
						</div>
						<select id="paperType" name={"mathContents["+idx+"].paperType"} className="customBlueBox marginFive" onChange={(event)=>{selChanged(event);removeRedBoxValid(event)}}>
							<option value="0">선택</option>
							<option value="1">통합</option>
							<option value="2">가형</option>
							<option value="3">나형</option>
						</select>

						<div className="mini-title10">시행연월
							{ordinalNum ==="1st" &&
							<span id="impYearMonthAllCheck" className="allCheckBtn" onClick={(event)=>{allCheckFunction(event, "impSuccess" , "impYear", "impMonth", "customBlueBoxComplete")}}>
								일괄적용
								<div className="allCheckBtnDesc">모든 문항에 시행연월 일괄적용</div>
								<div id="impSuccess" className="allCheckBtnSuccess">일괄적용 완료</div>
							</span>}
						</div>
						<input id="impYear" name ={"mathContents["+idx+"].impYear"} type="number" className="alignCenter impYear customBlueBox marginFive" onBlur={event => nb_completeBlueBoxMulti(event, 1)} onKeyUp={(event)=>removeRedBoxValid(event)} placeholder="연도"/>년
						<input id="impMonth" name ={"mathContents["+idx+"].impMonth"} type="number" className="alignCenter impMonth customBlueBox marginFive" onBlur={event => nb_completeBlueBoxMulti(event, 1)} onKeyUp={(event)=>removeRedBoxValid(event)} placeholder="월"/>월<br/>
						
						<div className="mini-title10">문항번호</div>
						<span className="mini-title11 paddingLTen">홀</span> <input id="oddQuesNum" name ={"mathContents["+idx+"].oddQuesNum"} type="number" onBlur={event => nb_completeBlueBoxMulti(event, 1)}  onKeyUp={(event)=>removeRedBoxValid(event)} className="alignCenter oddQuesNum customBlueBox" placeholder="홀수형"  />
						&nbsp;<span className="mini-title11 hide">짝</span> <input id="evenQuesNum" defaultValue={0} name ={"mathContents["+idx+"].evenQuesNum"} type="number" onBlur={event => nb_completeBlueBoxMulti(event, 1)} onKeyUp={(event)=>removeRedBoxValid(event)} className="alignCenter evenQuesNum customBlueBox hide" placeholder="짝수형"  /><br/>
						
						<div className="mini-title10">문항 점수&nbsp;
						<select id="quesLevel" name={"mathContents["+idx+"].quesLevel"} className="customBlueBox marginFive multi" onChange={(event)=>{selChanged(event);removeRedBoxValid(event)}}>
							<option value="0">배점</option>
							<option value="3">2점</option>
							<option value="4">3점</option>
							<option value="5">4점</option>
						</select>
						</div>

						<div className="mini-title10">오답률&nbsp;&nbsp;
						<input id="wrongRatio" name ={"mathContents["+idx+"].wrongRatio"} type="number" className="wrongRatio customBlueBox marginFive" onBlur={event => nb_completeBlueBoxMulti(event, 1)} onKeyUp={(event)=>removeRedBoxValid(event)}  placeholder=""/>&nbsp;%
						</div>
					</>
				}
				
			</div>
			<div>
				<NbWebEditor parentMethod={()=>{}} showAsistDesc={false} showExceptBtn={true} isMultiMode={true} idx={editorIdx}></NbWebEditor>
				<div className="twoGrid">
					<div id={"contentsFormulaEditor"+ordinalNum} className="contentsFormulaEditor contentEditClass onlyEdit multi" contentEditable="true"  spellCheck={false} placeholder="문제를 입력해주세요..." onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event);multiChoicDefaultSetFunc(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_dressSelectionBackColor();reg_tbCellKeyUp(event);reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("contentsFormulaEditor"+ordinalNum);removeRedBoxValid(event);multiChoicDefaultSetFunc(event)}} onClick={()=>{reg_dressYellowBox()}} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>{reg_tbPasteInPastePrevent(event);}} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
					<div id={"solutionFormulaEditor"+ordinalNum} className="solutionFormulaEditor contentEditClass onlyEdit multi" contentEditable="true"  spellCheck={false} placeholder="해설을 입력해주세요..." onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}}  onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_dressSelectionBackColor();reg_tbCellKeyUp(event);reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("solutionFormulaEditor"+ordinalNum);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}}  onPaste={(event)=>{reg_tbPasteInPastePrevent(event)}} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
					<textarea id="contents" className="contents hide" name={"mathContents["+idx+"].contents"} defaultValue={contentsText}></textarea>
					<textarea id="solution" className="solution hide" name={"mathContents["+idx+"].solution"} defaultValue={solutionText}></textarea>
				</div>
				
				<div className="twoGrid">
					<div id="contentsOptBox" className="contentsOptBox marginTen" onClick={(event)=>{removeRedBoxValidAll(event)}}>
						<div className="mini-title marginBox hide">
						</div>
						<div className="mini-title">객관식 보기(선택)</div>
						<div id="multiChoiceBox" className="multiChoiceBox">
							<input id="multiChoiceImageFile" className='hide' type="file" accept="image/*" onChange={(event) => {nb_extensionCheck2(event);multiChoiceImageFile(event);}} />
							<div className="multiChoiceWrap">
								<div id={"firNoFormulaEditor"+ordinalNum} contentEditable="true"  spellCheck={false} className="multiChoiceView contentEditClass onlyEdit multi" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("firNoFormulaEditor"+ordinalNum);removeRedBoxValidAll(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
								<div className="multiChoiceImgAddBtn" onClick={(event)=>{multiChoiceImgAdd("firNoFormulaEditor"+ordinalNum, event)}}></div>
							</div>
							<div className="multiChoiceWrap">
								<div id={"secNoFormulaEditor"+ordinalNum} contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit multi" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("secNoFormulaEditor"+ordinalNum);removeRedBoxValidAll(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
								<div className="multiChoiceImgAddBtn" onClick={(event)=>{multiChoiceImgAdd("secNoFormulaEditor"+ordinalNum, event)}}></div>
							</div>
							<div className="multiChoiceWrap">
								<div id={"thrNoFormulaEditor"+ordinalNum} contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit multi" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("thrNoFormulaEditor"+ordinalNum);removeRedBoxValidAll(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
								<div className="multiChoiceImgAddBtn" onClick={(event)=>{multiChoiceImgAdd("thrNoFormulaEditor"+ordinalNum, event)}}></div>
							</div>
							<div className="multiChoiceWrap">
								<div id={"fourNoFormulaEditor"+ordinalNum} contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit multi" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("fourNoFormulaEditor"+ordinalNum);removeRedBoxValidAll(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
								<div className="multiChoiceImgAddBtn" onClick={(event)=>{multiChoiceImgAdd("fourNoFormulaEditor"+ordinalNum, event)}}></div>
							</div>
							<div className="multiChoiceWrap">
								<div id={"fifNoFormulaEditor"+ordinalNum} contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit multi" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("fifNoFormulaEditor"+ordinalNum);removeRedBoxValidAll(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
								<div className="multiChoiceImgAddBtn" onClick={(event)=>{multiChoiceImgAdd("fifNoFormulaEditor"+ordinalNum, event)}}></div>
							</div>
							<div className="hide">
								&#9312; <textarea className="marginFive" id="firNo" name={"mathContents["+idx+"].firNo"} defaultValue={firNo}></textarea><br/>
								&#9313; <textarea className="marginFive" id="secNo" name={"mathContents["+idx+"].secNo"} defaultValue={secNo}></textarea><br/>
								&#9314; <textarea className="marginFive" id="thrNo" name={"mathContents["+idx+"].thrNo"} defaultValue={thrNo}></textarea><br/>
								&#9315; <textarea className="marginFive" id="fourNo" name={"mathContents["+idx+"].fourNo"} defaultValue={fourNo}></textarea><br/>
								&#9316; <textarea className="marginFive" id="fifNo" name={"mathContents["+idx+"].fifNo"} defaultValue={fifNo}></textarea><br/>
							</div>
						</div>
					</div>

					<div id="ansSolOptBox" className="ansSolOptBox marginTen multi">
						<div className="mini-title marginBox hide">
						</div>
						<div className="mini-title">정답</div>
						<div>
							<div className="mini-title2">주관식 정답</div> 
							<div id={"answerFormulaEditor"+ordinalNum} className="answerFormulaEditor contentEditClass onlyEdit" contentEditable="true" spellCheck={false} onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onDrop={(event)=>event.preventDefault()}></div>
							<textarea type="text" id="answer" name={"mathContents["+idx+"].answer"} className="hide" defaultValue={answerText}></textarea>
							
							<div className="mini-title2">객관식 정답(선택) </div>
							<div>
								<input type="checkbox" name={"mathContents["+idx+"].choiceAnswer"} id={"multiAns1"+ordinalNum} className="multiAnsInput hide" value="&#9312;"/>
								<label className="circleBox" htmlFor={"multiAns1"+ordinalNum}>&#9312;</label>
								
								<input type="checkbox" name={"mathContents["+idx+"].choiceAnswer"} id={"multiAns2"+ordinalNum} className="multiAnsInput hide" value="&#9313;"/>
								<label className="circleBox" htmlFor={"multiAns2"+ordinalNum}>&#9313;</label>
								
								<input type="checkbox" name={"mathContents["+idx+"].choiceAnswer"} id={"multiAns3"+ordinalNum} className="multiAnsInput hide" value="&#9314;"/>
								<label className="circleBox" htmlFor={"multiAns3"+ordinalNum}>&#9314;</label>
								
								<input type="checkbox" name={"mathContents["+idx+"].choiceAnswer"} id={"multiAns4"+ordinalNum} className="multiAnsInput hide" value="&#9315;"/>
								<label className="circleBox" htmlFor={"multiAns4"+ordinalNum}>&#9315;</label>
								
								<input type="checkbox" name={"mathContents["+idx+"].choiceAnswer"} id={"multiAns5"+ordinalNum} className="multiAnsInput hide" value="&#9316;"/>
								<label className="circleBox" htmlFor={"multiAns5"+ordinalNum}>&#9316;</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
  );
};

export default FormulaEditorUnitForMulti;