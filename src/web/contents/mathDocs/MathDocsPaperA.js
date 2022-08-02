import React, {useState, useEffect } from 'react';
import "css/page/mathDocsPaper.css";
import "css/common/nbFormula.css";
import "css/staff/staff.css";

const MathDocsPaperA = ({mathContentsList, mathDocsTitle, mathDocsSubTitle, mathDocsGrade, mathDocsOwner, parentMethod})=>{

  const [contentsList, setContentsList] = useState(new Array());

  const contentsPaper = "<div class='mathDocstitlePadding'></div>"
                                +"<div class='mathDocsPaperWrap onlyContents'>"
                                    +"<div class='mathDocsPaperContentsWrap onlyContents'>"
                                        +"<div class='paperContentsLeft'>"
                                            +"<div class='fourArrPageCon leftAbove'></div>"
                                            +"<div class='fourArrPageCon leftBelow'></div>"
                                        +" </div>"
                                        +"<div  class='paperContentsRight'>"
                                            +"<div class='fourArrPageCon rightAbove'></div>"
                                            +"<div class='fourArrPageCon rightBelow'></div>"
                                        +"</div>"
                                +"</div>"
                            +"</div>";
                        
    const answerPapert = "<div class='mathDocstitlePadding'></div>"
                                    +"<div class='mathDocsPaperWrap onlyContents'>"
                                        +"<div class='mathDocsPaperContentsWrap onlyContents'>"
                                            +"<div class='paperContentsLeft'>"
                                                +"<div class='mathDocsPaperAnswer'></div>"
                                            +"</div>"
                                            +"<div class='paperContentsRight'>"
                                                +"<div class='mathDocsPaperAnswer rightLayer'></div>"
                                        +"</div>"
                                    +"</div>"
                            +"</div>";

  useEffect(() => {
    const asyncUseEffect = async function(){
      setContentsList(mathContentsList);
      document.getElementById("mathDocsPaperGrade").innerHTML = mathDocsGrade;
      document.getElementById("mathDocsPaperTitle").innerHTML = mathDocsTitle;
      document.getElementById("mathDocsPaperSubTitle").innerHTML = mathDocsSubTitle;
      let today = new Date();
      let year = today.getFullYear(); 
      let month = today.getMonth() + 1;
      if(month.toString().length === 1) month = "0" + month.toString();
      let date = today.getDate();
      if(date.toString().length === 1) date = "0" + date.toString();
      document.getElementById("mathDocsCreateDate").innerHTML = year+"-"+month+"-"+date;
      document.getElementById("mathDocsConCnt").innerHTML = mathContentsList.length+"문항";
      if(mathDocsOwner.length === 0){
        document.getElementById("mathDocsPaperOwnerWrap").classList.add("hide");
      }else{
        document.getElementById("mathDocsPaperOwnerWrap").classList.remove("hide");
        document.getElementById("mathDocsPaperOwner").innerHTML = mathDocsOwner;
      }

      let answerLayoutIdx = 0;
      //정답 채우기
      for(let i=0; i<mathContentsList.length; i++){
        let mathPaperAns = document.createElement("table");
        mathPaperAns.className = "mathAnswerTb";
        let mathPaperAnsTr = document.createElement("tr");
        let mathPaperAnsNumTd = document.createElement("td");
        let mathPaperAnsTd = document.createElement("td");
        mathPaperAnsNumTd.className = "mathAnswerNumTd";
        mathPaperAnsNumTd.innerHTML = (i+1)+".&nbsp;&nbsp;";
        mathPaperAnsTd.className = "mathAnswerDiv";
        mathPaperAnsTd.innerHTML = mathContentsList[i].answer;
        if(mathContentsList[i].choiceAnswer !== null && mathContentsList[i].choiceAnswer !== undefined){
            mathPaperAnsTd.innerHTML = mathContentsList[i].choiceAnswer;
        }
        mathPaperAnsTr.append(mathPaperAnsNumTd);
        mathPaperAnsTr.append(mathPaperAnsTd);
        mathPaperAns.append(mathPaperAnsTr);


        document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].append(mathPaperAns);

        let bottomPaddingVal = 0;
        if(answerLayoutIdx === 0) bottomPaddingVal = 0;

        if(document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].parentElement.offsetHeight-bottomPaddingVal < document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].offsetHeight){
            if(document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].classList.contains("rightLayer")){
                //문제 페이지 추가
                let mathPaper = document.createElement("div");
                mathPaper.className =  "mathDocsA4Frame";
                mathPaper.innerHTML = answerPapert;
                document.getElementsByClassName("mathDocsA4Frame")[document.getElementsByClassName("mathDocsA4Frame").length-1].after(mathPaper);
            }
            mathPaperAns.remove();
            answerLayoutIdx++;
            document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].append(mathPaperAns);
        }
      }
      

      let contentsShow = document.getElementsByClassName("mathDocsContents")[0].querySelectorAll(".workQuesShow");
      //문제 채우기
      for(let i=0; i<contentsShow.length; i++){
            
            let hasAllContents = true;
            let fourArrPageCon = document.getElementsByClassName("fourArrPageCon");
            for(let j=0; j<fourArrPageCon.length; j++){
                if(fourArrPageCon[j].innerHTML === "") hasAllContents = false;
            }

            if(hasAllContents){     //한 페이지에 문제가 다 들어간 경우 다음 페이지 추가
                //문제 페이지 추가
                let mathPaper = document.createElement("div");
                mathPaper.className =  "mathDocsA4Frame";
                mathPaper.innerHTML = contentsPaper;
                document.getElementById("mathDocsPaper").append(mathPaper);
            }
            
            let isHeightOver = false;
            fourArrPageCon = document.getElementsByClassName("fourArrPageCon");
            innerLoop : for(let j=0; j<fourArrPageCon.length; j++){
                if(fourArrPageCon[j].innerHTML !== "") continue;
                else {
                    //첫 페이지는 타이틀이 있어 문제 공간의 높이가 다르니 페이지에 맞게 셋팅
                    let pageHeightVal = 540;
                    if(fourArrPageCon[j].classList.contains("firstPage")){
                        pageHeightVal=470;
                    }

                    if(contentsShow[i].offsetHeight > pageHeightVal){
                        let remainSpace = false;
                        //아래 공간에 위치하는 경우 위에 공간에 위치하는 문제와 비교
                        if(fourArrPageCon[j].classList.contains("leftBelow") || fourArrPageCon[j].classList.contains("rightBelow")){
                            //위에 공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                            let paddingHeight = ((fourArrPageCon[j].offsetHeight+fourArrPageCon[j-1].offsetHeight)
                                                -(contentsShow[i].offsetHeight+contentsShow[i-1].offsetHeight));
                            //공간이 최소 150px(4cm) 남았을 때 나눠 먹기
                            if(paddingHeight>150) {
                                remainSpace = true;
                                fourArrPageCon[j-1].style.height = (contentsShow[i-1].offsetHeight+(paddingHeight/2))+"px";
                                fourArrPageCon[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                            }

                        //위에 공간에 위치하는 경우 아래 공간에 위치하는 문제와 비교
                        }else{
                            //공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                            if(j!==fourArrPageCon.length-1){    //맨 마지막 컨텐츠가 아닐 때
                                let paddingHeight = ((fourArrPageCon[j].offsetHeight+fourArrPageCon[j+1].offsetHeight)
                                                    -(contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight));
                                //공간이 최소 150px(4cm) 남았을 때 나눠 먹기
                                if(paddingHeight>150){
                                    remainSpace = true;
                                    fourArrPageCon[j+1].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                    fourArrPageCon[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                }
                            }
                        }

                        //공간이 남지 않는 경우에만 다른 공간 제거
                        if(!remainSpace){
                            //case.1)왼쪽 아래  (오른쪽 위에 추가)
                            if(fourArrPageCon[j].classList.contains("leftBelow")){
                                //공간이 남는 경우, 남는 공간 똑같이 나눠 먹기(오른쪽 위와 오른쪽 아래 한번 더 비교)
                                let paddingHeight = ((fourArrPageCon[j+1].offsetHeight+fourArrPageCon[j+2].offsetHeight)
                                                    -(contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight));
                                //공간이 최소 150px(4cm) 남았을 때 나눠 먹고 그 이하는 아래 로직에서 한 쪽 공간제거 로직으로 구현
                                if(paddingHeight>150) {
                                    remainSpace = true;
                                    fourArrPageCon[j+2].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                    fourArrPageCon[j+1].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                }else{  //공간 남지 않으면 오른쪽 아래 공간 제거해서 한 줄 다 차지
                                    fourArrPageCon[j+2].remove(); 
                                }

                                //왼쪽 아래 공간 제거
                                fourArrPageCon[j].remove(); 

                                isHeightOver = true;
                                break innerLoop;
                            //case.2)오른쪽 아래 (다음페이지에 추가)
                            }else if(fourArrPageCon[j].classList.contains("rightBelow")){
                                //문제 페이지 추가
                                let mathPaper = document.createElement("div");
                                mathPaper.className =  "mathDocsA4Frame";
                                mathPaper.innerHTML = contentsPaper;

                                
                                //공간이 남는 경우, 남는 공간 똑같이 나눠 먹기(새로운 페이지 왼쪽 위와 왼쪽 아래 한번 더 비교)
                                //문제 페이지 높이 1080
                                let paddingHeight = (1080-(contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight));
                                //공간이 최소 150px(4cm) 남았을 때 나눠 먹고 그 이하는 아래 로직에서 한 쪽 공간제거 로직으로 구현
                                if(paddingHeight>150) {
                                    remainSpace = true;
                                    mathPaper.querySelectorAll(".leftAbove")[0].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                    mathPaper.querySelectorAll(".leftBelow")[0].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                }else{  //공간 남지 않으면 왼쪽 아래 공간 제거해서 한 줄 다 차지
                                    mathPaper.querySelectorAll(".leftBelow")[0].remove();   //다음 페이지 왼쪽 아래 공간 제거
                                }
                                
                                document.getElementById("mathDocsPaper").append(mathPaper);
                                fourArrPageCon[j].remove();         //오른쪽 아래 공간 제거
                                isHeightOver = true;
                                break innerLoop;
                            //case.3)위 (다음페이지에 추가)
                            }else{
                                fourArrPageCon[j+1].remove();
                            }
                        }
                    }
                    fourArrPageCon[j].innerHTML = "<div class='mathPaperQuesNumber'>"+(i+1)+"</div>"+contentsShow[i].innerHTML;
                    break innerLoop;
                }
            }

            
            if(isHeightOver){
                fourArrPageCon = document.getElementsByClassName("fourArrPageCon");
                innerLoop : for(let j=0; j<fourArrPageCon.length; j++){
                    if(fourArrPageCon[j].innerHTML !== "") continue;
                    else {
                        fourArrPageCon[j].innerHTML = "<div class='mathPaperQuesNumber'>"+(i+1)+"</div>"+contentsShow[i].innerHTML;
                        break innerLoop;
                    }
                }
            }
      }

      let mathDocsA4Frame = document.getElementsByClassName("mathDocsA4Frame");
      for(let i=0; i<mathDocsA4Frame.length; i++){
        mathDocsA4Frame[i].classList.add("tmpHideDivForPrint");
      }

      
      document.getElementById("mathoDocsSolution")
      
      let ansSolDiv = document.getElementsByClassName("ansSolDiv");
      for(let i=0; i<ansSolDiv.length; i++){
        let tmpSpan = document.createElement("span");
        tmpSpan.innerHTML = ansSolDiv[i].innerHTML;
        document.getElementById("mathoDocsSolution").append(tmpSpan);
      }
      window.print();
      parentMethod();
    }
    asyncUseEffect();
},[]);


  return (
    <div id="mathDocsPaperPdf" className='mathDocsWrap'>
        <div id="mathDocsPaper" >
            <div id="mathDocsPaperA" className="mathDocsA4Frame">
                <div className='mathDocstitlePadding'></div>
                <div className="mathDocsPaperWrap">
                <div className="mathDocsPaperTitleWrap">
                        <table className='mathDocPaperTitleTb'>
                            <tbody>
                                <tr>
                                    <td rowSpan={3}><span id="mathDocsPaperGrade" className='mathDocsPaperGrade'></span></td>
                                </tr>
                                <tr>
                                    <td id="mathDocsPaperTitle" className='mathDocsPaperTitle'></td>
                                </tr>
                                <tr>
                                    <td id="mathDocsPaperSubTitle" className='mathDocsPaperSubTitle'></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='mathDocsTitleWrap2'>
                        <div><span id="mathDocsCreateDate"></span> [<span id="mathDocsConCnt"></span>]<br/> <span id="mathDocsPaperOwnerWrap">출제자 : <span id="mathDocsPaperOwner"></span></span></div>
                        <div>학생 이름 : <span className='nameSpan'></span></div>
                        </div>
                </div>
                <div className='mathDocsPaperContentsWrap'>
                    <div className='paperContentsLeft'>
                        <div className='fourArrPageCon firstPage leftAbove'></div>
                        <div className='fourArrPageCon firstPage leftBelow'></div>
                    </div>
                    <div  className='paperContentsRight'>
                        <div className='fourArrPageCon firstPage rightAbove'></div>
                        <div className='fourArrPageCon firstPage rightBelow'></div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div className="mathDocsA4Frame">
                <div className='mathDocstitlePadding'></div>
                <div className="mathDocsPaperWrap onlyContents">
                    <div className='mathDocsPaperContentsWrap onlyContents'>
                        <div className='paperContentsLeft'>
                            <div className='mathDocsPaperAnsTitle'><span className='ellipseUi'>정답</span></div>
                            <div className='mathDocsPaperAnswer'></div>
                        </div>
                        <div className='paperContentsRight'>
                            <div className='mathDocsPaperAnswer rightLayer'></div>
                        </div>
                        
                    </div>
                </div>
        </div>
        <div id="mathoDocsSolution" className="mathoDocsSolution mathDocsA4Frame">

        </div>
    </div>
    
    
  );
}

export default MathDocsPaperA;