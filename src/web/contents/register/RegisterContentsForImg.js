import React, { useState, useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import {Link} from "react-router-dom";
import FormulaShortCutKey from './FormulaShortCutKey';
import imgPlus2 from 'img/plus2.png';
import questionMark from 'img/question-mark.png';
import regForImgEx1 from 'img/regForImgEx1.PNG';
import regForImgEx2 from 'img/regForImgEx2.PNG';
import TabButton from 'web/common/TabButton'
import RegisterContentsInfo from 'web/contents/register/RegisterContentsInfo';
import "css/common/common.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";
import {nb_isLogin, nb_formDataFetch, nb_dataFetch, nb_addClass, nb_fadeInOut, nb_extensionCheck2, nb_imgFileDel} from 'js/common/common_nb.js';
import {reg_preventKeyEvent,  reg_dressYellowBox,  reg_newSelectFormulaElement, reg_selectCheck, reg_selectUnitOrTypeData,
    reg_dressSelectionBackColor, reg_tbPastePrevent, reg_nbComplie, reg_removeResizeFrame, reg_unitTypeChange, reg_formulaTapMoveEv} from 'js/contents/register/contents_reg';

let conImgName="N";	//컨텐츠 이미지 존재 여부
let solImgName="N";	//해설 이미지 존재 여부
const formulaTabList = [{id:'mainFormulaTap',tabName:'기본수식(alt단축키)', className:"formulaTap selectedTab"}, {id:'highFormulaTap',tabName:'기타 수식(alt+shift 단축키)', className:"formulaTap"}, {id:'etcFormulaTap',tabName:'기타 기호(alt+shift+ctrl 단축키)', className:"formulaTap"}];
let shortCutKeyList;
const RegisterContentsForImg = ({contentsNo})=>{
    const[isFetchShotCutKey, setIsFetchShotCutKey] = useState(false);
    const[shortCutKey, setShortCutKey] = useState("");
    const [answerText, setAnswerText] = useState("");		// 사용자 입력 정답
	const[updateModeUniqNo, setUpdateModeUniqNo] = useState("");
	

	const removeAddedEvent = () => {
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

		//undo 초기화
	}
	

    useEffect(() => {
        const asyncUseEffect = async function(){
            let jsonObj = await nb_dataFetch('/mathInfo/takeShortCutKey', true);
			setShortCutKey(jsonObj);
			setIsFetchShotCutKey(true);
			shortCutKeyList = jsonObj["shortCutKey"]
			window.shortCutKeyList = shortCutKeyList;
			window.shortCutKeyHigh1 = jsonObj["shortCutKeyHigh1"];
			window.shortCutKeyEtc = jsonObj["shortCutKeyEtc"];
			window.addEventListener('scroll', reg_removeResizeFrame);
			window.addEventListener("keydown", reg_formulaTapMoveEv)
			//수식요소 마우스 셀렉트 규칙
			window.addEventListener('mouseup', await reg_newSelectFormulaElement);
			let myContents;
			if(contentsNo!==undefined){
				document.getElementById("makeContentsLinkDiv").classList.add("hidden");
				myContents = await nb_dataFetch('/mathInfo/takeContentsByContentsNo?contentsno='+contentsNo, true);
				
				if(myContents.existMsg){
					document.getElementById("saveBtn").remove();
					return;
				}
				setAnswerText(myContents["myContents"].answer);
				document.getElementById("answerFormulaEditor").innerHTML = myContents["myContents"].answer;

				let choiceAnswers = document.getElementsByName("choiceAnswer");
				let choiceAnswerShowVal;
				if(myContents["myContents"].choiceAnswer != null){
					for(let i=0; i<choiceAnswers.length; i++){
						if(myContents["myContents"].choiceAnswer.indexOf(choiceAnswers[i].value)>-1){
							choiceAnswers[i].checked =true;
							if(choiceAnswerShowVal=== undefined) choiceAnswerShowVal = choiceAnswers[i].value;
							else choiceAnswerShowVal += ","+choiceAnswers[i].value;

						}
					}
				}


				//이미지 file 셋팅 필요(문제 및 정답)
				if(myContents["myContents"].contentsImg !== null){
					document.getElementById("conImgOutput").src = myContents["myContents"].imgPath+"/"+myContents["myContents"].contentsImg;
					conImgName = myContents["myContents"].contentsImg;
				}
				if(myContents["myContents"].solutionImg !== null){
					document.getElementById("solImgOutput").src = myContents["myContents"].solutionImgPath+"/"+myContents["myContents"].solutionImg;
					solImgName = myContents["myContents"].solutionImg;
				}
				// 주관식 객관식 마지막 validation에서 처리 필요(X)
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
				setUpdateModeUniqNo(myContents["myUnitInfo"].unitUniqNo+","+myContents["myContents"].typeNo+","+myContents["myContents"].contentsNo);
				//수정시간 서버에서 수정 필요

			}else{
				conImgName = "N";
				solImgName = "N";
			}
        }
        asyncUseEffect();
		return () => removeAddedEvent();
    },[contentsNo]);

	
	
    

    const formulaConvert = async (event) => {
		await reg_dressYellowBox();
        setAnswerText(document.getElementById(event.target.id).innerHTML);
	}

    const initFormElement = async function(){
		setAnswerText("");
		document.getElementById("contentsImg").value= "";
		document.getElementById("solutionImg").value= "";
		document.getElementById("conImgOutput").src = imgPlus2;
		document.getElementById("solImgOutput").src = imgPlus2;
		await nb_fadeInOut("정상적으로 등록되었습니다.\n나의 제작문제 페이지에서 확인할 수 있습니다.", 2500);
		if(contentsNo!== undefined) document.getElementById("modalFormulCloseBtn").click();
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


    const customImgUpld = async (targetId) =>{
		let updtImg = false;
		if((targetId === "contentsImg" && conImgName!=="N" ) 
			|| (targetId === "solutionImg" && solImgName!=="N") ){
				updtImg = await window.confirm("등록된 이미지를 삭제하고 새로운 이미지를 등록하시겠습니까?");
				if(updtImg) document.getElementById(targetId).click();
		}else{
			document.getElementById(targetId).click();
		}
		
	}

    const loadFile = async (event, outputId, contentsNo) => {	//outputId는 출력 dom
		let reader = new FileReader();
		let output = document.getElementById(outputId);
		reader.onload = async function(){
		  output.src = reader.result;
		};

		if(event.target.files[0] === undefined ){
			if(contentsNo === undefined) document.getElementById(outputId).src = imgPlus2;
			return false;     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
		} 
	
		if(contentsNo!== undefined){
		  let targetId = event.target.id
		  let targetName = event.target.name
		  let formData = new FormData();
		  formData.append("contentsNo",contentsNo);
		  formData.append(targetName, event.target.files[0])
		  let returnObj = await nb_formDataFetch("/mathInfo/changeConOrSolImg",formData, true);
		  window.mathContents = returnObj.mathContents;	//윈도우 전역변수로 객체 전달
		  document.getElementById("imgUpdt").value = "Y";
		  reader.readAsDataURL(event.target.files[0]);
		  output.classList.remove('hide');
		  if(returnObj.updateCond === -1) {
			await nb_imgFileDel(outputId, event.target.id);
			reader.onload = async function(){
				output.src = imgPlus2;
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


      const contentsValidation = async function(){
		if(!nb_isLogin()) {
			alert("로그인 이후 사용해주시기 바랍니다.");
			return;
		}

		if(contentsNo === undefined && document.getElementById("contentsImg").files[0] ===  undefined){
			alert("문제 이미지를 등록하여 주시기 바랍니다.");
			return;
		}
		
		document.getElementById("formulaEditBlindBox").classList.remove("hide");
		document.getElementById("contentsInfo").classList.remove("hide");
	}

  return (
    <>
		<Helmet>
          <title>이미지 문제 등록</title>
          <link rel="canonical" href="https://nsoohak.com/makeContentsForImg" />
          <meta property="og:title" content="이미지 문제 등록" />
          <meta property="og:description" content="이미지 파일의 문제를 등록 해보세요!" />
      </Helmet>
      <div id="registerQuestion">
      <form method="post" id="contentsForm" encType="multipart/form-data">
      <div className="rightAbsolBox marginTen">
			<div id="saveBtn" className="nabyBox" onClick={()=>{contentsValidation()}}>저장하기</div>
		</div>
        <div className="registerForImgWrap">
			<div id="makeContentsLinkDiv" className="makeContentsLinkDiv">
			<Link className='linkNoneCss' to="/makeContents">
						<div className="relative">
							<div className="makeContentsBtn"></div>
							<div className="makeContentsForImgBtnDesc">문제 직접 만들기</div>
						</div>
					</Link>
					<Link className='linkNoneCss' to="/makeContentsForImg">
						<div className="relative">
							<div className="makeContentsForImgBtn active"></div>
							<div className="makeContentsForImgBtnDesc">이미지로 등록하기</div>
						</div>
					</Link>
			</div>
			<div>
				<div id="topShortkeyDiv" className='shortCutKeyDivForImgReg'>
						<TabButton className="formulaTabButton" tabList={formulaTabList} clickEv={formularTabSelect}></TabButton>
						{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoard" keyName="shortCutKey" parentShortCutKey={shortCutKey} parentMethod={()=>{}} />}
						{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardHigh" keyName="shortCutKeyHigh1" parentShortCutKey={shortCutKey} parentMethod={()=>{}} />}
						{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardEtc" keyName="shortCutKeyEtc" parentShortCutKey={shortCutKey} parentMethod={()=>{}} />}
				</div>
				<div>
					<table className='regContensForImgTB'>
						<tbody>
							<tr>
								<td className='regContensForImgTbHeaderTd first relative'colSpan={2}>
									<span className='answerDistinctDesc'>주관식, 객관식 문제의 구분에 따라 정답을 입력해주세요.</span>
									<img className='questionMark rightPosition' src={questionMark} alt="도움말" onClick={()=>{document.getElementById("regForImgExampleBox").classList.remove("hide")}}/>
								</td>
							</tr>
							<tr>
								<td className='regContensForImgTbHeaderTd'>
									<div className='regAnswerWrap'>
										<div className="mini-title2">주관식 정답 &nbsp;&nbsp;</div>
										<div className='answerWrapForImg'>
											<div id="answerFormulaEditor" className="answerFormulaEditor contentEditClass onlyEdit forImg" contentEditable="true" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event);reg_dressSelectionBackColor();reg_nbComplie(event);}} onClick={()=>reg_dressYellowBox()} onMouseDown={()=>{reg_selectCheck()}} onPaste={(event)=>reg_tbPastePrevent(event)}></div>
											<textarea type="text" id="answer" name="answer" className="hide" defaultValue={answerText}></textarea>
										</div>
									</div>
								</td>
								<td className='regContensForImgTbHeaderTd'>
									<div className='regAnswerWrap'>
										<div className="mini-title2">객관식 정답 </div>
										<div>
											<input type="checkbox" name="choiceAnswer" id="multiAns1" className="multiAnsInput hide" value="&#9312;"/>
											<label className="circleBox" htmlFor="multiAns1">&#9312;</label>
											
											<input type="checkbox" name="choiceAnswer" id="multiAns2" className="multiAnsInput hide" value="&#9313;"/>
											<label className="circleBox" htmlFor="multiAns2">&#9313;</label>
											
											<input type="checkbox" name="choiceAnswer" id="multiAns3" className="multiAnsInput hide" value="&#9314;"/>
											<label className="circleBox" htmlFor="multiAns3">&#9314;</label>
											
											<input type="checkbox" name="choiceAnswer" id="multiAns4" className="multiAnsInput hide" value="&#9315;"/>
											<label className="circleBox" htmlFor="multiAns4">&#9315;</label>
											
											<input type="checkbox" name="choiceAnswer" id="multiAns5" className="multiAnsInput hide" value="&#9316;"/>
											<label className="circleBox" htmlFor="multiAns5">&#9316;</label>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td className='regContensForImgTbContents'>
									<div className='marginTen'>문제</div>
									<div className='alignCenter'><img id="conImgOutput" className='regContentsImg' src={imgPlus2} alt="문제등록" onClick={()=>{customImgUpld("contentsImg")}}/></div>
									<input id="contentsImg" name="contentsImgFile" type="file" accept="image/*" className="hide" onChange={(event)=>{nb_extensionCheck2(event, "conImgOutput", contentsNo); loadFile(event, "conImgOutput", contentsNo);nb_addClass("conImgOutput","marginTopTenAuto")}} />
								</td>
								<td className='regContensForImgTbSolution relative'>
									<div className='marginTen'>해설</div>
									<div className='alignCenter'><img id="solImgOutput" className='regSolutionImg' src={imgPlus2} alt="해설등록" onClick={()=>{customImgUpld("solutionImg")}}/></div>
									<input id="solutionImg" name="solutionImgFile" type="file" accept="image/*" className="hide" onChange={(event)=>{nb_extensionCheck2(event, "solImgOutput", contentsNo); loadFile(event, "solImgOutput", contentsNo);nb_addClass("solImgOutput","marginTopTenAuto")}} />
									{contentsNo!==undefined && <div className='imgChangeDesc'>이미지를 클릭하여 새로운 이미지로 변경할 수 있습니다.</div>}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
        </div>
        <div className="scrollFixBugMargin"></div>
		<RegisterContentsInfo parentMethod={initFormElement} updateModeUniqNo={updateModeUniqNo} contentsClassify={1} isOnlyImgReg={true}/>
		</form>

		<div id="regForImgExampleBox" className='blindBox hide'>
			<div className='regForImgExampleDiv'>
				<div id="regForImgExCloseBtn" className="closeBtn" onClick={()=>{document.getElementById("regForImgExampleBox").classList.add("hide")}}>X</div>
				<div className='regForImgExampleDivTitle'>이미지로 등록하여 학습지에 사용하거나 다른 사용자와 공유해보세요!</div>
				<div className='regForImgExampleDivDesc'>
					tip1. 문제 번호와 여백을 제거하고 등록하면 학습지 제작시 다른 문제들과 함께 출력하기 용이합니다.<br/>
					tip2. 문서파일에 있는 문제를 캡쳐하여 등록하는 경우 확대 후 캡쳐하면 화질이 더욱 깔끔합니다.
				</div>
				<div className='regForImgExampleWrap'>
					<div>
						<div className='regForImgExTitle'>문제 이미지 예시</div>
						<img className='regForImgExampleImg' src={regForImgEx1} alt="문제예시" />
					</div>
					<div>
						<div className='regForImgExTitle'>해설 이미지 예시</div>
						<img className='regForImgExampleImg' src={regForImgEx2} alt="해설예시" />
					</div>
				</div>
			</div>
		</div>
		
      </div>
    </>
  );
}

export default RegisterContentsForImg;