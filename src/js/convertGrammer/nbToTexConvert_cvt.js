//수식 변수명 중복으로 여러개 등록되어있는 것 고유화 작업
const inAccurateNbBoxesList = 
[
    {"formulType":"nbArrowBox","subTypeA":"nbRightArrowBase", "toTypeA":"nbRightArrowBox","subTypeB":"nbArcBase", "toTypeB":"nbArcBox","subTypeC":"nbBiDirArrowBase", "toTypeC":"nbBiDirArrowBox"},
    {"formulType":"nbExpBox","subTypeA":"nbFracExpTmp", "toTypeA":"nbFracExpBox"}
];

//nbBox 수식 tex 문법 변환 규칙
const nbToTexConvert = 
    [
        {"formulType":"nbExpBox", "toTex": " {}^{"+"val1Point"+"}", "val1Class" : "nbExpTmp"},
        {"formulType":"nbFracExpBox", "toTex": " {}^{"+"val1Point"+"}", "val1Class" : "nbFracExpTmp"},
        {"formulType":"nbFracBox", "toTex": " {"+"val1Point"+"} over {"+"val2Point"+"}", "val1Class" : "nbNumer", "val2Class" : "nbDenom"},
        {"formulType":"expRootType", "toTex": " root {"+"val2Point"+"} of {"+"val1Point"+"}", "val1Class" : "nbRootBase", "val2Class" : "nbRootExpBase"},
        {"formulType":"nbLogBox", "toTex": " log _{"+"val2Point"+"} {"+"val1Point"+"}", "val1Class" : "nbLogBase", "val2Class" : "nbLogSubBase"},
        {"formulType":"nbLnBox", "toTex": " ln {"+"val1Point"+"}", "val1Class" : "nbLnBase"},
        {"formulType":"nbLimBox", "toTex": " lim _{"+"val2Point"+"} {"+"val1Point"+"}", "val1Class" : "nbLimBase", "val2Class" : "nbLimSubBase"},
        {"formulType":"nbSigmaSumBox", "toTex": " sum _{"+"val2Point"+"} ^{"+"val3Point"+"} "+"val1Point", "val1Class" : "nbSigmaSumBase", "val2Class" : "nbSigmaSumSub", "val3Class" : "nbSigmaSumSup"},
        {"formulType":"nbRootBox", "toTex": " sqrt{"+"val1Point"+"}", "val1Class" : "nbRootBase"},
        {"formulType":"nbSubBox", "toTex": " {}_{"+"val1Point"+"}", "val1Class" : "nbSubTmp"},
        {"formulType":"nbBiDirSubBox", "toTex": " {}_{"+"val2Point"+"} rm"+"val1Point"+" {}_{"+"val3Point"+"} it", "val1Class" : "nbBiDirSubBase", "val2Class" : "nbLeftSub", "val3Class" : "nbRightSub"},
        {"formulType":"nbTrigonBox", "toTex": " "+"val1Point", "val1Class" : "nbTrigon"},
        {"formulType":"nbOverDotBox", "toTex": " {dot{"+"val1Point"+"}}", "val1Class" : "nbOverDotBase"},
        {"formulType":"nbAccentBox", "toTex": " {hat{"+"val1Point"+"}}", "val1Class" : "nbAccentBase"},
        {"formulType":"nbOverlineBox", "toTex": " {bar{"+"val1Point"+"}}", "val1Class" : "nbOverlineBase"},
        {"formulType":"nbRightArrowBox", "toTex": " {vec{"+"val1Point"+"}}", "val1Class" : "nbRightArrowBase"},
        {"formulType":"nbArcBox", "toTex": " {arch{"+"val1Point"+"}}", "val1Class" : "nbArcBase"},
        {"formulType":"nbBiDirArrowBox", "toTex": " {dyad{"+"val1Point"+"}}", "val1Class" : "nbBiDirArrowBase"},
        {"formulType":"nbIntegralBox", "toTex": " int _{"+"val2Point"+"} ^{"+"val3Point"+"} {"+"val1Point"+"}", "val1Class" : "nbIntBase", "val2Class" : "nbIntSub", "val3Class" : "nbIntSup"},
        {"formulType":"nbDoubleIntegralBox", "toTex": " dint _{"+"val2Point"+"} ^{"+"val3Point"+"} {"+"val1Point"+"}", "val1Class" : "nbDoubleIntBase", "val2Class" : "nbDoubleIntSub", "val3Class" : "nbDoubleIntSup"},
        {"formulType":"nbTripleIntegralBox", "toTex": " tint _{"+"val2Point"+"} ^{"+"val3Point"+"} {"+"val1Point"+"}", "val1Class" : "nbTripleIntBase", "val2Class" : "nbTripleIntSub", "val3Class" : "nbTripleIntSup"},
        {"formulType":"nb-Abs-BrckBox", "toTex": " LEFT | "+"val1Point"+" RIGHT | ", "val1Class" : "nb-Abs-BrckBase"},
        {"formulType":"nb-R-BrckBox", "toTex": " LEFT ( "+"val1Point"+" RIGHT ) ", "val1Class" : "nb-R-BrckBase"},
        {"formulType":"nb-C-BrckBox", "toTex": " LEFT { "+"val1Point"+" RIGHT } ", "val1Class" : "nb-C-BrckBase"},
        {"formulType":"nb-S-BrckBox", "toTex": " LEFT [ "+"val1Point"+" RIGHT ] ", "val1Class" : "nb-S-BrckBase"},
        {"formulType":"nbIntBrckBox", "toTex": " LEFT [ "+"val1Point"+" RIGHT ] _{"+"val2Point"+"} ^{"+"val3Point"+"}", "val1Class" : "nbIntBrckBase", "val2Class" : "nbIntBrckSubBase", "val3Class" : "nbIntBrckSupBase"},
        {"formulType":"nbBinomCoBox", "toTex": " {pmatrix {"+"val1Point"+"#"+"val2Point"+"}}", "val1Class" : "nbBinomCoFir", "val2Class" : "nbBinomCoSec"},
        {"formulType":"nbCaseBrckBox", "toTex": " {cases {"+"val1Point"+"#"+"val2Point"+"}}", "val1Class" : "nbCaseFir", "val2Class" : "nbCaseSec"},
        {"formulType":"nbThrCasekBox", "toTex": " {cases {"+"val1Point"+"#"+"val2Point"+"#"+"val3Point"+"}}", "val1Class" : "nbThrCaseFir", "val2Class" : "nbThrCaseSec", "val3Class" : "nbThrCaseThr"}
    ]

