/*
 * 정의 : contetns/register 패키지에서 사용하는 함수
 */


//수식 box 비어있는 경우에서 백스페이스 및 del 버튼 시 전체 선택되야하는데 안되는 요소 별도 처리
const vacantDomAllSel = ["nbCaseBrckBox", "nbThrCasekBox"];
//입력불가 수식요소 (FormulaShorCutKey.js에도 똑같이 정의함)
const writeDisabledDom = ["nbTrigon", "nbL-R-Brck", "nbR-R-Brck" ,"nbL-C-Brck", "nbR-C-Brck", "nbL-S-Brck", "nbR-S-Brck", "nbAbsVal", "nbThrCaseBrck", "nbCaseBrck"];
//위로 키보드 이벤트 미적용 대상
const noApplyUpKeyList = ["nbDenom", "nbBinomCoSec", "nbCaseSec", "nbThrCaseSec", "nbThrCaseThr"];
//아래로 키보드 이벤트 미적용 대상
const noApplyDownKeyList = ["nbNumer", "nbBinomCoFir", "nbCaseFir", "nbThrCaseFir", "nbThrCaseSec"];

//분수용 괄호 키보드 상하 이벤트 정상작동 안됨
const lineMoveBugEleFont = ["nbL-R-Brck ", "nbR-R-Brck" , "nbL-C-Brck ", "nbR-C-Brck", "nbL-S-Brck", "nbR-S-Brck", "nbAbsVal"];
//첨자 글자 위치 및 줄간격 달라 키보드 상하 이벤트 정상작동 안됨
const lineMoveBugTbElePosition = ["nbExpBox", "nbSubBox"];
const lineMoveBugTdElePosition = ["nbExpTmp", "nbSubTmp", "nbFracExpTmp","nbLeftSub", "nbRightSub"];

/*
 * 정의 : 과목, 대단원, 중단원, 소단원, 유형 콤보박스 onChange 이벤트 함수
 * 설명 : childElement는 자식 요소, isUnitBubbleEv는 연쇄 이벤트 실행 여부
 * 		  cusChildDomId는 customSelbox의 ul태그 Id
 */
export const reg_unitTypeChange = async (e, cusChildDomId, childDomId, isUnitBubbleEv) => {
	if(cusChildDomId == "cusSelQuesType") return;
	
	let targetId = e.target.id;
	let targetDom = document.getElementById(targetId);
	let targetIndex = targetDom.selectedIndex;

	let childElement = document.getElementById(childDomId);			//콤보박스의 option태그 자식요소 
	let cusChildElement = document.getElementById(cusChildDomId);	//커스텀 콤보박스의 ul태그 자식요소

	//부모 자식 관계 판단하여 display: none or notnone
	for(let i=0; i< childElement.length; i++){
	  let isCmbEvCond =false;                                //자식 컴포넌트 최초 한번만 연쇄이벤트 발생위한 변수
	  if(isUnitBubbleEv){isCmbEvCond = childElement.childNodes[i].dataset.parentValue == document.getElementById(targetId).value;}
	  else{isCmbEvCond = (childElement.childNodes[i].dataset.parentValue == document.getElementById(targetId)[targetIndex].dataset.uniqNo);}
	  
	  if(isCmbEvCond){
		childElement.childNodes[i].style.display ="";
		cusChildElement.childNodes[i].style.display ="";
	  }else{
		if(i==0) continue;	// 콤보 첫번째 인덱스는 건너뛰기
		childElement.childNodes[i].style.display ="none";
		cusChildElement.childNodes[i].style.display ="none";
	  }
	}
	let customTitleDom = cusChildElement.parentElement;	//customSel박스의 제목 div 태그
	let titleText = customTitleDom.dataset.title;		//option,li 태그의 첫번째 인덱스 제목
	customTitleDom.classList.remove("nbCustomSelected");
	//option, li태그 한개씩만 추가 위한 설정
	if(childElement.childNodes[0].dataset.uniqNo != 0){
		let firOpt = document.createElement('option');
		firOpt.innerText = titleText;
		firOpt.dataset.uniqNo = 0;
		childElement.prepend(firOpt);
		let firLi = cusChildElement.childNodes[0].cloneNode(true);
		firLi.innerText = titleText+"을 선택해주세요...";
		firLi.dataset.value = 0;
		firLi.className = "nbOptItem";
		firLi.id=cusChildElement.childNodes[0].id+"00";
		cusChildElement.prepend(firLi);
	}
	childElement.childNodes[0].selected = true;
	//cusChildElement.childNodes[0].selected = true;	li는 select 개념 없음
	document.getElementById(cusChildDomId+"Title").innerText = titleText;
	childElement.dispatchEvent(new Event('change', { bubbles: true }));

	//첫번째 과목 콤보박스 하드코딩으로 opt, li 태그 추가
	if(targetId=="subject" && targetDom.childNodes[0].dataset.uniqNo != 0){
		//sel콤보 과목 option 태그 추가
		let firOpt = document.createElement('option');
		firOpt.innerText = "과목";
		firOpt.dataset.uniqNo = 0;
		targetDom.prepend(firOpt);
		targetDom.childNodes[0].selected = true;

		//customSel 과목 li 태그 추가
		let firLi = document.createElement('li');
		firLi.innerText = "과목을 선택해주세요...";
		firLi.dataset.value = 0;
		firLi.className = "nbOptItem";
		firLi.id = "cusSelSubLi000";
		document.getElementById("cusSelSub").prepend(firLi);
	}

  }
/*
* 문제 및 해설 탭 클릭 이벤트
*/
export const reg_quesAnsTabClkEv= async (e) => {
	let targetId = e.target.id;
    if(targetId=="quesTab"){
		document.getElementById("ansSolTab").classList.remove('checkedTap');
		document.getElementById(targetId).classList.add('checkedTap');
		
		document.getElementById("contentsFormulaEditor").classList.remove('hide');
		document.getElementById("solutionFormulaEditor").classList.add('hide');

		document.getElementById("contentsOptBox").classList.remove('hide');
		document.getElementById("ansSolOptBox").classList.add('hide');
	}
	else if(targetId=="ansSolTab"){
		document.getElementById("quesTab").classList.remove('checkedTap');
		document.getElementById("ansSolTab").classList.remove('checkedTap');
		document.getElementById(targetId).classList.add('checkedTap');

		document.getElementById("solutionFormulaEditor").classList.remove('hide');
		document.getElementById("contentsFormulaEditor").classList.add('hide');

		document.getElementById("contentsOptBox").classList.add('hide');
		document.getElementById("ansSolOptBox").classList.remove('hide');
	}

}

/*
* 주관식 객관식 탭 선택 이벤트
*/
export const reg_mulChoiceTabClkEv = async (e) => {
	let targetId = e.target.id;
    if(targetId=="essayTab"){
		document.getElementById("essayRadio").checked=true;
		document.getElementById("mulTab").classList.remove('checkedTap2');
		document.getElementById(targetId).classList.add('checkedTap2');
		document.getElementById("multiChoiceBox").classList.add('hide');
		document.getElementById("multi-show").classList.add('hide');

		document.getElementById("multi-answer").classList.add('hide');
		document.getElementById("answer").classList.remove('hide');
		document.getElementById("answerFormulaEditor").classList.remove('hide');
	}
	else if(targetId=="mulTab"){
		document.getElementById("multiRadio").checked=true;
		document.getElementById("essayTab").classList.remove('checkedTap2');
		document.getElementById(targetId).classList.add('checkedTap2');
		document.getElementById("multiChoiceBox").classList.remove('hide');
		document.getElementById("multi-show").classList.remove('hide');

		document.getElementById("multi-answer").classList.remove('hide');
		document.getElementById("answer").classList.add('hide');
		document.getElementById("answerFormulaEditor").classList.add('hide');
	}
	
}



/*
* 객관식 보기 글자수 4개 미만인 경우 2줄 출력
*/
export const reg_threeDivGridChk = async () => {
	let multiShowDiv = document.getElementById("multi-show");
	let maxWidth=0;
	multiShowDiv.classList.remove("oneDivGrid");
	multiShowDiv.classList.remove("twoDivGrid");
	multiShowDiv.classList.remove("threeDivGrid");
	maxWidth = document.getElementsByClassName("firDiv")[0].offsetWidth;
	if(maxWidth < document.getElementsByClassName("secDiv")[0].offsetWidth) maxWidth =document.getElementsByClassName("secDiv")[0].offsetWidth;
	if(maxWidth < document.getElementsByClassName("thrDiv")[0].offsetWidth) maxWidth =document.getElementsByClassName("thrDiv")[0].offsetWidth;
	if(maxWidth < document.getElementsByClassName("fourDiv")[0].offsetWidth) maxWidth =document.getElementsByClassName("fourDiv")[0].offsetWidth;
	if(maxWidth < document.getElementsByClassName("fifDiv")[0].offsetWidth) maxWidth =document.getElementsByClassName("fifDiv")[0].offsetWidth;
	if(maxWidth<190 && maxWidth>130){
		multiShowDiv.classList.remove("oneDivGrid");
		multiShowDiv.classList.remove("threeDivGrid");
		multiShowDiv.classList.add("twoDivGrid");
	}  
	else if(maxWidth<=130) {
		multiShowDiv.classList.remove("oneDivGrid");
		multiShowDiv.classList.remove("twoDivGrid");
		multiShowDiv.classList.add("threeDivGrid");
	}
	else{
		multiShowDiv.classList.remove("twoDivGrid");
		multiShowDiv.classList.remove("threeDivGrid");
		multiShowDiv.classList.add("oneDivGrid");
	} 

}

/*
* 정의 : 에디터 모드 포커스 yellowBox 클래스 추가 함수(onKeyUp, onClick)
* 대상 : 문제, 해설, 객관식보기(5개), 주관식 정답
*/
export const reg_dressYellowBox = async()=>{
	//드래그 없이 포커스만 하나 있는 경우
	if(window.getSelection().isCollapsed && window.getSelection().rangeCount !== 0){
		let yellowBorderBox = document.getElementsByClassName("yellowBorderBox");
		while (yellowBorderBox.length > 0) {
			yellowBorderBox[0].classList.remove('yellowBorderBox');
		}

		let grayBorderBox = document.getElementsByClassName("grayBorderBox");
		while (grayBorderBox.length > 0) {
			grayBorderBox[0].classList.remove('grayBorderBox');
		}

		//parentElement가 아닌 포커스 컨테이너가 borderBox인 경우(비어있는 요소에 포커스)
		let focusDom = document.getSelection().getRangeAt(0).startContainer;
		let focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement

		//입력불가 요소는 옐로우박스 안 입힘
		for(let i=0; i<writeDisabledDom.length; i++){
			if(focusDom.classList!==undefined){
				if(focusDom.classList.contains(writeDisabledDom[i])){
					focusDom.classList.add("grayBorderBox");
					return;
				}
			}else{
				if(focusParDom.classList.contains(writeDisabledDom[i])){
					focusParDom.classList.add("grayBorderBox");
					return;
				}
			}
			
		}

		if(focusDom.classList!==undefined){
			if(focusDom.classList.contains("borderBox")){
				focusDom.classList.add("yellowBorderBox");
				return;
			} 
		}
		
		if(focusParDom!==undefined){
			focusParDom=focusParDom.closest(".borderBox");
			if(focusParDom!==null){
				focusParDom.classList.add("yellowBorderBox");
			}
		}

	

	}
}

/*
*  수식 alt키 단축키 이벤트
*/
export const reg_getMappingShortCutKey = (event, keyMapList) => {
	let userPressKey = event.keyCode;
	const mappingKeyArr = keyMapList.filter( (keyList) =>{
		if(keyList.shortcutKeycode==userPressKey)return keyList;
	});
	if(mappingKeyArr.length==0) return null;
	if(event.altKey && userPressKey==mappingKeyArr[0]["shortcutKeycode"]) return mappingKeyArr;
	else return null;
}

/*
*  수식 클릭 이벤트
*/
export const reg_getMappingShortCutKeyClk = (formulaId, keyMapList) => {
	const mappingKeyArr = keyMapList.filter( (keyList) =>{
		if(keyList.id==formulaId)return keyList;
	});
	if(mappingKeyArr.length==0) return null;
	if(formulaId==mappingKeyArr[0]["id"]) return mappingKeyArr;
	else return null;
}

/*
*	정의 : 입력불가 수식요소 
*	설명 : 입력불가 수식요소 borderBox 내 입력 불가 기능
*			i) keyDown이벤트인 경우 :
*			true인 경우 callback에서 event.preventDefault()로 제어
*			false인 경우 제어 필요 없음
*			ii) keyUp이벤트인 경우 :
*			true, false로 입력불가 수식요소인지만 판별
*/
export const reg_writeDisableDom = async (event) =>{
	if(document.getSelection().rangeCount === 0) return;
	let focusParDom = document.getSelection().getRangeAt(0).endContainer;
	if(focusParDom.classList === undefined) focusParDom = focusParDom.parentElement;
	let isDisableBox = false;
	for(let i=0; i<writeDisabledDom.length; i++){
		if(focusParDom.classList.contains(writeDisabledDom[i])) isDisableBox = true;
	}

	if(isDisableBox && (event.keyCode == "8" || event.keyCode == "46" )) {
		//입력 불가 수식요소 삭제시 부모요소 전체 선택
		document.getSelection().getRangeAt(0).selectNode(focusParDom.closest('table'));
		return true;
	}

	if(isDisableBox && !(event.keyCode>=37 && event.keyCode<=40)) return true;
	else return false;
	
}


/*
* 정의 : 수식요소에서 위아래 화살표 키 눌렀을때 이벤트
* 설명 : 위로 버튼 누르면 왼쪽으로 포커스, 아래로 버튼 누르면 오른쪽으로 포커스
*/
//위아래 이벤트 미적용 대상
export const upDownKeyRule = async (isShift, userKeyCode) => {
	if(!isShift && userKeyCode===38 ){
		let focusParDom = document.getSelection().getRangeAt(0).startContainer;
		if(focusParDom.classList === undefined) focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement;
		if(focusParDom!==undefined){
			for(let i=0; i<noApplyUpKeyList.length;i++){
				if(focusParDom.closest("."+noApplyUpKeyList[i]) !== null){return true;}
			}
		}
		return false;
	}else if(!isShift && userKeyCode===40 ){
		let focusParDom = document.getSelection().getRangeAt(0).startContainer
		if(focusParDom.classList === undefined) focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement
		if(focusParDom!==undefined){
			for(let i=0; i<noApplyDownKeyList.length;i++){
				if(focusParDom.closest("."+noApplyDownKeyList[i])){return true;}
			}
		}
		return false;
	}else{
		return false;
	}
	
}

