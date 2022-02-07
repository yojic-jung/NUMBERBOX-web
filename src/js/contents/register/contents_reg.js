/*
 * 정의 : contetns/register 패키지에서 사용하는 함수
 * 
 */

/*
 * 정의 : 과목, 대단원, 중단원, 소단원, 유형 콤보박스 onChange 이벤트 함수
 * 설명 : childElement 자식 요소, isUnitBubbleEv 연쇄 이벤트 실행 여부
 */
export const reg_unitTypeChange = async (e, childDomId, isUnitBubbleEv) => {
	let targetId = e.target.id;
	console.log(targetId);
	let targetIndex = document.getElementById(targetId).selectedIndex;
	let childElement = document.getElementById(childDomId);
  
	let isCmbSelected = false;                              //자식 컴포넌트 이벤트 실행여부 판단 변수
	for(let i=0; i< childElement.length; i++){
  
	  let isCmbEvCond =false;                                //자식 컴포넌트 최초 한번만 연쇄이벤트 발생위한 변수
	  if(isUnitBubbleEv){isCmbEvCond=childElement.childNodes[i].dataset.parentValue == document.getElementById(targetId).value;}
	  else{isCmbEvCond = (childElement.childNodes[i].dataset.parentValue == document.getElementById(targetId)[targetIndex].dataset.uniqNo);}
	  
	  if(isCmbEvCond){
		if(!isCmbSelected){                               //자식 컴포넌트 change 이벤트 최초한번 실행
		  childElement.childNodes[i].selected = true;
		  childElement.dispatchEvent(new Event('change', { bubbles: true }));
		  isCmbSelected=true;
		}
		childElement.childNodes[i].style.display ="";
	  }else{
		childElement.childNodes[i].style.display ="none";
	  }
	}
  }
/*
* 문제 및 해설 탭 클릭 이벤트
*/
export const reg_quesAnsTabClkEv= async (e) => {
	let targetId = e.target.id;
    if(targetId=="quesTab"){
		document.getElementById("ansTab").classList.remove('checkedTap');
		document.getElementById(targetId).classList.add('checkedTap');
		document.getElementById("contents").classList.remove('hide');
		document.getElementById("solution").classList.add('hide');
	}
	else if(targetId=="ansTab"){
		document.getElementById("quesTab").classList.remove('checkedTap');
		document.getElementById(targetId).classList.add('checkedTap');
		document.getElementById("solution").classList.remove('hide');
		document.getElementById("contents").classList.add('hide');
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
	}
	else if(targetId=="mulTab"){
		document.getElementById("multiRadio").checked=true;
		document.getElementById("essayTab").classList.remove('checkedTap2');
		document.getElementById(targetId).classList.add('checkedTap2');
		document.getElementById("multiChoiceBox").classList.remove('hide');
		document.getElementById("multi-show").classList.remove('hide');

		document.getElementById("multi-answer").classList.remove('hide');
		document.getElementById("answer").classList.add('hide');
	}
	
}



/*
* 객관식 보기 글자수 4개 미만인 경우 2줄 출력
*/
export const reg_threeDivGridChk = async () => {
	let firNoLen = document.getElementById("firNo").value.length;
	let secNoLen = document.getElementById("secNo").value.length;
	let thrNoLen = document.getElementById("thrNo").value.length;
	let fourNoLen = document.getElementById("fourNo").value.length;
	let fifNoLen = document.getElementById("fifNo").value.length;

	if(firNoLen < 4 && secNoLen < 4 && thrNoLen < 4 && fourNoLen < 4 && fifNoLen < 4){
		document.getElementById("multi-show").classList.add("threeDivGrid");
		document.getElementById("multi-show").classList.remove("oneDivGrid");
	}else{
		document.getElementById("multi-show").classList.remove("threeDivGrid");
		document.getElementById("multi-show").classList.add("oneDivGrid");
	}
}


export const reg_getMappingLatexKey = (event, keyMapList) => {
	let userPressKey = event.keyCode;
	console.log("유저 키코드: "+userPressKey);
	const mappingKeyArr = keyMapList.filter( (keyList) =>{
		if(keyList.shortcutKeycode==userPressKey)return keyList;
	});
	if(mappingKeyArr.length==0) return null;
	if(event.altKey && userPressKey==mappingKeyArr[0]["shortcutKeycode"]) return mappingKeyArr;
	else return null;
}