// '/' 기호 처리 안함
const engCheck =/^[a-zA-Z]*$/; 
const numCheck =/^[0-9]*$/; 
const fomulCheck1 =/^[π±×÷ʹ∘⦁∏≡≈≠≤≥<>+\-=\|\[\]\(\)]*$/;
const fomulCheck2 =/^[∅∪∩⊃⊂⊇⊆∋∈∌∉]*$/;
const fomulCheck3 =/^[αβγδθρμω∂στφ∞Δ≈≡∝∽]*$/;
const fomulCheck4 =/^[\{\}]*$/; //중괄호 수식에서 사라지는 문제 해결(수식 밖 중괄호 처리)


/*
* 정의 : 영어, 중괄호 수식 문법에서 명령어로 처리되는 에러 해결(수식 안 영어, 중괄호 처리)
* 설명 : 사용자가 직접 입력한 텍스트 노드 명령어로 실행 안되게끔 구현(영어는 공백 추가, 중괄호는 큰 따옴표로 감싸기)
*        (수식 밖 영어, 중괄호 처리는 json객체를 만들때 처리해야함, 여기서 처리하면 공백과 큰 따옴표까지 같이 들어감)
*/
export const cvt_textNodeConvert = async (targetDom) => {
    let re = new RegExp(String.fromCharCode(160), "g");
    if(targetDom.hasChildNodes()) {
        for(let i = 0; i < targetDom.childNodes.length; i ++) {
            if(targetDom.childNodes[i].nodeType === 3){
                //버그 해결, \n만 들어있는 노드들로 인해 hwp에서 띄어쓰기 되는 문제 해결
                if(targetDom.childNodes[i].length === 1 && targetDom.childNodes[i].nodeValue === "\n") {
                    continue;
                }
                if(targetDom.childNodes[i].length === 2 && targetDom.childNodes[i].nodeValue === "\n\n") {
                    continue;
                }
                //띄어쓰기가 html에서 \n으로 등록되어 hwp에서 띄어쓰기 사라지는 현상 생김(/\n+/g)
                //&nbsp;와 공백 띄어쓰기 hwp에서 자간 간격이 다름(&nbsp;가 더 좁음, 공백으로 통일)
                let textNode = document.createTextNode(targetDom.childNodes[i].nodeValue.replaceAll(re, " ").replaceAll(/\n+/g, " "));
                targetDom.childNodes[i].replaceWith(textNode);
            }
            if(targetDom.childNodes[i].nodeType === 3 && targetDom.childNodes[i].parentElement.closest(".nbBox") !== null) {
                let newTextVal = "";
                for(let j=0; j<targetDom.childNodes[i].nodeValue.length; j++){
                    if(engCheck.test(targetDom.childNodes[i].nodeValue.charAt(j))){
                        newTextVal += targetDom.childNodes[i].nodeValue.charAt(j)+" ";
                    }else if(fomulCheck4.test(targetDom.childNodes[i].nodeValue.charAt(j))){
                        newTextVal += '"'+targetDom.childNodes[i].nodeValue.charAt(j)+'"';
                    }else{
                        newTextVal += targetDom.childNodes[i].nodeValue.charAt(j);
                    }
                }
                
                let textNode = document.createTextNode(newTextVal);
                targetDom.childNodes[i].replaceWith(textNode);
            } else {
                cvt_textNodeConvert(targetDom.childNodes[i]);
            }
        }
    }
}