/*
*	정의 : reg_preventKeyEvent에서 사용되는 라인 이동 버그 요소 제어
*	설명 : 분수용 괄호, 첨자의 경우 글자크기 및 줄간격이 다른 텍스트와 달라 라인 이동 정상적이지 않음
*		   다른 텍스트와 동일하게 작동하도록 변환 함수
*/
export const reg_lineMoveBugFixStrt = async () =>{
	for(let i=0; i<lineMoveBugEleFont.length;i++){
		let bugElements = document.getElementById(document.activeElement.id).querySelectorAll("."+lineMoveBugEleFont[i]);
		for(let j=0; j<bugElements.length; j++){
			bugElements[j].classList.add("upDownLineMoveBugFixFont");
		}
	}
	

	for(let i=0; i<lineMoveBugTbElePosition.length;i++){
		let bugElements = document.getElementById(document.activeElement.id).querySelectorAll("."+lineMoveBugTbElePosition[i]);
		for(let j=0; j<bugElements.length; j++){
			bugElements[j].classList.add("upDownLineMoveBugFixTb");
		}
	}
	for(let i=0; i<lineMoveBugTdElePosition.length;i++){
		let bugElements = document.getElementById(document.activeElement.id).querySelectorAll("."+lineMoveBugTdElePosition[i]);
		for(let j=0; j<bugElements.length; j++){
			bugElements[j].classList.add("upDownLineMoveBugFixTd");
		}
	}
}

/*
*	정의 : reg_preventKeyEvent에서 사용되는 라인 이동 버그 요소 제어
*	설명 : 분수용 괄호, 첨자의 경우 글자크기 및 줄간격이 다른 텍스트와 달라 라인 이동 정상적이지 않음
*		   원상태로 복귀
*/
export const reg_lineMoveBugFixEnd = async () =>{
		let fontBugElements = document.getElementById(document.activeElement.id).querySelectorAll(".upDownLineMoveBugFixFont");
		for(let j=0; j<fontBugElements.length; j++){
			fontBugElements[j].classList.remove("upDownLineMoveBugFixFont");
		}
		let tbBugElements = document.getElementById(document.activeElement.id).querySelectorAll(".upDownLineMoveBugFixTb");
		for(let j=0; j<tbBugElements.length; j++){
			tbBugElements[j].classList.remove("upDownLineMoveBugFixTb");
		}
		let tdBugElements = document.getElementById(document.activeElement.id).querySelectorAll(".upDownLineMoveBugFixTd");
		for(let j=0; j<tdBugElements.length; j++){
			tdBugElements[j].classList.remove("upDownLineMoveBugFixTd");
		}
}


export const reg_reGenerFormulBugFix = async (event) =>{
		//수식이 셀렉트 영역의 마지막에 있는 경우 삭제, ctrl+x 또는 글자 입력하면 수식이 재생성 되는 버그 해결
		//분수 마지막 또는 처음에 있을때 삭제하면 가운데 정렬로 되는 버그 해결 위해 각각 앞 뒤에 공백 붙여줌
		let selection = window.getSelection();
		let range = selection.getRangeAt(0);
		let strtContainer = range.startContainer;
		let strtOffset = range.startOffset;
		

		let isLeftDir = true;
		if(window.getSelection().getRangeAt(0).endContainer === window.getSelection().focusNode){
			isLeftDir =false
		}
		/*
		let endContainer = range.endContainer;
		let endOffset = range.endOffset;
		let commonContainer = range.commonAncestorContainer;

		//하나의 수식요소 안에서는 적용안함, 수식요소 셀렉트 적용규칙은 reg_keyEvSelectFormulaElement에서 정의
		let strtNbBox = strtContainer;
		if(strtNbBox.classList !== undefined && strtNbBox.closest(".nbBox") !== null){
			strtNbBox = strtNbBox.closest(".nbBox")
		}else{
			strtNbBox = strtNbBox.parentElement.closest(".nbBox")
		}
		let endNbBox = endContainer;
		if(endNbBox.classList !== undefined && endNbBox.closest(".nbBox") !== null){
			endNbBox = endNbBox.closest(".nbBox")
		}else{
			endNbBox = endNbBox.parentElement.closest(".nbBox")
		}
		let rootStrtNbBox = null;
		if(strtNbBox !== null){
			while(strtNbBox.parentElement.closest('.nbBox')!==null){
				strtNbBox = strtNbBox.parentElement.closest('.nbBox');
			}
			rootStrtNbBox = strtNbBox;
		}
		let rootEndNbBox =null;
		if(endNbBox !== null){
			while(endNbBox.parentElement.closest('.nbBox')!==null){
				endNbBox = endNbBox.parentElement.closest('.nbBox');
			}
			rootEndNbBox = endNbBox;
		}
		//최상위 수식요소가 같고 현재 선택 요소가 최상위가 아닌 경우 적용하지 않음(선택한 요소가 최상위 요소이면 적용)
		if(rootStrtNbBox !== null && rootStrtNbBox === rootEndNbBox 
			&& rootStrtNbBox !== range.startContainer && rootEndNbBox !== range.endContainer){
			if(isShorcutKey) return false;
			else return true;
		}
		*/
		

		if(window.getSelection().getRangeAt(0).commonAncestorContainer.classList !== undefined){
			if(window.getSelection().getRangeAt(0).commonAncestorContainer.classList.contains("nbBox")){
				let tmpNode = document.createElement('span');
				tmpNode.innerHTML = "&nbsp;"
				tmpNode.className = "tmpReGenerBugFix"
				window.getSelection().getRangeAt(0).commonAncestorContainer.after(tmpNode);
				if(isLeftDir) window.getSelection().setBaseAndExtent(tmpNode, 1, strtContainer, strtOffset);
				else window.getSelection().setBaseAndExtent(strtContainer, strtOffset, tmpNode, 1);
			}
			else{
				let nbBoxes = window.getSelection().getRangeAt(0).commonAncestorContainer.querySelectorAll(".nbBox");
				if(nbBoxes.length !== 0){
					let lastNbBox =null;
					for(let i=0; i<nbBoxes.length; i++){
						if(window.getSelection().containsNode(nbBoxes[i])) lastNbBox = nbBoxes[i];
					}
					if(lastNbBox === null) return;
					while(lastNbBox.parentElement !== null && lastNbBox.parentElement.closest(".nbBox") !== null && window.getSelection().containsNode(lastNbBox.parentElement.closest(".nbBox"))){
						lastNbBox = lastNbBox.parentElement.closest(".nbBox");
					}
					let tmpNode = document.createElement('span');
					tmpNode.innerHTML = "&nbsp;"
					tmpNode.className = "tmpReGenerBugFix"
					lastNbBox.after(tmpNode);
					selection.removeAllRanges();
					selection.addRange(range);
					let isNbBoxLast = false;
					if(window.getSelection().containsNode(tmpNode)){
						isNbBoxLast = true;
					}
					if(!isNbBoxLast){
						if(isLeftDir) window.getSelection().setBaseAndExtent(tmpNode, 1, strtContainer, strtOffset);
						else window.getSelection().setBaseAndExtent(strtContainer, strtOffset, tmpNode, 1);
					}
				}
			}
		}
			
		

		/*
		let nbBoxes;
		if(commonContainer.classList === undefined){
			commonContainer = commonContainer.parentElement;
			nbBoxes = commonContainer.querySelectorAll('.nbBox');
		}else{
			if(commonContainer.classList.contains("nbBox")){
				nbBoxes = [commonContainer];
			}else{
				nbBoxes = commonContainer.querySelectorAll('.nbBox');
			}
		}

		let rangeBox = [];
		for(let i=0; i<nbBoxes.length; i++){
			if(selection.containsNode(nbBoxes[i])) rangeBox.push(nbBoxes[i])
		}
		if(rangeBox.length !== 0){
			let tmpNode = document.createElement('span');
			tmpNode.innerHTML = "&nbsp;"
			tmpNode.className = "tmpReGenerBugFix"
			let tmpNode2 = document.createElement('span');
			tmpNode2.innerHTML = "&nbsp;"
			tmpNode2.className = "tmpReGenerBugFix2"

			
			rangeBox[0].before(tmpNode);

			//범위 내에 마지막 노드가 첫번째 노드의 자식 노드인 경우 첫번째 노드 앞뒤에 공백추가(최상위에 공백 추가)
			//범위 내에 마지막 노드가 다른 수식요소의 하위요소일때 최상위 수식요소 뒤에 공백추가
			if(rangeBox[rangeBox.length-1].closest(".nbBox")!==null){
				let rootRangeBox = rangeBox[rangeBox.length-1];
				while(rootRangeBox.parentElement.closest(".nbBox") !== null){
					rootRangeBox = rootRangeBox.parentElement.closest(".nbBox");
				}
				rootRangeBox.after(tmpNode2);
				
			}else{
				rangeBox[rangeBox.length-1].after(tmpNode2); 
			}

			let isNbBoxFirst = false;
			let isNbBoxLast = false;

			if(!window.getSelection().containsNode(tmpNode)){
				isNbBoxFirst =true;
			}
			if(!window.getSelection().containsNode(tmpNode2)){
				isNbBoxLast = true;
			}

			selection.removeAllRanges();
			if(isNbBoxFirst && isNbBoxLast){
				if(isLeftDir) window.getSelection().setBaseAndExtent(tmpNode2, 1, tmpNode, 0);
				else window.getSelection().setBaseAndExtent(tmpNode, 0, tmpNode2, 1);
			}else if(isNbBoxFirst && !isNbBoxLast){
				if(isLeftDir) window.getSelection().setBaseAndExtent(endContainer, endOffset, tmpNode, 0);
				else window.getSelection().setBaseAndExtent(tmpNode, 0, endContainer, endOffset);
			}else if(!isNbBoxFirst && isNbBoxLast){
				if(isLeftDir) window.getSelection().setBaseAndExtent(tmpNode2, 1, strtContainer, strtOffset);
				else window.getSelection().setBaseAndExtent(strtContainer, strtOffset, tmpNode2, 1);
			}else{
				if(isLeftDir) window.getSelection().setBaseAndExtent(endContainer, endOffset, strtContainer, strtOffset);
				else window.getSelection().setBaseAndExtent(strtContainer, strtOffset, endContainer, endOffset);
			}
	}

	*/
	return false;
}

