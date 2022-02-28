import {React, useState, useEffect} from "react";
import FormulaShortCutKey from './FormulaShortCutKey';
import TabTable from 'web/common/TabTable'
import TabButton from 'web/common/TabButton'
import NbWebEditor from 'web/contents/register/NbWebEditor'
import InputQustionInfo from 'web/contents/register/InputQustionInfo';
import {nb_topMenuFixed, nb_dataFetch,nb_loadFile, nb_imgFileDel, nb_addClass, nb_extensionCheck, nb_getCheckedVal} from 'js/common/common_nb.js';
import {reg_threeDivGridChk , reg_quesAnsTabClkEv, reg_getMappingShortCutKey, reg_preventKeyEvent, reg_writeDisableDom} from 'js/contents/register/contents_reg';


const quesAnsTabList = [{id:'quesTab',tabName:'문제 입력', className:"checkedTap"}, {id:'ansSolTab',tabName:'해설 및 정답', className:""}];
const formulaTabList = [{id:'mainFormulaTap',tabName:'기본수식(alt단축키)', className:"formulaTap selectedTab"}, {id:'highFormulaTap',tabName:'기타 수식', className:"formulaTap"}, {id:'etcFormulaTap',tabName:'기타 기호', className:"formulaTap"}];
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
	const[isFetchShotCutKey, setIsFetchShotCutKey] = useState(false);


	useEffect(() => {
		const asyncUseEffect = async function(){
			let jsonObj = await nb_dataFetch('/takeShortCutKey', true);
			setShortCutKey(jsonObj);
			setIsFetchShotCutKey(true);
			shortCutKeyList = jsonObj["shortCutKey"]
	
			const targetDomWidth =  document.getElementById("shortKeyBoard").offsetWidth;
			window.addEventListener('scroll', ()=>{
				nb_topMenuFixed("shortKeyBoard", targetDomWidth)
			});
			window.addEventListener('scroll', ()=>{
				nb_topMenuFixed("shortKeyBoardHigh", targetDomWidth)
			});
			window.addEventListener('scroll', ()=>{
				nb_topMenuFixed("shortKeyBoardEtc", targetDomWidth)
			})
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
		}

		asyncUseEffect();
      },[]);

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
		setMultiAnswerText(await nb_getCheckedVal(event));
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

	/*
	* 정의 : 에디터 모드 포커스 yellowBox 클래스 추가 함수(onKeyUp, onClick)
	* 대상 : 문제, 해설, 객관식보기(5개), 주관식 정답
	*/
	const dressYellowBox = async()=>{
		//드래그 없이 포커스만 하나 있는 경우
		if(document.getSelection().isCollapsed){
			let yellowBorderBox = document.getElementsByClassName("yellowBorderBox");
			while (yellowBorderBox.length > 0) {
				yellowBorderBox[0].classList.remove('yellowBorderBox');
			  }

			let focusParDom = document.getSelection().getRangeAt(0).endContainer.parentElement
			if(focusParDom.classList.contains("borderBox")) focusParDom.classList.add("yellowBorderBox");
			
			//parentElement가 아닌 포커스 컨테이너가 borderBox인 경우
			let focusDom = document.getSelection().getRangeAt(0).endContainer;
			if(focusDom.classList!=undefined){
				if(focusDom.classList.contains("borderBox")) focusDom.classList.add("yellowBorderBox");
			}
		}
	}



	const formulaConvert = async (event, shortCutKeyList) => {
		let evIdName = event.target.id
		event.stopPropagation();
		await dressYellowBox();
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
		const isWriteDisableDom = await reg_writeDisableDom(event)
		if(mappingKey!= null && !isWriteDisableDom){      //alt 단축키 사용한 경우
			let nbGrammer = mappingKey[0]["nbGrammer"];

			//현재 포커스에 단축키 수식 추가
            const selection = document.getSelection();
            const newRange = selection.getRangeAt(0);
            selection.removeAllRanges();
            selection.addRange(newRange);
			//span 노드 추가 안하고 nbGrammer 추가시 백스페이스 및 del 오류 날 수 있음(reg_preventKeyEvent)
            let tmpNode= document.createElement('span');
            tmpNode.innerHTML = nbGrammer;
            newRange.deleteContents();
            newRange.insertNode(tmpNode);
			newRange.innerHTML=nbGrammer;
			window.getSelection().collapseToEnd();		//셀렉션객체의 마지막 부분에 포커스 맞춤
		}

		await showFormulaEditor(evIdName);
	}

	const showFormulaEditor = async function(evIdName){
		let userInnerText = document.getElementById(evIdName).innerText.replaceAll("<","&lt;").replaceAll(">","&gt;");
		let userInputText = document.getElementById(evIdName).innerHTML.trim();
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
		<div className="twoFlexLayout" >
			<div className="left">
				<div id="contents-show" className="contents-show">
					<div id="ques-show">
						<div className="mini-title4">[문제]</div>
						<div dangerouslySetInnerHTML={{__html:contentsText}} onDragStart={ev=>ev.preventDefault()}></div> 
						<div id="quesImg-show">
							<img src="" id="contentsImgOutput" onDoubleClick={() => nb_imgFileDel("contentsImgOutput", "contentsImg")} alt="" />
						</div>
						<div id="multi-show">
							<div><span id="firNoShow" className="hide">&#9312;</span><span dangerouslySetInnerHTML={{__html:firNo}}></span></div>
							<div><span id="secNoShow" className="hide">&#9313;</span><span dangerouslySetInnerHTML={{__html:secNo}}></span></div>
							<div><span id="thrNoShow" className="hide">&#9314;</span><span dangerouslySetInnerHTML={{__html:thrNo}}></span></div>
							<div><span id="fourNoShow" className="hide">&#9315;</span><span dangerouslySetInnerHTML={{__html:fourNo}}></span></div>
							<div><span id="fifNoShow" className="hide">&#9316;</span><span dangerouslySetInnerHTML={{__html:fifNo}}></span></div>
						</div>
					</div>
					<hr/>
					<div id="sol-show">
						<div className="mini-title4">[해설]</div>
						<div dangerouslySetInnerHTML={{__html:solutionText}}></div> 
						<div id="quesImg-show">
							<img src="" id="solutionImgOutput" onDoubleClick={() => nb_imgFileDel("solutionImgOutput", "solutionImg")} alt="" />
						</div>
					</div>
					<hr/>
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
				<TabButton className="formulaTabButton" tabList={formulaTabList} clickEv={formularTabSelect}></TabButton>
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoard" keyName="shortCutKey" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor}/>}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardHigh" keyName="shortCutKeyHigh1" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				{ isFetchShotCutKey && <FormulaShortCutKey compId="shortKeyBoardEtc" keyName="shortCutKeyEtc" parentShortCutKey={shortCutKey} parentMethod={showFormulaEditor} />}
				<div>
					<TabTable tabList={quesAnsTabList} className="tabTable" clickEv={reg_quesAnsTabClkEv}></TabTable>
				</div>
				<NbWebEditor parentMethod={showFormulaEditor}></NbWebEditor>
                <div id="contentsFormulaEditor" className="contentsFormulaEditor onlyEdit" contentEditable="true" placeholder="문제를 입력해주세요..." onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);}} onClick={()=>dressYellowBox()}></div>
                <div id="solutionFormulaEditor" className="solutionFormulaEditor onlyEdit hide" contentEditable="true" placeholder="해설을 입력해주세요..." onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => formulaConvert(event, shortCutKeyList)} onClick={()=>dressYellowBox()}></div>
				
                <textarea id="contents" className="contents hide" name="contents" defaultValue={contentsText}></textarea>
				<textarea id="solution" className="solution hide" name="solution" defaultValue={solutionText}></textarea>
				
                <div id="contentsOptBox" className="contentsOptBox marginTen">
					<div className="mini-title">문제 이미지 첨부 <input id="contentsImg" name="contentsImg" type="file" accept="image/*" onChange={(event)=>{nb_extensionCheck(event, "contentsImgOutput");nb_loadFile(event, "contentsImgOutput");nb_addClass("contentsImgOutput","marginTopTenAuto")}} /></div>
					<div className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="mini-title">객관식 보기(선택)</div>
					<div id="multiChoiceBox" className="multiChoiceBox">
						<div id="firNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}} onClick={()=>dressYellowBox()}></div><br/>
						<div id="secNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}} onClick={()=>dressYellowBox()}></div><br/>
						<div id="thrNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}} onClick={()=>dressYellowBox()}></div><br/>
						<div id="fourNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}} onClick={()=>dressYellowBox()}></div><br/>
						<div id="fifNoFormulaEditor" contentEditable="true" className="multiChoiceView onlyEdit" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => {formulaConvert(event, shortCutKeyList);reg_threeDivGridChk();}} onClick={()=>dressYellowBox()}></div><br/>
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
					<div className="mini-title">해설 이미지 첨부 <input id="solutionImg" name="solutionImg" accept="image/*" type="file" onChange={(event)=>{nb_extensionCheck(event, "solutionImgOutput");nb_loadFile(event, "solutionImgOutput");nb_addClass("solutionImgOutput","marginTopTenAuto")}} /></div>
					<div className="descBox">이미지 삭제를 원하는 경우 이미지를 더블 클릭해주세요.</div>
					<div className="mini-title">정답</div>
					<div>
						<div className="mini-title2">주관식 정답(필수)</div> 
						<div className="mini-desc marginLeftFive">객관식 문제의 경우 번호를 제외한 주관식 정답까지 입력해주세요.(복수개의 경우 쉼표로 구분)</div>
						<div id="answerFormulaEditor" className="answerFormulaEditor onlyEdit" contentEditable="true" onKeyDown={(event) => reg_preventKeyEvent(event)} onKeyUp={(event) => formulaConvert(event, shortCutKeyList)} onClick={()=>dressYellowBox()}></div>
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
		<InputQustionInfo parentMethod={initFormElement}/>
		</form>
	</>
  );
};

export default FormulaEditor;