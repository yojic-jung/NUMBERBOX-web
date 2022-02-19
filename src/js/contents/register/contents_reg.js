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
	customTitleDom.classList.remove("msbCustomSelected");
	//option, li태그 한개씩만 추가 위한 설정
	if(childElement.childNodes[0].dataset.uniqNo != 0){
		let firOpt = document.createElement('option');
		firOpt.innerText = titleText;
		firOpt.dataset.uniqNo = 0;
		childElement.prepend(firOpt);
		let firLi = cusChildElement.childNodes[0].cloneNode(true);
		firLi.innerText = titleText+"을 선택해주세요...";
		firLi.dataset.value = 0;
		firLi.className = "msbOptItem";
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
		firLi.className = "msbOptItem";
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
	let firNoLen = document.getElementById("firNoFormulaEditor").textContent.length;
	let secNoLen = document.getElementById("secNoFormulaEditor").textContent.length;
	let thrNoLen = document.getElementById("thrNoFormulaEditor").textContent.length;
	let fourNoLen = document.getElementById("fourNoFormulaEditor").textContent.length;
	let fifNoLen = document.getElementById("fifNoFormulaEditor").textContent.length;

	if(firNoLen < 4 && secNoLen < 4 && thrNoLen < 4 && fourNoLen < 4 && fifNoLen < 4){
		document.getElementById("multi-show").classList.add("threeDivGrid");
		document.getElementById("multi-show").classList.remove("oneDivGrid");
	}else{
		document.getElementById("multi-show").classList.remove("threeDivGrid");
		document.getElementById("multi-show").classList.add("oneDivGrid");
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