/*
 * 정의 : width 및 height 셋팅 함수
 * 설명 : 이미지 및 표 hwp에서 생성시 너비, 높이값 있어야함
 *        offsetWidth와 offsetHeight는 실제 브라우저에 표현되어있는 너비를 반환하므로
 *        html요소를 복사하여 실행시 0으로 나타나 html to hwp 함수 실행 전 스타일 속성에 너비, 높이 셋팅
 */
export const cvt_initWidthHeight = (targetDom) => {
    //이미지 너비, 높이 셋팅
    let tmpImgTag = targetDom.querySelectorAll("img");
    for(let i=0; i<tmpImgTag.length; i++){
        tmpImgTag[i].style.width = tmpImgTag[i].offsetWidth+"px";
        tmpImgTag[i].style.height = tmpImgTag[i].offsetHeight+"px";
    }

    //조건 박스(표) 너비 셋팅
    let tmpCondBase = targetDom.querySelectorAll(".nbCondBase");
    for(let i=0; i<tmpCondBase.length; i++){
        //padding 좌 8, 우 8, border 2, 8+8+2=18만큼 빼주기
        tmpCondBase[i].style.width = (tmpCondBase[i].offsetWidth-18)+"px";
    }
}

export const cvt_initOrgWidthHeight = (targetDom) => {
    //조건 박스(표) 너비 셋팅
    let tmpCondBase = targetDom.querySelectorAll(".nbCondBase");
    for(let i=0; i<tmpCondBase.length; i++){
        //padding 좌우 8+8=16만큼 빼주기
        tmpCondBase[i].style.width = "unset";
    }
}


