/*
 * 정의 : 단원 정보 및 유형정보 콤보박스 onChange 이벤트 함수
 * 
 */

export function unitTypeChange (e) {

  var targetId = e.target.id;

  var targetIndex = document.getElementById(targetId).selectedIndex;
  var childElement;
  var isUnitBubbleEv = true;
  if(targetId == "subject"){
    childElement = document.getElementById("firUnit");
  }else if(targetId == "firUnit"){
    childElement = document.getElementById("secUnit");
  }else if(targetId == "secUnit"){
    childElement = document.getElementById("thrUnit");
  }else if(targetId == "thrUnit"){
    childElement = document.getElementById("quesType");
    isUnitBubbleEv = false;
  }

  var isCmbSelected = false;
  for(var i=0; i< childElement.length; i++){

    var isCmbEvCond =false;
    if(isUnitBubbleEv){isCmbEvCond=childElement.childNodes[i].dataset.parentValue == document.getElementById(targetId).value;}
    else{isCmbEvCond = (childElement.childNodes[i].dataset.parentValue == document.getElementById(targetId)[targetIndex].dataset.uniqNo);}
    
    if(isCmbEvCond){
      if(!isCmbSelected){
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
