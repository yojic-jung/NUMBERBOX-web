export const nb_isLogin = () => {
  let isLogin = (window.localStorage.getItem("access-token") !== "null") && document.cookie.indexOf("refresh-token") > -1;
  return isLogin;
}

export const nb_isManger = () => {
  let isLogin = (window.localStorage.getItem("access-token") !== "null") && document.cookie.indexOf("refresh-token") > -1;
  let isManger =false;
  if(isLogin){
    isManger = window.localStorage.getItem("role") === "MANAGER" || window.localStorage.getItem("role") === "ADMIN" ;
  }
  return isManger;
}

export const nb_isAdmin = () => {
  let isLogin = (window.localStorage.getItem("access-token") !== "null") && document.cookie.indexOf("refresh-token") > -1;
  let isAdmin =false;
  if(isLogin){
    isAdmin = window.localStorage.getItem("role") === "ADMIN";
  }
  return isAdmin;
}

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
  await fetch(url, {
      method: 'get',	// 방식은 get
      headers: {
        'access-token':window.localStorage.getItem("access-token")
      }
  })
  .then(async (response) => {
    if(response.headers.get("access-token") !== null){
      window.localStorage.setItem("access-token", response.headers.get("access-token"));
      window.localStorage.setItem("role", response.headers.get("role"));
    }else if(response.headers.get("tokenExpired") !== null) {
      alert("로그인 유효기간이 만료되었습니다.\n다시 로그인 해주세요.")
      window.localStorage.setItem("access-token", null);
      window.localStorage.setItem("role", null);
      document.cookie = "refresh-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/";
    }
    return response.text();} )
  .then(async (data) => { 
    if(transitEffect){
      document.getElementById("page-transit").classList.add("hide");
      document.getElementById("page-transit-img").classList.add("hide");
    }
    if(data !== ""){
      returnVal = JSON.parse(data);
      if(returnVal.existMsg){
        alert(returnVal.serverMsg);
      }
    }
  });
  return returnVal
}


export const nb_formDataFetch = async (url, formData, transitEffect) => {
  if(transitEffect){
    document.getElementById("page-transit").classList.remove("hide");
    document.getElementById("page-transit-img").classList.remove("hide");
  } 

  let returnVal = null;
    await fetch(url, {	// fetch를 통해 Ajax통신을 한다.
      method: 'post',	// 방식은 post
      headers: {
        'access-token':window.localStorage.getItem("access-token")
      },
      body: formData	// body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
    })
    .then(async (response) => {
      if(response.headers.get("access-token") !== null) {
        window.localStorage.setItem("access-token", response.headers.get("access-token"));
        window.localStorage.setItem("role", response.headers.get("role"));
      }else if(response.headers.get("tokenExpired") !== null) {
        alert("로그인 유효기간이 만료되었습니다.\n다시 로그인 해주세요.")
        window.localStorage.setItem("access-token", null);
        window.localStorage.setItem("role", null);
        document.cookie = "refresh-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/";
      }
      return response.text();} )
    .then(async (data) => {
      if(transitEffect){
        document.getElementById("page-transit").classList.add("hide");
        document.getElementById("page-transit-img").classList.add("hide");
      }

      if(data !== ""){
        returnVal = JSON.parse(data)
        if(returnVal.existMsg){
          alert(returnVal.serverMsg);
        }
      }
      
    });
    return returnVal;
  }

  
  /*
  * 로그인 요청
  */
  export const nb_formJsonFetch = async (url, formData, transitEffect) => {
    if(transitEffect){
      document.getElementById("page-transit").classList.remove("hide");
      document.getElementById("page-transit-img").classList.remove("hide");
    } 
  
    let returnVal = null;
      await fetch(url, {	// fetch를 통해 Ajax통신을 한다.
        method: 'post',	// 방식은 post
        headers: {
        },
        body: formData	// body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
      })
      .then(async (response) => {
        if(response.headers.get("access-token") !== null){
          window.localStorage.setItem("access-token", response.headers.get("access-token"));
          window.localStorage.setItem("role", response.headers.get("role"));
        }
        return response.text();
      }).then(async (data) => {	
        if(transitEffect){
          document.getElementById("page-transit").classList.add("hide");
          document.getElementById("page-transit-img").classList.add("hide");
        }
        returnVal = JSON.parse(data)
      });
      return returnVal;
    }

export const fadeIn = async (targetId) => {
  let dom = document.getElementById(targetId);
  let op = 0.1;  // initial opacity
  let timer = setInterval(function () {
    if (op >= 1){
      clearInterval(timer);
    }
    dom.style.display= "inline-block"
    dom.style.opacity = op;
    op += 0.1;
  }, 30);
}

export const fadeOut = async (targetId) => {
  console.log(targetId);
  let dom = document.getElementById(targetId);
  let op = 1;  // initial opacity
  let timer = setInterval(function () {
    console.log(op <= 0.1);
    if (op <= 0.1 ){
      clearInterval(timer);
      dom.style.display = 'none';
    }
    dom.style.opacity = op;
    op -=  0.1;
  }, 30);
}

