import {React, useState, useEffect} from "react";
import FormulaShortCutKey from './FormulaShortCutKey';
import TabTable from 'web/common/TabTable'
import TabButton from 'web/common/TabButton'
import NbWebEditor from 'web/contents/register/NbWebEditor'
import InputQuestionInfo from 'web/contents/register/InputQuestionInfo';
import {nb_formDataFetch, nb_topMenuFixed, nb_dataFetch, nb_addClass, nb_extensionCheck, nb_getCheckedVal, nb_imgFileDel} from 'js/common/common_nb.js';
import { reg_quesAnsTabClkEv, reg_preventKeyEvent, reg_eraseEditTbUI ,reg_mDownTdWidthChange, reg_mUpTdWidthChange, 
		reg_mMoveTdWidthChange, reg_selStartTdWidthChange, reg_unitTypeChange ,reg_selectUnitOrTypeData, reg_dressYellowBox, 
		reg_selectFormulaElement, reg_keyEvSelectFormulaElement, reg_selectCheck, reg_removeSelectionBackColor, 
		reg_dressSelectionBackColor, reg_tbCellMouseUp, reg_tbCellCopy, reg_tbSelBackgroundRemove, reg_tbPasteInPastePrevent, reg_tbCellKeyUp
		,reg_tbPastePrevent, reg_nbComplie, reg_undoInitialize} from 'js/contents/register/contents_reg';


const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansSolTab',tabName:'해설 및 정답', className:""}];
const formulaTabList = [{id:'mainFormulaTap',tabName:'기본수식(alt단축키)', className:"formulaTap selectedTab"}, {id:'highFormulaTap',tabName:'기타 수식', className:"formulaTap"}, {id:'etcFormulaTap',tabName:'기타 기호', className:"formulaTap"}];
let shortCutKeyList;