/*
* 정의 : html로 표현된 nbBox 수식 요소를 hwp에서 사용하는 tex문법으로 변형
*/
export const cvt_convertHtmlToTex = (contentsDiv) => {
    //nbBox 수식, 수식명 중복으로 설정되어있는 수식 고유 변수명 만들어주기
    let inAccurateNbBoxes = contentsDiv.querySelectorAll(".nbBox:not(:has(.nbBox))");
    for(let i=0; i<inAccurateNbBoxes.length; i++) {
        InnerLoop :for(let j=0; j<inAccurateNbBoxesList.length; j++) {
            if(inAccurateNbBoxes[i].classList.contains(inAccurateNbBoxesList[j].formulType)){
                if(inAccurateNbBoxesList[j].subTypeA !== undefined){
                    if(inAccurateNbBoxes[i].querySelector("."+inAccurateNbBoxesList[j].subTypeA) !== null){
                        inAccurateNbBoxes[i].className = "";
                        inAccurateNbBoxes[i].classList.add(inAccurateNbBoxesList[j].toTypeA)
                        inAccurateNbBoxes[i].classList.add("nbBox");
                    }
                }
                if(inAccurateNbBoxesList[j].subTypeB !== undefined){
                    if(inAccurateNbBoxes[i].querySelector("."+inAccurateNbBoxesList[j].subTypeB) !== null){
                        inAccurateNbBoxes[i].className = "";
                        inAccurateNbBoxes[i].classList.add(inAccurateNbBoxesList[j].toTypeB);
                        inAccurateNbBoxes[i].classList.add("nbBox");
                    }
                }
                if(inAccurateNbBoxesList[j].subTypeC !== undefined){
                    if(inAccurateNbBoxes[i].querySelector("."+inAccurateNbBoxesList[j].subTypeC) !== null){
                        inAccurateNbBoxes[i].className = "";
                        inAccurateNbBoxes[i].classList.add(inAccurateNbBoxesList[j].toTypeC);
                        inAccurateNbBoxes[i].classList.add("nbBox");
                    }
                }
                break InnerLoop;
            }
        }
    }

    //최상위 수식에 span태그로 수식 분류
    let rootNbBox = contentsDiv.querySelectorAll(".nbBox");
    for(let i=0; i<rootNbBox.length; i++){
        if(rootNbBox[i].parentElement.closest(".nbBox") !== null){
            continue;
        }

        //조건박스는 수식 처리 아닌 표로 처리
        if(rootNbBox[i].classList.contains("nbCondBox")){
            continue;
        }

        let tmpSpan = document.createElement("span");
        tmpSpan.className="formulType";
        tmpSpan.innerHTML = rootNbBox[i].outerHTML;
        rootNbBox[i].outerHTML = tmpSpan.outerHTML
    }


    //하위 수식부터 문법으로 변환
    //수식 띄어쓰기 구현 안해도 알아서 처리됨(별도 구현 안함, 개행문자로 처리되어 수식 스크립트에서 띄어쓰기 가능한 것으로 추측)
    let nbBoxes = contentsDiv.querySelectorAll(".nbBox:not(:has(.nbBox))");
    while(nbBoxes.length !== 0){
        for(let i=0; i<nbBoxes.length; i++) {
            let isConverted = false;
            InnerLoop : for(let j=0; j<nbToTexConvert.length; j++) {
                if(nbBoxes[i].classList.contains(nbToTexConvert[j].formulType)){
                    let val = nbBoxes[i].querySelector("."+nbToTexConvert[j].val1Class).innerText;
                    if(val === "\n"){
                        val = "";
                    }

                    let toTex = nbToTexConvert[j].toTex;
                    toTex =  toTex.replace("val1Point", val);
                    if(nbToTexConvert[j].val2Class !== undefined){
                        let val2 = nbBoxes[i].querySelector("."+nbToTexConvert[j].val2Class).innerText;
                        if(val2 === "\n"){
                            val2 = "";
                        }
                        toTex =  toTex.replace("val2Point", val2);
                    }
                    if(nbToTexConvert[j].val3Class !== undefined){
                        let val3 = nbBoxes[i].querySelector("."+nbToTexConvert[j].val3Class).innerText;
                        if(val3 === "\n"){
                            val3 = "";
                        }

                        toTex =  toTex.replace("val3Point", val3);
                    }
                    nbBoxes[i].outerHTML = toTex;
                    isConverted = true;
                    break InnerLoop;
                }
            }

            // 문법으로 변환되지 않는 수식처리(무한루프 에러 해결)
            // 조건박스는 표로 처리, 기타 다른 수식은 innerText로 처리
            if(!isConverted){
                if(nbBoxes[i].classList.contains("nbCondBox")){
                    nbBoxes[i].classList.remove("nbBox");
                }else{
                    nbBoxes[i].outerHTML = nbBoxes[i].innerText;
                }
            }
        }
        nbBoxes = contentsDiv.querySelectorAll(".nbBox:not(:has(.nbBox))");
    }

    //div태그 없애기
    let allDivDom = contentsDiv.querySelectorAll("div")
    while(allDivDom.length > 0){
        //최하위 div 안 텍스트 존재하지만 마지막 태그가 br태그 아니면 뒤에 br 추가 
        //마지막 태그가 table이 아닌 경우(table이면 hwp에서 자동으로 줄바꿈 됨)
        if(allDivDom[0].querySelectorAll("div").length === 0 && allDivDom[0].innerText.length !== 0 &&
        (allDivDom[0].lastElementChild === null ||
        (allDivDom[0].lastElementChild !== null && allDivDom[0].lastElementChild.nodeName !== "BR" && !allDivDom[0].lastElementChild.classList.contains("editInnerTable"))
        || ( allDivDom[0].lastElementChild !== null && allDivDom[0].lastElementChild.nodeName === "BR" &&   //마지막 element가 br이여도 그 다음에 텍스트 노드가 오는 경우 있음 이때는 div 뒤에 br 추가 필요
            allDivDom[0].lastElementChild.nextSibling !== null && allDivDom[0].lastElementChild.nextSibling.nodeName === "#text" && allDivDom[0].lastElementChild.nextSibling.length >0) 
        || ( allDivDom[0].lastElementChild !== null && allDivDom[0].lastElementChild.classList.contains("editInnerTable") &&   //마지막 element가 br이여도 그 다음에 텍스트 노드가 오는 경우 있음 이때는 div 뒤에 br 추가 필요
            allDivDom[0].lastElementChild.nextSibling !== null && allDivDom[0].lastElementChild.nextSibling.nodeName === "#text" && allDivDom[0].lastElementChild.nextSibling.length >0)
        )){
            let brTag = document.createElement("br");
            allDivDom[0].after(brTag)
            //div태그 앞 뒤로 정렬 기능 구현 필요
            if(allDivDom[0].classList.contains("alignCenter")){
                let align = document.createElement("span");
                align.className = "align alignCenter";
                allDivDom[0].before(align);

                //정렬 초기화(br 태그 뒤에서 초기화)
                let alignInit = document.createElement("span");
                alignInit.className = "align alignLeft";
                brTag.after(alignInit);
            }else if(allDivDom[0].classList.contains("alignLeft")){
                let align = document.createElement("span");
                align.className = "align alignLeft";
                allDivDom[0].before(align);

                //정렬 초기화(br 태그 뒤에서 초기화)
                let alignInit = document.createElement("span");
                alignInit.className = "align alignLeft";
                brTag.after(alignInit);
            }else if(allDivDom[0].classList.contains("alignRight")){
                let align = document.createElement("span");
                align.className = "align alignRight";
                allDivDom[0].before(align);

                //정렬 초기화(br 태그 뒤에서 초기화)
                let alignInit = document.createElement("span");
                alignInit.className = "align alignLeft";
                brTag.after(alignInit);
            }
        }else{
            //div태그 앞 뒤로 정렬 기능 구현 필요
            if(allDivDom[0].classList.contains("alignCenter")){
                let align = document.createElement("span");
                align.className = "align alignCenter";
                allDivDom[0].before(align);

                //정렬 초기화(div 태그 안에 br 있으니 div 뒤에서 초기화)
                let alignInit = document.createElement("span");
                alignInit.className = "align alignLeft";
                allDivDom[0].after(alignInit);
            }else if(allDivDom[0].classList.contains("alignLeft")){
                let align = document.createElement("span");
                align.className = "align alignLeft";
                allDivDom[0].before(align);

                //정렬 초기화(div 태그 안에 br 있으니 div 뒤에서 초기화)
                let alignInit = document.createElement("span");
                alignInit.className = "align alignLeft";
                allDivDom[0].after(alignInit);
            }else if(allDivDom[0].classList.contains("alignRight")){
                let align = document.createElement("span");
                align.className = "align alignRight";
                allDivDom[0].before(align);

                //정렬 초기화(div 태그 안에 br 있으니 div 뒤에서 초기화)
                let alignInit = document.createElement("span");
                alignInit.className = "align alignLeft";
                allDivDom[0].after(alignInit);
            }
        }

        allDivDom[0].outerHTML = allDivDom[0].innerHTML;
        allDivDom = contentsDiv.querySelectorAll("div")
    }

    //보더박스 비어있는 경우 개행문자로 줄바꿈 안되게 u태그로 변경
    let allBorderBox = contentsDiv.querySelectorAll(".borderBox");
    for(let i=0; i<allBorderBox.length; i++){
        if(allBorderBox[i].innerText.length === 0 && allBorderBox[i].childNodes.length === 1 && allBorderBox[i].childNodes[0].nodeName === "BR"){
            allBorderBox[i].childNodes[0].outerHTML = "<span class='vacantText'></span>";
        }
    }

    //표 셀 비어있는 경우 개행문자로 줄바꿈 안되게 u태그로 변경
    let allInnerTbTd = contentsDiv.querySelectorAll(".innerTbTd");
    for(let i=0; i<allInnerTbTd.length; i++){
        if(allInnerTbTd[i].innerText.length === 0 && allInnerTbTd[i].childNodes.length === 1 && allInnerTbTd[i].childNodes[0].nodeName === "BR"){
            allInnerTbTd[i].childNodes[0].outerHTML = "<span class='vacantText'></span>";
        }

        //셀에 값이 있고 마지막 element가 br일 경우 br제거(셀에서 줄바꿈 될 수 있음)
        //td 안에서 텍스트 아닌 수식 단축키 통해서 입력하면 br태그가 제거 되지 않고 계속 남아있을 수 있음
        if(allInnerTbTd[i].innerText.length !== 0 && allInnerTbTd[i].lastElementChild !== null && allInnerTbTd[i].lastElementChild.nodeName === "BR"){
            allInnerTbTd[i].lastElementChild.remove();
        }
    }

    //span태그 제거(캐럿 없애기, 수식 빼고 모두 제거, 밑줄 u태그 제거 로직, br태그 제거 로직과 과 순서 바뀌면 안됨)
    let allSpan = contentsDiv.querySelectorAll("span:not(.formulType):not(.align):not(.vacantText)")
    while(allSpan.length > 0){
        allSpan[0].outerHTML = allSpan[0].innerText.replace(/[\u200B-\u200D\uFEFF]/g, "");
        allSpan = contentsDiv.querySelectorAll("span:not(.formulType):not(.align):not(.vacantText)")
    }

     //br태그 (span태그 BreakPara으로 변경, span태그 제거 로직과 순서 바뀌면 안됨)
     let brTag = contentsDiv.querySelectorAll("br");
     while(brTag.length > 0){
         let breakPara = document.createElement("span");
         breakPara.className = "breakParaSpan"
         brTag[0].after(breakPara);
         brTag[0].remove();
         brTag = contentsDiv.querySelectorAll("br");
     }

    //밑줄 u태그 제거(span태그 underLine클래스로 생성, span태그 제거 로직과 순서 바뀌면 안됨)
    let allUTag = contentsDiv.querySelectorAll("u")
    while(allUTag.length > 0){
        let underLineStrt = document.createElement("span");
        underLineStrt.className = "underLine"
        allUTag[0].before(underLineStrt);
        let underLineEnd = document.createElement("span");
        underLineEnd.className = "underLine"
        allUTag[0].after(underLineEnd);
        allUTag[0].outerHTML = allUTag[0].innerHTML;
        allUTag = contentsDiv.querySelectorAll("u")
    }

    //남아있는 html 태그 처리 필요(혹시 모를 에러 결함 처리)
    //(table 태그, img태그, span(수식, 밑줄) 태그 제외하고 전부 innerText)
    let remainTag = contentsDiv.querySelectorAll("*");
    for(let i=0; i<remainTag.length; i++){
        if(remainTag[i].nodeName === "TABLE" || remainTag[i].nodeName === "IMG" || remainTag[i].nodeName === "SPAN"){
            continue;
        }else{
            remainTag[i].outerHTML = remainTag[i].innerHTML;
        }
    }

    return contentsDiv;
}