/*
*	정의 : 키값 입력 제어 이벤트
*	설명 : 제거(백스페이스, Del), 입력불가 수식요소(입력 불가 기능과 백스페이스 및 del 시 전체선택기능),
*			alt키 제어(단축키 사용용도)
*/
export const reg_preventKeyEvent = async (event) => {
	let userKeyCode = event.keyCode;

	if(document.activeElement.id === "contentsFormulaEditor" || document.activeElement.id === "solutionFormulaEditor"){
		if(document.getElementById(document.activeElement.id).innerHTML === "" || document.getElementById(document.activeElement.id).innerHTML === "<br>"){
			document.getElementById(document.activeElement.id).innerHTML = "<div><br></div>"
		}
	}

	if(!event.ctrlKey){
		//테이블 셀렉트 색상 제거
		let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
		for(let i=0; i<nbSelectionTbTd.length; i++){
			nbSelectionTbTd[i].classList.remove("nbSelectionTbTd");
		}
	}

	//borderBox 뒤에 한글 쓴 후 지우면 포커스 사라지는 문제 해결
	if(userKeyCode === 229 && event.code === "Backspace"){
		let previousEle = window.getSelection().getRangeAt(0).startContainer.previousSibling;
		if(window.getSelection().getRangeAt(0).startOffset === 1 && previousEle !== null && previousEle.classList !== undefined){
			if(previousEle.classList.contains("nbBox")){
				const newRange = window.getSelection().getRangeAt(0)
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(newRange);
				let tmpNode= document.createElement('span');
				tmpNode.innerHTML = "&nbsp;"
				tmpNode.className = "tmpFocusHideBugFix"		//onKeyup에서 제거해주어야함(reg_keyEvSelectFormulaElement 메서드)
				newRange.insertNode(tmpNode);
				return;
			}
		}
		
	}

	//키 다운시 수식 셀렉트 배경색 삭제 안하면 수식 셀렉트 된 상태에서 글자 입력하면 수식 배경색이 글자에 적용됨
	if(!document.getSelection().isCollapsed && (userKeyCode !== 37 && userKeyCode !== 38 && userKeyCode !== 39 && userKeyCode !== 40)){
		await reg_removeSelectionBackColor();
	}

	//1번 validation
	//셀렉트 상태에서 글자 입력, 삭제, cut, 수식키 입력, ctrl+v 입력시 셀렉트 안의 수식이 마지막 요소인 경우 재생성 버그
	//수식이 마지막 요소 일때 붙여넣기 하면 수식 재생성 및 라인 끝어짐 (ctrl+c에서 수식 마지막 요소 공백 추가)
	//셀렉트 마지막에 공백 추가
	if( (!document.getSelection().isCollapsed 
		&& userKeyCode !== 37 && userKeyCode !== 38 && userKeyCode !== 39 && userKeyCode !== 40
		 && !event.shiftKey && !event.ctrlKey && !event.altKey )
		 || (userKeyCode === 88 && event.ctrlKey)
		 || (userKeyCode === 86 && event.ctrlKey)
		 || (userKeyCode === 67 && event.ctrlKey)
		 || (userKeyCode !== 18 && event.altKey)){

			await reg_reGenerFormulBugFix(event);
	}

	//삭제 또는 cut으로 라인 이동시 라인 마지막에 수식요소 있으면 재생성 되는 버그 해결 
	//모든 div태그의 마지막 요소가 수식요소인지 체크하여 수식인 경우 뒤에 공백 추가
	if(userKeyCode === 8 || userKeyCode === 46 || (userKeyCode === 88 && event.ctrlKey) || (userKeyCode === 86 && event.ctrlKey) || (userKeyCode !== 18 && event.altKey)
	|| (!document.getSelection().isCollapsed 
		&& userKeyCode !== 37 && userKeyCode !== 38 && userKeyCode !== 39 && userKeyCode !== 40
	 	&& !event.shiftKey && !event.ctrlKey && !event.altKey)){
		let childDiv = document.getElementById(document.activeElement.id).querySelectorAll("div");
		for(let i=0; i<childDiv.length; i++){
			//div태그의 마지막이 수식요소인 경우, 수식 재생성 오류 해결
			//마지막요소가 br이고 br 이전이 수식요소인 경우 재생성 안됨, 오직 마지막 요소가 수식요소인 경우 또는 수식이 span에 감싸져있는 경우 재생성됨
			if(childDiv[i].lastElementChild !== null && childDiv[i].lastElementChild.classList.contains("nbBox")){
					if(childDiv[i].lastElementChild.nextSibling === null || childDiv[i].lastElementChild.nextSibling.length===0){
						let lastNbBox = childDiv[i].lastElementChild;	//변수 지정 안 한채 사용하면 tmpNode가 lastElementChild로 잡힐 수 있음
						let tmpNode = document.createElement('span');
						tmpNode.innerHTML = "&nbsp;"
						tmpNode.className = "tmpReGenerBugFix";
						if(userKeyCode === 46 && window.getSelection().getRangeAt(0).getBoundingClientRect().y===0 && window.getSelection().isCollapsed){
							let tmpNode2 = document.createElement('span');
							tmpNode2.innerHTML = "&nbsp;"
							tmpNode2.className = "tmpPosition";
							window.getSelection().getRangeAt(0).insertNode(tmpNode2);
							if(lastNbBox !== tmpNode2.previousSibling){
								childDiv[i].lastElementChild.after(tmpNode);
							}
							tmpNode2.remove();
						}else{
							childDiv[i].lastElementChild.after(tmpNode);
						}
					}
			//수식이 span에 감싸져있는 경우 재생성 버그 해결
			}else if(childDiv[i].lastElementChild !== null && childDiv[i].lastElementChild.tagName === "SPAN"){
				let lastNbBox = childDiv[i].lastElementChild.querySelectorAll(".nbBox");
				if(lastNbBox.length !== 0){
					lastNbBox = lastNbBox[lastNbBox.length-1];
					if(lastNbBox.parentElement !== undefined){
						while(lastNbBox.parentElement.closest(".nbBox") !== null){
							lastNbBox = lastNbBox.parentElement.closest(".nbBox");
						}
					}
					
					if(lastNbBox.nextSibling === null || lastNbBox.nextSibling.length===0){
						let isLastDom = true;
						let spanTag = lastNbBox
						while(spanTag.parentElement.closest("span") !== null){
							spanTag=spanTag.parentElement.closest("span") ;
							if(spanTag.nextSibling !== null || (spanTag.nextSibling !== null && spanTag.nextSibling.length!==0)){
								isLastDom = false;
								break;
							}
						}
						if(isLastDom){
							let tmpNode = document.createElement('span');
							tmpNode.innerHTML = "&nbsp;"
							tmpNode.className = "tmpReGenerBugFix";
							if(userKeyCode === 46 && window.getSelection().getRangeAt(0).getBoundingClientRect().y===0 && window.getSelection().isCollapsed){
								let tmpNode2 = document.createElement('span');
								tmpNode2.innerHTML = "&nbsp;"
								tmpNode2.className = "tmpPosition";
								window.getSelection().getRangeAt(0).insertNode(tmpNode2);
								if(lastNbBox !== tmpNode2.previousSibling){
									lastNbBox.after(tmpNode);
								}
								tmpNode2.remove();
							}else{
								lastNbBox.after(tmpNode);
							}
						}
						
					}
				}
			}
		}
	}
	//[end]

	//2번 validation(순서 바뀌면 안됨, 백스페이스 및 del 오류남)
	//입력 불가 수식 box요소 제어[start]
	if(await reg_writeDisableDom(event)){
		event.preventDefault();
	} 
	//[end]

	//3번 
	//수식 box 비어있는 경우에서 백스페이스 및 del 버튼 시 전체 선택 , yellow 요소 전체 입혀줘야함
	if(userKeyCode === 8 || userKeyCode === 46 ){
		let endContainer = document.getSelection().getRangeAt(0).endContainer;
		let nbBoxDom;
		if(endContainer.classList !== undefined) nbBoxDom=endContainer.closest('.nbBox');
		else nbBoxDom=endContainer.parentElement.closest('.nbBox');
		if(nbBoxDom!==null && nbBoxDom.querySelector(".nbBox") === null){
			let nbBoxInnerText = nbBoxDom.innerText.replace(/\r\n|\n|\r|\s*/g, "");
			if(nbBoxInnerText.length===0 && window.getSelection().isCollapsed){
				let range = document.createRange();
				range.setStart(nbBoxDom, 0);
				range.setEnd(nbBoxDom, 1);
				const selection1 = document.getSelection();
				selection1.removeAllRanges();
				selection1.addRange(range);
				//document.getSelection().getRangeAt(0).selectNode(nbBoxDom);
				let childTd = nbBoxDom.querySelectorAll('td');
				for(let i=0; i<childTd.length; i++){
					childTd[i].classList.add('yellowBorderBox');
				}
				event.preventDefault();
			}else if(nbBoxInnerText.length===1 && window.getSelection().isCollapsed){
				for(let i=0; i<vacantDomAllSel.length; i++){
					if(nbBoxDom.classList.contains(vacantDomAllSel[i])){
						let range = document.createRange();
						range.setStart(nbBoxDom, 0);
						range.setEnd(nbBoxDom, 1);
						const selection1 = document.getSelection();
						selection1.removeAllRanges();
						selection1.addRange(range);
						//document.getSelection().getRangeAt(0).selectNode(nbBoxDom);
						let childTd = nbBoxDom.querySelectorAll('td');
						for(let i=0; i<childTd.length; i++){
							childTd[i].classList.add('yellowBorderBox');
						}
						event.preventDefault();
					}
				}
			}
		}
	}


	//4번, validation 순서 바뀌어도 되는 독립적인 로직
	//테이블의 셀에 포커스가 있을때 탭 누르면 다음 셀로 이동
	if(userKeyCode===9){
		let parentTable = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.editInnerTable');
		let targetCell= document.getSelection().getRangeAt(0).endContainer;
		//수식 요소인 경우
		if(targetCell.tagName !== undefined){
			targetCell = document.getSelection().getRangeAt(0).endContainer.closest('.innerTbTd');
		}else{
			targetCell = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.innerTbTd');
		}

		if(parentTable===null) {
			if(event.shiftKey){
			}
			return;
		}
		
		let trDom ;
		if(parentTable.childNodes[0].tagName==="TBODY"){
			trDom =parentTable.childNodes[0].childNodes;
		}else{
			trDom = parentTable.childNodes;
		}
		let rowLength = trDom.length;
		let colLength = trDom[0].childNodes.length;
		let targetRowIdx = -1;
		let targetColIdx = -1;

		//포커스를 가진 셀의 행,열 인덱스 구하기
		for(let rowIdx = 0; rowIdx<rowLength; rowIdx++){
			for(let colIdx = 0; colIdx<colLength; colIdx++){
				if(trDom[rowIdx].childNodes[colIdx] === targetCell){
					targetRowIdx = rowIdx;
					targetColIdx = colIdx;
					continue;
				}
			}
		}

		let focusCellDom;
		//마지막 열인 경우
		if(targetColIdx === colLength-1){
			//마지막 행, 열인 경우
			if(targetRowIdx === rowLength-1){
				event.preventDefault();
				return;
			} 
			focusCellDom = trDom[targetRowIdx+1].childNodes[0];
		}else{
			focusCellDom = trDom[targetRowIdx].childNodes[targetColIdx+1];
		}

		let range = document.createRange();
		range.setStart(focusCellDom, 0);
		range.setEnd(focusCellDom, 0);
		const selection1 = document.getSelection();
		selection1.removeAllRanges();
		selection1.addRange(range);
		event.preventDefault();
	}

	//shift+위로 또는 shift+아래로 누른 경우(수식 최상위 요소 전체 선택)
	if((event.shiftKey && userKeyCode===38) || (event.shiftKey && userKeyCode===40)){
		let anchorNbBox = window.getSelection().anchorNode.parentElement.closest('.nbBox');
		let focusNbBox = window.getSelection().focusNode.parentElement.closest('.nbBox');

		let rootAnchorNbBox = anchorNbBox;
		let rootFocusNbBox = focusNbBox;
		if(anchorNbBox !== null && focusNbBox !== null){
			while(rootAnchorNbBox.parentElement.closest('.nbBox')!==null){
				rootAnchorNbBox = rootAnchorNbBox.parentElement.closest('.nbBox');
			}
			while(rootFocusNbBox.parentElement.closest('.nbBox')!==null){
				rootFocusNbBox = rootFocusNbBox.parentElement.closest('.nbBox');
			}
			if(rootAnchorNbBox === rootFocusNbBox){
				let orgRange = window.getSelection()
				orgRange.removeAllRanges();
				if(userKeyCode===38){
					orgRange.setBaseAndExtent(rootAnchorNbBox, 1, rootAnchorNbBox, 0);
				}else{
					orgRange.setBaseAndExtent(rootAnchorNbBox, 0, rootAnchorNbBox, 1);
				}
				event.preventDefault();
			}
			return;
		}
		
		if(focusNbBox !== null){
			while(rootFocusNbBox.parentElement.closest('.nbBox')!==null){
				rootFocusNbBox = rootFocusNbBox.parentElement.closest('.nbBox');
			}
			
			let orgRange = window.getSelection()
			let anchorNode = window.getSelection().anchorNode;
			let anchorOffset = window.getSelection().anchorOffset;
			orgRange.removeAllRanges();
			if(userKeyCode===38){
				orgRange.setBaseAndExtent(anchorNode, anchorOffset, rootFocusNbBox, 0);
			}else{
				orgRange.setBaseAndExtent(anchorNode, anchorOffset, rootFocusNbBox, 1);
			}
			event.preventDefault();
			return;
		}
	}
	
	
	/* shift + 키보드 상하 셀렉션 규칙
	* 앵커를 전역변수로 생성한 뒤 셀렉션을 없애고(셀렉션을 없애지 않으면 키보드 위아래 이동 방식에서 리무브 됨) 
	* 포커스는 포커스노드에 맞춘 후
	* 키보드 화살표 위아래가 이동하는 포커스를 새로운 포커스로 잡아 셀렉션 영역 마지막에 생성 */
	let anchorNode = window.getSelection().anchorNode
	let anchorOffset = window.getSelection().anchorOffset;
	if((event.shiftKey && userKeyCode===38) || (event.shiftKey && userKeyCode===40)){
		event.preventDefault();
		window.getSelection().setBaseAndExtent(window.getSelection().focusNode, window.getSelection().focusOffset, window.getSelection().focusNode, window.getSelection().focusOffset);
	}
	
	//키보드 상하 화살표 누른 경우(커서 라인 이동)
	if( (userKeyCode===38 || userKeyCode===40) && window.getSelection().isCollapsed ){
		if(document.activeElement.firstChild === null) return;
		//5번, validation 순서 바뀌어도 되는 독립적인 로직
		await reg_lineMoveBugFixStrt();
		/*
		*  브라우저의 절대좌표로 하단 라인에 텍스트 요소 판단하므로 브라우저 화면에 요소들이 모두 보여야 함.
		*  contentEditable이 아닌 요소 제거 및 contentEditable 요소의 높이를 제거하여 모든 텍스트 보이도록 구현
		*  커서 포인터와 이동할 커서 포인터를 브라우저 중앙에 두어 null값 안나오도록 구현
		*/
		let windowScrollTop = document.querySelector('html').scrollTop;			// 이전 브라우저 스크롤 높이 파악
		let scrollTop = document.getElementById(document.activeElement.id).scrollTop // 이전 active 요소 스크롤 높이 파악
		document.getElementById(document.activeElement.id).classList.add("fullHeight");
		document.getElementById("topShortkeyDiv").classList.add("hide");
		/*버그 해결. getBoundingClientRect 값이 수식요소 뒤나 표 등의 뒤에 있을때 0으로 리턴 되는 경우가 있어
		모든 커서 포인터에 캐럿을 집어넣어 좌표 파악 */
		const newRange = window.getSelection();
		let tempRange = newRange.getRangeAt(0);
		let endContainer =tempRange.endContainer;
		let endOffset =tempRange.endOffset;
		newRange.removeAllRanges();
		newRange.addRange(tempRange);
		let tempNode= document.createElement('span');
		tempNode.className = "tmpCaretPoint";
		tempNode.innerHTML = ".";
		tempRange.deleteContents();

		//수식편집기 ctrl+v 한 경우 div 마지막에 br태그가 붙어 키보드 위로 이동이 정상적이지 않음
		let isCarotInserted = false;
		if(endContainer.tagName === "DIV" && endContainer.childNodes.length === endOffset && endOffset!==0){
			if(endContainer.childNodes[endContainer.childNodes.length-1].tagName === "BR"){
				endContainer.childNodes[endContainer.childNodes.length-1].before(tempNode);
				isCarotInserted=true;
			}
		}

		//요소를 ctrl+v한 경우 BR 태그로 캐럿이 빠지는 경우가 있음, BR 태그로 캐럿이 빠지면 무한루프 돔
		if(!isCarotInserted){
			if(endContainer.tagName === "BR"){
				endContainer.before(tempNode)
			}else{
				tempRange.insertNode(tempNode);
			}
		}

		// 커서 포인터와 이동할 커서 포인터를 브라우저 중앙에 두어 null값 안나오도록 구현, 커서 포인터가 브라우저 맨 하단에 있으면 아래 텍스트 있어도 절대 좌표이므로 포인터 못 잡음.
		document.getElementsByClassName("tmpCaretPoint")[0].scrollIntoView({block:"center"});	
		let position = document.getElementsByClassName("tmpCaretPoint")[0].getBoundingClientRect();

		window.getSelection().collapseToStart();		//collapseToStart 명령어 실행 안하면 셀렉트 상태라 옐로우 박스 안 입혀짐.
		
		//현재 포커스가 표 안에 있는지 판별
		let isTable = false;
		let parentTable = null
		if(document.getElementsByClassName("tmpCaretPoint")[0].closest(".innerTbTd") !== null){
			isTable = true;
			parentTable = document.getElementsByClassName("tmpCaretPoint")[0].closest(".editInnerTable");
		} 

		document.getElementsByClassName("tmpCaretPoint")[0].remove();
		let moveRange;
		let isExeptDom = await upDownKeyRule(event.shiftKey,userKeyCode);
		if(isExeptDom){	//예외 수식요소인 경우
			//분수의 경우 분모는 무조건 분자로, 분자는 분모로(이항계수도 마찬가지)
			//경우의 수의 경우 위아래 이동 케이스 순서에 맞춰서
			let focusParDom = document.getSelection().getRangeAt(0).startContainer;
			if(focusParDom.classList === undefined) focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement;
			if(focusParDom!==undefined){
				if(userKeyCode===38){
					for(let i=0; i<noApplyUpKeyList.length;i++){
						if(focusParDom.closest("."+noApplyUpKeyList[i]) !== null){focusParDom =focusParDom.closest("."+noApplyUpKeyList[i]) }
					}
				}
				else{
					for(let i=0; i<noApplyDownKeyList.length;i++){
						if(focusParDom.closest("."+noApplyDownKeyList[i]) !== null){focusParDom =focusParDom.closest("."+noApplyDownKeyList[i]) }
					}
				}
				if (document.caretRangeFromPoint) {
					if(userKeyCode===38) moveRange = document.caretRangeFromPoint(position.x, focusParDom.getBoundingClientRect().y-focusParDom.getBoundingClientRect().height*0.5);
					else moveRange = document.caretRangeFromPoint(position.x, focusParDom.getBoundingClientRect().y+focusParDom.getBoundingClientRect().height*1.5);
				} else if (document.caretPositionFromPoint) {
					if(userKeyCode===38) moveRange = document.caretPositionFromPoint(position.x, focusParDom.getBoundingClientRect().y-focusParDom.getBoundingClientRect().height*0.5);
					else moveRange = document.caretPositionFromPoint(position.x, focusParDom.getBoundingClientRect().y+focusParDom.getBoundingClientRect().height*1.5);
				}
			}
		}else{
			// 키보드 위로 화살표 버튼 누른 경우
			if(userKeyCode===38){
				if (document.caretRangeFromPoint) {
					moveRange = document.caretRangeFromPoint(position.x, position.y-position.height*1.5);
				} else if (document.caretPositionFromPoint) {
					moveRange = document.caretPositionFromPoint(position.x, position.y-position.height*1.5);
				}
			} 
			// 키보드 아래로 화살표 버튼 누른 경우
			else {
				if (document.caretRangeFromPoint) {
					//요소의 절대 좌표는 왼쪽 상단이므로 아래로 이동 시에는 자기 자신 높이에 아래라인 줄간격 만큼 y값 추가
					moveRange = document.caretRangeFromPoint(position.x, position.y+position.height*2.5);
				} else if (document.caretPositionFromPoint) {
					moveRange = document.caretPositionFromPoint(position.x, position.y+position.height*2.5);
				}
			}

			let tmpNode= document.createElement('span');
			tmpNode.className = "tmpCaretPoint";
			tmpNode.innerHTML = ".";
			moveRange.deleteContents();
			moveRange.insertNode(tmpNode);
			let i=1;
			// 이동할 커서 포인터 라인이 자기 자신이 리턴되는 경우 있음(분수에 분수 포함 된 경우 한 줄이 기존 계산의 간격에서 벗어남)
			while((position.y < moveRange.getBoundingClientRect().y+moveRange.getBoundingClientRect().height  && position.y > moveRange.getBoundingClientRect().y-moveRange.getBoundingClientRect().height)){
				document.getElementsByClassName("tmpCaretPoint")[0].remove();
				if(userKeyCode===38){
					if (document.caretRangeFromPoint) {
						moveRange = document.caretRangeFromPoint(position.x, position.y-position.height*1.5-position.height*i);
					} else if (document.caretPositionFromPoint) {
						moveRange = document.caretPositionFromPoint(position.x, position.y-position.height*1.5-position.height*i);
					}
				} else {
					if (document.caretRangeFromPoint) {
						moveRange = document.caretRangeFromPoint(position.x, position.y+position.height*2.5+position.height*i);
					} else if (document.caretPositionFromPoint) {
						moveRange = document.caretPositionFromPoint(position.x, position.y+position.height*2.5+position.height*i);
					}
				}
				let tmpNode= document.createElement('span');
				tmpNode.className = "tmpCaretPoint";
				tmpNode.innerHTML = ".";
				moveRange.deleteContents();
				moveRange.insertNode(tmpNode);
				i++;
			}
			window.getSelection().collapseToStart();	//collapseToStart 명령어 실행 안하면 셀렉트 상태라 옐로우 박스 안 입혀짐.
			document.getElementsByClassName("tmpCaretPoint")[0].remove();
			tmpNode= document.createElement('span');
			tmpNode.className = "tmpCaretPoint";
			tmpNode.innerHTML = ".";
			moveRange.deleteContents();
			moveRange.insertNode(tmpNode);
			//라인 이동시 이동 라인에 수식요소 있는 경우 수식요소 안으로 커서 안들어가는 경우 있어 
			//정확도를 높이기 위해 한번 더 x좌표에 맞는 요소로 커서 이동
			if (document.caretRangeFromPoint) {
				moveRange = document.caretRangeFromPoint(position.x, moveRange.getBoundingClientRect().y);
			} else if (document.caretPositionFromPoint) {
				moveRange = document.caretPositionFromPoint(position.x, moveRange.getBoundingClientRect().y);
			}
			window.getSelection().collapseToStart();	//collapseToStart 명령어 실행 안하면 셀렉트 상태라 옐로우 박스 안 입혀짐.
			document.getElementsByClassName("tmpCaretPoint")[0].remove();
		}
		
		
		let moveStrtContainer = null;
		if(moveRange.startContainer.classList !== undefined) moveStrtContainer =moveRange.startContainer;
		else if(moveRange.startContainer.parentElement.classList !== undefined) moveStrtContainer =moveRange.startContainer.parentElement;
		
		//테이블 맨 윗줄 밑 맨 아랫줄 라인 이동 구현
		let isTbMove = true;
		if(isTable){
			if(moveStrtContainer.closest(".innerTbTd")===null){
				let tmpNode= document.createElement('span');
				tmpNode.className = "tmpCaretPoint";
				tmpNode.innerHTML = ".";
				if(userKeyCode === 38){
					parentTable.before(tmpNode);
					newRange.setBaseAndExtent(document.getElementsByClassName("tmpCaretPoint")[0], 0, document.getElementsByClassName("tmpCaretPoint")[0], 0);
				}
				else{
					parentTable.after(tmpNode);
					newRange.setBaseAndExtent(document.getElementsByClassName("tmpCaretPoint")[0], 0, document.getElementsByClassName("tmpCaretPoint")[0], 0);
				}
				isTbMove = false;
				document.getElementsByClassName("tmpCaretPoint")[0].remove();
				event.preventDefault();
			}
		}
		
		if(moveStrtContainer !== null && isTbMove){
			newRange.removeAllRanges();
			if(moveStrtContainer.closest("#"+document.activeElement.id) !== null){
				newRange.setBaseAndExtent(moveRange.startContainer, moveRange.startOffset, moveRange.endContainer, moveRange.endOffset);
				event.preventDefault();
			//맨 윗줄은 맨 왼쪽으로 이동, 맨 아랫줄은 맨 오른쪽으로 이동
			}else{
				let tmpNode= document.createElement('span');
				tmpNode.className = "tmpCaretPoint";
				tmpNode.innerHTML = ".";
				if(userKeyCode === 38){
					if(document.activeElement.firstChild.classList === undefined){
						document.activeElement.prepend(tmpNode);
					}else{	//div 요소가 있을때 div 요소 밖에 집어넣으면 밑에 줄에 캐럿이 생성되어 커서 포인터가 정확하지 않음
						let prependNodes = document.activeElement.firstChild;
						while(prependNodes.firstChild !== null && prependNodes.firstChild.tagName === "DIV"){
							prependNodes = prependNodes.firstChild
						}
						prependNodes.prepend(tmpNode);
					}
				}
				else{
					if(document.activeElement.lastChild.classList === undefined){
						document.activeElement.append(tmpNode);
					}else{	//div 요소가 있을때 div 요소 밖에 집어넣으면 밑에 줄에 캐럿이 생성되어 커서 포인터가 정확하지 않음
						let appendNodes = document.activeElement.lastChild;
						while(appendNodes.lastChild !== null && appendNodes.lastChild.tagName === "DIV"){
							appendNodes = appendNodes.lastChild
						}
						appendNodes.append(tmpNode);
					}
				}
				newRange.setBaseAndExtent(tmpNode, 0, tmpNode, 0);
				window.getSelection().collapseToStart();	//collapseToStart 명령어 실행 안하면 셀렉트 상태라 옐로우 박스 안 입혀짐.
				document.getElementsByClassName("tmpCaretPoint")[0].remove();
				event.preventDefault();	
			}
		}

		//브라우저 스크롤 초기화 및 contentEditable 요소 스크롤 이동 필요시 스크롤 이동, hide요소 show로 전환
		const tmpRange = newRange.getRangeAt(0);
		newRange.removeAllRanges();
		newRange.addRange(tmpRange);
		let tmpNode= document.createElement('span');
		tmpNode.className = "tmpCaretPoint";
		tmpNode.innerHTML = ".";
		tmpRange.deleteContents();
		tmpRange.insertNode(tmpNode);
		document.getElementById("topShortkeyDiv").classList.remove("hide");		// hide요소 show로 전환
		document.getElementById(document.activeElement.id).classList.remove("fullHeight");	// hide요소 show로 전환
		document.querySelector('html').scrollTop = windowScrollTop;			//브라우저 스크롤 초기화
		document.getElementById(document.activeElement.id).scrollTop = scrollTop;	//contentEditable 요소 스크롤 초기화
		
		//contentEditable 요소 스크롤 이동 필요시 스크롤 이동
		// y값을 10정도 빼거나 추가하여 이동하는 라인의 여백이 보이고 스크롤 처음과 끝까지 이동될 수 있도록 구현
		if(window.getSelection().getRangeAt(0).getBoundingClientRect().y-10 < document.getElementById(document.activeElement.id).getBoundingClientRect().y){
			document.getElementById(document.activeElement.id).scrollTop += window.getSelection().getRangeAt(0).getBoundingClientRect().y-document.getElementById(document.activeElement.id).getBoundingClientRect().y-10;
		}
		else if(window.getSelection().getRangeAt(0).getBoundingClientRect().y+10 > document.getElementById(document.activeElement.id).getBoundingClientRect().y+document.getElementById(document.activeElement.id).getBoundingClientRect().height){
			document.getElementById(document.activeElement.id).scrollTop += (window.getSelection().getRangeAt(0).getBoundingClientRect().y + window.getSelection().getRangeAt(0).getBoundingClientRect().height - document.getElementById(document.activeElement.id).getBoundingClientRect().y - document.getElementById(document.activeElement.id).getBoundingClientRect().height)+10;
		}
		window.getSelection().collapseToStart();	//collapseToStart 명령어 실행 안하면 셀렉트 상태라 옐로우 박스 안 입혀짐.
		document.getElementsByClassName("tmpCaretPoint")[0].remove();

		if(!isExeptDom){
			//분수 또는 이항계수로 포커스가 이동된 경우
			//키보드 위로 화살표 버튼의 경우 분모로, 아래로 화살표의 경우 분자로(이항계수도 마찬가지)
			let focusParDom = document.getSelection().getRangeAt(0).startContainer;
			if(focusParDom.classList === undefined) focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement;
			if(focusParDom.classList !==undefined){
				if(userKeyCode === 38 && (focusParDom.closest(".nbNumer")!==null || focusParDom.closest(".nbBinomCoFir")!==null ) ){
					if(focusParDom.closest(".nbNumer") !== null) focusParDom = focusParDom.closest(".nbNumer");
					else focusParDom = focusParDom.closest(".nbBinomCoFir");

					if (document.caretRangeFromPoint) {
						moveRange = document.caretRangeFromPoint(position.x, focusParDom.getBoundingClientRect().y+focusParDom.getBoundingClientRect().height*1.5);
					} else if (document.caretPositionFromPoint) {
						moveRange = document.caretPositionFromPoint(position.x, focusParDom.getBoundingClientRect().y+focusParDom.getBoundingClientRect().height*1.5);
					}
					newRange.removeAllRanges();
					newRange.setBaseAndExtent(moveRange.startContainer, moveRange.startOffset, moveRange.endContainer, moveRange.endOffset);
					await reg_lineMoveBugFixEnd();
					event.preventDefault();
					return;
				}else if(userKeyCode === 40 && (focusParDom.closest(".nbDenom")!==null || focusParDom.closest(".nbBinomCoSec")!==null) ){
					if(focusParDom.closest(".nbDenom") !== null) focusParDom = focusParDom.closest(".nbDenom");
					else focusParDom = focusParDom.closest(".nbBinomCoSec")

					if (document.caretRangeFromPoint) {
						moveRange = document.caretRangeFromPoint(position.x, focusParDom.getBoundingClientRect().y-focusParDom.getBoundingClientRect().height*0.5);
					} else if (document.caretPositionFromPoint) {
						moveRange = document.caretPositionFromPoint(position.x, focusParDom.getBoundingClientRect().y-focusParDom.getBoundingClientRect().height*0.5);
					}
					newRange.removeAllRanges();
					newRange.setBaseAndExtent(moveRange.startContainer, moveRange.startOffset, moveRange.endContainer, moveRange.endOffset);
					await reg_lineMoveBugFixEnd();
					event.preventDefault();
					return;
				}
			}
		}
		await reg_lineMoveBugFixEnd();
	}

	if((event.shiftKey && userKeyCode===38) || (event.shiftKey && userKeyCode===40)){
		window.getSelection().setBaseAndExtent(anchorNode, anchorOffset, window.getSelection().focusNode, window.getSelection().focusOffset);
	}


	//띄어쓰기 다섯칸 shift+space bar
	if(event.shiftKey && userKeyCode === 32){
		/*
		const selection = document.getSelection();
		const newRange = selection.getRangeAt(0);
		selection.removeAllRanges();
		selection.addRange(newRange);
		//span 노드 추가 안하고 nbGrammer 추가시 백스페이스 및 del 오류 날 수 있음(reg_preventKeyEvent)
		let tmpNode= document.createElement('span');
		tmpNode.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
		newRange.deleteContents();
		newRange.insertNode(tmpNode);
		window.getSelection().collapseToEnd();		//셀렉션객체의 마지막 부분에 포커스 맞춤
		*/
		//위 방식도 정상작동
		//ctrl+z 브라우저 자체 기능 사용위해 execCommand 방식으로 바꿈
		document.execCommand("insertHTML", false ,"&nbsp; &nbsp; &nbsp;");
		event.preventDefault();
	}

	//alt 단축키 제어
	if(event.altKey){
		const mappingKey = await reg_getMappingShortCutKey(event, window.shortCutKeyList);
		const isWriteDisableDom = await reg_writeDisableDom(event)
		if(mappingKey!= null && !isWriteDisableDom){      //alt 단축키 사용한 경우
			let nbGrammer = mappingKey[0]["nbGrammer"];
			/*
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
			*/
			//위 방식도 정상작동
			//ctrl+z 브라우저 자체 기능 사용위해 execCommand 방식으로 바꿈
			
			if(nbGrammer.length !== 0){
				//document.execCommand버그, 셀렉트 된 상태에서 수식 들어가야 다음 줄 줄바꿈 없음
				if(window.getSelection().isCollapsed){
					//테이블 요소인 경우에만 셀렉트 된 상태에서 수식 들어감, 일반 수식요소 셀렉트 된 상태에서 들어가면 span(tmpReGenerBugFix)태그 안에 들어가서 입력 후 바로 삭제 됨 
					if(nbGrammer.indexOf("nbBox")>-1){
						const newRange = window.getSelection().getRangeAt(0)
						window.getSelection().removeAllRanges();
						window.getSelection().addRange(newRange);
						let tmpNode= document.createElement('span');
						tmpNode.innerHTML = "&nbsp;"
						tmpNode.className = "tmpReGenerBugFix"
						let tmpNode2= document.createElement('span');
						tmpNode2.innerHTML = "&nbsp;"
						tmpNode2.className = "tmpReGenerBugFix2"
						if(newRange.commonAncestorContainer===document.activeElement && newRange.startOffset===0
							&& newRange.endOffset===0 && document.activeElement.childNodes[0] !== undefined
							&& document.activeElement.childNodes[0].tagName === "DIV"){
								document.activeElement.childNodes[0].prepend(tmpNode2);
								document.activeElement.childNodes[0].prepend(tmpNode);
						}else if( window.getSelection().getRangeAt(0).startContainer.tagName === "TR" && window.getSelection().getRangeAt(0).endContainer.tagName === "TR"
						&& window.getSelection().getRangeAt(0).startOffset === 0 && window.getSelection().getRangeAt(0).endOffset === 0
						&& window.getSelection().getRangeAt(0).endContainer.querySelector(".innerTbTd") !== null ){
							window.getSelection().getRangeAt(0).endContainer.querySelector(".innerTbTd").prepend(tmpNode2);
							window.getSelection().getRangeAt(0).endContainer.querySelector(".innerTbTd").prepend(tmpNode);
						}else{
							newRange.insertNode(tmpNode2);
							newRange.insertNode(tmpNode);
						}
						//div 마지막이 수식인 경우 tmpReGenerBugFix가 이미 추가되어 있어 수식이 tmpReGenerBugFix안으로 들어가 입력되지 않고 삭제되어버리는 버그 해결
						if(tmpNode2.nextSibling !== null && tmpNode2.nextSibling.classList !== undefined){
							if(tmpNode2.nextSibling.classList.contains("tmpReGenerBugFix")){
								tmpNode2.nextSibling.remove();
							}
						}
						newRange.selectNode(tmpNode2);
					}
				}else{
					//div의 맨앞에 들어가면 줄바꿈 이루어져서 맨앞에 공백 추가
					let strtContainer = window.getSelection().getRangeAt(0).startContainer;
					if(window.getSelection().getRangeAt(0).startContainer.classList === undefined) strtContainer = window.getSelection().getRangeAt(0).startContainer.parentElement;
					strtContainer = strtContainer.closest("div");
					if(window.getSelection().getRangeAt(0).startOffset===0 && strtContainer !== null){
						let tmpNode= document.createElement('span');
						tmpNode.innerHTML = "&nbsp;"
						tmpNode.className = "tmpReGenerBugFix"
						strtContainer.prepend(tmpNode);
					}
				}

				document.execCommand("insertHTML", false , nbGrammer);

				//nbCompile 루트 안의 분수 컴파일
				if(nbGrammer.indexOf("nbFracBox") > -1){
					let strtElement = window.getSelection().getRangeAt(0).startContainer;
					let endElement = window.getSelection().getRangeAt(0).endContainer;
					if(strtElement.classList === undefined) strtElement = strtElement.parentElement;
					if(endElement.classList === undefined) endElement = endElement.parentElement;
					strtElement = strtElement.closest(".nbRootBox");
					endElement = endElement.closest(".nbRootBox");
					if(strtElement !== null && endElement !== null){
						if(window.getSelection().getRangeAt(0).startContainer === window.getSelection().getRangeAt(0).endContainer){
							strtElement.querySelector(".nbRootBase").classList.add("nbCompile");
							strtElement.querySelector(".nbRootBase").classList.add("nbRootInFrac");
							strtElement.classList.add("nbCompile");
							strtElement.classList.add("nbRootInFrac");
						}
					}
				}
				

				//아래 명령어 사용하면 위에 명령어 필요 없음. 단, 포커스 다시 잡아줘야함, 깜빡임도 심함
				//document.execCommand("insertHTML", false , "<span class='tmpReGenerBugFix'>.</span>"+nbGrammer+"<span class='tmpReGenerBugFix2'>.</span>");

				//포커스 재설정 필요한 수식요소 포커스 설정
				let focusNbBorderBox = window.getSelection().focusNode;
				if(focusNbBorderBox.classList === undefined) focusNbBorderBox = focusNbBorderBox.parentElement;
				focusNbBorderBox = focusNbBorderBox.closest(".borderBox");
				
				if(focusNbBorderBox !== null) {
					//입력 불가 요소는 수식 오른쪽에 포커스
					for(let i=0; i<writeDisabledDom.length; i++){
						if(focusNbBorderBox.classList.contains(writeDisabledDom[i])){
							window.getSelection().getRangeAt(0).selectNode(focusNbBorderBox.closest(".nbBox"));
							window.getSelection().collapseToEnd();
						}
					}
	
					//연립방정식은 제일 첫번째 borderBox에 포커스
					if(focusNbBorderBox.classList.contains("nbThrCaseThr") && nbGrammer.indexOf("nbThrCaseThr") > -1){
						window.getSelection().getRangeAt(0).setStart(focusNbBorderBox.closest(".nbBox").querySelector(".nbThrCaseFir"), 0);
						window.getSelection().getRangeAt(0).setEnd(focusNbBorderBox.closest(".nbBox").querySelector(".nbThrCaseFir"), 0);
	
					}else if(focusNbBorderBox.classList.contains("nbCaseSec") && nbGrammer.indexOf("nbCaseSec") > -1){
						window.getSelection().getRangeAt(0).setStart(focusNbBorderBox.closest(".nbBox").querySelector(".nbCaseFir"), 0);
						window.getSelection().getRangeAt(0).setEnd(focusNbBorderBox.closest(".nbBox").querySelector(".nbCaseFir"), 0);
					}
				}
			}
		}
		event.preventDefault();
	}

	setTimeout(function(){
		let tmpReGenerBugFix = document.getElementsByClassName("tmpReGenerBugFix");
		while (tmpReGenerBugFix.length > 0) {
			tmpReGenerBugFix[0].remove();
		}
		let tmpReGenerBugFix2 = document.getElementsByClassName("tmpReGenerBugFix2");
		while (tmpReGenerBugFix2.length > 0) {
			tmpReGenerBugFix2[0].remove();
		}

		if( userKeyCode === 86 && event.ctrlKey){
			let copiedEditInnerTable = document.getElementById(document.activeElement.id).querySelector(".copiedEditInnerTable");
			if(copiedEditInnerTable !== null){
				copiedEditInnerTable.classList.remove("copiedEditInnerTable");
				let innerTbTd = copiedEditInnerTable.querySelectorAll(".innerTbTd")

				for(let i=0; i<innerTbTd.length; i++){
					if(!innerTbTd[i].classList.contains("nbSelectionTbTd")){
						innerTbTd[i].remove();
					}else{
						innerTbTd[i].addEventListener('mousedown', reg_tbCellMouseDown);
						innerTbTd[i].addEventListener('mousemove', reg_tbCellMouseMove);
					}
				}
				
				let innerTr = copiedEditInnerTable.querySelectorAll("tr");
				for(let i=0; i<innerTr.length; i++){
					let td = innerTr[i].querySelectorAll("td");
					if(td.length===0) innerTr[i].remove();
				}
				innerTr = copiedEditInnerTable.querySelectorAll("tr");
				for(let i=0; i<innerTr.length; i++){
					let td = innerTr[i].querySelectorAll("td");
					for(let j=0; j<td.length; j++){
						td[j].id="innerTbTd"+i+j;
					}
				}
			}

			let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
			for(let i=0; i<nbSelectionTbTd.length; i++){
					nbSelectionTbTd[i].classList.remove("nbSelectionTbTd");
			}
			
			//한글 붙여넣기 오류 해결
			if(!window.getSelection().isCollapsed){
				window.getSelection().collapseToStart();
			}
			
		}
	}, 0);
}

