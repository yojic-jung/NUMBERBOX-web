import {React, useState, useEffect} from "react";
import FormulaShortCutKey from './FormulaShortCutKey';
import FormulaShortCutKeyEtc from './FormulaShortCutKeyEtc';
import TabTable from 'web/common/TabTable'
import MsbWebEditor from 'web/contents/register/MsbWebEditor'
import InputQustionInfo from 'web/contents/register/InputQustionInfo';
import {msb_topMenuFixed, msb_dataFetch,msb_loadFile, msb_imgFileDel, msb_addClass, msb_extensionCheck, msb_getCheckedVal} from 'js/common/common_msb.js';
import {reg_threeDivGridChk , reg_quesAnsTabClkEv, reg_getMappingShortCutKey} from 'js/contents/register/contents_reg';


const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansSolTab',tabName:'해설 및 정답', className:""}];
const formulaTabList = [{id:'mainFormulaTap',tabName:'기본수식(alt단축키)', className:"formulaTap selectedTab"}, {id:'etcFormulaTap',tabName:'기타 기호', className:"formulaTap"}];
let shortCutKeyList;
const FormulaEditor = () => {
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
	const[shortCutKeyEtc, setShortCutKeyEtc] = useState("");
	const[isFetchShotCutKey, setIsFetchShotCutKey] = useState(false);

	useEffect(async () => {
		let jsonObj = await msb_dataFetch('/takeShortCutKey', false);
		setShortCutKey(jsonObj);
		setShortCutKeyEtc(jsonObj);
		setIsFetchShotCutKey(true);
		shortCutKeyList = jsonObj["shortCutKey"]

		const targetDomWidth =  document.getElementById("shortKeyBoard").offsetWidth;
		window.addEventListener('scroll', ()=>{
			msb_topMenuFixed("shortKeyBoard", targetDomWidth)
		})
		window.addEventListener('scroll', ()=>{
			msb_topMenuFixed("shortKeyBoardEtc", targetDomWidth)
		})
      },[]);



	const preventAltEvent = async (event) => {
		if(event.altKey) event.preventDefault();
	}

	const getCheckedVal = async function(event){
		setMultiAnswerText(await msb_getCheckedVal(event));
	}


	const contentsValidation = async function(){
		let contentsDomLength = document.getElementById("contentsFormulaEditor").innerText.length;
		let firNoDomLength = document.getElementById("firNoFormulaEditor").innerText.length;
		let secNoDomLength = document.getElementById("secNoFormulaEditor").innerText.length;
		let thrNoDomLength = document.getElementById("thrNoFormulaEditor").innerText.length;
		let fourNoDomLength = document.getElementById("fourNoFormulaEditor").innerText.length;
		let fifNoDomLength = document.getElementById("fifNoFormulaEditor").innerText.length;
		
		let solutionDomLength = document.getElementById("solutionFormulaEditor").innerText.length;
		let answerDomLength = document.getElementById("answerFormulaEditor").innerText.length;

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
		
		//해설 validation [start]
		if(solutionDomLength>0 && answerDomLength == 0){
			alert("해설을 입력한 경우 주관식 정답을 반드시 적어주세요.\n객관식 문제인 경우에도 주관식 정답을 입력해주시기 바랍니다.");
			return false;
		}
		//해설 validation [end]

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
			document.getElementById("shortKeyBoardEtc").classList.add("hide");
			targetDom.classList.add("selectedTab");
		}else if(targetId=="etcFormulaTap"){
			document.getElementById("shortKeyBoard").classList.add("hide");
			document.getElementById("shortKeyBoardEtc").classList.remove("hide");
			targetDom.classList.add("selectedTab");
		}
		
	}


	const formulaConvert = async (event, shortCutKeyList) => {
		let evIdName = event.target.id
		event.stopPropagation();

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

		const mappingKey = await reg_getMappingShortCutKey(event, shortCutKeyList);
		if(mappingKey!= null){      //alt 단축키 사용한 경우
			let msbGrammer = mappingKey[0]["msbGrammer"];

			//현재 포커스에 단축키 수식 추가
            const selection = document.getSelection();
            const newRange = selection.getRangeAt(0);
            selection.removeAllRanges();
            selection.addRange(newRange);
            let tmpNode= document.createElement('span');
            tmpNode.innerHTML = msbGrammer;
            newRange.deleteContents();
            newRange.insertNode(tmpNode);
			window.getSelection().collapseToEnd();		//셀렉션객체의 마지막 부분에 포커스 맞춤
		}

		await showFormulaEditor(evIdName);
	}

	const showFormulaEditor = async function(evIdName){
		let userInputText = document.getElementById(evIdName).innerHTML.trim();
		let userInnerText = document.getElementById(evIdName).innerText;
		console.log(userInputText);
		console.log(userInnerText);
		console.log(JSON.stringify(userInnerText));
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
				document.getElementById("firNoShow").classList.remove("hide");
			}else{
				document.getElementById("firNoShow").classList.add("hide");
			}
			setFirNo(userInputText);
		}
		else if(evIdName=="secNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("secNoShow").classList.remove("hide");
			}else{
				document.getElementById("secNoShow").classList.add("hide");
			}
			setSecNo(userInputText);
		}
		else if(evIdName=="thrNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("thrNoShow").classList.remove("hide");
			}else{
				document.getElementById("thrNoShow").classList.add("hide");
			}
			setThrNo( userInputText);
		}
		else if(evIdName=="fourNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("fourNoShow").classList.remove("hide");
			}else{
				document.getElementById("fourNoShow").classList.add("hide");
			}
			setFourNo(userInputText);
		}
		else if(evIdName=="fifNoFormulaEditor"){
			if(userInnerText.length!=0){
				document.getElementById("fifNoShow").classList.remove("hide");
			}else{
				document.getElementById("fifNoShow").classList.add("hide");
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
		<div className="twoFlexLayout">
			<div className="left">
				<div className="latex-show" id="latex-show">
					<div id="ques-show">
						<div className="mini-title4">[문제]</div>
						<div dangerouslySetInnerHTML={{__html:contentsText}}></div> 
						<div id="quesImg-show">
							<img src="" id="contentsImgOutput" onDoubleClick={() => msb_imgFileDel("contentsImgOutput", "contentsImg")} alt="" />
						</div>
						<div id="multi-show">
							<div><span id="firNoShow" className="hide">&#9312;</span><span dangerouslySetInnerHTML={{__html:firNo}}></span></div>
							<div><span id="secNoShow" className="hide">&#9313;</span><span dangerouslySetInnerHTML={{__html:secNo}}></span></div>
							<div><span id="thrNoShow" className="hide">&#9314;</span><span dangerouslySetInnerHTML={{__html:thrNo}}></span></div>
							<div><span id="fourNoShow" className="hide">&#9315;</span><span dangerouslySetInnerHTML={{__html:fourNo}}></span></div>
							<div><span id="fifNoShow" className="hide">&#9316;</span><span dangerouslySetInnerHTML={{__html:fifNo}}></span></div>
						</div>
					</div>
					
					<div id="sol-show">
						<div className="mini-title4">[해설]</div>
						<div dangerouslySetInnerHTML={{__html:solutionText}}></div> 
						<div id="quesImg-show">
							<img src="" id="solutionImgOutput" onDoubleClick={() => msb_imgFileDel("solutionImgOutput", "solutionImg")} alt="" />
						</div>
					</div>
					
					<div id="ans-show">
						<span className="mini-title4">[정답]</span>&nbsp;
						<div>
							<span dangerouslySetInnerHTML={{__html:multiAnswerText}}></span>
							<span dangerouslySetInnerHTML={{__html:answerText}}></span>
						</div>
					</div>
				</div>
			</div>
			<div className="right">
				<TabTable className="formulaTabTable" tabList={formulaTabList} clickEv={formularTabSelect}></TabTable>
				{ isFetchShotCutKey && <FormulaShortCutKey parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor}/>}
				{ isFetchShotCutKey && <FormulaShortCutKeyEtc parentShortCutKey={shortCutKeyEtc} parentMethod={showFormulaEditor}/>}
				<div>
					<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={reg_quesAnsTabClkEv}></TabTable>
				</div>
				<MsbWebEditor parentMethod={showFormulaEditor}></MsbWebEditor>
                <div id="contentsFormulaEditor" className="contentsFormulaEditor onlyEdit" contentEditable="true" role="textbox" placeholder="문제를 입력해주세요..." onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);}}></div>
                <div id="solutionFormulaEditor" className="solutionFormulaEditor onlyEdit hide" contentEditable="true" placeholder="해설을 입력해주세요..." onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => formulaConvert(event, shortCutKeyList)}></div>
				
                <textarea id="contents" className="contents hide" name="contents" defaultValue={contentsText}></textarea>
				<textarea id="solution" className="solution hide" name="solution" defaultValue={solutionText}></textarea>
				
                <div id="contentsOptBox" className="contentsOptBox marginTen">
					<div className="mini-title">문제 이미지 첨부 <input id="contentsImg" name="contentsImg" type="file" accept="image/*" onChange={(event)=>{msb_extensionCheck(event, "contentsImgOutput");msb_loadFile(event, "contentsImgOutput");msb_addClass("contentsImgOutput","marginTenAuto")}} /></div>
					<div className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="mini-title">객관식 보기(선택)</div>
					<div id="multiChoiceBox" className="multiChoiceBox">
						<div id="firNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="secNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="thrNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="fourNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="fifNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
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
					<div className="mini-title">해설 이미지 첨부 <input id="solutionImg" name="solutionImg" accept="image/*" type="file" onChange={(event)=>{msb_extensionCheck(event, "solutionImgOutput");msb_loadFile(event, "solutionImgOutput");msb_addClass("solutionImgOutput","marginTenAuto")}} /></div>
					<div className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="mini-title">정답</div>
					<div>
						<div className="mini-title2">주관식 정답(필수)</div> 
						<div className="mini-desc marginLeftFive">객관식 문제의 경우 번호를 제외한 주관식 정답까지 입력해주세요.(복수개의 경우 쉼표로 구분)</div>
						<div id="answerFormulaEditor" className="answerFormulaEditor onlyEdit" contentEditable="true" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => formulaConvert(event, shortCutKeyList)}></div>
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
		<InputQustionInfo/>
		</form>
	</>
  );
};

export default FormulaEditor;