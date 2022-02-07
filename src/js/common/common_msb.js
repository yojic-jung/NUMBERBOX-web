/*
 * 정의 : web에서 was의 data를 fetch하는 공통 함수
 * 설명 : transitEffect는 spinner 효과 사용여부 판단
*/

export const msb_dataFetch = async (url, transitEffect) => {
  if(transitEffect) document.getElementById("page-transit").classList.remove("hide");
  let returnVal = null;
  await fetch(url)
  .then(async (response) => response.text() )
  .then(async (data) => { 
    if(transitEffect) document.getElementById("page-transit").classList.add("hide");
    returnVal = JSON.parse(data)
  });
  return returnVal
}


/*
 * 정의 : 클래스 추가 함수
 */
export const msb_addClass = async (targetId, className) => {
  document.getElementById(targetId).classList.add(className);
}



/*
* 정의 : 이미지 로드 & 쇼
* 설명 : input file에 등록된 파일 이미지를 쇼하는 함수
*/

export const msb_loadFile = async (event, outputId) => {	//outputId는 출력 dom
	let reader = new FileReader();
	reader.onload = function(){
	  let output = document.getElementById(outputId);
	  output.src = reader.result;
	};
	reader.readAsDataURL(event.target.files[0]);
  };

/*
* 정의 : 이미지 삭제
* 설명 : input file에 등록된 파일 이미지를 삭제하는 함수
*/
  export const msb_imgFileDel = async (event, outputId, fileTagId) => {//outputId는 출력 dom
    document.getElementById(fileTagId).value= "";
    
    let output = document.getElementById(outputId);
	  output.src = "";
  }


/*
* 정의 : 이미지 파일 확장자 체크 함수
*/
export const msb_extensionCheck = async (event, outputTarget) => {
  let targetId = event.target.id;
  let obj = document.getElementById(targetId);
    let file =	document.getElementById(targetId).files[0];
    // file[0].size 는 파일 용량 정보입니다.
    if(file.size > 1024*1024*1){
      // 용량 초과시 경고후 해당 파일의 용량도 보여줌
        alert("첨부파일 사이즈는 1MB 이내로 등록 가능합니다. ");
        document.getElementById(targetId).value = ""; 
      document.getElementById(outputTarget).src = ""; 
        return false;
    }
    
    let pathpoint = obj.value.lastIndexOf('.');
    let filepoint = obj.value.substring(pathpoint+1,event.length);
    let filetype = filepoint.toLowerCase();
       // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
       if(filetype=='jpg' || filetype=='gif' || filetype=='png' || filetype=='jpeg' || filetype=='bmp'){
       }else{
         alert('이미지  파일만 등록해주십시오.(img/gif/png/jpeg/bmp)');
         document.getElementById(targetId).value = ""; 
     document.getElementById(outputTarget).src = ""; 
       }
}