/*
 * 정의 : contetns/register 패키지에서 사용하는 함수
 */


//수식 box 비어있는 경우에서 백스페이스 및 del 버튼 시 전체 선택되야하는데 안되는 요소 별도 처리
const vacantDomAllSel = ["nbCaseBrckBox", "nbThrCasekBox"];
//입력불가 수식요소 
const writeDisabledDom = ["nbTrigon", "nbL-R-Brck", "nbR-R-Brck" ,"nbL-C-Brck", "nbR-C-Brck", "nbL-S-Brck", "nbR-S-Brck", "nbAbsVal", "nbThrCaseBrck", "nbCaseBrck"];
//위로 키보드 이벤트 미적용 대상
const noApplyUpKeyList = ["nbDenom", "nbBiDirSubBase", "nbRightSub", "nbBinomCoSec", "nbCaseSec", "nbThrCaseSec", "nbThrCaseThr"];
//아래로 키보드 이벤트 미적용 대상
const noApplyDownKeyList = ["nbNumer", "nbLeftSub", "nbBiDirSubBase", "nbBinomCoFir", "nbCaseFir","nbThrCaseFir", "nbThrCaseSec"];
//셀렉트가 되어있을때 재 클릭시 셀렉트 이벤트 다시 적용되는 문제 해결 변수
let alreadySelected = false;
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

