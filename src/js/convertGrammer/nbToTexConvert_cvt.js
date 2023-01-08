import {nb_S3ImgToBase64} from 'js/common/common_nb.js';

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
        {"formulType":"nbCondBox", "toTex": " BOX{``"+"val1Point"+"``}", "val1Class" : "nbCondBase"},
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

//nbBox 수식 tex 문법 변환 규칙
const nbToTexConvertOnlyExistInTex = [
        {"texCase": "nb-Abs-BrckBox-noRightBrck", "formulType":"nb-Abs-BrckBox", "toTex": " LEFT | "+"val1Point"+" RIGHT . ", "val1Class" : "nb-Abs-BrckBase"},
        {"texCase": "nb-Abs-BrckBox-noLeftBrck", "formulType":"nb-Abs-BrckBox", "toTex": " LEFT . "+"val1Point"+" RIGHT | ", "val1Class" : "nb-Abs-BrckBase"},
        {"texCase": "nb-Abs-BrckBox-rightRoundBrck", "formulType":"nb-Abs-BrckBox", "toTex": " LEFT | "+"val1Point"+" RIGHT ) ", "val1Class" : "nb-Abs-BrckBase"},
        {"texCase": "nb-Abs-BrckBox-rightCBrck", "formulType":"nb-Abs-BrckBox", "toTex": " LEFT | "+"val1Point"+" RIGHT } ", "val1Class" : "nb-Abs-BrckBase"},
        {"texCase": "nb-Abs-BrckBox-rightSBrck", "formulType":"nb-Abs-BrckBox", "toTex": " LEFT | "+"val1Point"+" RIGHT ] ", "val1Class" : "nb-Abs-BrckBase"},

        {"texCase": "nb-R-BrckBox-noRightBrck", "formulType":"nb-R-BrckBox", "toTex": " LEFT ( "+"val1Point"+" RIGHT . ", "val1Class" : "nb-R-BrckBase"},
        {"texCase": "nb-R-BrckBox-noLeftBrck", "formulType":"nb-R-BrckBox", "toTex": " LEFT . "+"val1Point"+" RIGHT ) ", "val1Class" : "nb-R-BrckBase"},
        {"texCase": "nb-R-BrckBox-rightAbsBrck", "formulType":"nb-R-BrckBox", "toTex": " LEFT ( "+"val1Point"+" RIGHT | ", "val1Class" : "nb-R-BrckBase"},
        {"texCase": "nb-R-BrckBox-rightCBrck", "formulType":"nb-R-BrckBox", "toTex": " LEFT ( "+"val1Point"+" RIGHT } ", "val1Class" : "nb-R-BrckBase"},
        {"texCase": "nb-R-BrckBox-rightSBrck", "formulType":"nb-R-BrckBox", "toTex": " LEFT ( "+"val1Point"+" RIGHT ] ", "val1Class" : "nb-R-BrckBase"},

        {"texCase": "nb-C-BrckBox-noRightBrck", "formulType":"nb-C-BrckBox", "toTex": " LEFT { "+"val1Point"+" RIGHT . ", "val1Class" : "nb-C-BrckBase"},
        {"texCase": "nb-C-BrckBox-noLeftBrck", "formulType":"nb-C-BrckBox", "toTex": " LEFT . "+"val1Point"+" RIGHT } ", "val1Class" : "nb-C-BrckBase"},
        {"texCase": "nb-C-BrckBox-rightAbsBrck", "formulType":"nb-C-BrckBox", "toTex": " LEFT { "+"val1Point"+" RIGHT | ", "val1Class" : "nb-C-BrckBase"},
        {"texCase": "nb-C-BrckBox-rightRoundBrck", "formulType":"nb-C-BrckBox", "toTex": " LEFT { "+"val1Point"+" RIGHT ) ", "val1Class" : "nb-C-BrckBase"},
        {"texCase": "nb-C-BrckBox-rightSBrck", "formulType":"nb-C-BrckBox", "toTex": " LEFT { "+"val1Point"+" RIGHT ] ", "val1Class" : "nb-C-BrckBase"},

        {"texCase": "nb-S-BrckBox-noRightBrck", "formulType":"nb-S-BrckBox", "toTex": " LEFT [ "+"val1Point"+" RIGHT . ", "val1Class" : "nb-S-BrckBase"},
        {"texCase": "nb-S-BrckBox-noLeftBrck", "formulType":"nb-S-BrckBox", "toTex": " LEFT . "+"val1Point"+" RIGHT ] ", "val1Class" : "nb-S-BrckBase"},
        {"texCase": "nb-S-BrckBox-rightAbsBrck", "formulType":"nb-S-BrckBox", "toTex": " LEFT [ "+"val1Point"+" RIGHT | ", "val1Class" : "nb-S-BrckBase"},
        {"texCase": "nb-S-BrckBox-rightRoundBrck", "formulType":"nb-S-BrckBox", "toTex": " LEFT [ "+"val1Point"+" RIGHT ) ", "val1Class" : "nb-S-BrckBase"},
        {"texCase": "nb-S-BrckBox-rightCBrck", "formulType":"nb-S-BrckBox", "toTex": " LEFT [ "+"val1Point"+" RIGHT } ", "val1Class" : "nb-S-BrckBase"},
    ]
// '/' 기호 처리 안함
const engCheck =/^[a-zA-Z]*$/; 
const numCheck =/^[0-9]*$/; 
const fomulCheck1 =/^[π±×÷ʹ∘⦁∏≡≈≠≤≥<>+\-=\|\[\]\(\)]*$/;
const fomulCheck2 =/^[∅∪∩⊃⊂⊇⊆∋∈∌∉⊄⊅]*$/;
const fomulCheck3 =/^[αβγδθρμω∂στφ∞Δ≈≡∝∽]*$/;
const fomulCheck4 =/^[\{\}]*$/; //중괄호 수식에서 사라지는 문제 해결(수식 밖 중괄호 처리)