//테이블 td 너비 변경 위한 변수 
let mousedown = false; 
let td = ""; 
let td_width; 
let x = 0; 

const TCstartColResize = (obj) => {
	mousedown = true;
	td = obj;
	td_width = td.style.width;
	x = window.event.clientX;
}

const TCColResize = async () => {
	if(!document.getSelection().isCollapsed){
		return;
	} 
	if (mousedown){
		let distX = window.event.x - x; 
		let width = parseInt(td_width) + parseInt(distX);
		if(width>=10 ){
			let tdLen = td.parentElement.childNodes.length;
			let tagetNextIdx = -1;
			let elseWidth = 0;		//타겟 td와 그 옆 요소를 제외한 totalWidth;
			for(let i=0; i<tdLen; i++){
				if(td.parentElement.childNodes[i]===td) {
					//타겟 td가 마지막 요소일 경우 너비변경 로직 종료
					if(i===(tdLen-1)) return;

					tagetNextIdx= i+1;
				}else if(tagetNextIdx===i){
				}else{
					elseWidth += parseInt(td.parentElement.childNodes[i].style.width);
				}
			}

			let nextDom = td.parentElement.childNodes[tagetNextIdx]
			let nextDomWidth = 260-elseWidth-width;
			if(nextDomWidth <= 10) return;
			td.style.width =width+"px";
			
			nextDom.style.width = 260-elseWidth-width+"px";
		}
	}
}


