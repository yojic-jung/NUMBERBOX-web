/*
 * 정의 : contetns/register 패키지에서 사용하는 함수
 * 
 */

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
	if(maxWidth<170 && maxWidth>90){
		multiShowDiv.classList.remove("oneDivGrid");
		multiShowDiv.classList.remove("threeDivGrid");
		multiShowDiv.classList.add("twoDivGrid");
	}  
	else if(maxWidth<=90) {
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
const writeDisabledDom = ["nbTrigon", "nbL-R-Brck", "nbR-R-Brck" ,"nbL-C-Brck", "nbR-C-Brck", "nbL-S-Brck", "nbR-S-Brck", "nbAbsVal"];
export const reg_writeDisableDom = async (event) =>{
	let focusParDom = document.getSelection().getRangeAt(0).endContainer.parentElement;
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
*	정의 : 키값 입력 제어 이벤트
*	설명 : 제거(백스페이스, Del), 입력불가 수식요소(입력 불가 기능과 백스페이스 및 del 시 전체선택기능),
*			alt키 제어(단축키 사용용도)
*/
export const reg_preventKeyEvent = async (event) => {
	//1번 validation
	//백스페이스 및 del 이벤트, 박스요소 수식 삭제 후에도 재생성되는 버그 수정[start]
	if((event.keyCode == "8" || event.keyCode == "46" ) && document.getSelection().getRangeAt(0).endContainer.children != undefined){
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
	//수식 box 비어있는 경우에서 백스페이스 및 del 버튼 시 전체 선택 , 부분드래그시 결함 존재, yellow 요소 전체 입혀줘야함
	if(event.keyCode == "8" || event.keyCode == "46" ){
		let nbBoxDom = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('table');
		if(nbBoxDom!=undefined){
			let nbBoxInnerText = nbBoxDom.innerText.replace(/\r\n|\n|\r|\s*/g, "");
			if(nbBoxInnerText.length==0){
				document.getSelection().getRangeAt(0).selectNode(nbBoxDom);
				let childTd = nbBoxDom.querySelectorAll('td');
				for(let i=0; i<childTd.length; i++){
					childTd[0].classList.add('yellowBorderBox');
				}
				event.preventDefault();
			}
		}
	}

	//4번, validation 순서 바뀌어도 되는 독립적인 로직
	//테이블의 셀에 포커스가 있을때 탭 누르면 다음 셀로 이동
	if(event.keyCode===9){
		let parentTable = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.editInnerTable');
		let targetCell= document.getSelection().getRangeAt(0).endContainer;
		//수식 요소인 경우
		if(targetCell.tagName !== undefined){
			targetCell = document.getSelection().getRangeAt(0).endContainer.closest('.innerTbTd');
		}else{
			targetCell = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.innerTbTd');
		}

		if(parentTable===null) return;
		
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

	//아래로 40, 위로 38
	//5번, validation 순서 바뀌어도 되는 독립적인 로직
	//테이블의 셀에 포커스가 있을때 위 아래로 셀 이동 가능
	if(event.keyCode===40 || event.keyCode===38){

		let parentTable;
		//수식 요소인 경우 셀 이동만 비활성(수식 요소 내에서 위아래 이동은 가능 해야함)	
		//수식요소 안에 값 없는 경우
		if(document.getSelection().getRangeAt(0).endContainer.tagName !== undefined){
			if(document.getSelection().getRangeAt(0).endContainer.closest('.borderBox')!==null){
				return;
			}else{
				parentTable = document.getSelection().getRangeAt(0).endContainer.closest('.editInnerTable');
			}
		}

		if(document.getSelection().getRangeAt(0).endContainer.parentElement.tagName !== undefined){
			if(document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.borderBox')!==null){
				return;
			}else{
				parentTable = document.getSelection().getRangeAt(0).endContainer.parentElement.closest('.editInnerTable');
			}
		}
		
		if(parentTable===null){
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
		if(event.keyCode===38){
			//첫번째 행인 경우 
			if(targetRowIdx===0){
				event.preventDefault();
				return;
			} 
			else{
				focusCellDom = trDom[targetRowIdx-1].childNodes[targetColIdx];
			}
		}

		//아래로 화살표 누른 경우
		if(event.keyCode===40){
			//첫번째 행인 경우 
			if(targetRowIdx===rowLength-1){
				event.preventDefault();
				return;
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
	}
	
	//alt 단축키 제어
	if(event.altKey) event.preventDefault();
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