/*
* 정의 : hwp tex문법 to nbFormul 규칙 변수(일반 텍스트 수식)
*/
//db화 필요 박스 수식과 텍스트 수식 구분 칼럼 필요, 문법 변환 위해 보여지는 수식 안 보이는 수식 구분 필요
export const replaceTexToNbFormul = [{texGrammer: "+-", nbFormula : "±"}, 
    {texGrammer: "TIMES ", nbFormula : "×"},
    {texGrammer: "DIVIDE ", nbFormula : "÷"},
    {texGrammer: "BIGCIRC ", nbFormula : "○"},
    {texGrammer: "CIRC ", nbFormula : "∘"}, 
    {texGrammer: "VDOTS ", nbFormula : "⋮"}, 
    {texGrammer: "CDOTS ", nbFormula : "⋯"}, //CDOTS과 CDOT 순서 바뀌면 안됨
    {texGrammer: "CDOT ", nbFormula : "·"}, 
    {texGrammer: "BECAUSE ", nbFormula : "∵"}, 
    {texGrammer: "THEREFORE ", nbFormula : "∴"}, 
    {texGrammer: "!=", nbFormula : "≠"}, 
    {texGrammer: "LEQ ", nbFormula : "≤"}, 
    {texGrammer: "GEQ ", nbFormula : "≥"},
    {texGrammer: "EMPTYSET ", nbFormula : "∅"},
    {texGrammer: "CUP ", nbFormula : "∪"},
    {texGrammer: "SMALLINTER ", nbFormula : "∩"},
    {texGrammer: "NOTIN ", nbFormula : "∉"},
    {texGrammer: "INF ", nbFormula : "∞"},
    {texGrammer: "IN ", nbFormula : "∈"},
    {texGrammer: "SUPERSET ", nbFormula : "⊃"},
    {texGrammer: "SUBSETEQ ", nbFormula : "⊆"},
    {texGrammer: "NSUBSET ", nbFormula : "⊄"},
    {texGrammer: "SUBSET ", nbFormula : "⊂"},
    {texGrammer: "SUPSETEQ ", nbFormula : "⊇"},
    
    {texGrammer: "NOWNS ", nbFormula : "∌"},
    {texGrammer: "OWNS ", nbFormula : "∋"},
    
    {texGrammer: "NSUPSET ", nbFormula : "⊅"},

    {texGrammer: "alpha ", nbFormula : "α"},
    {texGrammer: "beta ", nbFormula : "β"},
    {texGrammer: "gamma ", nbFormula : "γ"},
    {texGrammer: "delta ", nbFormula : "δ"},
    {texGrammer: "theta ", nbFormula : "θ"},
    {texGrammer: "rho ", nbFormula : "ρ"},
    {texGrammer: "mu ", nbFormula : "μ"},
    {texGrammer: "omega ", nbFormula : "ω"},
    {texGrammer: "PARTIAL ", nbFormula : "∂"},
    {texGrammer: "sigma ", nbFormula : "σ"},
    {texGrammer: "tau ", nbFormula : "τ"},
    {texGrammer: "phi ", nbFormula : "φ"},
    
    {texGrammer: "DELTA ", nbFormula : "Δ"},
    {texGrammer: "DEG ", nbFormula : "°"},

    {texGrammer: "TRIANGLE ", nbFormula : "△"},
    {texGrammer: "MSANGLE ", nbFormula : "∡"},
    {texGrammer: "ANGLE ", nbFormula : "∠"},

    {texGrammer: "BOT ", nbFormula : "⊥"}, 
    {texGrammer: "==", nbFormula : "≡"}, 
    {texGrammer: "PROPTO ", nbFormula : "∝"},
    {texGrammer: "pi ", nbFormula : "π"},
    {texGrammer: "SMALLPROD ", nbFormula : "∏"},
    {texGrammer: "rarrow ", nbFormula : "→"},
    {texGrammer: "larrow ", nbFormula : "←"},
    {texGrammer: "uparrow ", nbFormula : "↑"},
    {texGrammer: "downarrow ", nbFormula : "↓"},
    {texGrammer: "RARROW ", nbFormula : "⇒"},
    {texGrammer: "LARROW ", nbFormula : "⇐"},
    {texGrammer: "UPARROW ", nbFormula : "⇑"},
    {texGrammer: "DOWNARROW ", nbFormula : "⇓"},

    {texGrammer: "NEARROW ", nbFormula : "↗"},
    {texGrammer: "SEARROW ", nbFormula : "↘"},
    {texGrammer: "NWARROW ", nbFormula : "↖"},
    {texGrammer: "SWARROW ", nbFormula : "↙"},

    {texGrammer: "CENTIGRADE ", nbFormula : "℃"},
    {texGrammer: "FAHRENHEIT ", nbFormula : "℉"},
   
    {texGrammer: "'", nbFormula : "ʹ"},
    {texGrammer: "prime", nbFormula : "ʹ"},
    
    {texGrammer: "SIM", nbFormula : "nbCustomWaveText"},
    {texGrammer: "BULLET ", nbFormula : "⦁"},
    {texGrammer: "vert", nbFormula : "|"}
    ]

