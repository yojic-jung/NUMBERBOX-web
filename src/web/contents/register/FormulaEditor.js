import React, { useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import FormulaShortCutKey from './FormulaShortCutKey';
import TabTable from 'web/common/TabTable'
import TabButton from 'web/common/TabButton'
import NbWebEditor from 'web/contents/register/NbWebEditor'
import RegisterContentsInfo from 'web/contents/register/RegisterContentsInfo';
import {nb_isLogin, nb_topMenuFixed, nb_dataFetch, nb_extensionCheck2, nb_getCheckedVal, nb_base64ImgRegisterToS3,
	nb_licenseUiCheck, nb_contentsSrcVal, nb_multiChoiceGridSet, nb_module_handleImageUpload, nb_fadeInOutA} from 'js/common/common_nb.js';
import { reg_quesAnsTabClkEv, reg_preventKeyEvent, reg_mDownTdWidthChange, reg_mUpTdWidthChange, reg_formulaTapMoveEv,
		reg_mMoveTdWidthChange, reg_selStartTdWidthChange, reg_unitTypeChange ,reg_selectUnitOrTypeData, reg_dressYellowBox, 
		reg_newSelectFormulaElement, reg_selectCheck, reg_removeSelectionBackColor, reg_oldNbFormulToNewNbFormul, reg_convertFigureTagRemove,
		reg_dressSelectionBackColor, reg_tbCellMouseUp, reg_tbCellCopy, reg_tbSelBackgroundRemove, reg_tbPasteInPastePrevent, reg_tbCellKeyUp
		,reg_tbPastePrevent, reg_nbComplie, reg_undoRedoInitialize, reg_undoRedoSetting, reg_enableImageResizeInDiv, reg_removeResizeFrame, reg_imageCopy} from 'js/contents/register/contents_reg';


const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansSolTab',tabName:'해설 및 정답', className:""}];
const formulaTabList = [{id:'mainFormulaTap',tabName:'기본수식(alt 단축키)', className:"formulaTap selectedTab"}, {id:'highFormulaTap',tabName:'기타 수식(alt+shift 단축키)', className:"formulaTap"}, {id:'etcFormulaTap',tabName:'기타 기호(alt+shift+ctrl 단축키)', className:"formulaTap"}, {id:'etcFormulaTap2',tabName:'기타 기호2', className:"formulaTap"}];
let shortCutKeyList;

let multiImgTargetId;

const FormulaEditor = ({contentsNo, contentsClassify}) => {
	let urlPath = useLocation().pathname;
	
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

	const[shortCutKey, setShortCutKey] = useState("");
	const[isFetchShotCutKey, setIsFetchShotCutKey] = useState(false);

	const[updateModeUniqNo, setUpdateModeUniqNo] = useState("");


	const removeAddedEvent = () => {
		window.removeEventListener('mousedown', reg_mDownTdWidthChange);
		window.removeEventListener('mousemove', reg_mMoveTdWidthChange);
		window.removeEventListener('mouseup', reg_mUpTdWidthChange);
		window.removeEventListener('selectstart', reg_selStartTdWidthChange);
		window.removeEventListener('scroll', topMenuFixed);
		if(contentsNo!==undefined) document.getElementById("outerFormulaEditor").removeEventListener('scroll', topMenuFixed);
		window.removeEventListener('resize', topMenuWidth);
		window.removeEventListener('mousedown', reg_removeSelectionBackColor);
		window.removeEventListener('mouseup', reg_tbCellMouseUp);
		document.removeEventListener('copy', reg_tbCellCopy);
		window.removeEventListener('mousedown', reg_tbSelBackgroundRemove);
		window.removeEventListener('mouseup', reg_newSelectFormulaElement);
		window.removeEventListener('scroll',reg_removeResizeFrame);
		window.removeEventListener("keydown", reg_formulaTapMoveEv)
		/*
		document.getElementById("firNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("secNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("thrNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("fourNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("fifNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		*/
		//이미지 및 파일 복붙 
		//document.getElementById('answerFormulaEditor').removeEventListener('paste', pastePreventFile);

		window.shortCutKeyList = null;
		window.shortCutKeyHigh1 = null;
		window.shortCutKeyEtc = null;
		window.shortCutKeyEtc2 = null;
		//undo 초기화
		reg_undoRedoInitialize();
	}

	let targetDomWidth=window.innerWidth/2;
	const topMenuWidth = ()=>{
		targetDomWidth =  document.getElementsByClassName("right")[0].offsetWidth;
		document.getElementById("topShortkeyDiv").style.width =targetDomWidth+"px";
	}

	const topMenuFixed = ()=>{
		if(contentsNo!==undefined){
			targetDomWidth = document.getElementsByClassName("right")[0].offsetWidth;
			nb_topMenuFixed("topShortkeyDiv", targetDomWidth, "outerFormulaEditor")
		}
		else nb_topMenuFixed("topShortkeyDiv", targetDomWidth, null)
	}

	//이미지 파일 및 각종 파일 붙여넣기 금지
	const pastePreventFile = (event) => {
		let pasteHtml = event.clipboardData.getData('text/html')
		let template = document.createElement('template');
		template.innerHTML = pasteHtml;
		if(template.content.querySelector("img") !== null){
			alert("정답 입력창에는 이미지 첨부가 불가합니다.");
			event.preventDefault();
			return;
		}

		let isFileExist = false;
		for(let i=0; i<event.clipboardData.items.length; i++){
			let file = event.clipboardData.items[i].getAsFile();
			if(file !== null){
				let fileName = file.name.split(".")
				let fileExtension = fileName[fileName.length-1].toUpperCase()
				if(fileExtension === "PNG" || fileExtension === "JPG" || fileExtension === "JPEG" || fileExtension === "GIF" ||
					fileExtension === "BMP"){
					alert("정답 입력창에는 이미지 첨부가 불가합니다.");
					event.preventDefault();
					return
				}
				isFileExist = true;
			}
		}

		if(isFileExist){
			event.preventDefault();
			return;
		}
	}

	  const multiChoiceImageFile = async (event) =>{
		let file = await nb_module_handleImageUpload(event)
		if(file !== undefined){
			let img=document.createElement("img");
			img.style.width=100+"px";
			let reader  = new FileReader();
			let contentEditClass;
			document.getElementById(multiImgTargetId).append(img);
			reader.onload = async () => {
			   img.src=reader.result;
			   if(multiImgTargetId === "firNoFormulaEditor" ){
					contentEditClass = document.getElementById("firNoFormulaEditor");
					document.getElementById("firNo").value = contentEditClass.innerHTML;
					document.getElementById("firNoShow").innerHTML = contentEditClass.innerHTML;
					document.getElementById("firDiv").classList.remove("hide")
					nb_multiChoiceGridSet("multi-show");

				}else if(multiImgTargetId === "secNoFormulaEditor"){
					contentEditClass = document.getElementById("secNoFormulaEditor");
					document.getElementById("secNo").value = contentEditClass.innerHTML;
					document.getElementById("secNoShow").innerHTML = contentEditClass.innerHTML;
					document.getElementById("secDiv").classList.remove("hide")
					nb_multiChoiceGridSet("multi-show");

				}else if(multiImgTargetId === "thrNoFormulaEditor"){
					contentEditClass = document.getElementById("thrNoFormulaEditor");
					document.getElementById("thrNo").value = contentEditClass.innerHTML;
					document.getElementById("thrNoShow").innerHTML = contentEditClass.innerHTML;
					document.getElementById("thrDiv").classList.remove("hide")
					nb_multiChoiceGridSet("multi-show");

				}else if(multiImgTargetId === "fourNoFormulaEditor"){
					contentEditClass = document.getElementById("fourNoFormulaEditor");
					document.getElementById("fourNo").value = contentEditClass.innerHTML;
					document.getElementById("fourNoShow").innerHTML = contentEditClass.innerHTML;
					document.getElementById("fourDiv").classList.remove("hide")
					nb_multiChoiceGridSet("multi-show");

				}else if(multiImgTargetId === "fifNoFormulaEditor"){
					contentEditClass = document.getElementById("fifNoFormulaEditor");
					document.getElementById("fifNo").value = contentEditClass.innerHTML;
					document.getElementById("fifNoShow").innerHTML = contentEditClass.innerHTML;
					document.getElementById("fifDiv").classList.remove("hide")
					nb_multiChoiceGridSet("multi-show");
				}
			}; 
			if (file) reader.readAsDataURL(file);
			event.target.value= "";
			return;
		}
	  }

	const multiChoiceImgAdd = (targetId) =>{
		multiImgTargetId = targetId;
		document.getElementById("multiChoiceImageFile").click();
	}


	const errReportBy = ()=>{
		window.errType = 4;		//수학 문제 만들기 errType;
		document.getElementById("serviceCenter").classList.remove("hide")
		document.getElementById("serviceCenterQnADesc").innerHTML ="기호 추가, 오류, 제안사항이 있으시면 적어주세요.<br/>빠르게 개선하여 더 좋은 서비스를 제공해 드리겠습니다."
		document.getElementById("serviceQuestionTab").click();
		document.getElementById("serviceQuestion").scrollTo(0, 0)
	}

	useEffect(() => {
		const asyncUseEffect = async function(){
			if(nb_isLogin()){
				document.getElementById("tabTableDesc").classList.add("hide");
			}else{
				document.getElementById("tabTableDesc").classList.remove("hide");
			}
			let contentEditClass = document.querySelectorAll('[contenteditable]');
			for(let i=0; i<contentEditClass.length; i++){
				if(contentEditClass[i].id !== "answerFormulaEditor"){
					reg_enableImageResizeInDiv(contentEditClass[i].id);
				}
			}
			//reg_enableImageResizeInDiv('contentsFormulaEditor');
			//reg_enableImageResizeInDiv('solutionFormulaEditor');
			
			let jsonObj = await nb_dataFetch('/mathInfo/takeShortCutKey', true);
			setShortCutKey(jsonObj);
			setIsFetchShotCutKey(true);
			shortCutKeyList = jsonObj["shortCutKey"]
			window.shortCutKeyList = shortCutKeyList;
			window.shortCutKeyHigh1 = jsonObj["shortCutKeyHigh1"];
			window.shortCutKeyEtc = jsonObj["shortCutKeyEtc"];
			window.shortCutKeyEtc2 = jsonObj["shortCutKeyEtc2"];

			if(contentsNo!==undefined) document.getElementById("outerFormulaEditor").addEventListener('scroll', topMenuFixed);
			else window.addEventListener('scroll', topMenuFixed);
			window.addEventListener('resize', topMenuWidth);
			window.addEventListener('scroll', reg_removeResizeFrame);
			window.addEventListener("keydown", reg_formulaTapMoveEv);
			
			//이미지 및 파일 복붙 금지
			let answerFormulaEditor = document.getElementById('answerFormulaEditor');
			answerFormulaEditor.addEventListener('paste', pastePreventFile);
			

			document.getElementById("contents-show").addEventListener("contextmenu",(e)=>{
				e.preventDefault();
				return false;
			});
			document.getElementById("contents-show").addEventListener("dragstart",(e)=>{
				e.preventDefault();
				return false;
			});
			document.getElementById("contents-show").addEventListener("selectstart",(e)=>{
				e.preventDefault();
				return false;
			});

			//테이블 너비 변경 이벤트
			window.addEventListener('mousedown', await reg_mDownTdWidthChange);
			window.addEventListener('mousemove', await reg_mMoveTdWidthChange);
			window.addEventListener('mouseup', await reg_mUpTdWidthChange);
			window.addEventListener('selectstart', await reg_selStartTdWidthChange);
			//테이블 셀렉트 색상 이벤트
			window.addEventListener('mousedown', reg_tbSelBackgroundRemove);
			window.addEventListener('mouseup', await reg_tbCellMouseUp);
			document.addEventListener('copy', await reg_tbCellCopy);
			//수식요소 배경색 지정
			window.addEventListener('mousedown', await reg_removeSelectionBackColor);
			//수식요소 마우스 셀렉트 규칙
			window.addEventListener('mouseup', await reg_newSelectFormulaElement);
			
			//undo 초기화
			await reg_undoRedoInitialize();

			let myContents;
			//수정모드
			if(contentsNo!==undefined){
				document.getElementById("makeContentsLinkDiv").classList.add("hide");
				if(urlPath === "/contentsList" || urlPath === "/myRepository"){		//문제검색 페이지에서는 다른 사용자의 제작문제 접근 가능
					myContents = await nb_dataFetch('/mathInfo/takeContentsByContentsNo?contentsno='+contentsNo, true);
				}else{
					myContents = await nb_dataFetch('/mathInfo/takeMyWorkContents?contentsno='+contentsNo, true);
				}
				setIsMyContents(myContents.isMyContents);
				
				if(myContents.existMsg){
					document.getElementById("saveBtn").remove();
					return;
				}
				setContentsText(myContents["myContents"].contents);
				document.getElementById("contentsFormulaEditor").innerHTML = myContents["myContents"].contents;
				setSolutionText(myContents["myContents"].solution);
				document.getElementById("solutionFormulaEditor").innerHTML = myContents["myContents"].solution;
				setAnswerText(myContents["myContents"].answer);
				document.getElementById("answerFormulaEditor").innerHTML = myContents["myContents"].answer;
				document.getElementById("answerFormulaEditor").innerHTML = myContents["myContents"].answer;

				let choiceAnswers = document.getElementsByName("choiceAnswer");
				let choiceAnswerShowVal;
				if(myContents["myContents"].choiceAnswer != null){
					for(let i=0; i<choiceAnswers.length; i++){
						if(myContents["myContents"].choiceAnswer.indexOf(choiceAnswers[i].value)>-1){
							choiceAnswers[i].checked =true;
							if(choiceAnswerShowVal=== undefined) choiceAnswerShowVal = choiceAnswers[i].value;
							else choiceAnswerShowVal += ","+choiceAnswers[i].value;
							setMultiAnswerText(choiceAnswerShowVal)
							document.getElementById('isBlank').classList.remove("hide");

						}
					}
				}

				if(myContents["myContents"].firNo.length!=0){
					document.getElementById("firDiv").classList.remove("hide");
					document.getElementById("secDiv").classList.remove("hide");
					document.getElementById("thrDiv").classList.remove("hide");
					document.getElementById("fourDiv").classList.remove("hide");
					document.getElementById("fifDiv").classList.remove("hide");
				}else{
					document.getElementById("firDiv").classList.add("hide");
					document.getElementById("secDiv").classList.add("hide");
					document.getElementById("thrDiv").classList.add("hide");
					document.getElementById("fourDiv").classList.add("hide");
					document.getElementById("fifDiv").classList.add("hide");
				}
				setFirNo(myContents["myContents"].firNo);
				document.getElementById("firNoFormulaEditor").innerHTML = myContents["myContents"].firNo;
				setSecNo(myContents["myContents"].secNo);
				document.getElementById("secNoFormulaEditor").innerHTML = myContents["myContents"].secNo;
				setThrNo(myContents["myContents"].thrNo);
				document.getElementById("thrNoFormulaEditor").innerHTML = myContents["myContents"].thrNo;
				setFourNo(myContents["myContents"].fourNo);
				document.getElementById("fourNoFormulaEditor").innerHTML = myContents["myContents"].fourNo;
				setFifNo(myContents["myContents"].fifNo);
				document.getElementById("fifNoFormulaEditor").innerHTML = myContents["myContents"].fifNo;

				await nb_multiChoiceGridSet("multi-show");

				//예전 방식으로 구현된 수식UI 현재 방식으로 변경
				await reg_oldNbFormulToNewNbFormul("makeContents");

				//이미지 file 셋팅 필요(문제 및 정답)
				if(myContents["myContents"].contentsImg !== null){
					document.getElementById("contentsImgOutput").src = myContents["myContents"].imgPath+"/"+myContents["myContents"].contentsImg;
					document.getElementById("contentsImgOutput").classList.remove("hide");
				}
				if(myContents["myContents"].solutionImg !== null){
					document.getElementById("solutionImgOutput").src = myContents["myContents"].solutionImgPath+"/"+myContents["myContents"].solutionImg;
					document.getElementById("solutionImgOutput").classList.remove("hide");
				}
				// 주관식 객관식 마지막 validation에서 처리 필요(X)
				if(contentsClassify===0){	//N명의수학만 셋팅
					//유사 교재
					document.getElementById("orgSrcRef").value = myContents["myContents"].mathContentsComp[0].orgSrcRef;
					document.getElementById("cusOrgRefSelTitle").innerHTML =document.getElementById("orgSrcRef")[document.getElementById("orgSrcRef").selectedIndex].innerText;
					document.getElementById("cusOrgRefSelDiv").classList.add("nbCustomSelected");

					//유사 문제 번호
					document.getElementById("orgSrcNo").value = myContents["myContents"].mathContentsComp[0].orgSrcNo;
					document.getElementById("orgSrcNo").classList.add("customBlueBoxComplete");

					//유사 문제 페이지
					document.getElementById("orgSrcPage").value = myContents["myContents"].mathContentsComp[0].orgSrcPage;
					document.getElementById("orgSrcPage").classList.add("customBlueBoxComplete");

					//유사 문제 출판연월
					document.getElementById("copyrightYear").value = myContents["myContents"].mathContentsComp[0].copyrightYear;
					document.getElementById("copyrightYear").classList.add("customBlueBoxComplete");

					nb_contentsSrcVal(null, true);

					//문제 구분
					document.getElementById("mathTypeClassify").value = myContents["myContents"].mathContentsComp[0].mathTypeClassify;
					document.getElementById("cusMathClassifySelTitle").innerHTML =document.getElementById("mathTypeClassify")[document.getElementById("mathTypeClassify").selectedIndex].innerText;
					document.getElementById("cusMathClassifySelDiv").classList.add("nbCustomSelected");
				
				}else if(contentsClassify===1){
					//공개, 비공개 여부 설정
					if(myContents["myContents"].mathContentsLicense !== null){
						if( myContents["myContents"].mathContentsLicense[0].shareStts === 1 ){
							document.getElementById("shareSttsPublic").click();
						}else if(myContents["myContents"].mathContentsLicense[0].shareStts === 0) {
							document.getElementById("shareSttsPublic").checked = false;
							document.getElementById("shareSttsPrivate").click();
						}
	
						if( myContents["myContents"].mathContentsLicense[0].onlineLicStts === 1 ){
							document.getElementById("onlineLicStts").checked = true;
						}
	
						if( myContents["myContents"].mathContentsLicense[0].perLicStts === 1 ){
							document.getElementById("perLicStts").checked = true;
						}
	
						if( myContents["myContents"].mathContentsLicense[0].entLicStts === 1 ){
							document.getElementById("entLicStts").checked = true;
						}
					}
				}else if(contentsClassify===2){
					//사용자 제작 문제
					if(myContents["myContents"].mathContentsLicense !== null && myContents["myContents"].mathContentsLicense !== undefined){
						await nb_licenseUiCheck(myContents["myContents"].mathContentsLicense[0]);
					//N명의수학 문제
					}else{		
						await nb_licenseUiCheck();
					}
				}else if(contentsClassify===4){	//N명의수학만 셋팅
					//가/나형 구분
					document.getElementById("paperType").value = myContents["myContents"].mathContentsIpsi[0].paperType;
					document.getElementById("cusOrgRefSelTitle").innerHTML = document.getElementById("paperType")[document.getElementById("paperType").selectedIndex].innerText;
					document.getElementById("cusOrgRefSelDiv").classList.add("nbCustomSelected");

					//홀수형 문제 번호
					document.getElementById("oddQuesNum").value = myContents["myContents"].mathContentsIpsi[0].oddQuesNum;
					document.getElementById("oddQuesNum").classList.add("customBlueBoxComplete");

					//짝수형 문제 번호
					document.getElementById("evenQuesNum").value = myContents["myContents"].mathContentsIpsi[0].evenQuesNum;
					document.getElementById("evenQuesNum").classList.add("customBlueBoxComplete");

					//시행연도
					document.getElementById("impYear").value = myContents["myContents"].mathContentsIpsi[0].impYear;
					document.getElementById("impYear").classList.add("customBlueBoxComplete");

					//시행월
					document.getElementById("impMonth").value = myContents["myContents"].mathContentsIpsi[0].impMonth;
					document.getElementById("impMonth").classList.add("customBlueBoxComplete");

					//출제기관
					document.getElementById("manageIns").value = myContents["myContents"].mathContentsIpsi[0].manageIns;
					document.getElementById("cusMathClassifySelTitle").innerHTML = document.getElementById("manageIns")[document.getElementById("manageIns").selectedIndex].innerText;
					document.getElementById("cusMathClassifySelDiv").classList.add("nbCustomSelected");
				}
				
				//문제 난이도
				document.getElementById("quesLevel").value = myContents["myContents"].quesLevel;
				document.getElementById("cusQuesSelTitle").innerHTML =document.getElementById("quesLevel")[document.getElementById("quesLevel").selectedIndex].innerText;
				document.getElementById("cusQuesSelDiv").classList.add("nbCustomSelected");

				//과목
				document.getElementById("subject").value = myContents["myUnitInfo"].subject;
				document.getElementById("cusSelSubTitle").innerHTML =document.getElementById("subject")[document.getElementById("subject").selectedIndex].innerText;
				document.getElementById("cusSelSubDiv").classList.add("nbCustomSelected");
				let trigEv = new Object();
				let sub    = new Object();
				trigEv.target= sub;
				trigEv.target.id= "subject";
				await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);

				/*
				document.getElementById("firUnit").value = myContents["myUnitInfo"].firUnit;
				document.getElementById("cusSelFirUnitTitle").innerHTML =document.getElementById("firUnit")[document.getElementById("firUnit").selectedIndex].innerText;
				document.getElementById("cusSelFirUnitDiv").classList.add("nbCustomSelected");
				trigEv.target.id= "firUnit";
				await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);
				*/
				
				document.getElementById("secUnit").value = myContents["myUnitInfo"].secUnit;
				document.getElementById("cusSelSecUnitTitle").innerHTML =document.getElementById("secUnit")[document.getElementById("secUnit").selectedIndex].innerText;
				document.getElementById("cusSelSecUnitDiv").classList.add("nbCustomSelected");
				trigEv.target.id= "secUnit";
				await reg_unitTypeChange(trigEv, "cusSelThrUnit","thrUnit", true);

				await reg_selectUnitOrTypeData("thrUnit", "cusSelThrUnitTitle",  "cusSelThrUnitDiv", myContents["myContents"].unitUniqNo);
				
				//유형
				if(contentsClassify === 0) setUpdateModeUniqNo(myContents["myUnitInfo"].unitUniqNo+","+myContents["myContents"].typeNo+","+myContents["myContents"].contentsNo+","+myContents["myContents"].mathContentsComp[0].seqNo);
				else if(contentsClassify === 4) setUpdateModeUniqNo(myContents["myUnitInfo"].unitUniqNo+","+myContents["myContents"].typeNo+","+myContents["myContents"].contentsNo+","+myContents["myContents"].mathContentsIpsi[0].seqNo);
				else setUpdateModeUniqNo(myContents["myUnitInfo"].unitUniqNo+","+myContents["myContents"].typeNo+","+myContents["myContents"].contentsNo);
				//수정시간 서버에서 수정 필요

			}
			await reg_undoRedoSetting();
		}

		asyncUseEffect();
		return () => removeAddedEvent();
      },[contentsNo]);

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

	const initFormElement = async function(){
		setContentsText("");
		setSolutionText("");
		setAnswerText("");
		setMultiAnswerText("");

		setFirNo("");
		setSecNo("");
		setThrNo("");
		setFourNo("");
		setFifNo("");

	}
	const getCheckedVal = async function(event){
		let chkVal = await nb_getCheckedVal(event);
		if(chkVal.length!==0) document.getElementById("isBlank").classList.remove("hide");
		else document.getElementById("isBlank").classList.add("hide");
		setMultiAnswerText(chkVal);
	}

	let multiChoiceId = ["firNoFormulaEditor", "secNoFormulaEditor", "thrNoFormulaEditor", "fourNoFormulaEditor", "fifNoFormulaEditor"];
	const contentsValidation = async function(){
		if(!nb_isLogin()) {
			alert("로그인 이후 사용해주시기 바랍니다.");
			return;
		}
		//객관식 br태그만 남아있는 경우 제거
		for(let i=0; i<multiChoiceId.length; i++){
			let childNodes = document.getElementById(multiChoiceId[i]).childNodes;
			for(let j=0; j<childNodes.length; j++){
				if(childNodes[j].nodeName === "#text" && childNodes[j].length === 0){
					childNodes[j].remove();
				}
			}
		}
		if(document.getElementById("firNoFormulaEditor").childNodes.length===1 && document.getElementById("firNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("firNoFormulaEditor").childNodes[0].remove();
			document.getElementById("firNo").innerHTML=document.getElementById("firNoFormulaEditor").innerHTML;
		}
		if(document.getElementById("secNoFormulaEditor").childNodes.length===1 && document.getElementById("secNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("secNoFormulaEditor").childNodes[0].remove();
			document.getElementById("secNo").innerHTML=document.getElementById("secNoFormulaEditor").innerHTML;
		}
		if(document.getElementById("thrNoFormulaEditor").childNodes.length===1 && document.getElementById("thrNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("thrNoFormulaEditor").childNodes[0].remove();
			document.getElementById("thrNo").innerHTML=document.getElementById("thrNoFormulaEditor").innerHTML;
		}
		if(document.getElementById("fourNoFormulaEditor").childNodes.length===1 && document.getElementById("fourNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("fourNoFormulaEditor").childNodes[0].remove();
			document.getElementById("fourNo").innerHTML=document.getElementById("fourNoFormulaEditor").innerHTML;
		}
		if(document.getElementById("fifNoFormulaEditor").childNodes.length===1 && document.getElementById("fifNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("fifNoFormulaEditor").childNodes[0].remove();
			document.getElementById("fifNo").innerHTML=document.getElementById("fifNoFormulaEditor").innerHTML;
		}

		let contentsDomLength = document.getElementById("contentsFormulaEditor").innerText.length;
		let isFirNoExist = ((!(document.getElementById("firNoFormulaEditor").innerText.length ===1 && document.getElementById("firNoFormulaEditor").innerText === "\n") && document.getElementById("firNoFormulaEditor").innerText.length > 0) || document.getElementById("firNoFormulaEditor").querySelector("img") !== null);
		let isSecNoExist = ((!(document.getElementById("secNoFormulaEditor").innerText.length ===1 && document.getElementById("secNoFormulaEditor").innerText === "\n") && document.getElementById("secNoFormulaEditor").innerText.length > 0) || document.getElementById("secNoFormulaEditor").querySelector("img") !== null);
		let isThrNoExist = ((!(document.getElementById("thrNoFormulaEditor").innerText.length ===1 && document.getElementById("thrNoFormulaEditor").innerText === "\n") && document.getElementById("thrNoFormulaEditor").innerText.length > 0) || document.getElementById("thrNoFormulaEditor").querySelector("img") !== null);
		let isFourNoExist = ((!(document.getElementById("fourNoFormulaEditor").innerText.length ===1 && document.getElementById("fourNoFormulaEditor").innerText === "\n") && document.getElementById("fourNoFormulaEditor").innerText.length > 0) || document.getElementById("fourNoFormulaEditor").querySelector("img") !== null);
		let isFifNoExist = ((!(document.getElementById("fifNoFormulaEditor").innerText.length ===1 && document.getElementById("fifNoFormulaEditor").innerText === "\n") && document.getElementById("fifNoFormulaEditor").innerText.length > 0) || document.getElementById("fifNoFormulaEditor").querySelector("img") !== null);
	
		
		//문제 validation [start]
		if(contentsDomLength<5){
			//이미지 등록한 경우는 글자 입력 가능하지만 이미지 등록 안 한 경우 최소 5글자 이상 
			if(document.getElementById("contentsFormulaEditor").querySelector("img") === null){
				alert("문제를 최소 5글자 이상 입력해주시기 바랍니다.");
				return false;
			}
		} 

		//객관식 하나라도 입력되어 있는지 체크
		let multiChoiceOrCheck = (isFirNoExist || isSecNoExist || isThrNoExist || isFourNoExist || isFifNoExist)
		//객관식 전부 다 입력되어 있는지 체크
		let multiChoiceAllCheck = (isFirNoExist && isSecNoExist && isThrNoExist && isFourNoExist && isFifNoExist);
		//객관식이 하나라도 입력되어있는데 전부 다 입력되지 않은 경우 
		if(multiChoiceOrCheck && !multiChoiceAllCheck){
			alert("객관식 문제인 경우 객관식 보기를 모두 입력해주세요.\n객관식 문제가 아닌 경우 객관식 보기를 모두 지워주세요.");
			return false;
		}
		//문제 validation [end]

		if(!isFirNoExist){
			setFirNo("")
			document.getElementById("firNoFormulaEditor").innerHTML = "";
		}
		if(!isSecNoExist){
			setSecNo("")
			document.getElementById("secNoFormulaEditor").innerHTML = "";
		}
		if(!isThrNoExist){
			setThrNo("")
			document.getElementById("thrNoFormulaEditor").innerHTML = "";
		}
		if(!isFourNoExist){
			setFourNo("")
			document.getElementById("fourNoFormulaEditor").innerHTML = "";
		}
		if(!isFifNoExist){
			setFifNo("")
			document.getElementById("fifNoFormulaEditor").innerHTML = "";
		}


		document.getElementById("formulaEditBlindBox").classList.remove("hide");
		document.getElementById("contentsInfo").classList.remove("hide");
	}

	const formularTabSelect = async function(event){
		let targetId = event.target.id;
		let targetDom = document.getElementById(targetId);
		let selectedDom = document.getElementsByClassName("selectedTab");
		for(let i=0; i<selectedDom.length; i++){
			selectedDom[i].classList.remove("selectedTab");
		}
		if(targetId=="mainFormulaTap"){
			document.getElementById("shortKeyBoard").classList.remove("hide");
			document.getElementById("shortKeyBoardHigh").classList.add("hide");
			document.getElementById("shortKeyBoardEtc").classList.add("hide");
			document.getElementById("shortKeyBoardEtc2").classList.add("hide");
			targetDom.classList.add("selectedTab");
		}else if(targetId=="highFormulaTap"){
			document.getElementById("shortKeyBoard").classList.add("hide");
			document.getElementById("shortKeyBoardHigh").classList.remove("hide");
			document.getElementById("shortKeyBoardEtc").classList.add("hide");
			document.getElementById("shortKeyBoardEtc2").classList.add("hide");
			targetDom.classList.add("selectedTab");
		}
		else if(targetId=="etcFormulaTap"){
			document.getElementById("shortKeyBoard").classList.add("hide");
			document.getElementById("shortKeyBoardHigh").classList.add("hide");
			document.getElementById("shortKeyBoardEtc").classList.remove("hide");
			document.getElementById("shortKeyBoardEtc2").classList.add("hide");
			targetDom.classList.add("selectedTab");
		}
		else if(targetId=="etcFormulaTap2"){
			document.getElementById("shortKeyBoard").classList.add("hide");
			document.getElementById("shortKeyBoardHigh").classList.add("hide");
			document.getElementById("shortKeyBoardEtc").classList.add("hide");
			document.getElementById("shortKeyBoardEtc2").classList.remove("hide");
			targetDom.classList.add("selectedTab");
		}

		//첫 페이지 로드시 아무것도 클릭 안한상태(rangeCount=0)
		if(document.getSelection().rangeCount==0) return;
		if(document.getSelection().isCollapsed){
			const selection = document.getSelection();
			const newRange = selection.getRangeAt(0);
			selection.removeAllRanges();
			selection.addRange(newRange);
			window.getSelection().collapseToEnd();
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

		await showFormulaEditor(evIdName);
	}

	const showFormulaEditor = async function(evIdName){
		let userInnerText = document.getElementById(evIdName).innerText;
		let userInputText = document.getElementById(evIdName).innerHTML;
		userInnerText = userInnerText.replace( "/\n$/" , '');
		if(userInnerText == '\n' )userInnerText="";

		if(evIdName == "contentsFormulaEditor"){
			setContentsText(userInputText);
		}
		else if(evIdName == "solutionFormulaEditor"){
			setSolutionText(userInputText);
		}
		else if(evIdName == "answerFormulaEditor"){
			setAnswerText(userInputText);
		}
		else if(evIdName=="firNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("firDiv").classList.remove("hide");
			}else{
				if(document.getElementById(evIdName).querySelector("img") === null){
					document.getElementById("firDiv").classList.add("hide");
				}else{
					document.getElementById("firDiv").classList.remove("hide");
				}
			}
			setFirNo(userInputText);
		}
		else if(evIdName=="secNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("secDiv").classList.remove("hide");
			}else{
				if(document.getElementById(evIdName).querySelector("img") === null){
					document.getElementById("secDiv").classList.add("hide");
				}else{
					document.getElementById("secDiv").classList.remove("hide");
				}
			}
			setSecNo(userInputText);
		}
		else if(evIdName=="thrNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("thrDiv").classList.remove("hide");
			}else{
				if(document.getElementById(evIdName).querySelector("img") === null){
					document.getElementById("thrDiv").classList.add("hide");
				}else{
					document.getElementById("thrDiv").classList.remove("hide");
				}
			}
			setThrNo( userInputText);
		}
		else if(evIdName=="fourNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("fourDiv").classList.remove("hide");
			}else{
				if(document.getElementById(evIdName).querySelector("img") === null){
					document.getElementById("fourDiv").classList.add("hide");
				}else{
					document.getElementById("fourDiv").classList.remove("hide");
				}
			}
			setFourNo(userInputText);
		}
		else if(evIdName=="fifNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("fifDiv").classList.remove("hide");
			}else{
				if(document.getElementById(evIdName).querySelector("img") === null){
					document.getElementById("fifDiv").classList.add("hide");
				}else{
					document.getElementById("fifDiv").classList.remove("hide");
				}
			}
			setFifNo(userInputText);
		}
	}

  return (
	  <>
		<div className="rightAbsolBox marginTen">
			<div id="saveBtn" className="nabyBox" onClick={()=>{contentsValidation()}}>저장하기</div>
		</div>

		<form method="post" id="contentsForm" encType="multipart/form-data">
		<div className="twoFlexLayout" >
			<div className="left">
				<div id="makeContentsLinkDiv" className="makeContentsLinkDiv hide">
					<Link className='linkNoneCss' to="/makeContents">
						<div className="relative">
							<div className="makeContentsBtn active"></div>
							<div className="makeContentsForImgBtnDesc">문제 직접 만들기</div>
						</div>
					</Link>
					<Link className='linkNoneCss' to="/makeContentsForImg">
						<div className="relative">
							<div className="makeContentsForImgBtn"></div>
							<div className="makeContentsForImgBtnDesc">이미지로 등록하기</div>
						</div>
					</Link>
				</div>
				<div id="contents-show" className="contents-show">
					<div className="makeContentsWidthDesc">학습지 출력 미리보기 화면</div>
					<div className="mini-title4">문제</div>
					<div id="ques-show">
						<div id="ques-show-contents" dangerouslySetInnerHTML={{__html:contentsText}} onDragStart={ev=>ev.preventDefault()}></div> 
						<div id="quesImg-show" className="quesImg-show">
							<img src="" id="contentsImgOutput" className="hide" alt="" />
						</div>
						<div id="multi-show" className="multi-show">
							<div id="firDiv" className="firDiv hide"><span className='multiChoiceNo'>&#9312;</span><span id="firNoShow" dangerouslySetInnerHTML={{__html:firNo}}></span></div>
							<div id="secDiv" className="secDiv hide"><span className='multiChoiceNo'>&#9313;</span><span id="secNoShow" dangerouslySetInnerHTML={{__html:secNo}}></span></div>
							<div id="thrDiv" className="thrDiv hide"><span className='multiChoiceNo'>&#9314;</span><span id="thrNoShow" dangerouslySetInnerHTML={{__html:thrNo}}></span></div>
							<div id="fourDiv" className="fourDiv hide"><span className='multiChoiceNo'>&#9315;</span><span id="fourNoShow" dangerouslySetInnerHTML={{__html:fourNo}}></span></div>
							<div id="fifDiv" className="fifDiv hide"><span className='multiChoiceNo'>&#9316;</span><span id="fifNoShow" dangerouslySetInnerHTML={{__html:fifNo}}></span></div>
						</div>
					</div>
					<div className="mini-title4">정답 및 해설</div>
					<div className="ansSol-show">
						<span className='ansContents2 ansShow'>
							<span className='mini-title6'> 정답</span>&nbsp;&nbsp;
							<span className="" dangerouslySetInnerHTML={{__html:multiAnswerText}}></span>
							<span id="isBlank" className="marginRFive hide"></span>
							<span dangerouslySetInnerHTML={{__html:answerText}}></span>
						</span>
						<div id="sol-show">
						<span className='mini-title6'> 해설</span>&nbsp;&nbsp;
							<div id="solImg-show" className="solImg-show">
								<img src="" id="solutionImgOutput" className="hide" alt="" />
							</div>
							<div  id="ques-solution-contents" className="paddingLFive" dangerouslySetInnerHTML={{__html:solutionText}}></div> 

						</div>
					</div>
				</div>
			</div>
			<div className="right">
				<div onClick={()=>{errReportBy("makeContents")}} className="errBtn makeContents"></div>
				<div id="topShortkeyDiv">
				<TabButton className="formulaTabButton" tabList={formulaTabList} clickEv={formularTabSelect}></TabButton>
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoard" keyName="shortCutKey" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor}/>}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardHigh" keyName="shortCutKeyHigh1" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardEtc" keyName="shortCutKeyEtc" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardEtc2" keyName="shortCutKeyEtc2" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				</div>
				<div>
					<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={reg_quesAnsTabClkEv}></TabTable>
				</div>
				<NbWebEditor parentMethod={showFormulaEditor}></NbWebEditor>
                <div id="contentsFormulaEditor" className="contentsFormulaEditor contentEditClass onlyEdit" contentEditable="true"  spellCheck={false} placeholder="문제를 입력해주세요..." onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_dressSelectionBackColor();reg_tbCellKeyUp(event);reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("contentsFormulaEditor");}} onClick={()=>{reg_dressYellowBox()}} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>{reg_tbPasteInPastePrevent(event)}} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
                <div id="solutionFormulaEditor" className="solutionFormulaEditor contentEditClass onlyEdit hide" contentEditable="true"  spellCheck={false} placeholder="해설을 입력해주세요..." onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}}  onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_dressSelectionBackColor();reg_tbCellKeyUp(event);reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("solutionFormulaEditor");}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}}  onPaste={(event)=>{reg_tbPasteInPastePrevent(event)}} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
				
                <textarea id="contents" className="contents hide" name="contents" defaultValue={contentsText}></textarea>
				<textarea id="solution" className="solution hide" name="solution" defaultValue={solutionText}></textarea>
				
                <div id="contentsOptBox" className="contentsOptBox marginTen">
					<div className="mini-title marginBox hide">
						<span id="cusConUpldBtn" className="uploadBtn" >문제 이미지 첨부</span> 
						<span className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</span>
						<input id="contentsImg" name="contentsImgFile" type="file" accept="image/*" className="hide" />
					</div>
					<div className="mini-title">객관식 보기(선택)</div>
					<div id="multiChoiceBox" className="multiChoiceBox">
						<input id="multiChoiceImageFile" className='hide' type="file" accept="image/*" onChange={(event) => {nb_extensionCheck2(event);multiChoiceImageFile(event);}} />
						<div className="multiChoiceWrap">
							<div id="firNoFormulaEditor" contentEditable="true"  spellCheck={false} className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("firNoFormulaEditor");}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
							<div className="multiChoiceImgAddBtn" onClick={()=>{multiChoiceImgAdd("firNoFormulaEditor")}}></div>
						</div>
						<div className="multiChoiceWrap">
							<div id="secNoFormulaEditor" contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("secNoFormulaEditor");}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
							<div className="multiChoiceImgAddBtn" onClick={()=>{multiChoiceImgAdd("secNoFormulaEditor")}}></div>
						</div>
						<div className="multiChoiceWrap">
							<div id="thrNoFormulaEditor" contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("thrNoFormulaEditor");}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
							<div className="multiChoiceImgAddBtn" onClick={()=>{multiChoiceImgAdd("thrNoFormulaEditor")}}></div>
						</div>
						<div className="multiChoiceWrap">
							<div id="fourNoFormulaEditor" contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("fourNoFormulaEditor");}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
							<div className="multiChoiceImgAddBtn" onClick={()=>{multiChoiceImgAdd("fourNoFormulaEditor")}}></div>
						</div>
						<div className="multiChoiceWrap">
							<div id="fifNoFormulaEditor" contentEditable="true" spellCheck={false} className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);nb_multiChoiceGridSet("multi-show");reg_dressSelectionBackColor();reg_nbComplie(event);nb_base64ImgRegisterToS3(event);reg_convertFigureTagRemove("fifNoFormulaEditor");}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)} onCopy={(event)=>{reg_imageCopy(event, true)}} onCut={(event)=>{reg_imageCopy(event, false)}}></div>
							<div className="multiChoiceImgAddBtn" onClick={()=>{multiChoiceImgAdd("fifNoFormulaEditor")}}></div>
						</div>
						<div className="hide">
							&#9312; <textarea className="marginFive" id="firNo" name="firNo" defaultValue={firNo}></textarea><br/>
							&#9313; <textarea className="marginFive" id="secNo" name="secNo" defaultValue={secNo}></textarea><br/>
							&#9314; <textarea className="marginFive" id="thrNo" name="thrNo" defaultValue={thrNo}></textarea><br/>
							&#9315; <textarea className="marginFive" id="fourNo" name="fourNo" defaultValue={fourNo}></textarea><br/>
							&#9316; <textarea className="marginFive" id="fifNo" name="fifNo" defaultValue={fifNo}></textarea><br/>
						</div>
					</div>
				</div>

				<div id="ansSolOptBox" className="ansSolOptBox marginTen hide">
					<div className="mini-title marginBox hide">
						<span id="cusSolUpldBtn" className="uploadBtn">해설 이미지 첨부</span> 
						<span className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</span>
						<input id="solutionImg" name="solutionImgFile" accept="image/*" type="file" className="hide" />
					</div>
					<div className="mini-title">정답</div>
					<div>
						<div className="mini-title2">주관식 정답</div> 
						<div id="answerFormulaEditor" className="answerFormulaEditor contentEditClass onlyEdit" contentEditable="true" spellCheck={false} onKeyDown={(event) => {reg_preventKeyEvent(event, isMyContents);copyPreventEv(event)}} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
						<textarea type="text" id="answer" name="answer" className="hide" defaultValue={answerText}></textarea>
						
						<div className="mini-title2">객관식 정답(선택) </div>
						<div>
							<input type="checkbox" name="choiceAnswer" id="multiAns1" className="multiAnsInput hide" value="&#9312;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns1">&#9312;</label>
							
							<input type="checkbox" name="choiceAnswer" id="multiAns2" className="multiAnsInput hide" value="&#9313;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns2">&#9313;</label>
							
							<input type="checkbox" name="choiceAnswer" id="multiAns3" className="multiAnsInput hide" value="&#9314;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns3">&#9314;</label>
							
							<input type="checkbox" name="choiceAnswer" id="multiAns4" className="multiAnsInput hide" value="&#9315;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns4">&#9315;</label>
							
							<input type="checkbox" name="choiceAnswer" id="multiAns5" className="multiAnsInput hide" value="&#9316;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns5">&#9316;</label>
						</div>
						
					</div>
				</div>

			</div>
		</div>
		<div className="scrollFixBugMargin"></div>
		<RegisterContentsInfo parentMethod={initFormElement} updateModeUniqNo={updateModeUniqNo} contentsClassify={contentsClassify} isOnlyImgReg={false}/>
		</form>
	</>
  );
};

export default FormulaEditor;