export const reg_tableUpDownKeyEvent = async (event ,userKeyCode)=>{
	if( (!event.shiftKey && userKeyCode===40)|| (!event.shiftKey && userKeyCode===38) ){

		let parentTable;
		//수식 요소인 경우 셀 이동만 비활성(수식 요소 내에서 위아래 이동은 가능 해야함)	
		//수식요소 안에 값 없는 경우
		if(document.getSelection().getRangeAt(0).endContainer.tagName !== undefined){
			if(document.getSelection().getRangeAt(0).endContainer.closest('.borderBox')!==null){
				return false;
			}else{
				parentTable = document.getSelection().getRangeAt(0).endContainer.closest('.editInnerTable');
			}
		}

		if(document.getSelection().getRangeAt(0).endContainer.parentElement.tagName !== undefined){
			if(document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.borderBox')!==null){
				return false;
			}else{
				parentTable = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.editInnerTable');
			}
		}
		
		if(parentTable===null){
			return false;
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

		let targetCell= document.getSelection().getRangeAt(0).endContainer;
		//수식 요소인 경우
		if(targetCell.tagName !== undefined){
			targetCell = document.getSelection().getRangeAt(0).endContainer.closest('.innerTbTd');
		}else{
			targetCell = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.innerTbTd');
		}

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
		//위로 화살표 누른 경우
		if(userKeyCode===38){
			//첫번째 행인 경우 
			if(targetRowIdx===0){
				event.preventDefault();
				return true;
			} 
			else{
				focusCellDom = trDom[targetRowIdx-1].childNodes[targetColIdx];
			}
		}

		//아래로 화살표 누른 경우
		if(userKeyCode===40){
			//마지막째 행인 경우 
			if(targetRowIdx===rowLength-1){
				event.preventDefault();
				return true;
			} 
			else{
				focusCellDom = trDom[targetRowIdx+1].childNodes[targetColIdx];
			}
		}
		

		let range = document.createRange();
		range.setStart(focusCellDom, 0);
		range.setEnd(focusCellDom, 0);
		const selection1 = document.getSelection();
		selection1.removeAllRanges();
		selection1.addRange(range);
		event.preventDefault();
		return true;
	}
}
/*
* 정의 : 수식요소에서 위아래 화살표 키 눌렀을때 이벤트
* 설명 : 위로 버튼 누르면 왼쪽으로 포커스, 아래로 버튼 누르면 오른쪽으로 포커스
*/
//위아래 이벤트 미적용 대상
export const upDownKeyRule = async (isShift, userKeyCode) => {
	if(!isShift && userKeyCode===38 ){
		let isGoLeft = true;
		let focusParDom = document.getSelection().getRangeAt(0).startContainer;
		if(focusParDom.classList === undefined) focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement;
		if(focusParDom!==undefined){
			focusParDom=focusParDom.closest(".borderBox");
			if(focusParDom!==null){
				for(let i=0; i<noApplyUpKeyList.length;i++){
					if(focusParDom.classList.contains(noApplyUpKeyList[i])){isGoLeft = false; continue;}
				}
				if(isGoLeft){
					let rootFocusNbBox;
					let focusNbBox = focusParDom.closest(".nbBox")
					if(focusNbBox.previousSibling===null){
						rootFocusNbBox= focusNbBox.parentElement.previousSibling
					}else{
						rootFocusNbBox=focusNbBox.previousSibling
					}

					let orgRange = window.getSelection()
					let range = document.createRange();
					if(rootFocusNbBox===null){
						range.setStart(focusNbBox, 0);
						range.setEnd(focusNbBox, 0);
					}else{
						if(rootFocusNbBox.length!==undefined){
							range.setStart(rootFocusNbBox, rootFocusNbBox.length);
							range.setEnd(rootFocusNbBox, rootFocusNbBox.length);
						}else{
							range.setStart(rootFocusNbBox, 1);
							range.setEnd(rootFocusNbBox, 1);
						}
					}
					orgRange.removeAllRanges();
					orgRange.addRange(range);
					return true;
				}
			}
		}
		
		//parentElement가 아닌 포커스 컨테이너가 borderBox인 경우(비어있는 요소에 포커스)
		let focusDom = document.getSelection().getRangeAt(0).startContainer;
		if(isGoLeft && focusDom.classList!==undefined){
			for(let i=0; i<noApplyUpKeyList.length;i++){
				if(focusDom.classList.contains(noApplyUpKeyList[i])){isGoLeft = false; continue;}
			}
			if(isGoLeft){
				let focusNbBox = focusDom.closest(".nbBox");
				if(focusNbBox !== null){
					let rootFocusNbBox;
					if(focusNbBox.previousSibling===null){
						rootFocusNbBox = focusNbBox.parentElement.previousSibling;
					}else{
						rootFocusNbBox = focusNbBox.previousSibling;
					}
					let orgRange = window.getSelection()
					let range = document.createRange();
					if(rootFocusNbBox===null){
						range.setStart(focusNbBox, 0);
						range.setEnd(focusNbBox, 0);
					}else{
						if(rootFocusNbBox.length!==undefined){
							range.setStart(rootFocusNbBox, rootFocusNbBox.length);
							range.setEnd(rootFocusNbBox, rootFocusNbBox.length);
						}else{
							range.setStart(rootFocusNbBox, 1);
							range.setEnd(rootFocusNbBox, 1);
						}
					}
					orgRange.removeAllRanges();
					orgRange.addRange(range);
					return true;
				}
			}
		}
		return false;
	}else if(!isShift && userKeyCode===40 ){
		let isGoRight = true;
		let focusParDom = document.getSelection().getRangeAt(0).startContainer
		if(focusParDom.classList === undefined) focusParDom = document.getSelection().getRangeAt(0).startContainer.parentElement
		if(focusParDom!==undefined){
			focusParDom=focusParDom.closest(".borderBox");
			if(focusParDom!==null){
				for(let i=0; i<noApplyDownKeyList.length;i++){
					if(focusParDom.classList.contains(noApplyDownKeyList[i])){isGoRight = false; continue;}
				}
				if(isGoRight){
					let focusNbBox = focusParDom.closest(".nbBox")
					let rootFocusNbBox;
					if(focusNbBox.nextSibling===null){
						rootFocusNbBox= focusNbBox.parentElement.nextSibling
					}else{
						rootFocusNbBox=focusNbBox.nextSibling
					}
					let orgRange = window.getSelection()
					let range = document.createRange();
					if(rootFocusNbBox===null){
						range.setStart(focusNbBox, 1);
						range.setEnd(focusNbBox, 1);
					}else{
						range.setStart(rootFocusNbBox, 0);
						range.setEnd(rootFocusNbBox, 0);
					}
					orgRange.removeAllRanges();
					orgRange.addRange(range);
					return true;
				}
			}
		}
		
		//parentElement가 아닌 포커스 컨테이너가 borderBox인 경우(비어있는 요소에 포커스)
		let focusDom = document.getSelection().getRangeAt(0).startContainer;
		if(isGoRight && focusDom.classList!==undefined){
			for(let i=0; i<noApplyDownKeyList.length;i++){
				if(focusDom.classList.contains(noApplyDownKeyList[i])){isGoRight = false; continue;}
			}
			if(isGoRight){
				let focusNbBox = focusDom.closest(".nbBox");
				if(focusNbBox !== null){
					let rootFocusNbBox;
					if(focusNbBox.nextSibling===null){
						rootFocusNbBox = focusNbBox.parentElement.nextSibling;
					}else{
						rootFocusNbBox = focusNbBox.nextSibling;
					}
					let orgRange = window.getSelection()
					let range = document.createRange();
					if(rootFocusNbBox===null){
						range.setStart(focusNbBox, 1);
						range.setEnd(focusNbBox, 1);
					}else{
						range.setStart(rootFocusNbBox, 0);
						range.setEnd(rootFocusNbBox, 0);
					}
					orgRange.removeAllRanges();
					orgRange.addRange(range);
					return true;
				}
			}
		}
		return false;
	}
	
}
/*
*	정의 : 키값 입력 제어 이벤트
*	설명 : 제거(백스페이스, Del), 입력불가 수식요소(입력 불가 기능과 백스페이스 및 del 시 전체선택기능),
*			alt키 제어(단축키 사용용도)
*/
export const reg_preventKeyEvent = async (event) => {
	let userKeyCode = event.keyCode;
	//1번 validation
	//백스페이스 및 del 이벤트, 박스요소 수식 삭제 후에도 재생성되는 버그 수정[start]
	if((userKeyCode == "8" || userKeyCode == "46" ) && document.getSelection().getRangeAt(0).endContainer.children != undefined){
		//드래그 한 경우
		if(!document.getSelection().isCollapsed){
			if(document.getSelection().getRangeAt(0).endContainer.children[0].classList.contains('nbBox')){
				const selection = document.getSelection();
				const newRange = selection.getRangeAt(0);
				newRange.deleteContents();
				event.preventDefault();
			}
		}
	}
	//[end]

	//2번 validation(순서 바뀌면 안됨, 백스페이스 및 del 오류남)
	//입력 불가 수식 box요소 제어[start]
	if(await reg_writeDisableDom(event))event.preventDefault();
	//[end]

	//3번 
	//수식 box 비어있는 경우에서 백스페이스 및 del 버튼 시 전체 선택 , yellow 요소 전체 입혀줘야함
	if(userKeyCode == "8" || userKeyCode == "46" ){
		let nbBoxDom = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.nbBox');
		if(nbBoxDom!=undefined){
			let nbBoxInnerText = nbBoxDom.innerText.replace(/\r\n|\n|\r|\s*/g, "");
			if(nbBoxInnerText.length===0){
				document.getSelection().getRangeAt(0).selectNode(nbBoxDom);
				let childTd = nbBoxDom.querySelectorAll('td');
				for(let i=0; i<childTd.length; i++){
					childTd[0].classList.add('yellowBorderBox');
				}
				event.preventDefault();
			}else if(nbBoxInnerText.length===1){
				for(let i=0; i<vacantDomAllSel.length; i++){
					if(nbBoxDom.classList.contains(vacantDomAllSel[i])){
						document.getSelection().getRangeAt(0).selectNode(nbBoxDom);
						let childTd = nbBoxDom.querySelectorAll('td');
						for(let i=0; i<childTd.length; i++){
							childTd[0].classList.add('yellowBorderBox');
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
			const selection = document.getSelection();
            const newRange = selection.getRangeAt(0);
            selection.removeAllRanges();
            selection.addRange(newRange);
			//span 노드 추가 안하고 nbGrammer 추가시 백스페이스 및 del 오류 날 수 있음(reg_preventKeyEvent)
            let tmpNode= document.createElement('span');
            tmpNode.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            newRange.deleteContents();
            newRange.insertNode(tmpNode);
			window.getSelection().collapseToEnd();		//셀렉션객체의 마지막 부분에 포커스 맞춤
			event.preventDefault();
			return;}
		
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

	//수식박스 위로 화살표 누른 경우 왼쪽으로, 아래로 화살표 누른 경우 오른쪽으로 nbBox 빠져나가기(depth는 1)
	 if(await upDownKeyRule(event.shiftKey,userKeyCode)){
		event.preventDefault();
		return;
	 }

	let upDownArrowEv = true;
	//shift+위로 또는 shift+아래로 누른 경우(수식 최상위 요소 전체 선택)
	if((event.shiftKey && userKeyCode===38) || (event.shiftKey && userKeyCode===40)){
		let strtNbBox = document.getSelection().getRangeAt(0).startContainer.parentElement.closest('.nbBox');
		let rootNbBox = strtNbBox;
		if(strtNbBox !== null){
			while(rootNbBox.parentElement.closest('.nbBox')!==null){
				rootNbBox = rootNbBox.parentElement.closest('.nbBox');
			}
			let orgRange = window.getSelection()
			let range = document.createRange();
			range.setStart(rootNbBox, 0);
			range.setEnd(rootNbBox, 1);
			orgRange.removeAllRanges();
			orgRange.addRange(range);
			if(userKeyCode===38){
				let strtFocus = orgRange.anchorOffset;		//사용자 선택 시작점
				let endFocus = orgRange.focusOffset;		//사용자 선택 끝점
				orgRange.setBaseAndExtent(rootNbBox, endFocus, rootNbBox, strtFocus);
			}
			upDownArrowEv=false;
			event.preventDefault();
		}
	}

	//키보드 상하 화살표 누른 경우(셀렉트)
	if( (userKeyCode===38 || userKeyCode===40) && upDownArrowEv ){
		//5번, validation 순서 바뀌어도 되는 독립적인 로직
		//테이블의 셀에 포커스가 있을때 위 아래로 셀 이동 가능
		//reg_tableUpDownKeyEvent
		if(!await reg_tableUpDownKeyEvent(event, userKeyCode) ){
			//테이블 아닌 경우 위 아래 화살표 이동
			let contentEditEle = window.getSelection().getRangeAt(0).startContainer;
			if(contentEditEle.classList !== undefined){
				if(contentEditEle.classList.contains("contentEditClass"));
				else contentEditEle = contentEditEle.parentElement;
			}else{
				contentEditEle = contentEditEle.parentElement;
			}
			
			//상위에 수식요소 있는 경우 위아래 라인이동 이벤트 적용X
			if(contentEditEle.closest(".nbBox") !== null) return;
			if(contentEditEle.parentElement!== null){
				while(!contentEditEle.getAttribute("contenteditable")){
					contentEditEle = contentEditEle.parentElement;
				}
			}
			//위아래 화살표 누른 경우 수식 hidden
			let nbBoxes = contentEditEle.querySelectorAll(".nbBox");
			for(let i=0; i<nbBoxes.length; i++){
				nbBoxes[i].classList.add("hidden");
			}
		}
	}

	//alt 단축키 제어
	if(event.altKey) event.preventDefault();

	//수식요소 hidden제거 비동기 콜백
	setTimeout(function(){
		let contentEditEle = window.getSelection().getRangeAt(0).startContainer;
			if(contentEditEle.classList !== undefined){
				if(contentEditEle.classList.contains("contentEditClass"));
				else contentEditEle = contentEditEle.parentElement;
			}else{
				contentEditEle = contentEditEle.parentElement;
			}
			
			//상위에 수식요소 있는 경우 위아래 라인이동 이벤트 적용X
			if(contentEditEle.closest(".nbBox") !== null) return;
			if(contentEditEle.parentElement!== null){
				while(!contentEditEle.getAttribute("contenteditable")){
					contentEditEle = contentEditEle.parentElement;
				}
			}
			//위아래 화살표 누른 경우 수식 hidden
			let nbBoxes = contentEditEle.querySelectorAll(".nbBox");
			for(let i=0; i<nbBoxes.length; i++){
				nbBoxes[i].classList.remove("hidden");
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
	if(alreadySelected) return;	//마우스업 이벤트 발생전 마우스다운 이벤트에서 이미 셀렉트 되어있는지(이벤트가 적용되어있는지) 판단

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
				//경우의 수 케이스 다르면 전체 선택
				else if(strtParElement.closest('.nbCaseFir') !== null && endParElement.closest('.nbCaseSec') !== null){
					isAllSel=true;
				}
				//세가지 경우의 수 케이스 다르면 전체 선택
				else if( (strtParElement.closest('.nbThrCaseFir') !== null && endParElement.closest('.nbThrCaseSec') !== null)
				|| (strtParElement.closest('.nbThrCaseFir') !== null && endParElement.closest('.nbThrCaseThr') !== null)
				|| (strtParElement.closest('.nbThrCaseSec') !== null && endParElement.closest('.nbThrCaseThr') !== null)){
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
						console.log("3")
						if(focusNode === strtContainer){
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 1, focusNbRootBox, 0);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 1, anchorNbRootBox, 0);
						}else{
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 0, focusNbRootBox, 1);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 0, anchorNbRootBox, 1);
						}
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
						console.log("4")
						if(focusNode === strtContainer){
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 1, focusNbRootBox, 0);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 1, anchorNbRootBox, 0);
						}else{
							if(focusNbRootBox.classList.contains("nbRootBox") || focusNbRootBox.classList.contains("nbCondBox")) orgRange.setBaseAndExtent(focusNbRootBox, 0, focusNbRootBox, 1);
							else orgRange.setBaseAndExtent(anchorNbRootBox, 0, anchorNbRootBox, 1);
						}
						return;
					}
				}
			
				if(isAllSel){
					let orgRange = window.getSelection()
					let focusNode = window.getSelection().focusNode;
					let strtContainer = window.getSelection().getRangeAt(0).startContainer;
					orgRange.removeAllRanges();
					console.log("5")
					if(focusNode === strtContainer){
						orgRange.setBaseAndExtent(focusNbBox, 1, focusNbBox, 0);
					}else{
						orgRange.setBaseAndExtent(focusNbBox, 0, focusNbBox, 1);
					}
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
						console.log("6")
						if(focusNode === strtContainer){
							orgRange.setBaseAndExtent(anchorNodeOneDepth, 1, focusNodeOneDepth, 0);
						}else{
							orgRange.setBaseAndExtent(anchorNodeOneDepth, 0, focusNodeOneDepth, 1);
						}
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
							console.log("7")
							if(focusNode === strtContainer){
								orgRange.setBaseAndExtent(anchorNodeOneDepth, 1, focusNode, focusOffset);
							}else{
								orgRange.setBaseAndExtent(anchorNodeOneDepth, 0, focusNode, focusOffset);
							}
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
							console.log("8")
							if(focusNode === strtContainer){
								orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNodeOneDepth, 0);
							}else{
								orgRange.setBaseAndExtent(anchorNode, anchorOffset, focusNodeOneDepth, 1);
							}
							return;
						}
					}
				}
			}
		//최상위 수식요소가 다른 경우alreadySelected
		}else{
			let orgRange = window.getSelection()
			let focusNode = window.getSelection().focusNode;
			let strtContainer = window.getSelection().getRangeAt(0).startContainer;
			orgRange.removeAllRanges();
			console.log("9")
			if(focusNode === strtContainer){
				orgRange.setBaseAndExtent(anchorNbBox, 1, focusNbBox, 0);
			}else{
				orgRange.setBaseAndExtent(anchorNbBox, 0, focusNbBox, 1);
			}
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
		return;
	}
}

