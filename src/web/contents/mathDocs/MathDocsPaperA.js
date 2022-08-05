import React, {useState, useEffect } from 'react';
import "css/page/mathDocsPaper.css";

const MathDocsPaperA = ({perPageCnt, mathContentsList, mathDocsTitle, mathDocsSubTitle, mathDocsGrade, mathDocsOwner, parentMethod})=>{

  const [contentsList, setContentsList] = useState(new Array());

  const contentsPaper = "<div class='mathDocsPaperWrap onlyContents'>"
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

    const contentsPaperSix = "<div class='mathDocsPaperWrap onlyContents'>"
                                    +"<div class='mathDocsPaperContentsWrap onlyContents'>"
                                        +"<div class='paperContentsLeft'>"
                                            +"<div class='sixArrPageCon leftAbove'></div>"
                                            +"<div class='sixArrPageCon leftCenter'></div>"
                                            +"<div class='sixArrPageCon leftBelow'></div>"
                                        +" </div>"
                                        +"<div  class='paperContentsRight'>"
                                            +"<div class='sixArrPageCon rightAbove'></div>"
                                            +"<div class='sixArrPageCon rightCenter'></div>"
                                            +"<div class='sixArrPageCon rightBelow'></div>"
                                        +"</div>"
                                +"</div>"
                            +"</div>";
                        
    const contentsPaperEight = "<div class='mathDocsPaperWrap onlyContents'>"
                                    +"<div class='mathDocsPaperContentsWrap onlyContents'>"
                                        +"<div class='paperContentsLeft'>"
                                            +"<div class='eightArrPageCon leftFirst'></div>"
                                            +"<div class='eightArrPageCon leftSecond'></div>"
                                            +"<div class='eightArrPageCon leftThird'></div>"
                                            +"<div class='eightArrPageCon leftFourth'></div>"
                                        +" </div>"
                                        +"<div  class='paperContentsRight'>"
                                            +"<div class='eightArrPageCon rightFirst'></div>"
                                            +"<div class='eightArrPageCon rightSecond'></div>"
                                            +"<div class='eightArrPageCon rightThird'></div>"
                                            +"<div class='eightArrPageCon rightFourth'></div>"
                                        +"</div>"
                                +"</div>"
                            +"</div>";

    const answerPaper = "<div class='mathDocsPaperWrap onlyContents'>"
                                        +"<div class='mathDocsPaperContentsWrap onlyContents'>"
                                            +"<div class='paperContentsLeft'>"
                                                +"<div class='mathDocsPaperAnswer'></div>"
                                            +"</div>"
                                            +"<div class='paperContentsRight'>"
                                                +"<div class='mathDocsPaperAnswer rightLayer'></div>"
                                        +"</div>"
                                    +"</div>"
                            +"</div>";
    
    const solutionPaper = "<div class='paperContentsLeft sol'>"
                                +"<div class='mathDocsPaperAnsTitle'><span class='ellipseUi sol'>해설</span></div>"
                                +"<div class='mathDocsPaperAnswer'></div>"
                            +"</div>";

    const fourArrLayoutSet = async () => {
            let contentsShow = document.getElementsByClassName("mathDocsContents")[0].querySelectorAll(".workQuesShow");
            for(let i=0; i<contentsShow.length; i++){

                let targetArrClassName = "fourArrPageCon";

                let hasAllContents = true;
                let arrPageContents = document.getElementsByClassName(targetArrClassName);
                for(let j=0; j<arrPageContents.length; j++){
                    if(arrPageContents[j].innerHTML === "") hasAllContents = false;
                }

                if(hasAllContents){     //한 페이지에 문제가 다 들어간 경우 다음 페이지 추가
                    //문제 페이지 추가
                    let mathPaper = document.createElement("div");
                    mathPaper.className =  "mathDocsA4Frame";
                    mathPaper.innerHTML = contentsPaper;
                    document.getElementById("mathDocsPaper").append(mathPaper);
                }
                
                arrPageContents = document.getElementsByClassName(targetArrClassName);
                innerLoop : for(let j=0; j<arrPageContents.length; j++){
                    if(arrPageContents[j].innerHTML !== "") continue;
                    else {
                        let pageHeightVal = arrPageContents[j].offsetHeight;
                      
                        if(contentsShow[i].offsetHeight > pageHeightVal){
                            //아래 공간에 위치하는 경우 위에 공간에 위치하는 문제와 비교
                            if(arrPageContents[j].classList.contains("leftBelow") || arrPageContents[j].classList.contains("rightBelow")){
                                //위에 공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                                let paddingHeight = ((arrPageContents[j].offsetHeight+arrPageContents[j-1].offsetHeight)
                                                    -(contentsShow[i].offsetHeight+contentsShow[i-1].offsetHeight+50));     //50은 문제 번호 높이
                                if(paddingHeight>0) {
                                    arrPageContents[j-1].style.height = (contentsShow[i-1].offsetHeight+(paddingHeight/2))+"px";
                                    arrPageContents[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                }else{
                                     //case.1)왼쪽 아래 (오른쪽에 추가)
                                    if(arrPageContents[j].classList.contains("leftBelow")){
                                        
                                        arrPageContents[j].remove();    //현재 왼쪽 아래 공간 제거

                                        if(i!==contentsShow.length-1){      //맨 마지막 컨텐츠가 아닌 경우
                                            //다음 컨텐츠와의 높이 합이 페이지 한쪽 면의 높이보다 큰지 비교
                                            let paddingHeight = ((arrPageContents[j].offsetHeight+arrPageContents[j+1].offsetHeight)
                                                                -(contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight+50));    //50은 문제 번호 높이
                                            if(paddingHeight>0) {
                                                arrPageContents[j+1].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                                arrPageContents[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                            }else{  
                                                //공간 남지 않으면 오른쪽 공간 하나 더 제거해서 한 줄 다 차지
                                                arrPageContents[j].remove();  
                                            }
                                        }
                                    //case.2)오른쪽 아래 (다음페이지에 추가)
                                    }else{
                                        arrPageContents[j].remove();         //오른쪽 아래 공간 제거
                                        //문제 페이지 추가
                                        let mathPaper = document.createElement("div");
                                        mathPaper.className =  "mathDocsA4Frame";
                                        mathPaper.innerHTML = contentsPaper;
                                        document.getElementById("mathDocsPaper").append(mathPaper);
                                        if(i !== contentsShow.length-1){      //맨 마지막 컨텐츠가 아닌 경우 
                                            //다음 컨텐츠와의 높이 합이 페이지 한쪽 면의 높이보다 큰지 비교
                                            let paddingHeight = ((mathPaper.querySelectorAll(".leftAbove")[0].offsetHeight+mathPaper.querySelectorAll(".leftBelow")[0].offsetHeight)
                                                                    -(contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight+50));
                                            if(paddingHeight>0) {
                                                mathPaper.querySelectorAll(".leftAbove")[0].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                                mathPaper.querySelectorAll(".leftBelow")[0].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                            }else{   
                                                //공간 남지 않으면 오른쪽 공간 하나 더 제거해서 한 줄 다 차지
                                                mathPaper.querySelectorAll(".leftAbove")[0].remove();
                                            }
                                            
                                        }
                                    }
                                }

                            //위에 공간에 위치하는 경우 아래 공간에 위치하는 문제와 비교
                            }else{
                                //공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                                if(i!==contentsShow.length-1){    //맨 마지막 컨텐츠가 아닐 때
                                    let paddingHeight = ((arrPageContents[j].offsetHeight+arrPageContents[j+1].offsetHeight)
                                                        -(contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight+50));
                                    if(paddingHeight>0){
                                        arrPageContents[j+1].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                        arrPageContents[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                    }else{
                                        arrPageContents[j].remove();
                                    }
                                }
                            }
                        }
                        arrPageContents[j].innerHTML = "<div class='mathPaperQuesNumber'>"+(i+1)+"</div>"+contentsShow[i].innerHTML;
                        break innerLoop;
                    }
                }
            }
    }

    const sixArrLayoutSet = async () => {
        let contentsShow = document.getElementsByClassName("mathDocsContents")[0].querySelectorAll(".workQuesShow");
        for(let i=0; i<contentsShow.length; i++){

            let targetArrClassName = "sixArrPageCon";

            let hasAllContents = true;
            let arrPageContents = document.getElementsByClassName(targetArrClassName);
            for(let j=0; j<arrPageContents.length; j++){
                if(arrPageContents[j].innerHTML === "") hasAllContents = false;
            }

            if(hasAllContents){     //한 페이지에 문제가 다 들어간 경우 다음 페이지 추가
                //문제 페이지 추가
                let mathPaper = document.createElement("div");
                mathPaper.className =  "mathDocsA4Frame";
                mathPaper.innerHTML = contentsPaperSix;
                document.getElementById("mathDocsPaper").append(mathPaper);
            }
            
            arrPageContents = document.getElementsByClassName(targetArrClassName);
            innerLoop : for(let j=0; j<arrPageContents.length; j++){
                if(arrPageContents[j].innerHTML !== "") continue;
                else {
                    let pageHeightVal = arrPageContents[j].offsetHeight;
                    if(contentsShow[i].offsetHeight > pageHeightVal){
                        //아래 공간에 위치하는 경우 위에 공간에 위치하는 문제들과 비교
                        if(arrPageContents[j].classList.contains("leftBelow") || arrPageContents[j].classList.contains("rightBelow")){
                            //위에 문제들의 공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                            let halfPageSpace = arrPageContents[j].closest(".paperContentsLeft");
                            if(halfPageSpace === null) halfPageSpace = arrPageContents[j].closest(".paperContentsRight");
                            
                            //오른쪽이면 미리 페이지 추가
                            if(arrPageContents[j].classList.contains("rightBelow")){
                                let mathPaper = document.createElement("div");
                                mathPaper.className =  "mathDocsA4Frame";
                                mathPaper.innerHTML = contentsPaperSix;
                                document.getElementById("mathDocsPaper").append(mathPaper);
                            }
                            //현재 공간 제거
                            arrPageContents[j].remove();

                            //위에 두 공간 공간 똑같이 나누기
                            let contentsHeight = contentsShow[i-2].offsetHeight+contentsShow[i-1].offsetHeight+50;   //(50은 문제 번호 공간 높이)
                            let paddingHeight = (halfPageSpace.offsetHeight-contentsHeight);
                            arrPageContents[j-2].style.height = (contentsShow[i-2].offsetHeight+(paddingHeight/2))+"px";
                            arrPageContents[j-1].style.height = (contentsShow[i-1].offsetHeight+(paddingHeight/2))+"px";

                            if(i!==contentsShow.length-1){    //맨 마지막 컨텐츠가 아닐 때
                                let nextContentsHeight = contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight+50;   //(50은 문제 번호 공간 높이)
                                if(halfPageSpace.offsetHeight > nextContentsHeight){
                                    arrPageContents[j].remove();        //오른쪽(또는 새 패이지) 위 제거
                                    //다음 컨텐츠와 공간 나누기
                                    let contentsHeight = contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight+50;   //(50은 문제 번호 공간 높이)
                                    let paddingHeight = (halfPageSpace.offsetHeight-contentsHeight);

                                    //남은 두 공간 공간 나누기
                                    arrPageContents[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                    arrPageContents[j+1].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                }else{
                                    arrPageContents[j+1].remove();      //오른쪽(또는 새 패이지) 가운데 제거
                                    arrPageContents[j].remove();        //오른쪽(또는 새 패이지) 위 제거
                                }
                            }
                        //가운데 공간에 위치하는 경우 위 공간에 위치하는 문제와 비교
                        }else if(arrPageContents[j].classList.contains("leftCenter") || arrPageContents[j].classList.contains("rightCenter")){
                            //위에 문제들의 공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                            let halfPageSpace = arrPageContents[j].closest(".paperContentsLeft");
                            if(halfPageSpace === null) halfPageSpace = arrPageContents[j].closest(".paperContentsRight");
                            let contentsHeight = contentsShow[i-1].offsetHeight+contentsShow[i].offsetHeight+50;   //(50은 문제 번호 공간 높이)
                            let paddingHeight = (halfPageSpace.offsetHeight-contentsHeight);
                            if(paddingHeight > 0) {
                                arrPageContents[j].remove();
                                arrPageContents[j-1].style.height = (contentsShow[i-1].offsetHeight+(paddingHeight/2))+"px";
                                arrPageContents[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                            }else{
                                //오른쪽이면 페이지 추가하는 로직 필요, 
                                if(arrPageContents[j].classList.contains("rightCenter")){
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperSix;
                                    mathPaper.querySelector(".leftAbove").remove();
                                    mathPaper.querySelector(".leftCenter").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                }else{
                                    let paperContentsRight = arrPageContents[j].closest(".mathDocsPaperContentsWrap").querySelector(".paperContentsRight");
                                    paperContentsRight.querySelector(".rightAbove").remove();
                                    paperContentsRight.querySelector(".rightCenter").remove();
                                }
                                arrPageContents[j+1].remove();
                                arrPageContents[j].remove();
                            }
                        //위에 공간에 위치하는 경우 아래 공간에 위치하는 문제와 비교
                        }else{
                            //공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                            if(i!==contentsShow.length-1){    //맨 마지막 컨텐츠가 아닐 때
                                 //아래 문제 공간이 남는 경우, 남는 공간 똑같이 나눠 먹기
                                let halfPageSpace = arrPageContents[j].closest(".paperContentsLeft");
                                if(halfPageSpace === null) halfPageSpace =arrPageContents[j].closest(".paperContentsRight");
                                let contentsHeight = contentsShow[i].offsetHeight+contentsShow[i+1].offsetHeight+50;    //(50은 문제 번호 공간 높이)
                                let paddingHeight = (halfPageSpace.offsetHeight-contentsHeight);
                                if(paddingHeight > 0) {
                                    arrPageContents[j].remove();
                                    arrPageContents[j+1].style.height = (contentsShow[i+1].offsetHeight+(paddingHeight/2))+"px";
                                    arrPageContents[j].style.height = (contentsShow[i].offsetHeight+(paddingHeight/2))+"px";
                                }else {
                                    arrPageContents[j+1].remove();
                                    arrPageContents[j].remove();
                                }
                            }
                        }
                    }
                    arrPageContents[j].innerHTML = "<div class='mathPaperQuesNumber'>"+(i+1)+"</div>"+contentsShow[i].innerHTML;
                    break innerLoop;
                }
            }
            
        }
    }


    const eightArrLayoutSet = async () => {
        let contentsShow = document.getElementsByClassName("mathDocsContents")[0].querySelectorAll(".workQuesShow");

        for(let i=0; i<contentsShow.length; i++){

            let targetArrClassName = "eightArrPageCon";

            let hasAllContents = true;
            let arrPageContents = document.getElementsByClassName(targetArrClassName);
            for(let j=0; j<arrPageContents.length; j++){
                if(arrPageContents[j].innerHTML === "") hasAllContents = false;
            }

            if(hasAllContents){     //한 페이지에 문제가 다 들어간 경우 다음 페이지 추가
                //문제 페이지 추가
                let mathPaper = document.createElement("div");
                mathPaper.className =  "mathDocsA4Frame";
                mathPaper.innerHTML = contentsPaperEight;
                document.getElementById("mathDocsPaper").append(mathPaper);
            }
            
            arrPageContents = document.getElementsByClassName(targetArrClassName);
            innerLoop : for(let j=0; j<arrPageContents.length; j++){
                if(arrPageContents[j].innerHTML !== "") continue;
                else {
                    let pageHeightVal = arrPageContents[j].offsetHeight;
                    if(contentsShow[i].offsetHeight > pageHeightVal){
                        //왼쪽 첫번째 또는 오른쪽 첫번째 공간에 위치하는 경우
                        if(arrPageContents[j].classList.contains("leftFirst") || arrPageContents[j].classList.contains("rightFirst")){
                           
                            let multipleVal = contentsShow[i].offsetHeight/arrPageContents[j].offsetHeight;
                            //문제 높이가 공간 높이의 1배수 이상 2배수 미만인 경우
                            if(multipleVal<2 && multipleVal>=1){
                                arrPageContents[j+1].style.height = arrPageContents[j+1].offsetHeight*2+"px";
                                arrPageContents[j].remove();

                            //문제 높이가 공간 높이의 2배수 이상 3배수 미만인 경우
                            }else if(multipleVal<3 && multipleVal>=2){
                                arrPageContents[j+2].style.height = arrPageContents[j+2].offsetHeight*2+"px";
                                arrPageContents[j+1].remove();
                                arrPageContents[j].remove();

                            //문제 높이가 공간 높이의 3배수 이상인 경우
                            }else if(multipleVal>3){
                                arrPageContents[j+2].remove();
                                arrPageContents[j+1].remove();
                                arrPageContents[j].remove();
                            }
                        //왼쪽 두번째 또는 오른쪽 두번째 공간에 위치하는 경우
                        }else if(arrPageContents[j].classList.contains("leftSecond") || arrPageContents[j].classList.contains("rightSecond")){
                            let multipleVal = contentsShow[i].offsetHeight/arrPageContents[j].offsetHeight;
                            //문제 높이가 공간 높이의 1배수 이상 2배수 미만인 경우
                            if(multipleVal<2 && multipleVal>=1){
                                arrPageContents[j].remove();            //현재 공간 제거
                            //문제 높이가 공간 높이의 2배수 이상 3배수 미만인 경우
                            }else if(multipleVal<3 && multipleVal>=2){
                                arrPageContents[j+1].remove();
                                arrPageContents[j].remove();
                            //문제 높이가 공간 높이의 3배수 이상인 경우
                            }else if(multipleVal>3){
                                arrPageContents[j+1].remove();
                                arrPageContents[j].remove();

                                //왼쪽 사이드인 경우
                                if(arrPageContents[j].classList.contains("leftFourth") ){
                                    arrPageContents[j+3].remove();
                                    arrPageContents[j+2].remove();
                                    arrPageContents[j+1].remove();
                                    arrPageContents[j].remove();

                                //오른쪽 사이드인 경우
                                }else{
                                    arrPageContents[j].remove();
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperEight;
                                    mathPaper.querySelector(".leftFirst").remove();
                                    mathPaper.querySelector(".leftSecond").remove();
                                    mathPaper.querySelector(".leftThird").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                }
                            }
                        //왼쪽 세번째 또는 오른쪽 세번째 공간에 위치하는 경우
                        }else if(arrPageContents[j].classList.contains("leftThird") || arrPageContents[j].classList.contains("rightThird")){
                            let halfPageSpace = arrPageContents[j].closest(".paperContentsLeft");
                            if(halfPageSpace === null) halfPageSpace = arrPageContents[j].closest(".paperContentsRight");
                           
                            let multipleVal = contentsShow[i].offsetHeight/arrPageContents[j].offsetHeight;
                            //문제 높이가 공간 높이의 1배수 이상 2배수 미만인 경우
                            if(multipleVal<2 && multipleVal>=1){
                                arrPageContents[j].remove();
                            //문제 높이가 공간 높이의 2배수 이상 3배수 미만인 경우
                            }else if(multipleVal<3 && multipleVal>=2){
                                arrPageContents[j].remove();

                                //왼쪽 사이드인 경우
                                if(arrPageContents[j].classList.contains("leftFourth") ){
                                    arrPageContents[j].remove();        //왼쪽 마지막 제거
                                    //문제 들어갈 공간 높이*3
                                    arrPageContents[j+2].style.height = arrPageContents[j+2].offsetHeight*3+"px";
                                    arrPageContents[j+1].remove();        //오른쪽 두번째 제거
                                    arrPageContents[j].remove();        //오른쪽 첫번째 제거
                                   
                                //오른쪽 사이드인 경우
                                }else{
                                    arrPageContents[j].remove();        //오른쪽 마지막 제거
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperEight;
                                    mathPaper.querySelector(".leftFirst").remove();
                                    mathPaper.querySelector(".leftSecond").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                    mathPaper.querySelector(".leftThird").style.height = mathPaper.querySelector(".leftThird").offsetHeight*3+"px";
                                }
                            //문제 높이가 공간 높이의 3배수 이상인 경우
                            }else if(multipleVal>3){
                                arrPageContents[j].remove();

                                if(arrPageContents[j].classList.contains("leftFourth") ){
                                    arrPageContents[j+3].remove();
                                    arrPageContents[j+2].remove();
                                    arrPageContents[j+1].remove();
                                    arrPageContents[j].remove();
                                   
                                //오른쪽 사이드인 경우 새 페이지 왼쪽 공간 3개 더 제거
                                }else{
                                    arrPageContents[j].remove();
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperEight;
                                    mathPaper.querySelector(".leftFirst").remove();
                                    mathPaper.querySelector(".leftSecond").remove();
                                    mathPaper.querySelector(".leftThird").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                }
                            }
                        //왼쪽 마지막 또는 오른쪽 마지막 공간에 위치하는 경우
                        }else{
                            let multipleVal = contentsShow[i].offsetHeight/arrPageContents[j].offsetHeight;

                            //문제 높이가 공간 높이의 1배수 이상 2배수 미만인 경우
                            if(multipleVal<2 && multipleVal>=1){
                                //왼쪽 사이드인 경우
                                if(arrPageContents[j].classList.contains("leftFourth") ){
                                    arrPageContents[j].remove();        //왼쪽 마지막 제거
                                    //문제 들어갈 공간 높이*2
                                    arrPageContents[j+1].style.height = arrPageContents[j+1].offsetHeight*2+"px";
                                    arrPageContents[j].remove();        //오른쪽 첫번째 제거
                                    
                                //오른쪽 사이드인 경우 새 페이지 왼쪽 공간 2개 더 제거
                                }else{
                                    arrPageContents[j].remove();                //오른쪽 마지막 제거
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperEight;
                                    mathPaper.querySelector(".leftFirst").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                    mathPaper.querySelector(".leftSecond").style.height = mathPaper.querySelector(".leftSecond").offsetHeight*2+"px";
                                }

                            //문제 높이가 공간 높이의 2배수 이상 3배수 미만인 경우
                            }else if(multipleVal<3 && multipleVal>=2){
                                //왼쪽 사이드인 경우
                                if(arrPageContents[j].classList.contains("leftFourth") ){
                                    arrPageContents[j].remove();        //왼쪽 마지막 제거
                                    //문제 들어갈 공간 높이*3
                                    arrPageContents[j+2].style.height = arrPageContents[j+2].offsetHeight*3+"px";
                                    arrPageContents[j+1].remove();
                                    arrPageContents[j].remove();
                                }else{
                                    arrPageContents[j].remove();        //오른쪽 마지막 제거
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperEight;
                                    mathPaper.querySelector(".leftFirst").remove();
                                    mathPaper.querySelector(".leftSecond").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                    mathPaper.querySelector(".leftThird").style.height = mathPaper.querySelector(".leftThird").offsetHeight*3+"px";
                                }

                            //문제 높이가 공간 높이의 3배수 이상인 경우
                            }else if(multipleVal>3){
                                //왼쪽 사이드인 경우
                                if(arrPageContents[j].classList.contains("leftFourth") ){
                                    arrPageContents[j+3].remove();
                                    arrPageContents[j+2].remove();
                                    arrPageContents[j+1].remove();
                                    arrPageContents[j].remove();
                                //오른쪽 사이드인 경우 새 페이지 왼쪽 공간 2개 더 제거
                                }else{
                                    arrPageContents[j].remove();
                                    let mathPaper = document.createElement("div");
                                    mathPaper.className =  "mathDocsA4Frame";
                                    mathPaper.innerHTML = contentsPaperEight;
                                    mathPaper.querySelector(".leftFirst").remove();
                                    mathPaper.querySelector(".leftSecond").remove();
                                    mathPaper.querySelector(".leftThird").remove();
                                    document.getElementById("mathDocsPaper").append(mathPaper);
                                }

                            }
                        }
                    }
                    arrPageContents[j].innerHTML = "<div class='mathPaperQuesNumber'>"+(i+1)+"</div>"+contentsShow[i].innerHTML;
                    break innerLoop;
                }
            }
        }
        
        
        let paperContentsLeft = document.getElementsByClassName("paperContentsLeft");
        for(let i=0; i<paperContentsLeft.length;i++){
            let childNodes = paperContentsLeft[i].querySelectorAll(".quesDiv");
            let parentDivHeight = paperContentsLeft[i].offsetHeight;
            let contentsHeight = 0;
            for(let j=0; j<childNodes.length; j++){
                contentsHeight += childNodes[j].offsetHeight+25;
            }
            let paddingHeight = parentDivHeight-contentsHeight;
            let contentsPaddingHeight = paddingHeight/childNodes.length;
            for(let j=0; j<childNodes.length; j++){
                childNodes[j].closest(".eightArrPageCon").style.height =childNodes[j].offsetHeight+25+contentsPaddingHeight +"px"
            }
        }

        let paperContentsRight = document.getElementsByClassName("paperContentsRight");
        for(let i=0; i<paperContentsRight.length;i++){
            let childNodes = paperContentsRight[i].querySelectorAll(".quesDiv");
            let parentDivHeight = paperContentsRight[i].offsetHeight;
            let contentsHeight = 0;
            for(let j=0; j<childNodes.length; j++){
                contentsHeight += childNodes[j].offsetHeight+25;
            }
            let paddingHeight = parentDivHeight-contentsHeight;
            let contentsPaddingHeight = paddingHeight/childNodes.length;
            for(let j=0; j<childNodes.length; j++){
                childNodes[j].closest(".eightArrPageCon").style.height =childNodes[j].offsetHeight+25+contentsPaddingHeight +"px"
            }
        }
    }

  useEffect(() => {
        const asyncUseEffect = async function(){
            document.getElementById("page-transit").classList.remove("hide");
            document.getElementById("page-transit-img").classList.remove("hide");
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
                if(answerLayoutIdx === 0) bottomPaddingVal = 47;

                if(document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].parentElement.offsetHeight-bottomPaddingVal < document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].offsetHeight){
                    if(document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].classList.contains("rightLayer")){
                        //정답 페이지 추가
                        let mathPaper = document.createElement("div");
                        mathPaper.className =  "mathDocsA4Frame answerSheet";
                        mathPaper.innerHTML = answerPaper;
                        document.getElementsByClassName("mathDocsA4Frame answerSheet")[document.getElementsByClassName("mathDocsA4Frame answerSheet").length-1].after(mathPaper);
                    }
                    mathPaperAns.remove();
                    answerLayoutIdx++;
                    document.getElementsByClassName("mathDocsPaperAnswer")[answerLayoutIdx].append(mathPaperAns);
                }
            }
            

            //페이지당 문제 수에 맞게 문제 채우기
            if(perPageCnt === 6){
                let fourArrPageCon = document.getElementsByClassName("fourArrPageCon");
                while(fourArrPageCon.length>0){
                    fourArrPageCon[0].remove();
                }
                let leftDivAbove = document.createElement("div");
                leftDivAbove.className = "sixArrPageCon firstPage leftAbove";
                let leftDivCenter = document.createElement("div");
                leftDivCenter.className = "sixArrPageCon firstPage leftCenter";
                let leftDivBelow = document.createElement("div");
                leftDivBelow.className = "sixArrPageCon firstPage leftBelow";
                document.getElementById("firstPageLeftWrap").append(leftDivAbove);
                document.getElementById("firstPageLeftWrap").append(leftDivCenter);
                document.getElementById("firstPageLeftWrap").append(leftDivBelow);

                let rightDivAbove = document.createElement("div");
                rightDivAbove.className = "sixArrPageCon firstPage rightAbove";
                let rightDivCenter = document.createElement("div");
                rightDivCenter.className = "sixArrPageCon firstPage rightCenter";
                let rightDivBelow = document.createElement("div");
                rightDivBelow.className = "sixArrPageCon firstPage rightBelow";
                document.getElementById("firstPageRightWrap").append(rightDivAbove);
                document.getElementById("firstPageRightWrap").append(rightDivCenter);
                document.getElementById("firstPageRightWrap").append(rightDivBelow);
                await sixArrLayoutSet();
            }else if(perPageCnt === 8){
                let fourArrPageCon = document.getElementsByClassName("fourArrPageCon");
                while(fourArrPageCon.length>0){
                    fourArrPageCon[0].remove();
                }
                let leftFirst = document.createElement("div");
                leftFirst.className = "eightArrPageCon firstPage leftFirst";
                let leftSecond = document.createElement("div");
                leftSecond.className = "eightArrPageCon firstPage leftSecond";
                let leftThird = document.createElement("div");
                leftThird.className = "eightArrPageCon firstPage leftThird";
                let leftFourth = document.createElement("div");
                leftFourth.className = "eightArrPageCon firstPage leftFourth";
                document.getElementById("firstPageLeftWrap").append(leftFirst);
                document.getElementById("firstPageLeftWrap").append(leftSecond);
                document.getElementById("firstPageLeftWrap").append(leftThird);
                document.getElementById("firstPageLeftWrap").append(leftFourth);

                let rightFirst = document.createElement("div");
                rightFirst.className = "eightArrPageCon firstPage rightFirst";
                let rightSecond = document.createElement("div");
                rightSecond.className = "eightArrPageCon firstPage rightSecond";
                let rightThird = document.createElement("div");
                rightThird.className = "eightArrPageCon firstPage rightFourth";
                let rightFourth = document.createElement("div");
                rightFourth.className = "eightArrPageCon firstPage rightFourth";
                document.getElementById("firstPageRightWrap").append(rightFirst);
                document.getElementById("firstPageRightWrap").append(rightSecond);
                document.getElementById("firstPageRightWrap").append(rightThird);
                document.getElementById("firstPageRightWrap").append(rightFourth);
                //문제 채우기
                await eightArrLayoutSet();
            }else{
                //문제 채우기
                await fourArrLayoutSet();
            }

            

            //해설 채우기
            let ansSolDiv = document.getElementsByClassName("ansSolDiv");
            document.getElementById("mathoDocsSolution").innerHTML = solutionPaper;
            for(let i=0; i<ansSolDiv.length; i++){
                let tmpSpan = document.createElement("span");
                tmpSpan.innerHTML = ansSolDiv[i].innerHTML;
                document.getElementById("mathoDocsSolution").append(tmpSpan);
            }

            let mathDocsA4Frame = document.getElementsByClassName("mathDocsA4Frame");
            for(let i=0; i<mathDocsA4Frame.length; i++){
                mathDocsA4Frame[i].classList.add("tmpHideDivForPrint");
            }
           
            setTimeout(function(){
                document.getElementById("page-transit").classList.add("hide");
                document.getElementById("page-transit-img").classList.add("hide");
                window.print();
                parentMethod();
            }, 500);
            
        }

        asyncUseEffect();
    },[]);


  return (
    <div id="mathDocsPaperPdf" className='mathDocsWrap'>
        <div id="mathDocsPaper" >
            <div id="mathDocsPaperA" className="mathDocsA4Frame">
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
                        <div id="firstPageLeftWrap" className='paperContentsLeft'>
                            <div className='fourArrPageCon firstPage leftAbove'></div>
                            <div className='fourArrPageCon firstPage leftBelow'></div>
                        </div>
                        <div id="firstPageRightWrap" className='paperContentsRight'>
                            <div className='fourArrPageCon firstPage rightAbove'></div>
                            <div className='fourArrPageCon firstPage rightBelow'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mathDocsA4Frame answerSheet">
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
        <div id="mathoDocsSolution" className="mathoDocsSolution mathDocsA4Frame"></div>
    </div>
    
    
  );
}

export default MathDocsPaperA;