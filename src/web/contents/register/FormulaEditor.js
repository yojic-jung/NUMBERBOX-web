import {React, useState, useEffect} from "react";
import FormulaShortCutKey from './FormulaShortCutKey';
import FormulaShortCutKeyEtc from './FormulaShortCutKeyEtc';
import TabTable from 'web/common/TabTable'
import MsbWebEditor from 'web/contents/register/MsbWebEditor'
import InputQustionInfo from 'web/contents/register/InputQustionInfo';
import {msb_dataFetch,msb_loadFile, msb_imgFileDel, msb_addClass, msb_extensionCheck, msb_getCheckedVal} from 'js/common/common_msb.js';
import {reg_threeDivGridChk , reg_quesAnsTabClkEv, reg_getMappingShortCutKey} from 'js/contents/register/contents_reg';


const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansSolTab',tabName:'해설 및 정답', className:""}];
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
      },[]);



	const preventAltEvent = async (event) => {
		if(event.altKey) event.preventDefault();
	}

	const getCheckedVal = async function(event){
		setMultiAnswerText(await msb_getCheckedVal(event));
	}


	const saveContents = async function(){
		document.getElementsByClassName("blindBox")[0].classList.remove("hide");
		document.getElementsByClassName("contentsInfo")[0].classList.remove("hide");
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
			if(userInputText.length!=0){
				userInputText = "&#9312; "+userInputText;
			}
			if(document.getElementById(evIdName).innerText === '\n' )userInputText="";
			setFirNo(userInputText);
		}
		else if(evIdName=="secNoFormulaEditor"){
			if(userInputText.length!=0){
				userInputText = "&#9313; "+userInputText;
			}
			if(document.getElementById(evIdName).innerText === '\n' )userInputText="";
			setSecNo(userInputText);
		}
		else if(evIdName=="thrNoFormulaEditor"){
			if(userInputText.length!=0){
				userInputText = "&#9314; "+userInputText;
			}
			if(document.getElementById(evIdName).innerText === '\n' )userInputText="";
			setThrNo( userInputText);
		}
		else if(evIdName=="fourNoFormulaEditor"){
			if(userInputText.length!=0){
				userInputText = "&#9315; "+userInputText;
			}
			if(document.getElementById(evIdName).innerText === '\n' )userInputText="";
			setFourNo(userInputText);
		}
		else if(evIdName=="fifNoFormulaEditor"){
			if(userInputText.length!=0){
				userInputText = "&#9316; "+userInputText;
			}
			if(document.getElementById(evIdName).innerText === '\n' )userInputText="";
			setFifNo(userInputText);
		}
	}

  return (
	  <>
		<div className="rightAbsolBox marginTen">
			<div id="saveBtn" className="nabyBox" onClick={()=>{saveContents()}}>저장하기</div>
		</div>

		<form method="post">
		<div className="twoFlexLayout">
			<div className="left">
				<div className="latex-show" id="latex-show">
					<div id="ques-show">
						<div className="mini-title4">[문제]</div>
						<div dangerouslySetInnerHTML={{__html:contentsText}}></div> 
						<div id="quesImg-show">
							<img src="" id="contentsImgOutput" onDoubleClick={(event) => msb_imgFileDel(event, "contentsImgOutput", "contentsImg")} alt="" />
						</div>
						<div id="multi-show">
							<div dangerouslySetInnerHTML={{__html:firNo}}></div>
							<div dangerouslySetInnerHTML={{__html:secNo}}></div>
							<div dangerouslySetInnerHTML={{__html:thrNo}}></div>
							<div dangerouslySetInnerHTML={{__html:fourNo}}></div>
							<div dangerouslySetInnerHTML={{__html:fifNo}}></div>
						</div>
					</div>
					
					<div id="sol-show">
						<div className="mini-title4">[해설]</div>
						<div dangerouslySetInnerHTML={{__html:solutionText}}></div> 
						<div id="quesImg-show">
							<img src="" id="solutionImgOutput" onDoubleClick={(event) => msb_imgFileDel(event, "solutionImgOutput", "solutionImg")} alt="" />
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
				{ isFetchShotCutKey && <FormulaShortCutKey parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor}/>}
				<div className="hide">
					{ isFetchShotCutKey && <FormulaShortCutKeyEtc parentShortCutKey={shortCutKeyEtc} parentMethod={showFormulaEditor}/>}
				</div>
				<div>
					<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={reg_quesAnsTabClkEv}></TabTable>
				</div>
				<MsbWebEditor parentMethod={showFormulaEditor}></MsbWebEditor>
                <div id="contentsFormulaEditor" className="contentsFormulaEditor onlyEdit" contentEditable="true" role="textbox" placeholder="문제를 입력해주세요..." onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);}}></div>
                <div id="solutionFormulaEditor" className="solutionFormulaEditor onlyEdit hide" contentEditable="true" placeholder="해설을 입력해주세요..." onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => formulaConvert(event, shortCutKeyList)}></div>
				
                <textarea id="contents" className="contents hide" name="contents" defaultValue={contentsText}></textarea>
				<textarea id="solution" className="solution hide" name="solution" defaultValue={solutionText}></textarea>
				
                <div id="contentsOptBox" className="contentsOptBox marginTen">
					<div className="mini-title">문제 이미지 첨부 <input id="contentsImg" name="contentsImg" type="file" onChange={(event)=>{msb_extensionCheck(event, "contentsImgOutput");msb_loadFile(event, "contentsImgOutput");msb_addClass("contentsImgOutput","marginTenAuto")}} /></div>
					<div className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="hide">
						<label><input type="radio" id="essayRadio" name="mutliChoiceType" defaultChecked/>주관식</label>
						<label><input type="radio" id="multiRadio" name="mutliChoiceType"/>객관식</label>
					</div>
					<div className="mini-title">객관식 보기(선택)</div>
					<div id="multiChoiceBox" className="multiChoiceBox">
						<div id="firNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="secNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="thrNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="fourNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div id="fifNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}}></div><br/>
						<div className="hide">
							&#9312; <textarea className="marginFive" id="firNo" name="firNo" type="text" defaultValue={firNo}></textarea><br/>
							&#9313; <textarea className="marginFive" id="secNo" name="secNo" type="text" defaultValue={secNo}></textarea><br/>
							&#9314; <textarea className="marginFive" id="thrNo" name="thrNo" type="text" defaultValue={thrNo}></textarea><br/>
							&#9315; <textarea className="marginFive" id="fourNo" name="fourNo" type="text" defaultValue={fourNo}></textarea><br/>
							&#9316; <textarea className="marginFive" id="fifNo" name="fifNo" type="text" defaultValue={fifNo}></textarea><br/>
						</div>
					</div>
				</div>

				<div id="ansSolOptBox" className="ansSolOptBox marginTen hide">
					<div className="mini-title">해설 이미지 첨부 <input id="solutionImg" name="solutionImg" type="file" onChange={(event)=>{msb_extensionCheck(event, "solutionImgOutput");msb_loadFile(event, "solutionImgOutput");msb_addClass("solutionImgOutput","marginTenAuto")}} /></div>
					<div className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="mini-title">정답</div>
					<div>
						<div className="mini-title2">주관식 정답(필수)</div> 
						<div className="mini-desc marginLeftFive">객관식 문제의 경우 번호를 제외한 주관식 정답까지 입력해주세요.(복수개의 경우 쉼표로 구분)</div>
						<div id="answerFormulaEditor" className="answerFormulaEditor onlyEdit" contentEditable="true" onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => formulaConvert(event, shortCutKeyList)}></div>
						<textarea type="text" id="answer" name="answer" className="hide" defaultValue={answerText}></textarea>
						
						<div className="mini-title2">객관식 정답(선택) </div>
						<div>
							<input type="checkbox" name="multiAns" id="multiAns1" className="multiAnsInput hide" value="&#9312;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns1">&#9312;</label>
							
							<input type="checkbox" name="multiAns" id="multiAns2" className="multiAnsInput hide" value="&#9313;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns2">&#9313;</label>
							
							<input type="checkbox" name="multiAns" id="multiAns3" className="multiAnsInput hide" value="&#9314;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns3">&#9314;</label>
							
							<input type="checkbox" name="multiAns" id="multiAns4" className="multiAnsInput hide" value="&#9315;" onChange={(event)=>{getCheckedVal(event)}} />
							<label className="circleBox" htmlFor="multiAns4">&#9315;</label>
							
							<input type="checkbox" name="multiAns" id="multiAns5" className="multiAnsInput hide" value="&#9316;" onChange={(event)=>{getCheckedVal(event)}} />
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