/*
* 정의 : 수식요소셀렉트(드래그)시 걸쳐서 셀렉트 안되고 table 요소 전체 셀렉트 되게끔 구현(키보드up 이벤트에 적용)
*/
export const reg_keyEvSelectFormulaElement = async (event) => {
	let userKeyCode = event.keyCode;
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
		let contentEditEle = window.getSelection().getRangeAt(0).startContainer;
		if(contentEditEle.classList !== undefined){
			if(contentEditEle.classList.contains("contentEditClass"));
			else contentEditEle = contentEditEle.parentElement;
		}else{
			contentEditEle = contentEditEle.parentElement;
		}
		
		//상위에 수식요소 있는 경우 위아래 라인이동 이벤트 적용X
		if(contentEditEle.closest(".nbBox") !== null) return;
		if(contentEditEle.parentElement!== null){
			while(!contentEditEle.getAttribute("contenteditable")){
				contentEditEle = contentEditEle.parentElement;
			}
		}
		//위아래 화살표 누른 경우 수식 hidden 제거
		let nbBoxes = contentEditEle.querySelectorAll(".nbBox");
		for(let i=0; i<nbBoxes.length; i++){
			//nbBoxes[i].classList.remove("hidden");
		}

		//수식 hidden으로 인해 수식요소 셀렉트 색상 안 입혀지는 문제 해결
		let selection1 = document.getSelection();
		let anchorNode= selection1.anchorNode; 
		let anchorOffset = selection1.anchorOffset;
		let focusNode = selection1.focusNode;
		let focusOffset =selection1.focusOffset;
		selection1.removeAllRanges();
		selection1.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
	}
} 

export const reg_selectCheck = () => {
	if(!window.getSelection().isCollapsed) alreadySelected =true;
	else alreadySelected =false;
}