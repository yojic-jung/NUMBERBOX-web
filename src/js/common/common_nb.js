import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";
import imageCompression from 'browser-image-compression';

export const nb_isLogin =  () => {
  let isLogin = (window.localStorage.getItem("access-token") !== "null") && document.cookie.indexOf("refresh-token") > -1;
  return isLogin;
}

//매니저 권한 임시 구현
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
  url = process.env.REACT_APP_DB_HOST+url;
  await fetch(url, {
      method: 'get',	// 방식은 get
      credentials: 'include',
      headers: {
        'access-token':window.localStorage.getItem("access-token")
      }
  })
  .then(async (response) => {
    if(response.headers.get("access-token") !== null){
      window.localStorage.setItem("access-token", response.headers.get("access-token"));
      //매니저 권한 임시 구현
      window.localStorage.setItem("role", response.headers.get("role"));
    }else if(response.headers.get("tokenExpired") !== null) {
      alert("로그인 유효기간이 만료되었습니다.\n다시 로그인 해주세요.")
      window.localStorage.setItem("access-token", null);
      //매니저 권한 임시 구현
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
        nb_fadeInOutC(returnVal.serverMsg, 3000);
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
  url = process.env.REACT_APP_DB_HOST+url;
    await fetch(url, {	// fetch를 통해 Ajax통신을 한다.
      method: 'post',	// 방식은 post
      credentials: 'include',
      headers: {
        'access-token':window.localStorage.getItem("access-token")
      },
      body: formData	// body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
    })
    .then(async (response) => {
      if(response.headers.get("access-token") !== null) {
        window.localStorage.setItem("access-token", response.headers.get("access-token"));
        //매니저 권한 임시 구현
        window.localStorage.setItem("role", response.headers.get("role"));
      }else if(response.headers.get("tokenExpired") !== null) {
        alert("로그인 유효기간이 만료되었습니다.\n다시 로그인 해주세요.")
        window.localStorage.setItem("access-token", null);
        //매니저 권한 임시 구현
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

  
export const nb_formDataFileFetch = async (url, formData, fileName) => {
  url = process.env.REACT_APP_DB_HOST+url;
    await fetch(url, {	// fetch를 통해 Ajax통신을 한다.
      method: 'post',	// 방식은 post
      credentials: 'include',
      headers: {
        'access-token':window.localStorage.getItem("access-token")
      },
      body: formData	// body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
    })
    .then((res) => {
      return res.blob();
    }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout((_) => {
            window.URL.revokeObjectURL(url);
        }, 60000);
        a.remove();

      })
      .catch((err) => {
          console.error('err: ', err);
      });
  }

 export const nb_dataFileFetch = async (url, fileName) => {
  url = process.env.REACT_APP_DB_HOST+url;
  await fetch(url, {
        method: 'get',	// 방식은 get
        credentials: 'include',
        headers: {
          'access-token':window.localStorage.getItem("access-token")
        },
    }).then((res) => {
            return res.blob();
      }).then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout((_) => {
                window.URL.revokeObjectURL(url);
            }, 60000);
            a.remove();

        })
        .catch((err) => {
            console.error('err: ', err);
        });
};
  
  /*
  * 로그인 요청
  */
  export const nb_formJsonFetch = async (url, formData, transitEffect) => {
    if(transitEffect){
      document.getElementById("page-transit").classList.remove("hide");
      document.getElementById("page-transit-img").classList.remove("hide");
    } 
  
    let returnVal = null;
    url = process.env.REACT_APP_DB_HOST+url;
      await fetch(url, {	// fetch를 통해 Ajax통신을 한다.
        method: 'post',	// 방식은 post
        credentials: 'include',
        headers: {
        },
        body: formData	// body에 json 데이터를 전송할 때에는 문자열로 변경해서 보내야한다.
      })
      .then(async (response) => {
        if(response.headers.get("access-token") !== null){
          window.localStorage.setItem("access-token", response.headers.get("access-token"));
          //매니저 권한 임시 구현
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
    dom.style.display= "inline-block";
    dom.style.opacity = op;
    op += 0.1;
  }, 30);
}

export const fadeOut = async (targetId) => {
  let dom = document.getElementById(targetId);
  let op = 1;  // initial opacity
  let timer = setInterval(function () {
    if (op <= 0.1 ){
      clearInterval(timer);
      dom.style.display= "none";
    }
    dom.style.opacity = op;
    op -=  0.1;
  }, 30);
}

/*
* custom alert (최상위에 위치)
*/
export const nb_fadeInOut = async (message, duringTime) => {
  document.getElementById("notifyBox").innerText = message;
			fadeIn("notifyBox")
			setTimeout(function(){
				fadeOut("notifyBox");
			}, duringTime);
}

/*
* custom alert (정중앙 위치)
*/
export const nb_fadeInOutA = async (message, duringTime) => {
  document.getElementById("notifyBoxA").innerText = message;
			fadeIn("notifyBoxA")
			setTimeout(function(){
				fadeOut("notifyBoxA");
			}, duringTime);
}

/*
* custom alert (정중앙 위치, 흔들림)
*/
export const nb_fadeInOutB = async (message, duringTime) => {
  document.getElementById("notifyBoxB").innerText = message;
			fadeIn("notifyBoxB")
			setTimeout(function(){
				fadeOut("notifyBoxB");
			}, duringTime);
}

/*
* custom alert (정중앙 위치, 흔들림, 확인 버튼)
*/
export const nb_fadeInOutC = async (message, duringTime) => {
  document.getElementById("notifyBoxC-desc").innerText = message;
			fadeIn("notifyBoxC")
}

/*
* custom prompt (정중앙 위치)
*/
export const nb_promptBox = async (message, placeholderMsg) => {
  document.getElementById("promptBoxScreen").classList.remove("hide");
  document.getElementById("promptMsg").innerText = message;
  document.getElementById("promptInput").focus();
  document.getElementById("promptInput").placeholder = placeholderMsg;
}

/*
* custom prompt (정중앙 위치)
*/
export const nb_confirmBox = async (message) => {
  document.getElementById("confirmBoxScreen").classList.remove("hide");
  document.getElementById("confirmMsg").innerText = message;
}

export const nb_confirmBoxB = async (message) => {
  document.getElementById("confirmBoxScreenB").classList.remove("hide");
  document.getElementById("confirmMsgB").innerText = message;
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
      let url = process.env.REACT_APP_DB_HOST+"/mathInfo/changeConOrSolImg";
      let returnObj = await nb_formDataFetch(url,formData, true);
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
    if(file.size > 1024*1024*2){
      // 용량 초과시 경고후 해당 파일의 용량도 보여줌
        alert("첨부파일 사이즈는 2MB 이내로 등록 가능합니다. ");
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
* 정의 : 이미지 파일 확장자 체크 함수
* 설명 : 아웃풋 이미지 변경없이 확장자만 체크
*/
export const nb_extensionCheck2 = async (event) => {
  let targetId = event.target.id;
  let obj = document.getElementById(targetId);
  let file =	document.getElementById(targetId).files[0];
  if(file== undefined){     //이미지 등록 후 다시 버튼 클릭하여 아무것도 안하고 취소버튼 누른 경우 버그 해결
        return false;
  }
  // file[0].size 는 파일 용량 정보입니다.
  if(file.size > 1024*1024*2){
    // 용량 초과시 경고후 해당 파일의 용량도 보여줌
      alert("첨부파일 사이즈는 2MB 이내로 등록 가능합니다. ");
      document.getElementById(targetId).value= "";
      return false;
  }
  let fileNames = event.target.files[0].name.split(".");
  let filetype = fileNames[1].toLowerCase();
  // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
  if(filetype=='jpg' || filetype=='gif' || filetype=='png' || filetype=='jpeg' || filetype=='bmp'){
  }else{
    alert('이미지 파일만 등록해주십시오.(img/gif/png/jpeg/bmp)');
    document.getElementById(targetId).value= "";
    return false;
  }

  if(fileNames[0].length > 40){
    alert("파일이름은 40글자 미만으로 설정해주시기 바랍니다.");
    document.getElementById(targetId).value= "";
    return false;
}

}


export const nb_module_handleImageUpload = async (event) => {
      let imageFile = event.target.files[0];
      
      //console.log(imageFile.size/1024/1024 < 0.06);
      //1MB 보다 큰 이미지에 대해서만 압축 진행
      if(imageFile.size/1024/1024 < 0.05) return imageFile;
      let options = {
        maxSizeMB: 0.04,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      try {
        document.getElementById("page-transit").classList.remove("hide");
        document.getElementById("page-transit-img").classList.remove("hide");
        document.getElementById("page-transit-desc").classList.remove("hide");
        document.getElementById("page-transit-desc").innerText = "이미지를 압축하여 불러오고 있습니다...";
        let compressedFile = await imageCompression(imageFile, options);
       // console.log(compressedFile.size/1024/1024);
        document.getElementById("page-transit").classList.add("hide");
        document.getElementById("page-transit-img").classList.add("hide");
        document.getElementById("page-transit-desc").classList.add("hide");
        return compressedFile;
      } catch (error) {
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
  let blindBox = document.getElementsByClassName("blindBox");
  for(let i=0; i<blindBox.length; i++){
    document.getElementsByClassName("blindBox")[i].classList.add("hide");
  }
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

    if(parentId=="cusSelThrUnitDiv"){
      let optionList = orginSelOpt.children;
      let selectedIdx = 0;
      for(let i=0; i<optionList.length;i++){
        if(optionList[i].dataset.uniqNo == targetDom.dataset.uniqNo) selectedIdx=i;
      }
      orginSelOpt.children[selectedIdx].selected = true;
      orginSelOpt.children[selectedIdx].dataset.uniqNo = targetDom.dataset.uniqNo;
    }else if(parentId=="cusSelQuesTypeDiv"){
      let optionList = orginSelOpt.children;
      let selectedIdx = 0;
      for(let i=0; i<optionList.length;i++){
        if(optionList[i].dataset.parentValue == targetDom.dataset.uniqNo && optionList[i].dataset.typeNo == targetDom.dataset.typeNo) selectedIdx=i;
      }
      orginSelOpt.children[selectedIdx].selected = true;
      orginSelOpt.children[selectedIdx].dataset.uniqNo = targetDom.dataset.uniqNo;
    }else{
      orginSelOpt.value = targetDom.dataset.value
      orginSelOpt.dataset.uniqNo = targetDom.dataset.uniqNo;
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
      if(targetDom.nextElementSibling.className !== "fakeDiv"){
        let div = document.createElement("div");
        div.className = "fakeDiv";
        targetDom.after(div)
      }
      
      if(targetDomWidth <620)targetDomWidth =620;
      targetDom.style.width =targetDomWidth+"px";
      targetDom.style.left = document.getElementsByClassName("right")[0].getBoundingClientRect().left+"px";
    }

    if(document.getElementsByClassName("fakeDiv")[0] !== undefined){
      if(document.getElementsByClassName("fakeDiv")[0].getBoundingClientRect().bottom> 250){
        targetDom.classList.remove("fixedTopMenu");
        if(document.getElementsByClassName("fakeDiv")[0] !== undefined) document.getElementsByClassName("fakeDiv")[0].remove();
      }
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

export const nb_topMenuFixed2 = async function(targetId){
        let targetDom = document.getElementById(targetId);
        if(targetDom.offsetTop<window.pageYOffset){
          targetDom.classList.add("fixedTopMenu");
          targetDom.style.left=50+"%";
          if(targetDom.nextElementSibling.className !== "fakeDiv2"){
            let div = document.createElement("div");
            div.className = "fakeDiv2";
            targetDom.after(div)
          }
        }

        if(document.getElementsByClassName("fakeDiv2")[0] !== undefined){
          if(document.getElementsByClassName("fakeDiv2")[0].getBoundingClientRect().bottom> 110){
            targetDom.classList.remove("fixedTopMenu");
            if(document.getElementsByClassName("fakeDiv2")[0] !== undefined) document.getElementsByClassName("fakeDiv2")[0].remove();
          }
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

/*
* 하위 요소 너비 우선 특정클래스 탐색방식 (BFS)
*/
export const nb_querySelctorBFS = async (element, className) =>{
  let childEle= null;
  let childrenByBFS = element.children;
  Loop1:
  while(childrenByBFS.length !== 0){
      let arr=[]
      Loop2:
      for(let i=0; i<childrenByBFS.length; i++){
          if(childrenByBFS[i].classList.contains(className)){
            childEle= childrenByBFS[i];
              break Loop1;
          } 
          arr.push.apply(arr, childrenByBFS[i].children);
      }
      childrenByBFS = arr;
  }
  return childEle;
}

export const nb_contentsSrcVal = async function(event, isUpdtMode) {
  let srcRef ;
  if(event === null) srcRef = document.getElementById("orgSrcRef").value;
  else srcRef = event.target.dataset.value;
  
  if(srcRef === "수학의 힘(베타)" || srcRef === "쎈수학" || srcRef === "RPM" || srcRef === "해결의법칙"){
    //참고서인 경우 문제번호, 출판연도, 문제 유형
      document.getElementById("orgSrcNo").classList.remove("hide");
      document.getElementById("copyrightYear").classList.remove("hide");
      document.getElementById("orgSrcPage").value = "";
      document.getElementById("orgSrcPage").classList.remove("customBlueBoxComplete");
      document.getElementById("orgSrcPage").classList.add("hide");
  }
  else if(srcRef === "교과서"){
      // 교과서인 경우 문제번호, 페이지수, 출판연도, 문제 유형
      document.getElementById("orgSrcNo").classList.remove("hide");
      document.getElementById("orgSrcPage").classList.remove("hide");
      document.getElementById("copyrightYear").classList.remove("hide");
  }
  else if(srcRef === "창작"){
     // 창작인 경우 문제 구분 유형만 노출, 나머지는 초기화
      document.getElementById("orgSrcNo").value = null;
      document.getElementById("orgSrcNo").classList.remove("customBlueBoxComplete");
      document.getElementById("orgSrcNo").classList.add("hide");
      document.getElementById("orgSrcPage").value = "";
      document.getElementById("orgSrcPage").classList.remove("customBlueBoxComplete");
      document.getElementById("orgSrcPage").classList.add("hide");
      document.getElementById("copyrightYear").value = "";
      document.getElementById("copyrightYear").classList.remove("customBlueBoxComplete");
      document.getElementById("copyrightYear").classList.add("hide");
  }
}

export const  nb_multiChoiceGridSet = async (className) => {
  let multiShowDiv = document.getElementsByClassName(className);
  let maxWidth;
  
  for(let i=0; i<multiShowDiv.length; i++){
      multiShowDiv[i].classList.remove("oneDivGrid");
      multiShowDiv[i].classList.remove("twoDivGrid");
      multiShowDiv[i].classList.remove("threeDivGrid");

      maxWidth = multiShowDiv[i].querySelector(".firDiv").offsetWidth;
      if(maxWidth < multiShowDiv[i].querySelector(".secDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".secDiv").offsetWidth;
      if(maxWidth < multiShowDiv[i].querySelector(".thrDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".thrDiv").offsetWidth;
      if(maxWidth < multiShowDiv[i].querySelector(".fourDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".fourDiv").offsetWidth;
      if(maxWidth < multiShowDiv[i].querySelector(".fifDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".fifDiv").offsetWidth;

      if(maxWidth<190 && maxWidth>120)  multiShowDiv[i].classList.add("twoDivGrid");
      else if(maxWidth<=120) multiShowDiv[i].classList.add("threeDivGrid");
      else multiShowDiv[i].classList.add("oneDivGrid");
  }
}

export const  nb_licenseUiCheck = async (licenseObj) => {
      if(licenseObj !== null && licenseObj !== undefined){
        if( licenseObj.shareStts === 1 ){ //공개문제
          document.getElementById("platformShareSttsUi").classList.remove("inactiveCircle");
          document.getElementById("platformShareSttsUi").classList.add("activeCircle");
          if(licenseObj.onlineLicStts === 1){
            document.getElementById("onlineLicSttsUi").classList.remove("inactiveCircle");
            document.getElementById("onlineLicSttsUi").classList.add("activeCircle");
          }else{
            document.getElementById("onlineLicSttsUi").classList.remove("activeCircle");
            document.getElementById("onlineLicSttsUi").classList.add("inactiveCircle");
          }
      
          if(licenseObj.perLicStts === 1){
            document.getElementById("perLicSttsUi").classList.remove("inactiveCircle");
            document.getElementById("perLicSttsUi").classList.add("activeCircle");
          }else{
            document.getElementById("perLicSttsUi").classList.remove("activeCircle");
            document.getElementById("perLicSttsUi").classList.add("inactiveCircle");
          }
      
          if(licenseObj.entLicStts === 1){
            document.getElementById("entLicSttsUi").classList.remove("inactiveCircle");
            document.getElementById("entLicSttsUi").classList.add("activeCircle");
          }else{
            document.getElementById("entLicSttsUi").classList.remove("activeCircle");
            document.getElementById("entLicSttsUi").classList.add("inactiveCircle");
          }
        }else{// 비공개 문제
          document.getElementById("platformShareSttsUi").classList.remove("activeCircle");
          document.getElementById("platformShareSttsUi").classList.add("inactiveCircle");
          document.getElementById("onlineLicSttsUi").classList.remove("activeCircle");
          document.getElementById("onlineLicSttsUi").classList.add("inactiveCircle");
          document.getElementById("perLicSttsUi").classList.remove("activeCircle");
          document.getElementById("perLicSttsUi").classList.add("inactiveCircle");
          document.getElementById("entLicSttsUi").classList.remove("activeCircle");
          document.getElementById("entLicSttsUi").classList.add("inactiveCircle");
        }
      }else{  //N명의수학 문제의 경우
        document.getElementById("platformShareSttsUi").classList.remove("inactiveCircle");
        document.getElementById("platformShareSttsUi").classList.add("activeCircle");

        document.getElementById("onlineLicSttsUi").classList.remove("inactiveCircle");
        document.getElementById("onlineLicSttsUi").classList.add("activeCircle");

        document.getElementById("perLicSttsUi").classList.remove("activeCircle");
        document.getElementById("perLicSttsUi").classList.add("inactiveCircle");

        document.getElementById("entLicSttsUi").classList.remove("activeCircle");
        document.getElementById("entLicSttsUi").classList.add("inactiveCircle");
      }
}

export const nb_getParameterByName = function (name) {
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export const nb_detectScrollPosition = async function(){
  if(window.innerHeight*2 < document.body.scrollHeight){
      if(window.innerHeight < window.scrollY){
          document.getElementById("scrollMoveBtn").classList.remove("hide");
      }else{
          document.getElementById("scrollMoveBtn").classList.add("hide");
      }
  }
}

export const nb_moveToScroll = async function(isToTop){
  if(isToTop){
      let interval = setInterval(function(){
          if(window.scrollY===0){clearInterval(interval);}
          window.scrollTo(window.scrollX, window.scrollY-window.scrollY/20)
      }, 1)
  }else{
      document.getElementById("bottom-div").classList.add("hide");
      let interval = setInterval(function(){
          if(Math.abs(window.scrollY-(document.documentElement.scrollHeight-document.body.offsetHeight)) <10 ){
            document.getElementById("bottom-div").classList.remove("hide");
            clearInterval(interval);
            //window.scrollTo(window.scrollX, window.scrollY-300);
          }else{
            window.scrollTo(window.scrollX, window.scrollY+window.scrollY/20)
          }
      }, 1)
  }
}

export const nb_moveToScrollAllRange = async function(isToTop){
  if(isToTop){
      let interval = setInterval(function(){
          if(window.scrollY===0){clearInterval(interval);}
          window.scrollTo(window.scrollX, window.scrollY-window.scrollY/20)
      }, 1)
  }else{
      if(document.getElementById("bottom-div") !== null) document.getElementById("bottom-div").classList.add("hide");
      let interval = setInterval(function(){
          if(Math.abs(window.scrollY-(document.documentElement.scrollHeight-document.body.offsetHeight)) <10 ){
            if(document.getElementById("bottom-div") !== null) document.getElementById("bottom-div").classList.remove("hide");
            clearInterval(interval);
            //window.scrollTo(window.scrollX, window.scrollY-300);
          }else{
            if(window.scrollY === 0)  window.scrollTo(window.scrollX, 100);
            window.scrollTo(window.scrollX, window.scrollY+window.scrollY/20)
          }
      }, 1)
  }
}

export const nb_dateFormat = async (separator) => {
    let today = new Date();
    let year = today.getFullYear(); 
    let month = today.getMonth() + 1;
    if(month.toString().length === 1) month = "0" + month.toString();
    let date = today.getDate();
    if(date.toString().length === 1) date = "0" + date.toString();
    let hour = today.getHours();
    if(hour.toString().length === 1) hour = "0" + hour.toString();
    let minute = today.getMinutes();
    if(minute.toString().length === 1) minute = "0" + minute.toString();
    let milliSec = today.getMilliseconds();
    if(milliSec.toString().length === 1) milliSec = "0" + milliSec.toString();
    return year+separator+month+separator+date+separator+hour+separator+minute+separator+milliSec;
}