const TCstopColResize = async () => {
	mousedown = false;
	td = '';
}


/*
*   테이블 컬럼의 오른쪽 윤곽선을 클릭한 경우
*/
const cell_right = async (obj) => {
	//+5 한 이유는 td에 padding 값 있으므로(하드코딩)
	if(window.event.offsetX > parseInt(obj.style.width)+5) return true;
	else return false;
}

/*
*	정의 : 테이블 너비 변경 mouseDown 이벤트
*/
export const reg_mDownTdWidthChange = async () => {
    try{
        let now_mousedown = window.event.target;
        if(now_mousedown.className.toUpperCase().indexOf("INNERTBTD")>-1){
			if(await cell_right(now_mousedown)){
				await TCstartColResize(now_mousedown);
			}
			
			

        }
    }catch(event){ return true; }
}


/*
*	정의 : 테이블 너비 변경 mouseMove 이벤트
*/
export const reg_mMoveTdWidthChange = async () => {
	try{
		if(!mousedown) return;
        let now_mousemove = window.event.target;
        if(now_mousemove.className.toUpperCase().indexOf("INNERTBTD")>-1 || td !== ""){
            if(await cell_right(now_mousemove) ){
				await TCColResize();
			}
           
        }else{
    }
    }catch(event){ return true; }

}

/*
*	정의 : 테이블 너비 변경 mouseUp 이벤트
*/
export const reg_mUpTdWidthChange = async () => {
    try{
        let now_mouseup = window.event.target;
        await TCstopColResize(now_mouseup);
    //}
    }catch(event){ return true; }
}

/*
*	정의 : 테이블 너비 변경 onSelect 이벤트
*/
export const reg_selStartTdWidthChange = async () => {
    try{
        if(td !== ""){
            return false;
        }
    }catch(event){ return true; }
}

/*
* 정의 : 단원 및 유형 콤보박스 및 커스텀 셀박스 서버 데이터 매핑 함수
*/
export const reg_selectUnitOrTypeData = async (targetId, titleTag, divTag, compareStr ) => {

	let subjects =  document.getElementById(targetId);
	for(let i=0; i<subjects.length; i++){
		if(subjects[i].dataset.uniqNo == compareStr){	//삼항식 쓰면 오류남
			subjects[i].selected = true;
			document.getElementById(titleTag).innerHTML =document.getElementById(targetId)[document.getElementById(targetId).selectedIndex].innerHTML;
			document.getElementById(divTag).classList.add("nbCustomSelected");
		}
	}
}

export const reg_selectTypeData = async (targetId, titleTag, divTag, compareStr ) => {
	let subjects =  document.getElementById(targetId);
	for(let i=0; i<subjects.length; i++){
		if(subjects[i].dataset.typeNo == compareStr){	//삼항식 쓰면 오류남
			subjects[i].selected = true;
			document.getElementById(titleTag).innerHTML =document.getElementById(targetId)[document.getElementById(targetId).selectedIndex].innerHTML;
			document.getElementById(divTag).classList.add("nbCustomSelected");
			
		}
	}
}


/*
*	정의 : 편집기 표 추가ui 표 이외의 요소 클릭시 사라지는 효과
*/
export const reg_eraseEditTbUI = async (event ) =>{
	let idBorderDesc = (event.target.id==="tbBorderDesc" || event.target.id==="tbBorderCheck")
	if(event.target.tagName==="A") return;
	if(idBorderDesc) return;

	let tagetDom = event.target.closest('button');
	if(tagetDom==null) {
		document.getElementById("editTableUi").classList.add("hide");
		return;
	}
	let targetId = tagetDom.id;
	if (targetId != "editTableBtn" || targetId !="editTableBtn" ){
		document.getElementById("editTableUi").classList.add("hide");
	} 
}

/*
* 정의 : reg_selectFormulaElement 함수에서 사용하는 수식요소별 전첵 선택규칙(startContainer 체크)
*		규칙1 = 루트, 조건(가) 분수는 처음과 끝 선택시 전체선택되야함
*		규칙2 = 루트 분수, 경우의수, 이항계수는 하나의 수식요소 밑 같은 요소끼리 select시 전체 선택 안함.(다른요소일때는 전체선택)
*		규칙3 = 윗첨자, 아랫첨자, 순열과조합, 순환소스, 악센트, 선분과 직선, 분수용 지수는 무조건 전체선택
*/
export const reg_allSelFormulaAnchorRule = async (isMouseUp) => {
	//루트, 조건(가) 직사각형
	let strtConOneDepth = document.getSelection().anchorNode;
	if(strtConOneDepth.classList === undefined) strtConOneDepth = strtConOneDepth.parentElement.closest('.nbBox');
	else strtConOneDepth = strtConOneDepth.closest('.nbBox');
	
	if(strtConOneDepth.classList.contains("nbRootBox") || strtConOneDepth.classList.contains("nbCondBox") ){
		return false;
	}
	//분수, 루트 분수, 경우의수, 이항계수는  하나의 수식요소 밑 같은 요소끼리 select시 전체 선택 안함.(다른요소일때는 전체선택)
	else if(strtConOneDepth.classList.contains("nbFracBox") || strtConOneDepth.classList.contains("nbRootFracBox")
		|| strtConOneDepth.classList.contains("nbCaseBrckBox") || strtConOneDepth.classList.contains("nbThrCasekBox")
		|| strtConOneDepth.classList.contains("nbBinomCoBox")){
		return false;
	}
	//윗첨자, 아랫첨자, 순열과조합, 순환소스, 악센트, 선분과 직선, 분수용 지수는 무조건 전체선택

	//셀렉트 선택없이 포커스 하나만 있는 경우는 이벤트 적용X
	if(isMouseUp && window.getSelection().isCollapsed) return false;
	return true;
}
/*
* 정의 : reg_allSelFormulaRuleEnd 함수에서 사용하는 규칙(endContainer 체크)
*		규칙1 = 루트, 조건(가) 분수는 처음과 끝 선택시 전체선택되야함
*		규칙2 = 루트 분수, 경우의수, 이항계수는 하나의 수식요소 밑 같은 요소끼리 select시 전체 선택 안함.(다른요소일때는 전체선택)
*		규칙3 = 윗첨자, 아랫첨자, 순열과조합, 순환소스, 악센트, 선분과 직선, 분수용 지수는 무조건 전체선택
*/
export const reg_allSelFormulaRuleEnd = async (isMouseUp) => {
	//루트, 조건(가) 직사각형
	let endConOneDepth = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.nbBox');
	if(endConOneDepth.classList.contains("nbRootBox") || endConOneDepth.classList.contains("nbCondBox") ){
		return false;
	}
	//분수, 루트 분수, 경우의수, 이항계수는  하나의 수식요소 밑 같은 요소끼리 select시 전체 선택 안함.(다른요소일때는 전체선택)
	else if(endConOneDepth.classList.contains("nbFracBox") || endConOneDepth.classList.contains("nbRootFracBox")
		|| endConOneDepth.classList.contains("nbCaseBrckBox") || endConOneDepth.classList.contains("nbThrCasekBox")
		|| endConOneDepth.classList.contains("nbBinomCoBox")){
		return false;
	}
	//윗첨자, 아랫첨자, 순열과조합, 순환소스, 악센트, 선분과 직선, 분수용 지수는 무조건 전체선택

	//셀렉트 선택없이 포커스 하나만 있는 경우는 이벤트 적용X
	if(isMouseUp && window.getSelection().isCollapsed) return false;
	return true;
}