export const cvt_makeJsonArrForHwp = async (contentsDiv) => {
    let innerContents = contentsDiv.childNodes;
    let objList = new Array();
    for(let i=0; i<innerContents.length; i++){
        let innerObj = await cvt_makeJsonForHwp(innerContents[i]);
        if(Array.isArray(innerObj)){
            for(let i=0; i<innerObj.length; i++){
                objList.push(innerObj[i]);
            }
        }else{
            objList.push(innerObj);
        }
        
    }
    return objList;
}


/*
* 정의 : 처리 대상 객체를 json객체로 변형
* 설명 : 처리 결과 생성되는 객체타입은 텍스트, 수식, 밑줄, 이미지, 표
*        python 서버에서 사용됨
*/
export const cvt_makeJsonForHwp = async (innerContents) => {
        //json객체 만들기 시작
        let innerObj = new Object();
        //텍스트 처리
        if(innerContents.nodeName==="#text"){
            //innerObj.contentsType="text";
            //innerObj.contents = innerContents.nodeValue;
            let testArr = new Array();
            let previousType;
            let newContents="";
            for (let j = 0; j< innerContents.nodeValue.length; j++) {
                //수식으로 들어가야할 영어, 숫자, 수식기호
                if(engCheck.test(innerContents.nodeValue.charAt(j)) || numCheck.test(innerContents.nodeValue.charAt(j))
                || fomulCheck1.test(innerContents.nodeValue.charAt(j)) || fomulCheck2.test(innerContents.nodeValue.charAt(j)) 
                || fomulCheck3.test(innerContents.nodeValue.charAt(j)) || fomulCheck4.test(innerContents.nodeValue.charAt(j))){
                    if(j===0) {
                        newContents +=innerContents.nodeValue.charAt(j);
                        if(innerContents.nodeValue.length === 1){
                            let innerObj = new Object();
                            innerObj.contentsType = "formul";
                            innerObj.contents = newContents;
                            testArr.push(innerObj);
                        }
                    }else{
                        if(previousType === "text"){
                            let innerObj = new Object();
                            innerObj.contentsType = "text";
                            innerObj.contents = newContents;
                            testArr.push(innerObj);
                            newContents=""
                            
                            //영어의 경우 영어단어가 명령어로 실행 될 수도 있어 글자 한 칸 씩 띄어 수식에 넣어주기
                            if(engCheck.test(innerContents.nodeValue.charAt(j))){
                                newContents += innerContents.nodeValue.charAt(j)+" ";
                            //{}는 수식 문법으로 처리되어 사라질 수 있어므로 "" 감싸주기(수식 밖 중괄호 처리)
                            }else if(fomulCheck4.test(innerContents.nodeValue.charAt(j))){
                                newContents += '"'+innerContents.nodeValue.charAt(j)+'"'
                            }else{
                                newContents += innerContents.nodeValue.charAt(j);
                            }
                            
                        }else{
                           //영어의 경우 영어단어가 명령어로 실행 될 수도 있어 글자 한 칸 씩 띄어 수식에 넣어주기
                            if(engCheck.test(innerContents.nodeValue.charAt(j))){
                                newContents += innerContents.nodeValue.charAt(j)+" ";
                            //{}는 수식 문법으로 처리되어 사라질 수 있어므로 "" 감싸주기(수식 밖 중괄호 처리)
                            }else if(fomulCheck4.test(innerContents.nodeValue.charAt(j))){
                                newContents += '"'+innerContents.nodeValue.charAt(j)+'"'
                            }else{
                                newContents += innerContents.nodeValue.charAt(j);
                            }
                            
                        }

                        if(j===innerContents.nodeValue.length-1){
                            let innerObj = new Object();
                            innerObj.contentsType = "formul";
                            innerObj.contents = newContents;
                            testArr.push(innerObj);
                            newContents=""
                        }
                    }
                    previousType = "formul";

                //일반 텍스트로 들어갈 데이터
                }else{
                    if(j===0) {
                        newContents +=innerContents.nodeValue.charAt(j);
                        if(innerContents.nodeValue.length === 1){
                            let innerObj = new Object();
                            innerObj.contentsType = "text";
                            innerObj.contents = newContents;
                            testArr.push(innerObj);
                        }
                    }else {
                        if(previousType === "formul"){
                            let innerObj = new Object();
                            innerObj.contentsType = "formul";
                            innerObj.contents = newContents;
                            testArr.push(innerObj);
                            newContents=""
                            newContents +=innerContents.nodeValue.charAt(j);
                        }else{
                            newContents +=innerContents.nodeValue.charAt(j);
                        }

                        if(j===innerContents.nodeValue.length-1){
                            let innerObj = new Object();
                            innerObj.contentsType = "text";
                            innerObj.contents = newContents;
                            testArr.push(innerObj);
                            newContents=""
                        }
                    }
                    previousType = "text";
                }
            }

            return testArr;

        //수식, 밑줄, 줄 바꿈, 정렬
        }else if(innerContents.nodeName==="SPAN"){
            if(innerContents.classList.contains("formulType")){
                innerObj.contentsType="formul";
                innerObj.contents = innerContents.innerText;
            }else if(innerContents.classList.contains("underLine")){
                innerObj.contentsType="underLine";
            }else if(innerContents.classList.contains("breakParaSpan")){
                innerObj.contentsType="BreakPara";
            }else if(innerContents.classList.contains("vacantText")){
                innerObj.contentsType="text";
                innerObj.contents="";
            }else if(innerContents.classList.contains("align")){
                if(innerContents.classList.contains("alignLeft")){
                    innerObj.contentsType="alignLeft";
                }else if(innerContents.classList.contains("alignRight")){
                    innerObj.contentsType="alignRight";
                }else if(innerContents.classList.contains("alignCenter")){
                    innerObj.contentsType="alignCenter";
                }else{
                    innerObj.contentsType="alignLeft";
                }
            }
        //이미지 처리
        }else if(innerContents.nodeName==="IMG"){
            innerObj.contentsType="img";
            innerObj.contents = innerContents.src.split(",")[1];
            innerObj.imgWidth = parseInt(innerContents.style.width.replace("px", ""));
            innerObj.imgHeight = parseInt(innerContents.style.height.replace("px", ""));
            
            if(innerContents.style.float === ""){
                innerObj.float = "asCharNoBreakPara";
            }else if(innerContents.style.float === "unset"){
                if(innerContents.style.marginRight.indexOf("auto")>-1 && innerContents.style.marginLeft.indexOf("auto")>-1){
                    innerObj.float = "asBlockCenter";
                }else if(innerContents.style.marginLeft.indexOf("auto")>-1){
                    innerObj.float = "asBlockRight";
                }else{
                    if(innerContents.closest("div").innerText.length !== 0){
                        innerObj.float = "asCharNoBreakPara";
                    }else{
                        innerObj.float = "asChar";
                    }
                    
                }
            }else if(innerContents.style.float === "left"){
                innerObj.float = "left";
            }else if(innerContents.style.float === "right"){
                innerObj.float = "right";
            }else{
                innerObj.float = "asCharNoBreakPara";
            }
        //표 및 조건박스 처리(표의 경우 셀 값 안에 텍스트, 수식, 이미지, 조건 박스가 들어갈 수 있음)
        }else if(innerContents.nodeName==="TABLE"){
            innerObj.contentsType="table";
            if(innerContents.classList.contains("nbCondBox")){  //조건박스 별도 처리
                innerObj.contentsDetailType = "condBox"
                innerObj.charAs = 1;  //글자처럼 취급
                innerObj.rowCnt = 1
                innerObj.colCnt = 1
                //셀 너비 배열 셋팅[시작]
                let colWidthList = new Array();
                let firstRowCol = innerContents.querySelectorAll(".nbCondBase");
                for(let j=0; j<firstRowCol.length; j++){
                    colWidthList.push(parseInt(firstRowCol[j].style.width.replace("px","")));
                }
                innerObj.colWidthList = colWidthList;
                //셀 너비 배열 셋팅[끝]
                
                //표 테두리 속성 여부 셋팅
                innerObj.borderStyle = "fill"
            }else{
                innerObj.contentsDetailType = "table"
                innerObj.charAs = 0;  //글자처럼 취급하지 않음
                innerObj.rowCnt = innerContents.childNodes[0].childNodes.length
                innerObj.colCnt = innerContents.childNodes[0].childNodes[0].querySelectorAll(".innerTbTd").length
                //셀 너비 배열 셋팅[시작]
                let colWidthList = new Array();
                let firstRowCol = innerContents.childNodes[0].childNodes[0].querySelectorAll(".innerTbTd");
                for(let j=0; j<firstRowCol.length; j++){
                    colWidthList.push(parseInt(firstRowCol[j].style.width.replace("px","")));
                }
                innerObj.colWidthList = colWidthList;
                //셀 너비 배열 셋팅[끝]

                //표 테두리 속성 여부 셋팅
                if(innerContents.querySelector(".innerTbTd").classList.contains("noneBorderTd")){
                    innerObj.borderStyle = "innerNone";
                }else{
                    innerObj.borderStyle = "fill"
                }
            }

            //표 안에 각 셀 컨텐츠 구현
            let tdList = new Array();
            for(let row=0; row<innerObj.rowCnt; row++){
                for(let col=0; col<innerObj.colCnt; col++){
                    let innerTbTd;
                    if(innerContents.classList.contains("nbCondBox")){  //조건박스 별도 처리
                        innerTbTd = innerContents.querySelector(".nbCondBase");
                    }else{
                        innerTbTd = innerContents.querySelector("#innerTbTd"+row+""+col);
                    }
                
                    let innerTbTdChild = innerTbTd.childNodes;
                    let tbInnerObjList = new Array();
                    for(let j=0; j<innerTbTdChild.length; j++){
                        let innerChild = await cvt_makeJsonForHwp(innerTbTdChild[j]);
                        //text 타입 contents 영어, 숫자, 수식을 fomul 타입으로 변경하며 셀의 child 노드가 array타입으로 반환 될 수 있음   
                        if(Array.isArray(innerChild)){
                            for(let k=0; k<innerChild.length; k++){
                                let tbInnerObj = new Object();
                                tbInnerObj.contents = innerChild[k];
                                //셀 안의 첫번째 값에만 align속성 지정 (python로직에서 첫번째 객체의 속성으로만 셀의 align속성 지정)
                                if(j === 0 && k ===0){
                                    if(innerTbTd.classList.contains("alignLeft")){
                                        tbInnerObj.align = "alignLeft";
                                    }else if(innerTbTd.classList.contains("alignRight")){
                                        tbInnerObj.align = "alignRight";
                                    }else if(innerTbTd.classList.contains("alignCenter")){
                                        tbInnerObj.align = "alignCenter";
                                    }else{
                                        if(innerTbTd.classList.contains("noneBorderTd")){
                                            tbInnerObj.align = "alignLeft";
                                        }else{
                                            tbInnerObj.align = "alignCenter";
                                        }
                                    }
                                }
                                
                                tbInnerObjList.push(tbInnerObj);
                            }
                        }else{
                            let tbInnerObj = new Object();
                            tbInnerObj.contents = innerChild;

                            //셀 안의 첫번째 값에만 align속성 지정 (python로직에서 첫번째 객체의 속성으로만 셀의 align속성 지정)
                            if(j === 0){
                                if(innerTbTd.classList.contains("alignLeft")){
                                    tbInnerObj.align = "alignLeft";
                                }else if(innerTbTd.classList.contains("alignRight")){
                                    tbInnerObj.align = "alignRight";
                                }else{
                                    tbInnerObj.align = "alignCenter";
                                }
                            }
                            
                            tbInnerObjList.push(tbInnerObj);
                        }
                        
                    }
                    tdList.push(tbInnerObjList);
                }
            }
            innerObj.contents=tdList;
            
        }
        return innerObj;
}

