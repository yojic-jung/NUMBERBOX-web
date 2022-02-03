import {React, useState} from "react";
import {MathJaxContext, MathJax} from "better-react-mathjax";
import UnitTypeCombo from 'web/common/UnitTypeCombo'
import TabTable from 'web/common/TabTable'
import {mulChoiceTabClkEv, loadFile, quesAnsTabClkEv, extensionCheck, addClassFunc} from 'js/common/latexConverterFunc'

const config = {
	tex2jax: {
	  inlineMath: [['$$', '$$'], ['$','$'], ['\\(','\\)']],
	},
};

const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansTab',tabName:'해설 입력', className:""}];
const mulChoiceTabList = [{id:'essayTab',tabName:'주관식', className:"checkedTap2"}, {id:'mulTab',tabName:'객관식', className:""}];
const LatexConverter = () => {
	const [latexText, setLatexText] = useState("");
	const [latexSolText, setLatexSolText] = useState("");
	
	const [answerText, setAnswerText] = useState("");

	const [firNo, setFirNo] = useState("");
	const [secNo, setSecNo] = useState("");
	const [thrNo, setThrNo] = useState("");
	const [fourNo, setFourNo] = useState("");
	const [fifNo, setFifNo] = useState("");

	function latexConvert(event) {
		let evIdName = event.target.id
		let latexValue =""
		if(evIdName == "contents"){
			latexValue = document.getElementById(evIdName).value.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;").trim();
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
			setSecNo("<br/>&#9313; "+ latexValue)
		}
		else if(evIdName=="thrNo"){
			setThrNo("<br/>&#9314; "+ latexValue)
		}
		else if(evIdName=="fourNo"){
			setFourNo("<br/>&#9315; "+ latexValue)
		}
		else if(evIdName=="fifNo"){
			setFifNo("<br/>&#9316; "+ latexValue)
		}
		
	 }
  return (
	<form method="post">
      <div className="thrFlexLayout">
		<div className="left">
			<div className="latex-show" id="latex-show">
				<div id="ques-show">
					<div>[문제]</div>
					<MathJaxContext config={config} version={2} >
						<MathJax dynamic inline dangerouslySetInnerHTML={{__html:latexText}}></MathJax> 
					</MathJaxContext>
				</div>
				<div id="quesImg-show">
					<img src="" id="contentsImgOutput" alt="" />
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
				<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={quesAnsTabClkEv}></TabTable>
			</div>
			<textarea id="contents" className="contents" name="contents" placeholder="문제를 입력해주세요..." onKeyUp={(event) => latexConvert(event)}></textarea>
			<textarea id="solution" className="solution hide" name="solution" placeholder="해설을 입력해주세요..." onKeyUp={(event) => latexConvert(event)}></textarea>
			<div className="marginTen">
				<div className="mini-title marginTen"> 문제 이미지 첨부 <input id="contentsImg" name="contentsImg" type="file" onChange={(event)=>{extensionCheck(event, "contentsImgOutput");loadFile(event);addClassFunc("contentsImgOutput","marginTenAuto")}} /></div>
				<div className="hide">
					<label><input type="radio" id="essayRadio" name="mutliChoiceType" checked/>주관식</label>
					<label><input type="radio" id="multiRadio" name="mutliChoiceType"/>객관식</label>
				</div>
				<TabTable tabList={mulChoiceTabList} className="tabTable" clickEv={mulChoiceTabClkEv}></TabTable>
				<div id="multiChoiceBox" className="multiChoiceBox hide">
					&#9312; <input className="marginFive" id="firNo" name="firNo" type="text" onKeyUp={(event) => multipleConvert(event)}/><br/>
					&#9313; <input className="marginFive" id="secNo" name="secNo" type="text" onKeyUp={(event) => multipleConvert(event)}/><br/>
					&#9314; <input className="marginFive" id="thrNo" name="thrNo" type="text" onKeyUp={(event) => multipleConvert(event)}/><br/>
					&#9315; <input className="marginFive" id="fourNo" name="fourNo" type="text" onKeyUp={(event) => multipleConvert(event)}/><br/>
					&#9316; <input className="marginFive" id="fifNo" name="fifNo" type="text" onKeyUp={(event) => multipleConvert(event)}/><br/>
				</div>
			</div>
		</div>
		<div className="right">
			<div className="mini-title">workMember</div>
			<input id="workMem" name="workMem" type="text" placeholder="이름을 적어주세요..."/>
			<UnitTypeCombo />
			<div>
				<div className="mini-title">원본책</div>
				<select id="originRef" name="originRef">
					<option>--선택--</option>
					<option>쎈수학</option>
					<option>RPM</option>
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
				<input type="text" id="answer" name="answer" onKeyUp={(event) => latexConvert(event)}/>
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
  );
};

export default LatexConverter;