export const reg_allSelFormulaFocusRule = async (isMouseUp) => {
	//루트, 조건(가) 직사각형
	let focusNbBox= document.getSelection().focusNode;

	if(focusNbBox.nodeName === "#text") focusNbBox=focusNbBox.parentElement.closest('.nbBox');
	else focusNbBox=focusNbBox.closest('.nbBox');
	
	if(focusNbBox === null ) return false;

	//루트, 조건 박스는 처음과 끝 선택시 전체 선택
	if(focusNbBox.classList.contains("nbRootBox") || focusNbBox.classList.contains("nbCondBox") ){
		return false;
	}
	//분수, 루트 분수, 경우의수, 이항계수는  하나의 수식요소 밑 같은 요소끼리 select시 전체 선택 안함.(다른요소일때는 전체선택)
	else if(focusNbBox.classList.contains("nbFracBox") || focusNbBox.classList.contains("nbRootFracBox")
		|| focusNbBox.classList.contains("nbCaseBrckBox") || focusNbBox.classList.contains("nbThrCasekBox")
		|| focusNbBox.classList.contains("nbBinomCoBox")){
		return false;
	}
	
	//윗첨자, 아랫첨자, 순열과조합, 순환소스, 악센트, 선분과 직선, 분수용 지수는 무조건 전체선택

	//셀렉트 선택없이 포커스 하나만 있는 경우는 이벤트 적용X
	if(isMouseUp && window.getSelection().isCollapsed) return false;
	return true;
}



export const reg_removeSelectionBackColor = async () => {
	let nbSelectionDiv = document.querySelectorAll(".nbSelectionDiv");
	for(let i=0; i<nbSelectionDiv.length; i++){
		nbSelectionDiv[i].classList.remove("nbSelectionDiv");
	}
}
/*
* 정의 : 수식요소셀렉트(드래그)시 nbBox 테이블 요소 배경색 설정
*/
export const reg_dressSelectionBackColor = async () => {
	let nbSelectionDiv = document.querySelectorAll(".nbSelectionDiv");
	for(let i=0; i<nbSelectionDiv.length; i++){
		nbSelectionDiv[i].classList.remove("nbSelectionDiv");
	}
	if(window.getSelection().isCollapsed) return;
	if(window.getSelection().getRangeAt(0).commonAncestorContainer.classList !== undefined){
		let selectionNbBox;
		if(window.getSelection().getRangeAt(0).commonAncestorContainer.classList.contains("nbBox")){
			selectionNbBox = window.getSelection().getRangeAt(0).commonAncestorContainer;
			selectionNbBox.classList.add("nbSelectionDiv");
		} 
		else{
			selectionNbBox = window.getSelection().getRangeAt(0).commonAncestorContainer.querySelectorAll(".nbBox");
			for(let i=0; i<selectionNbBox.length; i++){
				if( window.getSelection().containsNode(selectionNbBox[i]) ){
					selectionNbBox[i].classList.add("nbSelectionDiv");
				}
			}
		} 
		
		
	}
	
}
/*
* 정의 : 수식요소셀렉트(드래그)시 걸쳐서 셀렉트 안되고 table 요소 전체 셀렉트 되게끔 구현(마우스up 이벤트에 적용)
*/
export const reg_selectFormulaElement = async (event) => {
	let anchorNbBox = document.getSelection().anchorNode
	if(anchorNbBox.classList === undefined) anchorNbBox = anchorNbBox.parentElement.closest('.nbBox');
	else anchorNbBox = anchorNbBox.closest('.nbBox');

	let focusNbBox = document.getSelection().focusNode;
	if(focusNbBox.classList === undefined) focusNbBox = focusNbBox.parentElement.closest('.nbBox');
	else focusNbBox = focusNbBox.closest('.nbBox');

	
	//셀렉션의 앵커와 포커스에 수식요소 있는 경우
	if(anchorNbBox !== null && focusNbBox !== null){
		while(anchorNbBox.parentElement.closest('.nbBox')!==null){
			anchorNbBox = anchorNbBox.parentElement.closest('.nbBox');
		}
		while(focusNbBox.parentElement.closest('.nbBox')!==null){
			focusNbBox = focusNbBox.parentElement.closest('.nbBox');
		}
		//최상위 수식요소가 같은 경우
		if(anchorNbBox === focusNbBox){
			//하나의 수식요소 밑에서 같은 요소끼리 select한 경우
			if( document.getSelection().getRangeAt(0).startContainer === document.getSelection().getRangeAt(0).endContainer){
				if(await reg_allSelFormulaAnchorRule(true)){
					focusNbBox = document.getSelection().focusNode.parentElement.closest('.nbBox');
					let orgRange = window.getSelection()
					let focusNode = window.getSelection().focusNode;
					let strtContainer = window.getSelection().getRangeAt(0).startContainer;
					orgRange.removeAllRanges();
					if(focusNode === strtContainer){
						orgRange.setBaseAndExtent(focusNbBox, 1, focusNbBox, 0);
					}else{
						orgRange.setBaseAndExtent(focusNbBox, 0, focusNbBox, 1);
					}
					await reg_dressSelectionBackColor();
					return;
				}else{
					//예외 케이스 중 분수, 경우의 수, 이항계수는 하나의 수식요소를 선택하는 경우에 전체 선택이 아님
					let anchorNbRootBox = document.getSelection().anchorNode;
					let focusNbRootBox = document.getSelection().focusNode;
					if(anchorNbRootBox.classList !== undefined) anchorNbRootBox = anchorNbRootBox.closest(".nbBox");
					else anchorNbRootBox = anchorNbRootBox.parentElement.closest(".nbBox");
					if(focusNbRootBox.classList !== undefined) focusNbRootBox = focusNbRootBox.closest(".nbBox");
					else focusNbRootBox = focusNbRootBox.parentElement.closest(".nbBox");

					//루트 예외 케이스1) 루트, 조건 직사각형인 경우 처음과 끝 선택하면 루트, 조건 직사각형 전체 선택
					if( focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox") 
					|| anchorNbRootBox.classList.contains("nbRootBox") || anchorNbRootBox.classList.contains("nbCondBox") ){
						if(document.getSelection().getRangeAt(0).startOffset===0
						&& document.getSelection().getRangeAt(0).startContainer.previousSibling === null 
						&& (document.getSelection().getRangeAt(0).endContainer.nextSibling === null || document.getSelection().getRangeAt(0).endContainer.nextSibling.nodeValue === "") ){
							if(document.getSelection().getRangeAt(0).endContainer.nodeName === "#text" 
							&& document.getSelection().getRangeAt(0).endContainer.length !== document.getSelection().getRangeAt(0).endOffset){
								return;
							}
							if(window.getSelection().isCollapsed ) return;	// 비어있는 요소 클릭시 전체 선택되는 문제 해결
							
							let strtContainer = window.getSelection().getRangeAt(0).startContainer;
							let focusNode = window.getSelection().focusNode;
							let orgRange = window.getSelection()
							orgRange.removeAllRanges();
							if(focusNode === strtContainer){
								if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 1, focusNbRootBox, 0);
								else orgRange.setBaseAndExtent(anchorNbRootBox, 1, anchorNbRootBox, 0);
							}else{
								if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 0, focusNbRootBox, 1);
								else orgRange.setBaseAndExtent(anchorNbRootBox, 0, anchorNbRootBox, 1);
							}
							await reg_dressSelectionBackColor();
							return;
						}
					}
				}
			//하나의 수식요소 밑에서 다른 요소끼리 select한 경우
			}else{
				let isAllSel = false;
				let strtParElement = document.getSelection().getRangeAt(0).startContainer.parentElement;
				let endParElement = document.getSelection().getRangeAt(0).endContainer.parentElement;
				let strtContainer = document.getSelection().getRangeAt(0).startContainer;
				let endContainer = document.getSelection().getRangeAt(0).endContainer;
				//분수, 루트분수의 경우 분모분자 다르면 전체선택
				if(strtParElement.closest('.nbNumer') !== null
				&& endParElement.closest('.nbDenom') !== null) {
					isAllSel=true;
				}else if(strtParElement.closest('.nbNumer') !== null && endContainer.classList !== undefined && endContainer.classList.contains('nbDenom')){
					isAllSel=true;
				}else if(strtContainer.classList !== undefined && strtContainer.classList.contains('nbNumer') && endParElement.closest('.nbDenom')!== null ){
					isAllSel=true;
				}else if(strtContainer.classList !== undefined && endContainer.classList !== undefined &&
					strtContainer.classList.contains('nbNumer') && endContainer.classList.contains('nbDenom')){
						isAllSel=true;
				}
				//순열과 조합 선택요소 다르면 전체 선택
				else if( (strtParElement.closest('.nbLeftSub') !== null && endParElement.closest('.nbBiDirSubBase') !== null) 
				|| (strtParElement.closest('.nbLeftSub') !== null && endParElement.closest('.nbRightSub') !== null)
				|| (strtParElement.closest('.nbBiDirSubBase') !== null && endParElement.closest('.nbRightSub') !== null) ){
					isAllSel=true;
				}
				else if( (strtContainer.classList !== undefined && endContainer.classList !== undefined) &&
					(  (strtContainer.classList.contains('nbLeftSub') && endContainer.classList.contains('nbBiDirSubBase'))
					|| (strtContainer.classList.contains('nbLeftSub') && endContainer.classList.contains('nbRightSub'))
					|| (strtContainer.classList.contains('nbBiDirSubBase') && endContainer.classList.contains('nbRightSub')) ) ){
						isAllSel=true;
				}
				//이항계수 케이스 다르면 전체 선택
				else if(strtParElement.closest('.nbBinomCoFir') !== null && endParElement.closest('.nbBinomCoSec') !== null){
					isAllSel=true;
				}
				else if( (strtContainer.classList !== undefined && endContainer.classList !== undefined) &&
					  (strtContainer.classList.contains('nbBinomCoFir') && endContainer.classList.contains('nbBinomCoSec')) ){
						isAllSel=true;
				}
				//경우의 수 케이스 다르면 전체 선택
				else if(strtParElement.closest('.nbCaseFir') !== null && endParElement.closest('.nbCaseSec') !== null){
					isAllSel=true;
				}
				else if( (strtContainer.classList !== undefined && endContainer.classList !== undefined) &&
					(  (strtContainer.classList.contains('nbCaseFir') && endContainer.classList.contains('nbCaseSec'))) ){
						isAllSel=true;
				}
				//세가지 경우의 수 케이스 다르면 전체 선택
				else if( (strtParElement.closest('.nbThrCaseFir') !== null && endParElement.closest('.nbThrCaseSec') !== null)
				|| (strtParElement.closest('.nbThrCaseFir') !== null && endParElement.closest('.nbThrCaseThr') !== null)
				|| (strtParElement.closest('.nbThrCaseSec') !== null && endParElement.closest('.nbThrCaseThr') !== null)){
					isAllSel=true;
				}
				else if( (strtContainer.classList !== undefined && endContainer.classList !== undefined) &&
					(  (strtContainer.classList.contains('nbThrCaseFir') && endContainer.classList.contains('nbThrCaseSec'))
					|| (strtContainer.classList.contains('nbThrCaseFir') && endContainer.classList.contains('nbThrCaseThr'))
					|| (strtContainer.classList.contains('nbThrCaseSec') && endContainer.classList.contains('nbThrCaseThr')) ) ){
						isAllSel=true;
				}

				let anchorNbRootBox = document.getSelection().anchorNode;
				let focusNbRootBox = document.getSelection().focusNode;
				if(anchorNbRootBox.classList !== undefined) anchorNbRootBox = anchorNbRootBox.closest(".nbBox");
				else anchorNbRootBox = anchorNbRootBox.parentElement.closest(".nbBox");
				if(focusNbRootBox.classList !== undefined) focusNbRootBox = focusNbRootBox.closest(".nbBox");
				else focusNbRootBox = focusNbRootBox.parentElement.closest(".nbBox");

				//루트 예외 케이스1) 루트, 조건 직사각형인 경우 처음과 끝 선택하면 루트, 조건 직사각형 전체 선택
				if((focusNbRootBox=== anchorNbRootBox) && (focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")
				|| anchorNbRootBox.classList.contains("nbRootBox") || anchorNbRootBox.classList.contains("nbCondBox")) ){
					if(document.getSelection().getRangeAt(0).startOffset===0
					&& document.getSelection().getRangeAt(0).startContainer.previousSibling === null 
					&& (document.getSelection().getRangeAt(0).endContainer.nextSibling === null || document.getSelection().getRangeAt(0).endContainer.nextSibling.nodeValue === "") ){
						if(document.getSelection().getRangeAt(0).endContainer.nodeName === "#text" 
						&& document.getSelection().getRangeAt(0).endContainer.length !== document.getSelection().getRangeAt(0).endOffset){
							return;
						}
						
						if(window.getSelection().isCollapsed ) return;	// 비어있는 요소 클릭시 전체 선택되는 문제 해결
						let strtContainer = window.getSelection().getRangeAt(0).startContainer
						let focusNode = window.getSelection().focusNode
						let orgRange = window.getSelection()
						orgRange.removeAllRanges();
						if(focusNode === strtContainer){
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 1, focusNbRootBox, 0);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 1, anchorNbRootBox, 0);
						}else{
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 0, focusNbRootBox, 1);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 0, anchorNbRootBox, 1);
						}
						await reg_dressSelectionBackColor();
						return;
					}

				//루트 예외 케이스2) 루트 끝에 지수있고 지수에서 루트 선택할때
				} else if( (focusNbRootBox.contains(window.getSelection().anchorNode)
				&& (focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) )
				|| (anchorNbRootBox.contains(window.getSelection().focusNode)
				&& (anchorNbRootBox.classList.contains("nbRootBox") || anchorNbRootBox.classList.contains("nbCondBox")) ) ){
					if(document.getSelection().getRangeAt(0).startOffset===0
					&& document.getSelection().getRangeAt(0).startContainer.previousSibling === null 
					&& (document.getSelection().getRangeAt(0).endContainer.nextSibling === null || document.getSelection().getRangeAt(0).endContainer.nextSibling.nodeValue === "") ){
						
						if(document.getSelection().getRangeAt(0).endContainer.nodeName === "#text" 
						&& document.getSelection().getRangeAt(0).endContainer.length !== document.getSelection().getRangeAt(0).endOffset){
							return;
						}
						if(window.getSelection().isCollapsed ) return;	// 비어있는 요소 클릭시 전체 선택되는 문제 해결
						let strtContainer = window.getSelection().getRangeAt(0).startContainer
						let focusNode = window.getSelection().focusNode
						let orgRange = window.getSelection()
						orgRange.removeAllRanges();
						if(focusNode === strtContainer){
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 1, focusNbRootBox, 0);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 1, anchorNbRootBox, 0);
						}else{
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 0, focusNbRootBox, 1);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 0, anchorNbRootBox, 1);
						}
						await reg_dressSelectionBackColor();
						return;
					}
				}
			
				if(isAllSel){
					let orgRange = window.getSelection()
					let focusNode = window.getSelection().focusNode;
					let strtContainer = window.getSelection().getRangeAt(0).startContainer;
					orgRange.removeAllRanges();
					if(focusNode === strtContainer){
						orgRange.setBaseAndExtent(focusNbBox, 1, focusNbBox, 0);
					}else{
						orgRange.setBaseAndExtent(focusNbBox, 0, focusNbBox, 1);
					}
					await reg_dressSelectionBackColor();
					return;
				}else{
					let anchorNodeOneDepth = document.getSelection().anchorNode;
					if(anchorNodeOneDepth.classList !== undefined){
						anchorNodeOneDepth = anchorNodeOneDepth.closest('.nbBox')
					}else{
						anchorNodeOneDepth = anchorNodeOneDepth.parentElement.closest('.nbBox')
					}
					
					let focusNodeOneDepth = document.getSelection().focusNode;
					if(focusNodeOneDepth.classList !== undefined){
						focusNodeOneDepth = focusNodeOneDepth.closest('.nbBox')
					}else{
						focusNodeOneDepth = focusNodeOneDepth.parentElement.closest('.nbBox')
					}

					//셀렉션의 앵커와 포커스에 수식요소 있으며 수식요소가 최상위 요소가 아닌 경우
					if(anchorNodeOneDepth !== anchorNbBox && focusNodeOneDepth !== focusNbBox){
						let orgRange = window.getSelection()
						let focusNode = window.getSelection().focusNode;
						let strtContainer = window.getSelection().getRangeAt(0).startContainer;
						orgRange.removeAllRanges();
						if(focusNode === strtContainer){
							orgRange.setBaseAndExtent(anchorNodeOneDepth, 1, focusNodeOneDepth, 0);
						}else{
							orgRange.setBaseAndExtent(anchorNodeOneDepth, 0, focusNodeOneDepth, 1);
						}
						await reg_dressSelectionBackColor();
						return;
					}
					//셀렉션의 앵커에 수식요소 있으며 수식요소가 최상위 요소가 아닌 경우
					else if(anchorNodeOneDepth !== anchorNbBox){
						if(await reg_allSelFormulaAnchorRule(true)){
							let orgRange = window.getSelection()
							let focusNode = window.getSelection().focusNode;
							let focusOffset = window.getSelection().focusOffset;
							let strtContainer = window.getSelection().getRangeAt(0).startContainer;
							orgRange.removeAllRanges();
							if(focusNode === strtContainer){
								orgRange.setBaseAndExtent(anchorNodeOneDepth, 1, focusNode, focusOffset);
							}else{
								orgRange.setBaseAndExtent(anchorNodeOneDepth, 0, focusNode, focusOffset);
							}
							await reg_dressSelectionBackColor();
							return;
						}
					}
					//셀렉션의 포커스에 수식요소 있으며 수식요소가 최상위 요소가 아닌 경우
					else if(focusNodeOneDepth !== focusNbBox){
						if(await reg_allSelFormulaFocusRule(true)){
							let orgRange = window.getSelection()
							let focusNode = window.getSelection().focusNode;
							let anchorNode = window.getSelection().anchorNode;
							let anchorOffset = window.getSelection().anchorOffset;
							let strtContainer = window.getSelection().getRangeAt(0).startContainer;
							orgRange.removeAllRanges();
							if(focusNode === strtContainer){
								orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNodeOneDepth, 0);
							}else{
								orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNodeOneDepth, 1);
							}
							await reg_dressSelectionBackColor();
							return;
						}
					}
				}
			}
		//최상위 수식요소가 다른 경우
		}else{
			let orgRange = window.getSelection()
			let focusNode = window.getSelection().focusNode;
			let strtContainer = window.getSelection().getRangeAt(0).startContainer;
			orgRange.removeAllRanges();
			if(focusNode === strtContainer){
				orgRange.setBaseAndExtent(anchorNbBox, 1, focusNbBox, 0);
			}else{
				orgRange.setBaseAndExtent(anchorNbBox, 0, focusNbBox, 1);
			}
			await reg_dressSelectionBackColor();
			return;
		}
	//셀렉션의 포커스에 수식요소 있는 경우
	}else if(focusNbBox !== null){
		while(focusNbBox.parentElement.closest('.nbBox')!==null){
			focusNbBox = focusNbBox.parentElement.closest('.nbBox');
		}
		let orgRange = window.getSelection()
		let anchorNode = window.getSelection().anchorNode;
		let anchorOffset = window.getSelection().anchorOffset;
		let focusNode = window.getSelection().focusNode;
		let strtContainer = window.getSelection().getRangeAt(0).startContainer;
		orgRange.removeAllRanges();
		if(focusNode === strtContainer){
			orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNbBox, 0);
		}else{
			orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNbBox, 1);
		}
		await reg_dressSelectionBackColor();
		return;
	//셀렉션의 앵커에 수식요소 있는 경우
	}else if(anchorNbBox !== null){
		while(anchorNbBox.parentElement.closest('.nbBox')!==null){
			anchorNbBox = anchorNbBox.parentElement.closest('.nbBox');
		}
		let orgRange = window.getSelection()
		let focusNode = window.getSelection().focusNode;
		let focusOffset = window.getSelection().focusOffset;
		let strtContainer = window.getSelection().getRangeAt(0).startContainer;
		orgRange.removeAllRanges();
		if(focusNode === strtContainer){
			orgRange.setBaseAndExtent(anchorNbBox, 1, focusNode, focusOffset);
		}else{
			orgRange.setBaseAndExtent(anchorNbBox, 0, focusNode, focusOffset);
		}
		await reg_dressSelectionBackColor();
		return;
	}
	else{
		await reg_dressSelectionBackColor();
	}
}