export const cvt_combineFormul = async (pythonData) =>{
    let newJsonArr = new Array();
    let isPreviouseFormul = false;
    for(let i=0; i<pythonData.length; i++){
        let currentObj = pythonData[i];

        //표 안의 셀 값 같은 경우 구조가 다름(contents 변수 안에 한번 더 감싸져 있음)
        if(currentObj.contents !== undefined && currentObj.contents.contentsType !== undefined){
            currentObj = pythonData[i].contents;
        }
        if (i !== 0){
            if(currentObj.contentsType === "formul"){
                if(isPreviouseFormul){
                    newJsonArr[newJsonArr.length-1].contentsType = "formul";
                    newJsonArr[newJsonArr.length-1].contents += currentObj.contents;
                }else{
                    newJsonArr.push(currentObj);
                }
                isPreviouseFormul = true;
            }else if(currentObj.contentsType === "table"){
                for(let j=0; j< currentObj.contents.length;j++){
                    let cellVal = currentObj.contents[j];
                    let align = currentObj.contents[j][0].align
                    let newCellArray = await cvt_combineFormul(cellVal)
                    currentObj.contents[j].length = 0;
                    for(let k=0; k<newCellArray.length;k++){
                        let newCellChildObj = new Object();
                        newCellChildObj.contents = newCellArray[k];
                        if(k=== 0) newCellChildObj.align = align;
                        currentObj.contents[j].push(newCellChildObj);
                    }

                }
                newJsonArr.push(currentObj);
                isPreviouseFormul = false
            }else{
                newJsonArr.push(currentObj);
                isPreviouseFormul = false
            }
        }else{
            if(currentObj.contentsType === "formul"){
                isPreviouseFormul = true;
            }else if(currentObj.contentsType === "table"){
                for(let j=0; j< currentObj.contents.length;j++){
                    let cellVal = currentObj.contents[j];
                    let align = currentObj.contents[j][0].align
                    let newCellArray = await cvt_combineFormul(cellVal)
                    currentObj.contents[j].length = 0;
                    for(let k=0; k<newCellArray.length;k++){
                        let newCellChildObj = new Object();
                        newCellChildObj.contents = newCellArray[k];
                        if(k=== 0) newCellChildObj.align = align;
                        currentObj.contents[j].push(newCellChildObj);
                    }
                }
                isPreviouseFormul = false
            }else{
                isPreviouseFormul = false
            }
            newJsonArr.push(currentObj);

        }
    }
   
    return newJsonArr;
}