export const nb_fadeInOut = async (message) => {
  document.getElementById("notifyBox").innerText = message;
			fadeIn("notifyBox")
			setTimeout(function(){
				fadeOut("notifyBox");
			}, 2000);
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

export const nb_loadFile = async (event, outputId, contentsNo) => {	//outputId는 출력 dom
    let reader = new FileReader();
    let output = document.getElementById(outputId);
    reader.onload = async function(){
      output.src = reader.result;
    };
    if(event.target.files[0]==undefined) return false;     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결

    if(contentsNo!== undefined){
      let targetId = event.target.id
      let formData = new FormData();
      formData.append("contentsNo",contentsNo);
      formData.append(targetId, event.target.files[0])
      let returnObj = await nb_formDataFetch("/mathInfo/changeConOrSolImg",formData, true);
      document.getElementById("imgUpdt").value = "Y";
      reader.readAsDataURL(event.target.files[0]);
      output.classList.remove('hide');
      if(returnObj.updateCond !== 1) {
        alert("정상적으로 처리가 완료되지 않았습니다.\n새로고침 후 다시한번 처리해주세요.");
        return false;
      }else{
        return "Y";
      }
    }else{
      reader.readAsDataURL(event.target.files[0]);
      output.classList.remove('hide');
      return "";
    }
    
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
export const nb_extensionCheck = async (event, outputTarget, updtMode) => {
    let targetId = event.target.id;
    let obj = document.getElementById(targetId);
    let file =	document.getElementById(targetId).files[0];
    if(file== undefined){     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
      //수정모드일때는 수정모드에 있는 함수로 DB에 등록된 이미지 제거
      if(updtMode!== undefined){
          return false;
      }else{
        await nb_imgFileDel(outputTarget,targetId)
        return false;
      }
     
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
      alert('이미지 파일만 등록해주십시오.(img/gif/png/jpeg/bmp)');
      await nb_imgFileDel(outputTarget,targetId)
      return false;
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
export const nb_closeBtn = async function(targetId){
  document.getElementById(targetId).classList.add("hide");
  document.getElementsByClassName("blindBox")[0].classList.add("hide");
}


/*
* nbCustomSel 박스 option 클릭 함수
*/
export const nb_fCustomOptClk = function(event, parentId, customTitle, originSel){
    let targetDom = document.getElementById(event.currentTarget.id);
    let parentDom = document.getElementById(parentId);
    let selVal = document.getElementById(customTitle);
    selVal.innerHTML = targetDom.innerHTML;
    let orginSelOpt = document.getElementById(originSel);
    if(targetDom.dataset.value != "0"){
      parentDom.classList.add('nbCustomSelected');
    }else{
      parentDom.classList.remove('nbCustomSelected');
    }
    parentDom.classList.remove('active');
    //소단원과 유형정보에는 latex수식이 포함되어 value값으로 선택이 안됨
    if(parentId=="cusSelThrUnitDiv"){
      let optionList = orginSelOpt.children;
      let selectedIdx = 0;
      for(let i=0; i<optionList.length;i++){
        if(optionList[i].dataset.uniqNo == targetDom.dataset.uniqNo) selectedIdx=i;
      }
      orginSelOpt.children[selectedIdx].selected = true;
    }else if(parentId=="cusSelQuesTypeDiv"){
      let optionList = orginSelOpt.children;
      let selectedIdx = 0;
      for(let i=0; i<optionList.length;i++){
        if(optionList[i].dataset.parentValue == targetDom.dataset.uniqNo && optionList[i].dataset.typeNo == targetDom.dataset.typeNo) selectedIdx=i;
      }
      orginSelOpt.children[selectedIdx].selected = true;
    }else{
      orginSelOpt.value = targetDom.dataset.value
    }

    event.stopPropagation();  //이벤트 버블링 제거(제거 안하면 nb_fCustomSelDivClk 실행되어 customSel 박스가 안닫힘)
}

/*
* nbCustomSel 박스 div 클릭 함수
*/
export const nb_fCustomSelDivClk = async function(event){
  let curTargetDom = document.getElementById(event.currentTarget.id);
  let customSelList = document.getElementsByClassName('nbCustomSel');
  for(let i=0; i<customSelList.length; i++){
    if(customSelList[i].id!=event.currentTarget.id) customSelList[i].classList.remove('active');
  }
  if(curTargetDom.classList.contains('active')){
    curTargetDom.classList.remove('active');
  } else {
    curTargetDom.classList.add("active");
  }
  //nb_fCustomSelClose(박스 닫기 함수) 실행 안되게끔 이벤트 버블링 제거
  //nb_fCustomSelClose 실행되면 latex 수식 클릭시 customSel 박스 안열림(targetDom이 null로 잡히기 때문)
  event.stopPropagation();
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
export const nb_topMenuFixed = async function(targetId, targetDomWidth, parentDomId){
  let targetDom = document.getElementById(targetId);
  if(targetDomWidth===0)return;

  //부모 요소 없이 상단 브라우저 높이로 고정하는 경우
  if(parentDomId==null){
    if(targetDom.offsetTop<window.pageYOffset){
      targetDom.classList.add("fixedTopMenu");
      if(targetDomWidth <620)targetDomWidth =620;
      targetDom.style.width =targetDomWidth+"px";
      targetDom.style.left = document.getElementsByClassName("right")[0].getBoundingClientRect().left+"px";
    }else{
      targetDom.classList.remove("fixedTopMenu");
    }
  }else{
    //모달팝업인 경우
    let parentDomScrollTop= document.getElementById(parentDomId).scrollTop
    if(parentDomScrollTop > 12){
      targetDom.classList.add("fixedTopMenu");
      targetDom.style.width =targetDomWidth+"px";
    }else{
      targetDom.classList.remove("fixedTopMenu");
    }
    targetDom.style.left = document.getElementsByClassName("right")[0].getBoundingClientRect().left+"px";

  }

}

  
/*
* 모달 팝업 열었을시 부모창 스크롤 방지
*/
export const nb_modalScrollStrt = () =>{
  let scrollY = window.scrollY
  document.getElementById("root").style.overflow = "hidden";
  return scrollY;
}

/*
* 모달 팝업 닫았을시 부모창 스크롤 기존 위치로
*/
export const nb_modalScrollEnd = (scrollY) =>{
  document.getElementById("root").style.overflow = "unset"
  window.scrollTo(0, scrollY)
}