/*
* 정의 : 수식요소셀렉트(드래그)시 걸쳐서 셀렉트 안되고 table 요소 전체 셀렉트 되게끔 구현(키보드up 이벤트에 적용)
*/
export const reg_keyEvSelectFormulaElement = async (event) => {
	let userKeyCode = event.keyCode;

	//borderBox 뒤에 한글 쓴 후 지우면 포커스 사라지는 문제 해결
	if(event.keyCode === 229 && event.code === "Backspace"){
		if(document.getElementsByClassName("tmpFocusHideBugFix")[0] !== undefined){
			document.getElementsByClassName("tmpFocusHideBugFix")[0].remove()
		}
	}
	
	
	//키보드 좌우 화살표 누른 경우(셀렉트)
	if(event.shiftKey && (userKeyCode===37 || userKeyCode===39)){
		let strtNbBox = document.getSelection().getRangeAt(0).startContainer;
		if(strtNbBox.classList !== undefined && strtNbBox.closest(".nbBox") !== null){
			strtNbBox = strtNbBox.closest(".nbBox")
		}else{
			strtNbBox = strtNbBox.parentElement.closest(".nbBox")
		}

		let endNbBox = document.getSelection().getRangeAt(0).endContainer;
		if(endNbBox.classList !== undefined && endNbBox.closest(".nbBox") !== null){
			endNbBox = endNbBox.closest(".nbBox")
		}else{
			endNbBox = endNbBox.parentElement.closest(".nbBox")
		}

		let rootStrtNbBox = null;
		if(strtNbBox !== null){
			while(strtNbBox.parentElement.closest('.nbBox')!==null){
				strtNbBox = strtNbBox.parentElement.closest('.nbBox');
			}
			rootStrtNbBox = strtNbBox;
		}

		let rootEndNbBox =null;
		if(endNbBox !== null){
			while(endNbBox.parentElement.closest('.nbBox')!==null){
				endNbBox = endNbBox.parentElement.closest('.nbBox');
			}
			rootEndNbBox = endNbBox;
		}
		//하나의 수식요소 밑(최상위 수식요소가 같은 경우)
		if(rootStrtNbBox !== null && rootStrtNbBox === rootEndNbBox){
			let anchorNbBox = window.getSelection().anchorNode;
			let focusNbBox = window.getSelection().focusNode;

			if(anchorNbBox.nodeName === "#text") anchorNbBox = anchorNbBox.parentElement.closest(".nbBox");
			else anchorNbBox = anchorNbBox.closest(".nbBox");
			
			if(focusNbBox.nodeName === "#text") focusNbBox = focusNbBox.parentElement.closest(".nbBox");
			else focusNbBox = focusNbBox.closest(".nbBox");
			//포커스 노드가 최상위 노드가 아닌 경우
			if(focusNbBox !== rootStrtNbBox){
				//포커스 노드의 예외케이스 판별
				if(await reg_allSelFormulaFocusRule(false)){
					let orgRange = window.getSelection()
					//앵커노드가 예외케이스인 경우에는 nbBox 아닌 앵커노드 오프셋으로 셀렉션 설정
					//예외케이스 중 루트가 앵커에 있는 경우 루트 전체 선택되도록 함
					if(anchorNbBox.classList.contains("nbFracBox") || anchorNbBox.classList.contains("nbRootFracBox")
					|| anchorNbBox.classList.contains("nbCaseBrckBox") || anchorNbBox.classList.contains("nbThrCasekBox")
					|| anchorNbBox.classList.contains("nbBinomCoBox")){
						let anchorNode = window.getSelection().anchorNode;
						let anchorOffset = window.getSelection().anchorOffset;
						orgRange.removeAllRanges();
						if(userKeyCode===37) orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNbBox, 0)
						else if(userKeyCode===39) orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNbBox, 1);
						return;
					//포커스노드가 예외케이스가 아닌 수식요소인 경우 포커스노드와 앵커노드  
					}else{
						if(window.getSelection().anchorNode.nodeName==="TD" && window.getSelection().focusNode.nodeName !== "TD"){
							anchorNbBox = focusNbBox;
						}
						orgRange.removeAllRanges();
						if(userKeyCode===37) orgRange.setBaseAndExtent(anchorNbBox, 1, focusNbBox, 0)
						else if(userKeyCode===39) orgRange.setBaseAndExtent(anchorNbBox, 0, focusNbBox, 1);
						return;

					}
				}
			//하위에 다른 수식요소 없이 단독으로 쓰이는 경우
			}else{
				if(await reg_allSelFormulaFocusRule(false)){
					let orgRange = window.getSelection()
					let anchorNbBox = window.getSelection().anchorNode;
					if(anchorNbBox.nodeName === "#text") anchorNbBox = anchorNbBox.parentElement.closest(".nbBox");
					else anchorNbBox = anchorNbBox.closest(".nbBox");

					let focusNbBox = window.getSelection().focusNode;
					if(focusNbBox.nodeName === "#text") focusNbBox = focusNbBox.parentElement.closest(".nbBox");
					else focusNbBox = focusNbBox.closest(".nbBox");
					orgRange.removeAllRanges();
					if(userKeyCode===37) orgRange.setBaseAndExtent(anchorNbBox, 1, focusNbBox, 0)
					else if(userKeyCode===39) orgRange.setBaseAndExtent(anchorNbBox, 0, focusNbBox, 1);
					return;
				}
			}

			//루트 예외 케이스1) 루트, 조건 직사각형인 경우 처음과 끝 선택하면 루트, 조건 직사각형 전체 선택
			if( (focusNbBox.classList.contains("nbRootBox") || focusNbBox.classList.contains("nbCondBox") ) && focusNbBox === anchorNbBox){
				if(document.getSelection().getRangeAt(0).startOffset===0
				&& document.getSelection().getRangeAt(0).startContainer.previousSibling === null 
				&& (document.getSelection().getRangeAt(0).endContainer.nextSibling === null || document.getSelection().getRangeAt(0).endContainer.nextSibling.nodeValue === "") ){
					if(document.getSelection().getRangeAt(0).endContainer.nodeName === "#text" 
					&& document.getSelection().getRangeAt(0).endContainer.length !== document.getSelection().getRangeAt(0).endOffset){
						return;
					}
					let orgRange = window.getSelection()
					orgRange.removeAllRanges();
					if(userKeyCode===37) orgRange.setBaseAndExtent(focusNbBox, 1, focusNbBox, 0)
					else if(userKeyCode===39) orgRange.setBaseAndExtent(focusNbBox, 0, focusNbBox, 1);
					return;
				}
			//루트 예외 케이스2) 루트, 조건 직사각형이 루트 밖에서 셀렉트 하는 경우 전체 셀렉트
			}else if((focusNbBox.classList.contains("nbRootBox") || focusNbBox.classList.contains("nbCondBox") ) && focusNbBox !== anchorNbBox){
				let orgRange = window.getSelection()
				let anchorNode = window.getSelection().anchorNode
				let anchorOffset = window.getSelection().anchorOffset;
				orgRange.removeAllRanges();
				if(userKeyCode===37) orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNbBox, 0)
				else if(userKeyCode===39) orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNbBox, 1);
				return;
			}

			//최상위 예외 케이스1) 분수, 루트 분수인 경우 분모, 분자 선택시 분수 전체 선택
			let isDepthOneSel = false;
			let strtParElement = document.getSelection().getRangeAt(0).startContainer.parentElement;
			let endParElement = document.getSelection().getRangeAt(0).endContainer.parentElement;
			let strtContainer = document.getSelection().getRangeAt(0).startContainer;
			let endContainer = document.getSelection().getRangeAt(0).endContainer;
			if(rootStrtNbBox.classList.contains("nbFracBox") || rootStrtNbBox.classList.contains("nbRootFracBox")){
				if(strtParElement.closest('.nbNumer') !== null && endParElement.closest('.nbDenom') !== null) {
					isDepthOneSel = true;
				}else if(strtParElement.closest('.nbNumer') !== null && endContainer.classList !== undefined && endContainer.classList.contains('nbDenom')){
					isDepthOneSel = true;
				}else if(strtContainer.classList !== undefined && strtContainer.classList.contains('nbNumer') && endParElement.closest('.nbDenom')!== null ){
					isDepthOneSel = true;
				}else if(strtContainer.classList !== undefined && endContainer.classList !== undefined &&
				strtContainer.classList.contains('nbNumer') && endContainer.classList.contains('nbDenom')){
					isDepthOneSel = true;
				}
				if(isDepthOneSel){
					let orgRange = window.getSelection()
					orgRange.removeAllRanges();
					if(userKeyCode===37) orgRange.setBaseAndExtent(rootStrtNbBox, 1, rootStrtNbBox, 0)
					else if(userKeyCode===39) orgRange.setBaseAndExtent(rootStrtNbBox, 0, rootStrtNbBox, 1);
					return;
				}
			}
			//최상위 예외 케이스2) 경우의수, 이항계수는  하나의 수식요소 밑 같은 요소끼리 select시 전체 선택 안함.(다른요소일때는 전체선택)
			else if(rootStrtNbBox.classList.contains("nbCaseBrckBox") || rootStrtNbBox.classList.contains("nbThrCasekBox")
			|| rootStrtNbBox.classList.contains("nbBinomCoBox")){
				//두가지 경우의 수 케이스 다르면 전체 선택
				if(strtParElement.closest('.nbCaseFir') !== null && endParElement.closest('.nbCaseSec') !== null){
					isDepthOneSel = true;
				}
				//세가지 경우의 수 케이스 다르면 전체 선택
				else if( (strtParElement.closest('.nbThrCaseFir') !== null && endParElement.closest('.nbThrCaseSec') !== null)
				|| (strtParElement.closest('.nbThrCaseFir') !== null && endParElement.closest('.nbThrCaseThr') !== null)
				|| (strtParElement.closest('.nbThrCaseSec') !== null && endParElement.closest('.nbThrCaseThr') !== null)
				){
					isDepthOneSel = true;
				//경우의 수 각 경우 맨 앞에서 화살표 좌, 맨 뒤에서 화살표 우로 누른 경우 
				}else if(strtParElement.tagName==="TR" || endParElement.tagName==="TR"){
					isDepthOneSel = true;
				}

				if(isDepthOneSel){
					let orgRange = window.getSelection()
					orgRange.removeAllRanges();
					if(userKeyCode===37) orgRange.setBaseAndExtent(rootStrtNbBox, 1, rootStrtNbBox, 0)
					else if(userKeyCode===39) orgRange.setBaseAndExtent(rootStrtNbBox, 0, rootStrtNbBox, 1);
					return;
				}
					
			}
			return;
		}
			
				
		if(userKeyCode === 37){
			//셀렉션 먹을때, 수식요소 하나의 덩어리로 추가
			//셀렉션 빠질때, 수식요소 하나의 덩어리로 빼기
			let focusContainer = window.getSelection().focusNode.parentElement.closest(".nbBox");
			if(focusContainer !== null){
				while(focusContainer.parentElement.closest(".nbBox")!==null){
					focusContainer=focusContainer.parentElement.closest(".nbBox")
				}
				let selection1 = document.getSelection();
				let anchorNode= selection1.anchorNode; 
				let anchorOffset = selection1.anchorOffset;
				selection1.removeAllRanges();
				selection1.setBaseAndExtent(anchorNode, anchorOffset, focusContainer, 0);
			}
			let selection1 = document.getSelection();
			let anchorNode= selection1.anchorNode; 
			let focusNode= selection1.focusNode; 
			let focusOffset= selection1.focusOffset; 
			if(anchorNode.nodeName === "#text") anchorNode = anchorNode.parentElement.closest(".nbBox");
			else anchorNode = anchorNode.closest(".nbBox");

			if(anchorNode !== null){
				//셀렉션 먹을때
				if(document.getSelection().focusNode === document.getSelection().getRangeAt(0).startContainer){
					selection1.removeAllRanges();
					selection1.setBaseAndExtent(anchorNode, 1, focusNode, focusOffset);
				//셀렉션 빠질때
				}else{
					selection1.removeAllRanges();
					selection1.setBaseAndExtent(anchorNode, 0, focusNode, focusOffset);
				}
				
			}

		}else if(userKeyCode === 39){

			let focusContainer = window.getSelection().focusNode.parentElement.closest(".nbBox");
			if(focusContainer !== null){
				while(focusContainer.parentElement.closest(".nbBox")!==null){
					focusContainer=focusContainer.parentElement.closest(".nbBox")
				}
				let selection1 = document.getSelection();
				let anchorNode= selection1.anchorNode; 
				let anchorOffset = selection1.anchorOffset;
				selection1.removeAllRanges();
				selection1.setBaseAndExtent(anchorNode, anchorOffset, focusContainer, 1);
			}
			let selection1 = document.getSelection();
			let anchorNode= selection1.anchorNode; 
			let focusNode= selection1.focusNode; 
			let focusOffset= selection1.focusOffset; 
			if(anchorNode.nodeName === "#text") anchorNode = anchorNode.parentElement.closest(".nbBox");
			else anchorNode = anchorNode.closest(".nbBox");

			if(anchorNode !== null){
				//셀렉션 먹을때
				if(document.getSelection().focusNode === document.getSelection().getRangeAt(0).startContainer){
					selection1.removeAllRanges();
					selection1.setBaseAndExtent(anchorNode, 0, focusNode, focusOffset);
				//셀렉션 빠질때
				}else{
					selection1.removeAllRanges();
					selection1.setBaseAndExtent(anchorNode, 1, focusNode, focusOffset);
				}
				
			}
		}
		return;
	}

	//키보드 상하 화살표 누른 경우(셀렉트)
	if( (userKeyCode===38 || userKeyCode===40) ){
		let focusEle = window.getSelection().focusNode;
		if(!window.getSelection().isCollapsed){
			if(focusEle.classList === undefined) focusEle = focusEle.parentElement;
			if(focusEle.closest(".nbBox") !== null){
				while(focusEle.parentElement.closest(".nbBox")!== null){
					focusEle = focusEle.parentElement.closest(".nbBox");
				}
				if(userKeyCode===38) window.getSelection().setBaseAndExtent(window.getSelection().anchorNode, window.getSelection().anchorOffset, focusEle, 0);
				else window.getSelection().setBaseAndExtent(window.getSelection().anchorNode, window.getSelection().anchorOffset, focusEle, 1);
			}
			
		}
	}

} 


