/*
 * 정의 : latexConverter 컴포넌트에서 사용하는 함수
 * 
 */


export function loadFile(event) {
	var reader = new FileReader();
	reader.onload = function(){
	  var output = document.getElementById('contentsImgOutput');
	  output.src = reader.result;
	};
	reader.readAsDataURL(event.target.files[0]);
  };

/*
* 문제 및 해설 탭 클릭 이벤트
*/
export function quesAnsTabClkEv(e){
	var targetId = e.target.id;
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
export function mulChoiceTabClkEv(e) {
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


export function extensionCheck(event, outputTarget){
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
    	
    	var pathpoint = obj.value.lastIndexOf('.');
    	var filepoint = obj.value.substring(pathpoint+1,event.length);
    	var filetype = filepoint.toLowerCase();
         // 확장자가 이미지 파일이면 체크를 위해 임시로 로딩합니다.
         if(filetype=='jpg' || filetype=='gif' || filetype=='png' || filetype=='jpeg' || filetype=='bmp'){
         }else{
        	 alert('이미지  파일만 등록해주십시오.(img/gif/png/jpeg/bmp)');
        	 document.getElementById(targetId).value = ""; 
			 document.getElementById(outputTarget).src = ""; 
         }
}


export function addClassFunc(targetId, className){
	document.getElementById(targetId).classList.add(className);
}