/*
* 정의 : hwp tex문법 to nbFormul 규칙 변수(box요소)
*/
export const replaceTexToNbBoxFormul = [
    {texGrammer: "LEFT|", formulId : 82},//Left.(999)로 들어온 경우 82,83,84,85 문법 모두 리턴해줌 formulId 바뀌면 안됨
    {texGrammer: "LEFT(", formulId : 83},
    {texGrammer: "LEFT{", formulId : 84},
    {texGrammer: "LEFT[", formulId : 85},
    {texGrammer: "LEFT.", formulId : 999},  
    {texGrammer: "LEFT)", formulId : 1001},  
    {texGrammer: "LEFT]", formulId : 1002},

    {texGrammer: "BOX", formulId : 115},
    {texGrammer: "over", formulId : 5},
    {texGrammer: "sqrt", formulId : 17},
    {texGrammer: "sin", formulId : 23},
    {texGrammer: "cos", formulId : 24},
    {texGrammer: "tan", formulId : 25},
    {texGrammer: "sec", formulId : 34},
    {texGrammer: "csc", formulId : 35},
    {texGrammer: "cot", formulId : 36},
    {texGrammer: "sum", formulId : 22},
    {texGrammer: "dint", formulId : 15},    //int 순서 바뀌면 안됨(int가 맨 앞으로 오면 이중적, 삼중적 모두 일반 적분으로 바뀜)
    {texGrammer: "tint", formulId : 16},
    {texGrammer: "int", formulId : 14},
    {texGrammer: "root", formulId : 18},
    {texGrammer: "log", formulId : 19},
    {texGrammer: "ln", formulId : 20},
    {texGrammer: "lim", formulId : 21},
    {texGrammer: "bar", formulId : 37},
    {texGrammer: "vec", formulId : 38},
    {texGrammer: "arch", formulId : 39},
    {texGrammer: "dyad", formulId : 40},
    {texGrammer: "dot", formulId : 9},
    {texGrammer: "hat", formulId : 10},
    

    {texGrammer: "cases", formulId : 89},
    {texGrammer: "^", formulId : 6}, //지수와 밑은 다른 문법에서도 사용되므로 가장 나중에 변환
    {texGrammer: "_", formulId : 7},
    //{texGrammer: "sqrt", formulId : 18}

    //N명의 수학에 존재하지 않는 수식문법 처리
    {texGrammer: "bold", formulId : 1000}
]


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
                    //파일 변환시 borderBox 삭제하여 들어오도록 처리되는 부분 있음(다시 등록되거나 다운 될 때 에러 나는 경우 처리 필요)
                    //ex. 시그마 nbSigmaSumBase(한컴에서는 sup, sub에만 입력하여 nbSigmaSumBase를 파일 변환시 삭제함)
                    let val;
                    if(nbBoxes[i].querySelector("."+nbToTexConvert[j].val1Class) === null){
                        val = "";
                    }else{
                        val = nbBoxes[i].querySelector("."+nbToTexConvert[j].val1Class).innerText;
                    }
                    
                    if(val === "\n"){
                        val = "";
                    }

                    let toTex = nbToTexConvert[j].toTex;

                    //tex문법에서만 사용되는 방식 변환(괄호 서로 다름)
                    if(nbToTexConvert[j].formulType === "nb-R-BrckBox" || nbToTexConvert[j].formulType === "nb-C-BrckBox"
                    || nbToTexConvert[j].formulType === "nb-S-BrckBox" || nbToTexConvert[j].formulType === "nb-Abs-BrckBox"){
                        for(let k=0;k<nbToTexConvertOnlyExistInTex.length; k++){
                            if(nbBoxes[i].classList.contains("noRightBrck")){
                                if(nbToTexConvertOnlyExistInTex[k].texCase === nbToTexConvert[j].formulType+"-noRightBrck"){
                                    toTex = nbToTexConvertOnlyExistInTex[k].toTex;
                                }
                            }else if(nbBoxes[i].classList.contains("noLeftBrck")){
                                if(nbToTexConvertOnlyExistInTex[k].texCase === nbToTexConvert[j].formulType+"-noLeftBrck"){
                                    toTex = nbToTexConvertOnlyExistInTex[k].toTex;
                                }
                            }else if(nbBoxes[i].classList.contains("rightAbsBrck")){
                                if(nbToTexConvertOnlyExistInTex[k].texCase === nbToTexConvert[j].formulType+"-rightAbsBrck"){
                                    toTex = nbToTexConvertOnlyExistInTex[k].toTex;
                                }
                            }else if(nbBoxes[i].classList.contains("rightCBrck")){
                                if(nbToTexConvertOnlyExistInTex[k].texCase === nbToTexConvert[j].formulType+"-rightCBrck"){
                                    toTex = nbToTexConvertOnlyExistInTex[k].toTex;
                                }
                            }else if(nbBoxes[i].classList.contains("rightSBrck")){
                                if(nbToTexConvertOnlyExistInTex[k].texCase === nbToTexConvert[j].formulType+"-rightSBrck"){
                                    toTex = nbToTexConvertOnlyExistInTex[k].toTex;
                                }
                            }else if(nbBoxes[i].classList.contains("rightRoundBrck")){
                                if(nbToTexConvertOnlyExistInTex[k].texCase === nbToTexConvert[j].formulType+"-rightRoundBrck"){
                                    toTex = nbToTexConvertOnlyExistInTex[k].toTex;
                                }
                            }
                        }
                    }

                    toTex =  toTex.replace("val1Point", val);
                    if(nbToTexConvert[j].val2Class !== undefined){
                        let val2;
                        if(nbBoxes[i].querySelector("."+nbToTexConvert[j].val2Class) === null){
                            val2 = "";
                        }else{
                            val2 = nbBoxes[i].querySelector("."+nbToTexConvert[j].val2Class).innerText;
                        }
                        if(val2 === "\n"){
                            val2 = "";
                        }
                        toTex =  toTex.replace("val2Point", val2);
                    }
                    if(nbToTexConvert[j].val3Class !== undefined){
                        let val3;
                        if(nbBoxes[i].querySelector("."+nbToTexConvert[j].val2Class) === null){
                            val3 = "";
                        }else{
                            val3 = nbBoxes[i].querySelector("."+nbToTexConvert[j].val2Class).innerText;
                        }
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
                nbBoxes[i].outerHTML = nbBoxes[i].innerText;
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
            if(innerContents.src.indexOf("base64")<0){
                let imgBase64Result = await nb_S3ImgToBase64(innerContents.src );
                innerObj.contents = imgBase64Result.split(",")[1];
            }else{
                innerObj.contents = innerContents.src.split(",")[1];
            }
            
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
            /*
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
            */
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
            /*
            }
            */

            //표 안에 각 셀 컨텐츠 구현
            let tdList = new Array();
            for(let row=0; row<innerObj.rowCnt; row++){
                for(let col=0; col<innerObj.colCnt; col++){
                    let innerTbTd;
                    /*
                    if(innerContents.classList.contains("nbCondBox")){  //조건박스 별도 처리
                        innerTbTd = innerContents.querySelector(".nbCondBase");
                    }else{
                    */
                    innerTbTd = innerContents.querySelector("#innerTbTd"+row+""+col);
                    //}
                
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

/*
* 정의 : 인덱스 기준 오른쪽에 있는 중괄호 인덱스 리턴 함수
*/
export const cvt_findRightBrck = async (texArr, strtIdx) => {
    let brckIdx=0;
    let isStarted = false;
    let strtBrckIdx = null;
    let endBrckIdx = null;
    for(let i=strtIdx; i<texArr.length; i++){
        if(texArr[i] === "{"){
            if(strtBrckIdx === null) strtBrckIdx=i+1;
            brckIdx++;
            isStarted = true;
        }else if(texArr[i] === "}"){
            brckIdx--;
        }

        if(brckIdx === 0 && isStarted){
            endBrckIdx=i;
            break;
        }
    }
    return {strtBrckIdx, endBrckIdx};
}

/*
* 정의 : 인덱스 기준 왼쪽에 있는 중괄호 인덱스 리턴 함수
*/
export const  cvt_findLeftBrck = async (texArr, strtIdx) => {
    let brckIdx=0;
    let isStarted = false;
    let strtBrckIdx = null;
    let endBrckIdx = null;
    for(let i=strtIdx; i>=0; i--){
        if(texArr[i] === "}"){
            if(endBrckIdx === null) endBrckIdx=i;
            brckIdx++;
            isStarted = true;
        }else if(texArr[i] === "{"){
            brckIdx--;
        }

        if(brckIdx === 0 && isStarted){
            strtBrckIdx=i+1;
            break;
        }
    }
    return {strtBrckIdx, endBrckIdx};
}

/*
*  정의 : 인덱스 기준 오른쪽에 있는 LEFT, RIGHT 리턴 함수(한컴 괄호 수식문법 짝맞추기)
*/
export const cvt_findRight_LeftRight = async (texArr, strtIdx) => {
    let brckIdx=0;
    let isStarted = false;
    let strtBrckIdx = null;
    let endBrckIdx = null;
    for(let i=strtIdx; i<texArr.length; i++){
        if(texArr.substring(i, i+4) === "LEFT"){
            if(strtBrckIdx === null) strtBrckIdx=i+1;
            brckIdx++;
            isStarted = true;
        }else if(texArr.substring(i, i+5) === "RIGHT"){
            brckIdx--;
        }

        if(brckIdx === 0 && isStarted){
            endBrckIdx=i;
            break;
        }
    }
    return {strtBrckIdx, endBrckIdx};
}

/*
* 정의 : tex변환 함수
* 설명 : 문법에 알맞은 함수 호출 후 결과 리턴
*/
export const cvt_convertTexToNbFormul = async (formulId, texGrammer, texIndex, nbFormulHTML ) => {
    //분수
    if(formulId === 5){ 
        return await cvt_convertFracTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //지수
    }else if(formulId === 6){
        return await cvt_convertExpTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //아랫첨자
    }else if(formulId === 7){
        return await cvt_convertSubTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //루트
    }else if(formulId === 17){
        return await cvt_convertRootTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //분수용 절댓값
    }else if(formulId === 82){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT|");
    //분수용 소괄호
    }else if(formulId === 83){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT(");
    //분수용 중괄호
    }else if(formulId === 84){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT{");
    //분수용 대괄호
    }else if(formulId === 85){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT[");
    //삼각함수
    }else if(formulId === 23 || formulId === 24 || formulId === 25|| formulId === 34 || formulId === 35 || formulId === 36){ 
        return await cvt_convertTrigonTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //조건박스
    }else if(formulId === 115){   
        return await cvt_convertCondBoxTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //시그마합
    }else if(formulId === 22){   
        return await cvt_convertSigmaSumTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //적분
    }else if(formulId === 14){   
        return await cvt_convertIntegralTexToHtml(texGrammer, texIndex, nbFormulHTML, "basic");
    //이중적분
    }else if(formulId === 15){   
        return await cvt_convertIntegralTexToHtml(texGrammer, texIndex, nbFormulHTML, "double");
    //삼중적분
    }else if(formulId === 16){   
        return await cvt_convertIntegralTexToHtml(texGrammer, texIndex, nbFormulHTML, "triple");
    //지수 루트
    }else if(formulId === 18){   
        return await cvt_convertExpRootTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //자연로그
    }else if(formulId === 20){   
        return await cvt_convertLnTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //극한
    }else if(formulId === 21){   
        return await cvt_convertLimTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //로그
    }else if(formulId === 19){   
        return await cvt_convertLogTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //선분
    }else if(formulId === 37){   
        return await cvt_convertOverLineTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //우직선
    }else if(formulId === 38){   
        return await cvt_convertRightArrowTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //호
    }else if(formulId === 39){   
        return await cvt_convertArchTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //직선
    }else if(formulId === 40){   
        return await cvt_convertBiArrowTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //윗점
    }else if(formulId === 9){   
        return await cvt_convertOverDotTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //악센트
    }else if(formulId === 10){   
        return await cvt_convertAccentTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //연립방정식(2, 3, 4가지 경우)
    }else if(formulId === 89){   
        return await cvt_convertCasesTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //bold
    }else if(formulId === 1000){   
        return await cvt_convertBoldTexToHtml(texGrammer, texIndex, nbFormulHTML);
    //분수용 괄호 LEFT.
    }else if(formulId === 999){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT.");
    //분수용 괄호 LEFT)
    }else if(formulId === 1001){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT)");
    //분수용 괄호 LEFT]
    }else if(formulId === 1002){   
        return await cvt_convertBrckTexToHtml(texGrammer, texIndex, nbFormulHTML, "LEFT]");
    }
}

/*
* 정의 : tex변환 함수(분수)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertFracTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    let leftBrckIdx = await cvt_findLeftBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null 
        || leftBrckIdx.strtBrckIdx === null || leftBrckIdx.endBrckIdx=== null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbNumer").innerText = texGrammer.substring(leftBrckIdx.strtBrckIdx, leftBrckIdx.endBrckIdx);
    convertNbFormulBox.querySelector(".nbDenom").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbNumer").classList.add("forTexCheck");
    convertNbFormulBox.querySelector(".nbDenom").classList.add("forTexCheck");

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":leftBrckIdx.strtBrckIdx-1, "endIdx":rightBrckIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(지수)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertExpTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbExpTmp").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbExpTmp").classList.add("forTexCheck");

    if(texIndex>1){
        if(texGrammer.substring(texIndex-2, texIndex) === "{}"){
            texIndex = texIndex-2;
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(아래첨자)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertSubTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbSubTmp").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbSubTmp").classList.add("forTexCheck");

    if(texIndex>1){
        if(texGrammer.substring(texIndex-2, texIndex) === "{}"){
            texIndex = texIndex-2;
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(루트)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertRootTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbRootBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbRootBase").classList.add("forTexCheck");

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(분수용 괄호)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertBrckTexToHtml = async (texGrammer, texIndex, nbFormulHTML, leftBrckTex) =>{
    //LEFT 더 있는지 체크(RIGHT보다 먼저 나오는지가 중요)
    let leftRightIdx =  await cvt_findRight_LeftRight(texGrammer, texIndex);
    //null나왔을 때 리턴 처리
    if(leftRightIdx.strtBrckIdx === null || leftRightIdx.endBrckIdx === null ){
        return null;
    }
    let rightBrckTex = texGrammer.substring(leftRightIdx.endBrckIdx, leftRightIdx.endBrckIdx+6);

    let convertNbFormulBox = document.createElement('span');
    if(leftBrckTex === "LEFT."){
        let nbFormulGrammer;
        if(rightBrckTex==="RIGHT)"){
            nbFormulGrammer = nbFormulHTML.filter((element) => {
                return (element.id === 83)
            });
        }else if(rightBrckTex === "RIGHT}"){
            nbFormulGrammer = nbFormulHTML.filter((element) => {
                return (element.id === 84)
            });
        }else if(rightBrckTex === "RIGHT]"){
            nbFormulGrammer = nbFormulHTML.filter((element) => {
                return (element.id === 85)
            });
        }else if(rightBrckTex === "RIGHT|"){
            nbFormulGrammer = nbFormulHTML.filter((element) => {
                return (element.id === 82)
            });
        }else if(rightBrckTex === "RIGHT."){
            let tmpSpan = document.createElement("span");
            tmpSpan.innerText = texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx);
            convertNbFormulBox.append(tmpSpan);
            tmpSpan.classList.add("forTexCheck");
            //여기서 리턴 처리하기
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
        //괄호 반대로 들어온 경우 안에 내용과 괄호만 리턴
        }else if(rightBrckTex === "RIGHT(" || rightBrckTex === "RIGHT{" || rightBrckTex === "RIGHT["){
            let tmpSpan = document.createElement("span");
            tmpSpan.innerText = texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx)+rightBrckTex[5];
            convertNbFormulBox.append(tmpSpan);
            tmpSpan.classList.add("forTexCheck");

            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
        }else{
            return null;
        }
        convertNbFormulBox.innerHTML = nbFormulGrammer[0].nbGrammer;
        convertNbFormulBox.querySelector(".nbBox").classList.add("noLeftBrck");
    //괄호 반대로 들어온 경우 안에 내용과 괄호만 리턴
    }else if(leftBrckTex === "LEFT)" || leftBrckTex === "LEFT]"){
        let tmpSpan = document.createElement("span");
        let brck = rightBrckTex[5];
        if(rightBrckTex[5] === ".") brck ="";
        tmpSpan.innerText = texGrammer.substring(texIndex+4, leftRightIdx.endBrckIdx)+brck;
        convertNbFormulBox.append(tmpSpan);
        tmpSpan.classList.add("forTexCheck");

        return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
    }else{
        if(leftBrckTex === "LEFT|"){    //괄호 반대로 들어온 경우 안에 내용과 괄호만 리턴
            if(rightBrckTex === "RIGHT(" || rightBrckTex === "RIGHT{" || rightBrckTex === "RIGHT["){
                let tmpSpan = document.createElement("span");
                tmpSpan.innerText = texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx)+rightBrckTex[5];
                convertNbFormulBox.append(tmpSpan);
                tmpSpan.classList.add("forTexCheck");
    
                return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
            }
        }
        convertNbFormulBox.innerHTML = nbFormulHTML;
    }
    

    convertNbFormulBox.querySelector(".borderBox").innerText = texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".borderBox").classList.add("forTexCheck");
    if(rightBrckTex==="RIGHT)"){
        if(leftBrckTex !== "LEFT("){
            convertNbFormulBox.querySelector(".nbBox").classList.add("rightRoundBrck");
        }
    }else if(rightBrckTex === "RIGHT}"){
        if(leftBrckTex !== "LEFT{"){
            convertNbFormulBox.querySelector(".nbBox").classList.add("rightCBrck");
        }
    }else if(rightBrckTex === "RIGHT]"){
        if(leftBrckTex !== "LEFT["){
            convertNbFormulBox.querySelector(".nbBox").classList.add("rightSBrck");
        }else{
            //괄호 적분 체크
            //바로 옆에 _{} 있는지 체크 _{} 바로 옆에 ^{} 있는지 체크
            if(texGrammer.substr(leftRightIdx.endBrckIdx+6, 2)==="_{"){
                let rightUnderBrckIdx = await cvt_findRightBrck(texGrammer, leftRightIdx.endBrckIdx);
                if(texGrammer.substr(rightUnderBrckIdx.endBrckIdx+1, 2)==="^{") {
                    let rightSupBrckIdx = await cvt_findRightBrck(texGrammer, rightUnderBrckIdx.endBrckIdx+1);
                    let convertNbFormulBox = document.createElement('span');
                    convertNbFormulBox.innerHTML = '<table class="nbIntBrckBox nbBox"><tbody class="nbIntBrckTbody"><tr><td class="nbIntBrckBase borderBox"><br></td></tr></tbody><tbody class="nbIntBrckTbody2"><tr><td class="nbIntBrckSupBase borderBox"><br></td></tr><tr><td class="nbIntBrckSubBase borderBox"><br></td></tr></tbody></table>';
                    
                    convertNbFormulBox.querySelector(".nbIntBrckBase").innerText = texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx);
                    convertNbFormulBox.querySelector(".nbIntBrckSubBase").innerText = texGrammer.substring(rightUnderBrckIdx.strtBrckIdx, rightUnderBrckIdx.endBrckIdx);
                    convertNbFormulBox.querySelector(".nbIntBrckSupBase").innerText = texGrammer.substring(rightSupBrckIdx.strtBrckIdx, rightSupBrckIdx.endBrckIdx);
        
                    //보더박스에 들어있는 tex검사 위해
                    convertNbFormulBox.querySelector(".nbIntBrckBase").classList.add("forTexCheck");
                    convertNbFormulBox.querySelector(".nbIntBrckSubBase").classList.add("forTexCheck");
                    convertNbFormulBox.querySelector(".nbIntBrckSupBase").classList.add("forTexCheck");

                    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightSupBrckIdx.endBrckIdx+1};
                }
            }
        }
    }else if(rightBrckTex === "RIGHT|"){
        if(leftBrckTex !== "LEFT|"){
            convertNbFormulBox.querySelector(".nbBox").classList.add("rightAbsBrck");
        }
    }else if(rightBrckTex === "RIGHT."){
        convertNbFormulBox.querySelector(".nbBox").classList.add("noRightBrck");

        //#이 포함된 경우 (경우의 수 2가지)
        if(leftBrckTex === "LEFT{"){
            if(texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx).indexOf("#")>-1){
                let brckIdx = await cvt_findRightBrck(texGrammer.substring(texIndex+5, leftRightIdx.endBrckIdx), 0);
                let innerTexGrm = texGrammer.substring(brckIdx.strtBrckIdx+texIndex+5, brckIdx.endBrckIdx+texIndex+5).split("#");
                if(innerTexGrm.length !== 2 && innerTexGrm.length !== 3){
                    return null
                }
                if(innerTexGrm.length === 2){
                    //경우의수(2가지)
                    let convertNbFormulBox = document.createElement('span');
                    convertNbFormulBox.innerHTML = '<table class="nbCaseBrckBox nbBox" ><tbody><tr><td rowspan="2" class="nbCaseBrck writeDisable borderBox">{</td><td class="nbCaseFir borderBox"><br></td></tr><tr><td class="nbCaseSec borderBox"><br></td></tr></tbody></table>';
    
                    convertNbFormulBox.querySelector(".nbCaseFir").innerText = innerTexGrm[0].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
                    convertNbFormulBox.querySelector(".nbCaseSec").innerText = innerTexGrm[1].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
    
                    //보더박스에 들어있는 tex검사 위해
                    convertNbFormulBox.querySelector(".nbCaseFir").classList.add("forTexCheck");
                    convertNbFormulBox.querySelector(".nbCaseSec").classList.add("forTexCheck");
                    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
                }else{
                    //경우의수(3가지)
                    let convertNbFormulBox = document.createElement('span');
                    convertNbFormulBox.innerHTML = '<table class="nbThrCasekBox nbBox"><tbody><tr><td rowspan="3" class="nbThrCaseBrck writeDisable borderBox">{</td><td class="nbThrCaseFir borderBox"><br></td></tr><tr><td class="nbThrCaseSec borderBox"><br></td></tr><tr><td class="nbThrCaseThr borderBox"><br></td></tr></tbody></table>';
    
                    convertNbFormulBox.querySelector(".nbThrCaseFir").innerText = innerTexGrm[0].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
                    convertNbFormulBox.querySelector(".nbThrCaseSec").innerText = innerTexGrm[1].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
                    convertNbFormulBox.querySelector(".nbThrCaseThr").innerText = innerTexGrm[2].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
    
                    //보더박스에 들어있는 tex검사 위해
                    convertNbFormulBox.querySelector(".nbThrCaseFir").classList.add("forTexCheck");
                    convertNbFormulBox.querySelector(".nbThrCaseSec").classList.add("forTexCheck");
                    convertNbFormulBox.querySelector(".nbThrCaseThr").classList.add("forTexCheck");
                    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
                }
                
            }
        }
        
    }else{
        return null;
    }

    /*
    //이항계수 체크
        let pileIdx = texGrammer.indexOf("pile");
        if(pileIdx>-1 && leftCnt === 0){
            let rightBrckIdx = await cvt_findRightBrck(texGrammer, pileIdx);
            let nbBinomCoStr = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
            nbBinomCoStr = nbBinomCoStr.split("#")
            if(nbBinomCoStr.length === 2){
                let convertNbFormulBox = document.createElement('span');
                convertNbFormulBox.innerHTML = '<table class="nbBinomCoBox nbBox" ><tbody class="nbBinomCoTBody"><tr><td class="nbBinomCoFir borderBox" ><br></td></tr><tr><td class="nbBinomCoSec borderBox" ><br></td></tr></tbody></table>'
                
                convertNbFormulBox.querySelector(".nbBinomCoFir").innerText = nbBinomCoStr[0]
                convertNbFormulBox.querySelector(".nbBinomCoSec").innerText = nbBinomCoStr[1]
                //보더박스에 들어있는 tex검사 위해
                convertNbFormulBox.querySelector(".nbBinomCoFir").classList.add("forTexCheck");
                convertNbFormulBox.querySelector(".nbBinomCoFir").classList.add("forTexCheck");

                return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":texGrammer.indexOf(leftBrckTex)+6};
            }
        }
    */

    
    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":leftRightIdx.endBrckIdx+6};
}

/*
* 정의 : tex변환 함수(분수용 괄호 오른쪽만 있는 경우, LEFT.)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertBrckOnlyRightTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    //LEFT, RIGHT 짝 맞추기

    //LEFT 더 있는지 체크(RIGHT보다 먼저 나오는지가 중요)
    let chkIdx = texIndex+5
    let leftCnt = 1;
    while(texGrammer.substr(chkIdx).indexOf("LEFT")>-1){
        if(texGrammer.substr(chkIdx).indexOf("LEFT") < texGrammer.substr(chkIdx).indexOf("RIGHT")){
            chkIdx += texGrammer.substr(chkIdx).indexOf("LEFT")+5;
            leftCnt++;
        }else{
            break;
        }
    }


}


/*
* 정의 : tex변환 함수(삼각함수 괄호)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertTrigonTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;

    //보더박스에 들어있는 tex검사 위해, 삼각함수에 forTexCheck주면 무한루프 돔
    //convertNbFormulBox.querySelector(".borderBox").classList.add("forTexCheck");

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":texIndex+3};
}


/*
* 정의 : tex변환 함수(조건박스)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertCondBoxTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbCondBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbCondBase").classList.add("forTexCheck");
    
    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(시그마합)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertSigmaSumTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    //오른쪽 _{}와 ^{} 찾기
    let underBarIdx = texGrammer.substr(texIndex).indexOf("_{");
    let underBarBrckIdx = await cvt_findRightBrck(texGrammer, texIndex+underBarIdx);
    let hatIdx = texGrammer.substr(texIndex).indexOf("^{");
    let hatBrckIdx = await cvt_findRightBrck(texGrammer, texIndex+hatIdx);

    //null나왔을 때 리턴 처리
    if(underBarBrckIdx.strtBrckIdx === null || underBarBrckIdx.endBrckIdx === null
        || hatBrckIdx.strtBrckIdx === null || hatBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbSigmaSumSub").innerText = texGrammer.substring(underBarBrckIdx.strtBrckIdx, underBarBrckIdx.endBrckIdx);
    convertNbFormulBox.querySelector(".nbSigmaSumSup").innerText = texGrammer.substring(hatBrckIdx.strtBrckIdx, hatBrckIdx.endBrckIdx);
    convertNbFormulBox.querySelector(".nbSigmaSumTbody2").remove();

    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbSigmaSumSub").classList.add("forTexCheck");
    convertNbFormulBox.querySelector(".nbSigmaSumSup").classList.add("forTexCheck");

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":hatBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(적분)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertIntegralTexToHtml = async (texGrammer, texIndex, nbFormulHTML, integralType) =>{
    //오른쪽 _{}와 ^{} 찾기
    let underBarIdx = texGrammer.substr(texIndex).indexOf("_{");
    let underBarBrckIdx = await cvt_findRightBrck(texGrammer, texIndex+underBarIdx);
    let hatIdx = texGrammer.substr(texIndex).indexOf("^{");
    let hatBrckIdx = await cvt_findRightBrck(texGrammer, texIndex+hatIdx);
    let intBaseBrckIdx = await cvt_findRightBrck(texGrammer, hatBrckIdx.endBrckIdx+1);

    //null나왔을 때 리턴 처리
    if(underBarBrckIdx.strtBrckIdx === null || underBarBrckIdx.endBrckIdx === null
        || hatBrckIdx.strtBrckIdx === null || hatBrckIdx.endBrckIdx === null
        || intBaseBrckIdx.strtBrckIdx === null || intBaseBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    if(integralType === "basic"){
        convertNbFormulBox.querySelector(".nbIntSub").innerText = texGrammer.substring(underBarBrckIdx.strtBrckIdx, underBarBrckIdx.endBrckIdx);
        convertNbFormulBox.querySelector(".nbIntSup").innerText = texGrammer.substring(hatBrckIdx.strtBrckIdx, hatBrckIdx.endBrckIdx);
        if(texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx) === ""){
            convertNbFormulBox.querySelector(".nbIntegralTbody2").remove();
        }else{
            convertNbFormulBox.querySelector(".nbIntBase").innerText = texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx);
        }
        
        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbIntSub").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbIntSup").classList.add("forTexCheck");
        if(texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx) === ""){
        }else{
            convertNbFormulBox.querySelector(".nbIntBase").classList.add("forTexCheck");
        }

    }else if(integralType === "double"){
        convertNbFormulBox.querySelector(".nbDoubleIntSub").innerText = texGrammer.substring(underBarBrckIdx.strtBrckIdx, underBarBrckIdx.endBrckIdx);
        convertNbFormulBox.querySelector(".nbDoubleIntSup").innerText = texGrammer.substring(hatBrckIdx.strtBrckIdx, hatBrckIdx.endBrckIdx);
        if(texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx) === ""){
            convertNbFormulBox.querySelector(".nbIntegralTbody2").remove();
        }else{
            convertNbFormulBox.querySelector(".nbDoubleIntBase").innerText = texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx);
        }

        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbDoubleIntSub").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbDoubleIntSup").classList.add("forTexCheck");
        
        if(texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx) === ""){
        }else{
            convertNbFormulBox.querySelector(".nbDoubleIntBase").classList.add("forTexCheck");
        }

    }else if(integralType === "triple"){
        convertNbFormulBox.querySelector(".nbTripleIntSub").innerText = texGrammer.substring(underBarBrckIdx.strtBrckIdx, underBarBrckIdx.endBrckIdx);
        convertNbFormulBox.querySelector(".nbTripleIntSup").innerText = texGrammer.substring(hatBrckIdx.strtBrckIdx, hatBrckIdx.endBrckIdx);
        
        if(texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx) === ""){
            convertNbFormulBox.querySelector(".nbIntegralTbody2").remove();
        }else{
            convertNbFormulBox.querySelector(".nbTripleIntBase").innerText = texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx);
        }

        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbTripleIntSub").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbTripleIntSup").classList.add("forTexCheck");
        if(texGrammer.substring(intBaseBrckIdx.strtBrckIdx, intBaseBrckIdx.endBrckIdx) === ""){
        }else{
            convertNbFormulBox.querySelector(".nbTripleIntBase").classList.add("forTexCheck");
        }
    }else{
        return null;
    }
    

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":intBaseBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(극한)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertLimTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{

    //오른쪽 _{}와 {} 찾기
    let underBarIdx = texGrammer.substr(texIndex).indexOf("_{");
    let underBarBrckIdx = await cvt_findRightBrck(texGrammer, texIndex+underBarIdx);
    let baseBrckIdx = await cvt_findRightBrck(texGrammer, underBarBrckIdx.endBrckIdx+1);

    //null나왔을 때 리턴 처리
    if(underBarBrckIdx.strtBrckIdx === null || underBarBrckIdx.endBrckIdx === null
        || baseBrckIdx.strtBrckIdx === null || baseBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbLimSubBase").innerText = texGrammer.substring(underBarBrckIdx.strtBrckIdx, underBarBrckIdx.endBrckIdx);

    if(texGrammer.substring(baseBrckIdx.strtBrckIdx, baseBrckIdx.endBrckIdx) === ""){
        convertNbFormulBox.querySelector(".nbLimTbody2").remove();
    }else{
        convertNbFormulBox.querySelector(".nbLimBase").innerText = texGrammer.substring(baseBrckIdx.strtBrckIdx, baseBrckIdx.endBrckIdx);
    }

    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbLimSubBase").classList.add("forTexCheck");
    if(texGrammer.substring(baseBrckIdx.strtBrckIdx, baseBrckIdx.endBrckIdx) === ""){
    }else{
        convertNbFormulBox.querySelector(".nbLimBase").classList.add("forTexCheck");
    }
    

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":baseBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(자연로그)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertLnTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbLnBoxTbody2").remove();

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":texIndex+2};
}


/*
* 정의 : tex변환 함수(지수 루트)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertExpRootTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    //오른쪽 {} of {} 찾기
    let underBarIdx = texGrammer.substr(texIndex).indexOf("of");
    if(underBarIdx<0) return null;

    //of 기준으로 왼쪽 오른쪽 중괄호 찾기
    let rootBaseIdx = await cvt_findRightBrck(texGrammer, texIndex+underBarIdx);
    let rootExpIdx= await cvt_findLeftBrck(texGrammer, texIndex+underBarIdx);

    //null나왔을 때 리턴 처리
    if(rootExpIdx.strtBrckIdx === null || rootExpIdx.endBrckIdx === null
        || rootBaseIdx.strtBrckIdx === null || rootBaseIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbRootExpBase").innerText = texGrammer.substring(rootExpIdx.strtBrckIdx, rootExpIdx.endBrckIdx);
    convertNbFormulBox.querySelector(".nbRootBase").innerText = texGrammer.substring(rootBaseIdx.strtBrckIdx, rootBaseIdx.endBrckIdx);

    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbRootExpBase").classList.add("forTexCheck");
    convertNbFormulBox.querySelector(".nbRootBase").classList.add("forTexCheck");

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rootBaseIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(로그)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertLogTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    //로그 인덱스 바로 옆 _{}가 있는지 체크
    if(texGrammer.substr(texIndex+3, 2) ==="_{") {  //있으면 로그박스 생성
        let underBarBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
        //null나왔을 때 리턴 처리(닫힘 중괄호가 없을수도 있으므로)
        if(underBarBrckIdx.strtBrckIdx === null || underBarBrckIdx.endBrckIdx === null){
                return null;
        }
        let convertNbFormulBox = document.createElement('span');
        convertNbFormulBox.innerHTML = nbFormulHTML;
        convertNbFormulBox.querySelector(".nbLogSubBase").innerText = texGrammer.substring(underBarBrckIdx.strtBrckIdx, underBarBrckIdx.endBrckIdx);
        convertNbFormulBox.querySelector(".nbLogBoxTbody2").remove();
        
        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbLogSubBase").classList.add("forTexCheck");

        
        //html 및 문법 시작 idx와 끝 idx 리턴
        return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx": underBarBrckIdx.endBrckIdx+1};
    }else{  //없으면 로그문자 그대로
        return null;
    }
}


/*
* 정의 : tex변환 함수(선분)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertOverLineTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbOverlineBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbOverlineBase").classList.add("forTexCheck");

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(우직선)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertRightArrowTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbRightArrowBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbRightArrowBase").classList.add("forTexCheck");

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(호)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertArchTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbArcBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbArcBase").classList.add("forTexCheck");

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(직선)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertBiArrowTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbBiDirArrowBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbBiDirArrowBase").classList.add("forTexCheck");

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(윗점)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertOverDotTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbOverDotBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbOverDotBase").classList.add("forTexCheck");

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}


/*
* 정의 : tex변환 함수(악센트)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertAccentTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbAccentBase").innerText = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbAccentBase").classList.add("forTexCheck");

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}

/*
* 정의 : tex변환 함수(연립방정식(2, 3, 4가지 경우))
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertCasesTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    let casesStr = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    casesStr = casesStr.split("#")
    if(casesStr.length === 1){
        return null;
    }

    if(casesStr.length === 2){
        //연립방정식 2가지 경우
        convertNbFormulBox.querySelector(".nbCaseFir").innerText = casesStr[0].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
        convertNbFormulBox.querySelector(".nbCaseSec").innerText = casesStr[1].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
    
        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbCaseFir").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbCaseSec").classList.add("forTexCheck");
    }else if(casesStr.length === 3){
        //연립방정식 3가지 경우
        convertNbFormulBox.innerHTML = '<table class="nbThrCasekBox nbBox"><tbody><tr><td rowspan="3" class="nbThrCaseBrck writeDisable borderBox">{</td><td class="nbThrCaseFir borderBox"><br></td></tr><tr><td class="nbThrCaseSec borderBox"><br></td></tr><tr><td class="nbThrCaseThr borderBox"><br></td></tr></tbody></table>';

        convertNbFormulBox.querySelector(".nbThrCaseFir").innerText = casesStr[0].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
        convertNbFormulBox.querySelector(".nbThrCaseSec").innerText = casesStr[1].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
        convertNbFormulBox.querySelector(".nbThrCaseThr").innerText = casesStr[2].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");

        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbThrCaseFir").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbThrCaseSec").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbThrCaseThr").classList.add("forTexCheck");
    }else{
        //연립방정식 4가지 이상인 경우 경우
        convertNbFormulBox.innerHTML = '<table class="nbThrCasekBox nbBox"><tbody><tr><td rowspan="3" class="nbThrCaseBrck writeDisable borderBox">{</td><td class="nbThrCaseFir borderBox"><br></td></tr><tr><td class="nbThrCaseSec borderBox"><br></td></tr><tr><td class="nbThrCaseThr borderBox"><br></td></tr></tbody></table>';

        convertNbFormulBox.querySelector(".nbThrCaseFir").innerText = casesStr[0].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
        convertNbFormulBox.querySelector(".nbThrCaseSec").innerText = casesStr[1].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
        
        let additionalCases ="";
        for(let i=3; i<casesStr.length; i++){
            additionalCases+="<br/>"+casesStr[i].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;");
        }
        convertNbFormulBox.querySelector(".nbThrCaseThr").innerText = casesStr[2].replaceAll("&gt;", "임시꺽새변형999").replaceAll("&lt;", "임시변형888").replaceAll("&", "&nbsp;").replaceAll("임시꺽새변형999", "&gt;").replaceAll("임시변형888", "&lt;")
                                                                 +additionalCases       

        //보더박스에 들어있는 tex검사 위해
        convertNbFormulBox.querySelector(".nbThrCaseFir").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbThrCaseSec").classList.add("forTexCheck");
        convertNbFormulBox.querySelector(".nbThrCaseThr").classList.add("forTexCheck");
    }
   

    //바깥쪽 중괄호 제거
    if(texIndex>0){
        if(texGrammer[texIndex-1]==="{" && texGrammer[rightBrckIdx.endBrckIdx] === "}"){
            return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex-1, "endIdx":rightBrckIdx.endBrckIdx+2};
        }
    }

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":texIndex, "endIdx":rightBrckIdx.endBrckIdx+1};
}



/*
* 정의 : tex변환 함수(양방향 첨자)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴

export const cvt_convertBiDirSubTexToHtml = async (texGrammer, texIndex, nbFormulHTML) =>{
    // C LSUB {3} _{2} 문법.(3C2)
    //LSUB 옆에 있는 base 찾기[strt]
    let lastSpaceIdx = texGrammer.substring(0, texIndex).lastIndexOf(" ");
    if(lastSpaceIdx <0){
        return null;
    }

    let secondLastSpaceIdx = texGrammer.substring(0, lastSpaceIdx).lastIndexOf(" ");
    if(secondLastSpaceIdx <0){
        return null;
    }

    let baseStr = texGrammer.substring(secondLastSpaceIdx, lastSpaceIdx);
    //LSUB 옆에 있는 base 찾기[end]

    //LSUB 바로 뒤에 있는 중괄호 찾기[strt]
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
        return null;
    }
    let nbLeftSubStr = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
    //LSUB 바로 뒤에 있는 중괄호 찾기[end]

    //LSUB 뒤에 있는 _{} sub[strt]
    if(texGrammer.substr(rightBrckIdx.endBrckIdx+1, 2) !== "_{"){
        return null;
    }
    let rightSubBrckIdx = await cvt_findRightBrck(texGrammer, rightBrckIdx.endBrckIdx+1);
    let nbRightSubStr = texGrammer.substring(rightSubBrckIdx.strtBrckIdx, rightSubBrckIdx.endBrckIdx);
    //LSUB 뒤에 있는 _{} sub[end]
    
    

    let convertNbFormulBox = document.createElement('span');
    convertNbFormulBox.innerHTML = nbFormulHTML;
    convertNbFormulBox.querySelector(".nbLeftSub").innerText = nbLeftSubStr;
    convertNbFormulBox.querySelector(".nbBiDirSubBase").innerText = baseStr;
    convertNbFormulBox.querySelector(".nbRightSub").innerText = nbRightSubStr;
    
    //보더박스에 들어있는 tex검사 위해
    convertNbFormulBox.querySelector(".nbLeftSub").classList.add("forTexCheck");
    convertNbFormulBox.querySelector(".nbBiDirSubBase").classList.add("forTexCheck");
    convertNbFormulBox.querySelector(".nbRightSub").classList.add("forTexCheck");

    //html 및 문법 시작 idx와 끝 idx 리턴
    return {"nbFormulBox":convertNbFormulBox, "strtIdx":secondLastSpaceIdx, "endIdx":rightSubBrckIdx.endBrckIdx+1};
}
*/


/*
* 정의 : tex변환 함수(bold)
* 설명 : 변환한 html요소와 문법 시작 인덱스와 끝 인덱스를 리턴
*/
export const cvt_convertBoldTexToHtml= async (texGrammer, texIndex, nbFormulHTML) =>{
    let rightBrckIdx = await cvt_findRightBrck(texGrammer, texIndex);
    
    //null나왔을 때 리턴 처리
    if(rightBrckIdx.strtBrckIdx === null || rightBrckIdx.endBrckIdx === null ){
            return null;
    }

    if(texIndex>0 && texGrammer.substring(texIndex-1, texIndex) === "{"){
        let outsideBrckIdx = await cvt_findRightBrck(texGrammer, texIndex-1);   //bold를 감싸는 중괄호
        texGrammer = texGrammer.substring(rightBrckIdx.strtBrckIdx, rightBrckIdx.endBrckIdx);
        
        let tmpSpan = document.createElement("span");
        tmpSpan.innerHTML = texGrammer
        //html 및 문법 시작 idx와 끝 idx 리턴
        return {"nbFormulBox":tmpSpan, "strtIdx":texIndex-1, "endIdx":outsideBrckIdx.endBrckIdx+1};
    }else{
        return null;
    }
    
    
}