let conImgName="N";	//컨텐츠 이미지 존재 여부
let solImgName="N";	//해설 이미지 존재 여부
const FormulaEditor = ({contentsNo}) => {
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

	const[userNo, setUserNo] = useState("");

	const removeAddedEvent = () => {
		window.removeEventListener('mousedown', reg_mDownTdWidthChange);
		window.removeEventListener('mousemove', reg_mMoveTdWidthChange);
		window.removeEventListener('mouseup', reg_mUpTdWidthChange);
		window.removeEventListener('selectstart', reg_selStartTdWidthChange);
		window.removeEventListener('scroll', topMenuFixed);
		window.removeEventListener('resize', topMenuWidth);
		window.removeEventListener('mousedown', reg_removeSelectionBackColor);
		window.removeEventListener('mouseup', reg_tbCellMouseUp);
		document.removeEventListener('copy', reg_tbCellCopy);
		window.removeEventListener('mousedown', reg_tbSelBackgroundRemove);
		window.removeEventListener('mouseup', reg_selectFormulaElement);
        document.body.removeEventListener('click',reg_eraseEditTbUI);		//EditTableInnerUi에서 추가된 표 추가ui 표 이외 요소 클릭이벤트 제거
    	//이미지 및 파일 복붙 금지
		let contentEditDiv = document.querySelectorAll('[contenteditable]');
		for(let i=0; i<contentEditDiv.length; i++){
			contentEditDiv[i].removeEventListener('paste', pastePreventFile);
		}

		window.shortCutKeyList = null;

		//undo 초기화
		reg_undoInitialize();
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
		let isFileExist = false;
		for(let i=0; i<event.clipboardData.items.length; i++){
			let file = event.clipboardData.items[i].getAsFile();
			if(file !== null){
				let fileName = file.name.split(".")
				let fileExtension = fileName[1].toUpperCase()
				if(fileExtension === "PNG" || fileExtension === "JPG" || fileExtension === "JPEG" || fileExtension === "GIF" ||
					fileExtension === "BMP"){
					alert("이미지 파일의 경우 이미지 첨부 버튼을 클릭하여 이미지를 첨부 해주시기 바랍니다.(외부 프로그램의 텍스트 또한 첨부가 불가합니다.)");
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

	const multiChoiceGridSet = () => {
		let multiGrid = document.getElementById("multi-show");
		multiGrid.classList.remove("oneDivGrid");
		multiGrid.classList.remove("twoDivGrid");
		multiGrid.classList.remove("threeDivGrid");

		let maxWidth = document.getElementsByClassName("firDiv")[0].offsetWidth;
		if(maxWidth < document.getElementsByClassName("secDiv")[0].offsetWidth) maxWidth = document.getElementsByClassName("secDiv")[0].offsetWidth
		if(maxWidth <document.getElementsByClassName("thrDiv")[0].offsetWidth) maxWidth = document.getElementsByClassName("thrDiv")[0].offsetWidth
		if(maxWidth < document.getElementsByClassName("fourDiv")[0].offsetWidth) maxWidth = document.getElementsByClassName("fourDiv")[0].offsetWidth
		if(maxWidth < document.getElementsByClassName("fifDiv")[0].offsetWidth) maxWidth = document.getElementsByClassName("fifDiv")[0].offsetWidth

		if(maxWidth<170 && maxWidth>90)  document.getElementById("multi-show").classList.add("twoDivGrid");
		else if(maxWidth<=90) multiGrid.classList.add("threeDivGrid");
		else multiGrid.classList.add("oneDivGrid");
	}


	const customImgUpld = async (targetId) =>{
		let updtImg = false;
		if((targetId === "contentsImg" && conImgName!=="N" ) 
			|| (targetId === "solutionImg" && solImgName!=="N") ){
			updtImg = await window.confirm("등록된 이미지를 삭제하고 새로운 이미지를 등록하시겠습니까?");
			if(updtImg){
				let formData = new FormData();
				formData.append("userNo",userNo);
				formData.append("contentsNo",contentsNo)
				formData.append("conOrSol",targetId)
				let returnObj = await nb_formDataFetch("/mathInfo/delConOrSolImg",formData, true);

				if(returnObj.updateCond === -1) {
					return false;
				}
				else if(returnObj.updateCond !== 1){
					alert("정상적으로 처리가 완료되지 않았습니다.\n새로고침 후 다시한번 처리해주세요.")
					return false;
				}else{
					if(targetId === "contentsImg"){
						nb_imgFileDel("contentsImgOutput", "contentsImg");
						conImgName="N";
					} 
					else if(targetId === "solutionImg"){
						nb_imgFileDel("solutionImgOutput", "solutionImg");
						solImgName="N";
					} 
				}
				document.getElementById("imgUpdt").value = "Y";
				document.getElementById(targetId).click()
			} 
		}else{
			document.getElementById(targetId).click();
		}
	}

	const imgFileDel = async (outputId, fileTagId) => {  //outputId는 출력 dom
		if((outputId==="contentsImgOutput" && conImgName!=="N") 
			|| (outputId==="solutionImgOutput" && solImgName!=="N") ){
			if(window.confirm("등록된 이미지를 삭제하시겠습니까?")){
				
				if(outputId === "contentsImgOutput"){
					let formData = new FormData();
					formData.append("userNo",userNo);
					formData.append("contentsNo",contentsNo)
					formData.append("conOrSol","contentsImg")
					let returnObj = await nb_formDataFetch("/mathInfo/delConOrSolImg",formData, true);
					if(returnObj.updateCond === -1) {
						return false;
					 }
					else if(returnObj.updateCond !== 1){
						alert("정상적으로 처리가 완료되지 않았습니다.\n새로고침 후 다시한번 처리해주세요.")
						return false;
					}else{
						nb_imgFileDel("contentsImgOutput", "contentsImg");
						conImgName="N";
					}
					document.getElementById("imgUpdt").value = "Y";
				} 
				else{
					let formData = new FormData();
					formData.append("userNo", userNo);
					formData.append("contentsNo",contentsNo)
					formData.append("conOrSol","solutionImg")
					let returnObj = await nb_formDataFetch("/mathInfo/delConOrSolImg",formData, true);
					if(returnObj.updateCond === -1) {
						return false;
					 }
					else if(returnObj.updateCond !== 1){
						alert("정상적으로 처리가 완료되지 않았습니다.\n새로고침 후 다시한번 처리해주세요.");
						return false;
					}else{
						nb_imgFileDel("solutionImgOutput", "solutionImg");
						solImgName="N";
					}
					document.getElementById("imgUpdt").value = "Y";
				} 
			}else{
				return;
			}
		}

		document.getElementById(fileTagId).value= "";
		
		let output = document.getElementById(outputId);
		output.src = "";
		output.classList.add('hide');
	  }

	  const loadFile = async (event, outputId, contentsNo) => {	//outputId는 출력 dom
		let reader = new FileReader();
		let output = document.getElementById(outputId);
		reader.onload = async function(){
		  output.src = reader.result;
		};
		if(event.target.files[0]==undefined) return false;     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
	
		if(contentsNo!== undefined){
		  let targetId = event.target.id
		  let formData = new FormData();
		  formData.append("userNo",userNo);
		  formData.append("contentsNo",contentsNo);
		  formData.append(targetId, event.target.files[0])
		  let returnObj = await nb_formDataFetch("/mathInfo/changeConOrSolImg",formData, true);
		  document.getElementById("imgUpdt").value = "Y";
		  reader.readAsDataURL(event.target.files[0]);
		  output.classList.remove('hide');
		  if(returnObj.updateCond === -1) {
			await nb_imgFileDel(outputId, event.target.id);
			reader.onload = async function(){
				output.src = "";
			};
			if(targetId === "contentsImg") conImgName = "Y";
			else if(targetId === "solutionImg") solImgName = "Y";
			return false;
		  }
		  else if(returnObj.updateCond !== 1) {
			alert("정상적으로 처리가 완료되지 않았습니다.\n새로고침 후 다시한번 처리해주세요.");
			return false;
		  }else{
			  if(targetId === "contentsImg") conImgName = "Y";
			  else if(targetId === "solutionImg") solImgName = "Y";
		  }
		}else{
		  reader.readAsDataURL(event.target.files[0]);
		  output.classList.remove('hide');
		  return "";
		}
		
	  };


	useEffect(() => {
		const asyncUseEffect = async function(){
			let jsonObj = await nb_dataFetch('/mathInfo/takeShortCutKey', true);
			setShortCutKey(jsonObj);
			setIsFetchShotCutKey(true);
			shortCutKeyList = jsonObj["shortCutKey"]
			window.shortCutKeyList = shortCutKeyList;
			if(contentsNo!==undefined) document.getElementById("outerFormulaEditor").addEventListener('scroll', topMenuFixed);
			else window.addEventListener('scroll', topMenuFixed);
			window.addEventListener('resize', topMenuWidth);

			//이미지 및 파일 복붙 금지
			let contentEditDiv = document.querySelectorAll('[contenteditable]');
			for(let i=0; i<contentEditDiv.length; i++){
				contentEditDiv[i].addEventListener('paste', (event) => pastePreventFile(event));
			}

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
			window.addEventListener('mouseup', await reg_selectFormulaElement);
			
			//undo 초기화
			await reg_undoInitialize();

			let myContents;
			//수정모드
			if(contentsNo!==undefined){
				myContents = await nb_dataFetch('/mathInfo/takeMyContents?contentsno='+contentsNo, true);
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

				await multiChoiceGridSet();

				//이미지 file 셋팅 필요(문제 및 정답)
				if(myContents["myContents"].contentsImg !== null){
					document.getElementById("contentsImgOutput").src = myContents["myContents"].imgPath+"/"+myContents["myContents"].contentsImg;
					document.getElementById("contentsImgOutput").classList.remove("hide");
					conImgName = myContents["myContents"].contentsImg;
				}else{
					conImgName="N"
				}
				if(myContents["myContents"].solutionImg !== null){
					document.getElementById("solutionImgOutput").src = myContents["myContents"].solutionImgPath+"/"+myContents["myContents"].solutionImg;
					document.getElementById("solutionImgOutput").classList.remove("hide");
					solImgName = myContents["myContents"].solutionImg;
				}else{
					solImgName="N"
				}

				// 주관식 객관식 마지막 validation에서 처리 필요(X)

				//원본 책
				document.getElementById("originRef").value = myContents["myContents"].originRef;
				document.getElementById("cusOrgRefSelTitle").innerHTML =document.getElementById("originRef")[document.getElementById("originRef").selectedIndex].innerText;
				document.getElementById("cusOrgRefSelDiv").classList.add("nbCustomSelected");

				//원본 문제 번호
				document.getElementById("originNo").value = myContents["myContents"].originNo;
				document.getElementById("originNo").classList.add("customBlueBoxComplete");

				//문제난이도
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
				await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);

				document.getElementById("firUnit").value = myContents["myUnitInfo"].firUnit;
				document.getElementById("cusSelFirUnitTitle").innerHTML =document.getElementById("firUnit")[document.getElementById("firUnit").selectedIndex].innerText;
				document.getElementById("cusSelFirUnitDiv").classList.add("nbCustomSelected");
				trigEv.target.id= "firUnit";
				await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);

				document.getElementById("secUnit").value = myContents["myUnitInfo"].secUnit;
				document.getElementById("cusSelSecUnitTitle").innerHTML =document.getElementById("secUnit")[document.getElementById("secUnit").selectedIndex].innerText;
				document.getElementById("cusSelSecUnitDiv").classList.add("nbCustomSelected");
				trigEv.target.id= "secUnit";
				await reg_unitTypeChange(trigEv, "cusSelThrUnit","thrUnit", true);

				await reg_selectUnitOrTypeData("thrUnit", "cusSelThrUnitTitle",  "cusSelThrUnitDiv", myContents["myContents"].unitUniqNo);
				
				//유형
				setUpdateModeUniqNo(myContents["myUnitInfo"].unitUniqNo+","+myContents["myContents"].typeNo+","+myContents["myContents"].contentsNo);
				//수정시간 서버에서 수정 필요

				//문제제작자
				setUserNo(myContents["myContents"].userNo);
			}
		}

		asyncUseEffect();
		return () => removeAddedEvent();
      },[contentsNo]);

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

	const contentsValidation = async function(){
		//객관식 br태그만 남아있는 경우 제거
		if(document.getElementById("firNoFormulaEditor").childNodes.length===1 && document.getElementById("firNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("firNoFormulaEditor").childNodes[0].remove();
		}
		if(document.getElementById("secNoFormulaEditor").childNodes.length===1 && document.getElementById("secNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("secNoFormulaEditor").childNodes[0].remove();
		}
		if(document.getElementById("thrNoFormulaEditor").childNodes.length===1 && document.getElementById("thrNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("thrNoFormulaEditor").childNodes[0].remove();
		}
		if(document.getElementById("fourNoFormulaEditor").childNodes.length===1 && document.getElementById("fourNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("fourNoFormulaEditor").childNodes[0].remove();
		}
		if(document.getElementById("fifNoFormulaEditor").childNodes.length===1 && document.getElementById("fifNoFormulaEditor").childNodes[0].nodeName==="BR"){
			document.getElementById("fifNoFormulaEditor").childNodes[0].remove();
		}
		let contentsDomLength = document.getElementById("contentsFormulaEditor").innerText.length;
		let firNoDomLength = document.getElementById("firNoFormulaEditor").innerText.length;
		let secNoDomLength = document.getElementById("secNoFormulaEditor").innerText.length;
		let thrNoDomLength = document.getElementById("thrNoFormulaEditor").innerText.length;
		let fourNoDomLength = document.getElementById("fourNoFormulaEditor").innerText.length;
		let fifNoDomLength = document.getElementById("fifNoFormulaEditor").innerText.length;
		
		//문제 validation [start]
		if(contentsDomLength<10){
			alert("문제를 최소 10글자 이상 입력해주시기 바랍니다.");
			return false;
		} 

		//객관식 하나라도 입력되어 있는지 체크
		let multiChoiceOrCheck = (firNoDomLength>0 || secNoDomLength>0 || thrNoDomLength>0 || fourNoDomLength>0 || fifNoDomLength>0);
		//객관식 전부 다 입력되어 있는지 체크
		let multiChoiceAllCheck = (firNoDomLength>0 && secNoDomLength>0 && thrNoDomLength>0 && fourNoDomLength>0 && fifNoDomLength>0);
		//객관식이 하나라도 입력되어있는데 전부 다 입력되지 않은 경우 
		if(multiChoiceOrCheck && !multiChoiceAllCheck){
			alert("객관식 문제인 경우 객관식 보기를 모두 입력해주세요.\n객관식 문제가 아닌 경우 객관식 보기를 모두 지워주세요.");
			return false;
		}
		//문제 validation [end]
		
		document.getElementsByClassName("blindBox")[0].classList.remove("hide");
		document.getElementsByClassName("contentsInfo")[0].classList.remove("hide");
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
			targetDom.classList.add("selectedTab");
		}else if(targetId=="highFormulaTap"){
			document.getElementById("shortKeyBoard").classList.add("hide");
			document.getElementById("shortKeyBoardHigh").classList.remove("hide");
			document.getElementById("shortKeyBoardEtc").classList.add("hide");
			targetDom.classList.add("selectedTab");
		}
		else if(targetId=="etcFormulaTap"){
			document.getElementById("shortKeyBoard").classList.add("hide");
			document.getElementById("shortKeyBoardHigh").classList.add("hide");
			document.getElementById("shortKeyBoardEtc").classList.remove("hide");
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




	const formulaConvert = async (event, shortCutKeyList) => {
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
				document.getElementById("firDiv").classList.add("hide");
			}
			setFirNo(userInputText);
		}
		else if(evIdName=="secNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("secDiv").classList.remove("hide");
			}else{
				document.getElementById("secDiv").classList.add("hide");
			}
			setSecNo(userInputText);
		}
		else if(evIdName=="thrNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("thrDiv").classList.remove("hide");
			}else{
				document.getElementById("thrDiv").classList.add("hide");
			}
			setThrNo( userInputText);
		}
		else if(evIdName=="fourNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("fourDiv").classList.remove("hide");
			}else{
				document.getElementById("fourDiv").classList.add("hide");
			}
			setFourNo(userInputText);
		}
		else if(evIdName=="fifNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("fifDiv").classList.remove("hide");
			}else{
				document.getElementById("fifDiv").classList.add("hide");
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
				<div id="contents-show" className="contents-show">
					<div className="mini-title4">문제</div>
					<div id="ques-show">
						<div dangerouslySetInnerHTML={{__html:contentsText}} onDragStart={ev=>ev.preventDefault()}></div> 
						<div id="quesImg-show" className="quesImg-show">
							<img src="" id="contentsImgOutput" className="hide" onDoubleClick={() => {imgFileDel("contentsImgOutput", "contentsImg", {contentsNo});}} alt="" />
						</div>
						<div id="multi-show">
							<div id="firDiv" className="firDiv hide"><span id="firNoShow" dangerouslySetInnerHTML={{__html:firNo}}></span></div>
							<div id="secDiv" className="secDiv hide"><span id="secNoShow" dangerouslySetInnerHTML={{__html:secNo}}></span></div>
							<div id="thrDiv" className="thrDiv hide"><span id="thrNoShow" dangerouslySetInnerHTML={{__html:thrNo}}></span></div>
							<div id="fourDiv" className="fourDiv hide"><span id="fourNoShow" dangerouslySetInnerHTML={{__html:fourNo}}></span></div>
							<div id="fifDiv" className="fifDiv hide"><span id="fifNoShow" dangerouslySetInnerHTML={{__html:fifNo}}></span></div>
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
								<img src="" id="solutionImgOutput" className="hide" onDoubleClick={() => imgFileDel("solutionImgOutput", "solutionImg", {contentsNo})} alt="" />
							</div>
							<div className="paddingLFive" dangerouslySetInnerHTML={{__html:solutionText}}></div> 

						</div>
					</div>
				</div>
			</div>
			<div className="right">
				<div id="topShortkeyDiv">
				<TabButton className="formulaTabButton" tabList={formulaTabList} clickEv={formularTabSelect}></TabButton>
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoard" keyName="shortCutKey" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor}/>}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardHigh" keyName="shortCutKeyHigh1" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardEtc" keyName="shortCutKeyEtc" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				</div>
				<div>
					<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={reg_quesAnsTabClkEv}></TabTable>
				</div>
				<NbWebEditor parentMethod={showFormulaEditor}></NbWebEditor>
                <div id="contentsFormulaEditor" className="contentsFormulaEditor contentEditClass onlyEdit" contentEditable="true" placeholder="문제를 입력해주세요..." onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_tbCellKeyUp(event);reg_nbComplie(event);}} onClick={()=>{reg_dressYellowBox();}} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>{reg_tbPasteInPastePrevent(event)}}></div>
                <div id="solutionFormulaEditor" className="solutionFormulaEditor contentEditClass onlyEdit hide" contentEditable="true" placeholder="해설을 입력해주세요..." onKeyDown={(event) => reg_preventKeyEvent(event)}  onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_tbCellKeyUp(event);reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}}  onPaste={(event)=>{reg_tbPasteInPastePrevent(event)}}></div>
				
                <textarea id="contents" className="contents hide" name="contents" defaultValue={contentsText}></textarea>
				<textarea id="solution" className="solution hide" name="solution" defaultValue={solutionText}></textarea>
				
                <div id="contentsOptBox" className="contentsOptBox marginTen">
					<div className="mini-title marginBox">
						<span id="cusConUpldBtn" className="uploadBtn" onClick={()=>{customImgUpld("contentsImg")}}>문제 이미지 첨부</span> 
						<span className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</span>
						<input id="contentsImg" name="contentsImg" type="file" accept="image/*" className="hide" onChange={(event)=>{nb_extensionCheck(event, "contentsImgOutput", contentsNo); loadFile(event, "contentsImgOutput", contentsNo);nb_addClass("contentsImgOutput","marginTopTenAuto")}} />
					</div>
					<div className="mini-title">객관식 보기(선택)</div>
					<div id="multiChoiceBox" className="multiChoiceBox">
						<div id="firNoFormulaEditor" contentEditable="true" className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);multiChoiceGridSet();reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
						<div id="secNoFormulaEditor" contentEditable="true" className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);multiChoiceGridSet();reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
						<div id="thrNoFormulaEditor" contentEditable="true" className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);multiChoiceGridSet();reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
						<div id="fourNoFormulaEditor" contentEditable="true" className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);multiChoiceGridSet();reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
						<div id="fifNoFormulaEditor" contentEditable="true" className="multiChoiceView contentEditClass onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);multiChoiceGridSet();reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
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
					<div className="mini-title marginBox">
						<span id="cusSolUpldBtn" className="uploadBtn" onClick={()=>{customImgUpld("solutionImg")}}>해설 이미지 첨부</span> 
						<span className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</span>
						<input id="solutionImg" name="solutionImg" accept="image/*" type="file" className="hide" onChange={(event)=>{nb_extensionCheck(event, "solutionImgOutput", contentsNo); loadFile(event, "solutionImgOutput", contentsNo);nb_addClass("solutionImgOutput","marginTopTenAuto")}} />
					</div>
					<div className="mini-title">정답</div>
					<div>
						<div className="mini-title2">주관식 정답</div> 
						<div id="answerFormulaEditor" className="answerFormulaEditor contentEditClass onlyEdit" contentEditable="true" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_keyEvSelectFormulaElement(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
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
		<InputQuestionInfo parentMethod={initFormElement} updateModeUniqNo={updateModeUniqNo} userNo={userNo}/>
		</form>
	</>
  );
};

export default FormulaEditor;