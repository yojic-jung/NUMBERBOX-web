import {React, useState} from "react";
import {MathJaxContext, MathJax} from "better-react-mathjax";
import FormulaShortCutKey from './FormulaShortCutKey';
import {UnitTypeCombo} from 'web/common/UnitTypeCombo';
import {nb_loadFile, nb_imgFileDel, nb_addClass, nb_extensionCheck} from 'js/common/common_nb.js';
import TabTable from 'web/common/TabTable'
import {reg_threeDivGridChk , reg_mulChoiceTabClkEv, reg_quesAnsTabClkEv, reg_getMappingShortCutKey} from 'js/contents/register/contents_reg';

const config = {
	tex2jax: {
	  inlineMath: [['$$', '$$'], ['$','$'], ['\\(','\\)']],
	},
};

const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansTab',tabName:'해설 입력', className:""}];
const mulChoiceTabList = [{id:'essayTab',tabName:'주관식', className:"checkedTap2"}, {id:'mulTab',tabName:'객관식', className:""}];
let shortCutKeyList;
let isPressedSpaceBar =false;
const FormulaEditorLatex = () => {
	const [latexText, setLatexText] = useState("");
	const [latexSolText, setLatexSolText] = useState("");
	
	const [answerText, setAnswerText] = useState("");

	const [firNo, setFirNo] = useState("");
	const [secNo, setSecNo] = useState("");
	const [thrNo, setThrNo] = useState("");
	const [fourNo, setFourNo] = useState("");
	const [fifNo, setFifNo] = useState("");

	const getShortCutKeyList = async (keyList) => {
		shortCutKeyList = keyList;
	}

	const preventAltEvent = async (event) => {
		if(event.altKey) event.preventDefault();
	}
	
	const latexConvert = async (event, shortCutKeyList) => {
		let evIdName = event.target.id
		let latexValue =""
		event.stopPropagation();
		const mappingKey = await reg_getMappingShortCutKey(event, shortCutKeyList, isPressedSpaceBar);
		isPressedSpaceBar = false;
		if(mappingKey != null){
			let contentsDom = document.getElementById(evIdName);
			let contentsVal = contentsDom.value;
			let strtPoint = contentsDom.selectionStart;
			let endPoint = contentsDom.selectionEnd;
			let contentsLength = contentsVal.length;
			let firBlock = contentsVal.substring(0, strtPoint);
			let secBlock = contentsVal.substring(endPoint, contentsLength);
			let addText = mappingKey[0]["latexGrammer"];
			
			contentsDom.value = firBlock+addText+secBlock;
			contentsDom.selectionStart = strtPoint+addText.length;
			contentsDom.selectionEnd = strtPoint+addText.length;
			contentsDom.focus()
		}

		if(evIdName == "contents"){
			latexValue = document.getElementById(evIdName).value.replaceAll("\n", "<br/>").trim();
			setLatexText(latexValue)
		}else if(evIdName == "solution"){
			latexValue = document.getElementById(evIdName).value.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;").trim();
			setLatexSolText(latexValue);
		}else if(evIdName == "answer"){
			latexValue = document.getElementById(evIdName).value.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;").trim();
			if(latexValue.length != 0){
				latexValue =  latexValue;
			}
			setAnswerText(latexValue);
		}
		else if(evIdName == "multi-answer"){
			let selBox = document.getElementById(evIdName);
			let selIdx = selBox.selectedIndex;
			let selectValue = selBox.options[selBox.selectedIndex].value;
			if(selIdx == 0){
				selectValue = "";
			}
			setAnswerText(selectValue);
		}
	}


	function multipleConvert(event){
		let evIdName = event.target.id
		let latexValue = document.getElementById(evIdName).value.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;").trim();
		if(evIdName=="firNo"){
			setFirNo("&#9312; "+ latexValue)
		}
		else if(evIdName=="secNo"){
			setSecNo("&#9313; "+ latexValue)
		}
		else if(evIdName=="thrNo"){
			setThrNo("&#9314; "+ latexValue)
		}
		else if(evIdName=="fourNo"){
			setFourNo("&#9315; "+ latexValue)
		}
		else if(evIdName=="fifNo"){
			setFifNo("&#9316; "+ latexValue)
		}
		
	 }


  return (
	  <>
		<FormulaShortCutKey getShortCutKeyList={getShortCutKeyList} />
		<form method="post">
		<div className="thrFlexLayout">
			<div className="left">
				<div className="contents-show" id="contents-show">
					<div id="ques-show">
						<div>[문제]</div>
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline dangerouslySetInnerHTML={{__html:latexText}}></MathJax> 
						</MathJaxContext>
					</div>
					<div id="quesImg-show">
						<img src="" id="contentsImgOutput" onDoubleClick={(event) => nb_imgFileDel(event, "contentsImgOutput", "contentsImg")} alt="" />
					</div>
					<div id="multi-show">
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:firNo}}></MathJax> 
						</MathJaxContext>
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:secNo}}></MathJax> 
						</MathJaxContext>
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:thrNo}}></MathJax> 
						</MathJaxContext>
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:fourNo}}></MathJax> 
						</MathJaxContext>
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:fifNo}}></MathJax> 
						</MathJaxContext>
					</div>
					<div id="ans-show">
						<span>[정답]</span>&nbsp;
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:answerText}}></MathJax> 
						</MathJaxContext>
					</div>
					<div id="sol-show">
						<div>[해설]</div>
						<MathJaxContext config={config} version={2} >
							<MathJax dynamic inline  dangerouslySetInnerHTML={{__html:latexSolText}}></MathJax> 
						</MathJaxContext>
					</div>
				</div>
			</div>
			<div className="center">
				<div>
					<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={reg_quesAnsTabClkEv}></TabTable>
				</div>
				<textarea id="contents" className="contents" name="contents" placeholder="문제를 입력해주세요..." onKeyDown={(event) => preventAltEvent(event)} onKeyUp={(event) => latexConvert(event, shortCutKeyList)}></textarea>
				<textarea id="solution" className="solution hide" name="solution" placeholder="해설을 입력해주세요..." onKeyUp={(event) => latexConvert(event, shortCutKeyList)}></textarea>
				<div className="marginTen">
					<div className="mini-title marginTen"> 문제 이미지 첨부 <input id="contentsImg" name="contentsImg" type="file" onChange={(event)=>{nb_extensionCheck(event, "contentsImgOutput");nb_loadFile(event, "contentsImgOutput");nb_addClass("contentsImgOutput","marginTenAuto")}} /></div>
					<div>이미지를 삭제하기를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="hide">
						<label><input type="radio" id="essayRadio" name="mutliChoiceType" defaultChecked/>주관식</label>
						<label><input type="radio" id="multiRadio" name="mutliChoiceType"/>객관식</label>
					</div>
					<TabTable tabList={mulChoiceTabList} className="tabTable" clickEv={reg_mulChoiceTabClkEv}></TabTable>
					<div id="multiChoiceBox" className="multiChoiceBox hide">
						&#9312; <input className="marginFive" id="firNo" name="firNo" type="text" onKeyUp={(event) => {multipleConvert(event); reg_threeDivGridChk()}}/><br/>
						&#9313; <input className="marginFive" id="secNo" name="secNo" type="text" onKeyUp={(event) => {multipleConvert(event); reg_threeDivGridChk()}}/><br/>
						&#9314; <input className="marginFive" id="thrNo" name="thrNo" type="text" onKeyUp={(event) => {multipleConvert(event); reg_threeDivGridChk()}}/><br/>
						&#9315; <input className="marginFive" id="fourNo" name="fourNo" type="text" onKeyUp={(event) => {multipleConvert(event); reg_threeDivGridChk()}}/><br/>
						&#9316; <input className="marginFive" id="fifNo" name="fifNo" type="text" onKeyUp={(event) => {multipleConvert(event); reg_threeDivGridChk()}}/><br/>
					</div>
				</div>
			</div>
			<div className="right">
				<div className="mini-title">workMember</div>
				<input id="workMem"  name="workMem" type="text" placeholder="이름을 적어주세요..."/>
				<UnitTypeCombo />
				<div>
					<div className="mini-title">원본책</div>
					<select id="originRef" name="originRef">
						<option>--선택--</option>
						<option>쎈수학</option>
						<option>RPM</option>
						<option>수학의 힘(베타)</option>
					</select>
					<div className="mini-title">원본 문제 번호</div>
					<input id="originNo" name ="originNo" type="number" />
					<div className="mini-title">문제 난이도</div>
					<select id="quesLevel" name="quesLevel">
						<option>--선택--</option>
						<option value="1">하</option>
						<option value="2">중하</option>
						<option value="3">중</option>
						<option value="4">중상</option>
						<option value="5">상</option>
					</select>
					<div className="mini-title">정답</div>
					<input type="text" id="answer" name="answer" onKeyUp={(event) => {latexConvert(event);} }/>
					<select id="multi-answer" className="hide" name="" onChange={(event) => latexConvert(event)}>
						<option>--선택--</option>
						<option>&#9312;</option>
						<option>&#9313;</option>
						<option>&#9314;</option>
						<option>&#9315;</option>
						<option>&#9316;</option>
					</select>
				</div>
			</div>
		</div>
		</form>
	</>
  );
};

export default FormulaEditorLatex;