export const reg_selectCheck = () => {
	//셀렉트 이후 셀렉트 안되는 문제 해결, 마우스 다운시에 셀레트 제거
	if(!window.getSelection().isCollapsed) {
		window.getSelection().setBaseAndExtent(window.getSelection().anchorNode, window.getSelection().anchorOffset, window.getSelection().anchorNode, window.getSelection().anchorOffset);
	}
}


/*
* 테이블 셀렉트 색상 제거
*/
export const reg_tbSelBackgroundRemove = async () => {
	//테이블 셀렉트 색상 제거
	let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
	for(let i=0; i<nbSelectionTbTd.length; i++){
		nbSelectionTbTd[i].classList.remove("nbSelectionTbTd");
	}
}



/*
* 정의 : 테이블 셀렉트 색상 마우스 다운 이벤트
*/
let isTbMouseDown = false;
let agoFocusInnerTbTd=null;
let lastFocusNode= null;
export const reg_tbCellMouseDown = async () =>{
	//테이블 셀렉트 색상 제거
	let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
	for(let i=0; i<nbSelectionTbTd.length; i++){
		nbSelectionTbTd[i].classList.remove("nbSelectionTbTd");
	}
	isTbMouseDown=true;
}

/*
* 정의 : 테이블 셀렉트 색상 마우스 무브 이벤트
*/
export const reg_tbCellMouseMove = async () =>{
	if(!isTbMouseDown) return;
	let anchorInnerTbTd = window.getSelection().anchorNode;
	if(anchorInnerTbTd.classList === undefined) anchorInnerTbTd = anchorInnerTbTd.parentElement;
	anchorInnerTbTd = anchorInnerTbTd.closest(".innerTbTd");
	let focusInnerTbTd = window.getSelection().focusNode;
	if(focusInnerTbTd.classList === undefined) focusInnerTbTd = focusInnerTbTd.parentElement;
	focusInnerTbTd = focusInnerTbTd.closest(".innerTbTd");
	if(focusInnerTbTd === null) return;
	if(anchorInnerTbTd !== focusInnerTbTd){
		let anchorRowCol = anchorInnerTbTd.id.substring(9);
		let focusRowCol = focusInnerTbTd.id.substring(9)
		let lowerRowCol = focusRowCol;
		let biggerRowCol = anchorRowCol;
		if(Number(anchorRowCol) < Number(focusRowCol)){
			lowerRowCol = anchorRowCol
			biggerRowCol = focusRowCol
		}
		if(Number(lowerRowCol.substring(1)) > Number(biggerRowCol.substring(1))){
			let tmpLowerRowCol = lowerRowCol;
			let tmpBiggerRowCol = biggerRowCol;
			lowerRowCol = tmpLowerRowCol.substring(0, 1) + tmpBiggerRowCol.substring(1)
			biggerRowCol = tmpBiggerRowCol.substring(0, 1) + tmpLowerRowCol.substring(1)
		}

		if(agoFocusInnerTbTd !==focusInnerTbTd){
			let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
			for(let i=0; i<nbSelectionTbTd.length; i++){
				nbSelectionTbTd[i].classList.remove("nbSelectionTbTd");
			}
		}

		for(let row=lowerRowCol.substring(0, 1); row<=biggerRowCol.substring(0, 1); row++){
			for(let col=lowerRowCol.substring(1); col<=biggerRowCol.substring(1); col++){
				let innerTbTdId = "innerTbTd"+row+col;
				focusInnerTbTd.closest(".editInnerTable").querySelector("#"+innerTbTdId).classList.add("nbSelectionTbTd");
			}
		}
		lastFocusNode = focusInnerTbTd;
	}
	agoFocusInnerTbTd=focusInnerTbTd;
}

/*
* 정의 : 테이블 셀렉트 색상 키업 이벤트
*/
let isTbSelExecuted = false;
let firstAnchor = null;
export const reg_tbCellKeyUp = async (event) =>{
	if(event.shiftKey && (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) ){
		let anchorInnerTbTd = window.getSelection().anchorNode;
		if(anchorInnerTbTd.classList === undefined) anchorInnerTbTd = anchorInnerTbTd.parentElement;
		anchorInnerTbTd = anchorInnerTbTd.closest(".innerTbTd");
		let focusInnerTbTd = window.getSelection().focusNode;
		if(focusInnerTbTd.classList === undefined) focusInnerTbTd = focusInnerTbTd.parentElement;
		focusInnerTbTd = focusInnerTbTd.closest(".innerTbTd");

		if(anchorInnerTbTd === null || focusInnerTbTd === null) return;
		if(anchorInnerTbTd !== focusInnerTbTd){
			if(isTbSelExecuted){
				anchorInnerTbTd = firstAnchor;
				window.getSelection().getRangeAt(0).setStart(anchorInnerTbTd, 0)
			}else{
				firstAnchor = anchorInnerTbTd;
			}
			let anchorRowCol = anchorInnerTbTd.id.substring(9);
			let focusRowCol = focusInnerTbTd.id.substring(9)
			let lowerRowCol = focusRowCol;
			let biggerRowCol = anchorRowCol;
			if(Number(anchorRowCol) < Number(focusRowCol)){
				lowerRowCol = anchorRowCol
				biggerRowCol = focusRowCol
			}
			if(Number(lowerRowCol.substring(1)) > Number(biggerRowCol.substring(1))){
				let tmpLowerRowCol = lowerRowCol;
				let tmpBiggerRowCol = biggerRowCol;
				lowerRowCol = tmpLowerRowCol.substring(0, 1) + tmpBiggerRowCol.substring(1)
				biggerRowCol = tmpBiggerRowCol.substring(0, 1) + tmpLowerRowCol.substring(1)
			}
	
			if(agoFocusInnerTbTd !==focusInnerTbTd){
				let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
				for(let i=0; i<nbSelectionTbTd.length; i++){
					nbSelectionTbTd[i].classList.remove("nbSelectionTbTd");
				}
			}
	
			for(let row=lowerRowCol.substring(0, 1); row<=biggerRowCol.substring(0, 1); row++){
				for(let col=lowerRowCol.substring(1); col<=biggerRowCol.substring(1); col++){
					let innerTbTdId = "innerTbTd"+row+col;
					focusInnerTbTd.closest(".editInnerTable").querySelector("#"+innerTbTdId).classList.add("nbSelectionTbTd");
				}
			}
			let nbSelectionDiv = document.querySelectorAll(".nbSelectionDiv");
			for(let i=0; i<nbSelectionDiv.length; i++){
				nbSelectionDiv[i].classList.remove("nbSelectionDiv");
			}
			isTbSelExecuted = true;
			window.getSelection().setBaseAndExtent(focusInnerTbTd, 0, focusInnerTbTd, 0);
		}
		agoFocusInnerTbTd=focusInnerTbTd;
	}else if(!event.shiftKey){
		isTbSelExecuted = false;
	}
}

/*
* 정의 : 테이블 셀렉트 색상 마우스 업 이벤트
*/
export const reg_tbCellMouseUp = async () =>{
	isTbMouseDown=false;
	let nbSelectionTbTd = document.querySelectorAll(".nbSelectionTbTd");
	if(nbSelectionTbTd.length !== 0) {
		window.getSelection().getRangeAt(0).selectNodeContents(lastFocusNode);
		let nbSelectionDiv = document.querySelectorAll(".nbSelectionDiv");
		for(let i=0; i<nbSelectionDiv.length; i++){
			nbSelectionDiv[i].classList.remove("nbSelectionDiv");
		}
	}
}


/*
* 정의 : 테이블 셀렉트 색상 복사 이벤트
*/
export const reg_tbCellCopy = async (event)=>{
	let nbSelectionTbTd = document.querySelector(".nbSelectionTbTd");
	if(nbSelectionTbTd !== null){
		let wrapSpan = document.createElement("span");
		wrapSpan.className = "copiedEditInnerTable";
		wrapSpan.innerHTML = nbSelectionTbTd.closest(".editInnerTable").outerHTML
		event.clipboardData.setData('text/html', wrapSpan.outerHTML);
		event.preventDefault();
	}
}

/*
* 정의 : 테이블 안에 테이블 붙여넣기 금지
*/
export const reg_tbPasteInPastePrevent = async (event)=>{
	let data= event.clipboardData.getData("text/html"); 
	let wrapSpan = document.createElement('span'); 
	wrapSpan.innerHTML = data; 
	let tbEle = wrapSpan.querySelector(".copiedEditInnerTable");

	if(tbEle !== null){
		let anchorNode = window.getSelection().anchorNode;
		let focusNode = window.getSelection().focusNode;
		if(anchorNode.classList === undefined) anchorNode = anchorNode.parentElement;
		if(focusNode.classList === undefined) focusNode = focusNode.parentElement;

		let anchorTbBox = anchorNode.closest(".editInnerTable");
		let focusTbBox = focusNode.closest(".editInnerTable");

		if(anchorTbBox !== null || focusTbBox !== null){
			event.preventDefault();
		}
	}
}



/*
* 정의 : 표 붙여넣기 금지
*/
export const reg_tbPastePrevent = async (event)=>{
	let data= event.clipboardData.getData("text/html"); 
	let wrapSpan = document.createElement('span'); 
	wrapSpan.innerHTML = data; 
	let tbEle = wrapSpan.querySelector(".editInnerTable");

	if(tbEle !== null){
		event.preventDefault();
	}
}


/*
* 정의 : 수식 컴파일 방식 구현
* 설명 : 루트 안의 분수, 분수 없을 때 컴파일 클래스 제거
*/
export const reg_nbComplie = async (event) => {
	let nbRootBoxes = document.querySelectorAll(".nbRootBox.nbCompile.nbRootInFrac");
	for(let i=0; i<nbRootBoxes.length; i++){
		if(nbRootBoxes[i].querySelectorAll(".nbFracBox").length === 0) {
			nbRootBoxes[i].classList.remove("nbCompile");
			nbRootBoxes[i].classList.remove("nbRootInFrac");
		}
	}
}