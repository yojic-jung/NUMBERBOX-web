/*
 * 정의 : web에서 was의 data를 fetch하는 공통 함수
 * 설명 : transitEffect는 spinner 효과 사용여부 판단
*/

export const nb_dataFetch = async (url, transitEffect) => {
  if(transitEffect){
    document.getElementById("page-transit").classList.remove("hide");
    document.getElementById("page-transit-img").classList.remove("hide");
  } 
  
  let returnVal = null;
  await fetch(url)
  .then(async (response) => response.text() )
  .then(async (data) => { 
    if(transitEffect){
      document.getElementById("page-transit").classList.add("hide");
      document.getElementById("page-transit-img").classList.add("hide");
    }
    returnVal = JSON.parse(data)
  });
  return returnVal
}


/*
 * 정의 : 클래스 추가 함수
 */
export const nb_addClass = async (targetId, className) => {
  document.getElementById(targetId).classList.add(className);
}



/*
* 정의 : 이미지 로드 & 쇼
* 설명 : input file에 등록된 파일 이미지를 쇼하는 함수
*/

export const nb_loadFile = async (event, outputId) => {	//outputId는 출력 dom
    let reader = new FileReader();
    let output = document.getElementById(outputId);
    reader.onload = async function(){
      output.src = reader.result;
    };
    if(event.target.files[0]==undefined) return false;     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
    reader.readAsDataURL(event.target.files[0]);
    output.classList.remove('hide');
  };

/*
* 정의 : 이미지 삭제
* 설명 : input file에 등록된 파일 이미지를 삭제하는 함수
*/
  export const nb_imgFileDel = async (outputId, fileTagId) => {  //outputId는 출력 dom
    document.getElementById(fileTagId).value= "";
    
    let output = document.getElementById(outputId);
	  output.src = "";
    output.classList.add('hide');
  }


/*
* 정의 : 이미지 파일 확장자 체크 함수
*/
export const nb_extensionCheck = async (event, outputTarget) => {
    let targetId = event.target.id;
    let obj = document.getElementById(targetId);
    let file =	document.getElementById(targetId).files[0];
    if(file== undefined){     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
      await nb_imgFileDel(outputTarget,targetId)
      return false;
    }
    // file[0].size 는 파일 용량 정보입니다.
    if(file.size > 1024*1024*1){
      // 용량 초과시 경고후 해당 파일의 용량도 보여줌
        alert("첨부파일 사이즈는 1MB 이내로 등록 가능합니다. ");
        await nb_imgFileDel(outputTarget,targetId)
        return false;
    }
    
    let pathpoint = obj.value.lastIndexOf('.');
    let filepoint = obj.value.substring(pathpoint+1,event.length);
    let filetype = filepoint.toLowerCase();
    // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
    if(filetype=='jpg' || filetype=='gif' || filetype=='png' || filetype=='jpeg' || filetype=='bmp'){
    }else{
      alert('이미지  파일만 등록해주십시오.(img/gif/png/jpeg/bmp)');
      await nb_imgFileDel(outputTarget,targetId)
    }
}

/*
* 체크박스 선택된 값 가져오는 함수
*/
export const nb_getCheckedVal = async function(event){
      let obj_length = document.getElementsByName(event.target.name).length;
      let checkedValue = ""
      for (var i=0; i<obj_length; i++) {
          if (document.getElementsByName(event.target.name)[i].checked == true) {
              if(checkedValue.length==0){
                checkedValue = document.getElementsByName(event.target.name)[i].value;
              }else{
                checkedValue += ","+document.getElementsByName(event.target.name)[i].value;
              }
          }
      }
  return checkedValue;
}


/*
* 닫기 버튼 함수
*/
export const nb_closeBtn = async function(event){
  document.getElementsByClassName(event.target.classList[0])[0].parentElement.classList.add("hide");
  document.getElementsByClassName("blindBox")[0].classList.add("hide");
  
}


/*
* nbCustomSel 박스 option 클릭 함수
*/
export const nb_fCustomOptClk = function(event, parentId, customTitle, originSel){
    let targetDom = document.getElementById(event.target.id);
    let parentDom = document.getElementById(parentId);
    let selVal = document.getElementById(customTitle);
    selVal.innerHTML = targetDom.innerText;
    let orginSelOpt = document.getElementById(originSel);
    if(targetDom.dataset.value != "0"){
      parentDom.classList.add('nbCustomSelected');
    }else{
      parentDom.classList.remove('nbCustomSelected');
    }
    parentDom.classList.remove('active');
     
    orginSelOpt.value = targetDom.dataset.value
}

/*
* nbCustomSel 박스 div 클릭 함수
*/
export const nb_fCustomSelDivClk = async function(event){
  let targetDom = document.getElementById(event.target.id);
  let customSelList = document.getElementsByClassName('nbCustomSel');
  if(targetDom.classList.contains('nbCustomSelVal')) return;
  for(let i=0; i<customSelList.length; i++){
    if(customSelList[i].id!=event.target.id) customSelList[i].classList.remove('active');
  }
  
  if(targetDom.classList.contains('active')) {
    targetDom.classList.remove('active');
  } else {
    targetDom.classList.add('active');
  }
}

/*
* nbCustomSel 박스 span태크 클릭 함수
*/
export const nb_fCustomSelSpanClk = async function(event){
  let targetDom = document.getElementById(event.target.id);
  let parentDom = document.getElementById(targetDom.parentElement.id);
  if(parentDom.classList.contains('active')){
    parentDom.classList.remove('active');
  } else {
    parentDom.classList.add("active");
  }
}

/*
* nbCustomSel 박스가 아닌 다른 요소를 클릭한 경우 sel 박스 닫기 이벤트
* 이벤트 등록된 요소 밑에 dom 많을 수록 많이 실행됨
*/
export const nb_fCustomSelClose = async function(event){
  let customSelList = document.getElementsByClassName('nbCustomSel');
  let targetDom = document.getElementById(event.target.id);
  //클릭한 요소가 id가 없거나 클래스이름에 nbCustomSel 또는 nbCustomSelVal 포함되지 않는경우
  if(targetDom==null || (!targetDom.classList.contains("nbCustomSel") && !targetDom.classList.contains("nbCustomSelVal")) ){ 
    for(let i=0; i<customSelList.length; i++){
      if(customSelList[i].classList.contains("nbCustomSel")){  //nbCustomSel클래스의 active 제거
        customSelList[i].classList.remove('active');
      } 
    }
  }

}

/*
* nb_completeBlueBox 입력완료 블루박스
*/
export const nb_completeBlueBox = async function(event, charLength){
  let targetDom = document.getElementById(event.target.id);
  if(targetDom.value.length < charLength){
    document.getElementById(event.target.id).classList.remove("customBlueBoxComplete");
  }else{
    document.getElementById(event.target.id).classList.add("customBlueBoxComplete");

  }
}

/*
* 상단 메뉴 고정 fixed 함수
*/
export const nb_topMenuFixed = async function(targetId, targetDomWidth){
  let targetDom = document.getElementById(targetId);
  if(targetDom.offsetTop<window.pageYOffset){
    targetDom.classList.add("fixedTopMenu");
    targetDom.style.width =targetDomWidth+"px";
  }else{
    targetDom.classList.remove("fixedTopMenu");
  }
}

