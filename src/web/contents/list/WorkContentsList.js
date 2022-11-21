import React, {useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormulaEditor from 'web/contents/register/FormulaEditor'
import EmptyList from 'web/common/EmptyList';
import {nb_dataFetch} from 'js/common/common_nb.js';
import CustomUnitSelBox from 'web/common/CustomUnitSelBox';
import UnitSelBox from 'web/common/UnitSelBox';
import {nb_isAdmin, nb_fCustomSelClose, nb_formDataFetch, nb_formDataFileFetch,  nb_dateFormat, nb_confirmBox, nb_fadeInOut, nb_fadeInOutA, nb_promptBox, nb_detectScrollPosition, nb_moveToScroll, 
    nb_closeBtn, nb_modalScrollStrt, nb_modalScrollEnd, nb_multiChoiceGridSet, nb_getParameterByName, nb_topMenuFixed2} from 'js/common/common_nb.js';
import {reg_unitTypeChange, reg_eraseEditTbUI} from 'js/contents/register/contents_reg.js';
import "css/common/nbScreen.css";
import {cvt_textNodeConvert, cvt_initWidthHeight, cvt_initOrgWidthHeight, cvt_convertHtmlToTex, cvt_makeJsonArrForHwp, cvt_combineFormul} from 'js/convertGrammer/nbToTexConvert_cvt.js';
import hwpDownImg from 'img/hwpDownImg.png';
import hourglass from 'img/hourglass.gif';

let fExecuteWidth = false;  //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0;            //모달 팝업시 부모창 스크롤 위치
let subjectVal;
//let firUnitVal;
let secUnitVal;
let thrUnitVal;
let currentPath = "";
let isContentsListInitiated = false;    //모달 팝업이후 컨텐츠가 모두 뿌려졌는지 판단여부
const WorkContentsList = ()=>{
    let location = useLocation();

    const [contentsList, setContentsList] = useState(new Array());
    const [subjectBox, setSubjectBox] = useState(new Array());
    //const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
    const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
    const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
    const [contentsLen, setContentsLen] = useState(0);
    const [contentsNo, setContentsNo] = useState("");
    const [modalState, setModalState] = useState(false);        //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼
    const [workListChanged, setWorkListChanged] = useState(true); 
    const [compDelTr, setCompDelTr] = useState(""); 
    const [emptyListMsg, setEmptyListMsg] = useState("단원 정보를 선택하여 원하는 문제를 찾아보세요.");

    const removeAddedEvent = () => {
        window.removeEventListener('scroll', nb_detectScrollPosition);
        window.removeEventListener('scroll', topMenuFixed);
    }
    const modalPopupOpen = async (event)  =>{
        subjectVal = document.getElementById("subject").value;
        //firUnitVal = document.getElementById("firUnit").value;
        secUnitVal = document.getElementById("secUnit").value;
        thrUnitVal = document.getElementById("thrUnit").value;
        scrollY=nb_modalScrollStrt();
        
        document.getElementById("outerFormulaEditor").classList.remove("hide")
        await setContentsNo(document.getElementById(event.target.id).dataset.contentsNo);
        setModalState(true);
    }

    const topMenuFixed = () => {
        nb_topMenuFixed2("workListUnitTypeRoot")
    }

    const modalPopupClose = async (event, isSearch) =>{
        isContentsListInitiated = false;
        window.removeEventListener('click', reg_eraseEditTbUI);
        await nb_closeBtn("outerFormulaEditor"); 
        await setModalState(false);

        //이전 검색조건 셋팅
        let trigEv = new Object();
        let sub    = new Object();
       
        trigEv.target= sub;
        trigEv.target.id= "subject";
        document.getElementById("subject").value = subjectVal;
        await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);
        document.getElementById("subject").value = subjectVal;
        document.getElementById("cusSelSubTitle").innerHTML =document.getElementById("subject")[document.getElementById("subject").selectedIndex].innerText;
        document.getElementById("cusSelSubDiv").classList.add("nbCustomSelected");
        await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);
        /*
        //두번 실행해야함, 자식 콤보의 첫번째 인덱스를 display:none 패스 후 자식 콤보의 대단원, 중단원, 소단원 등의 콤보 제목정보가 추가되는데
        //과목 이벤트 한번만 실행되면  대단원에는 display:none 패스 후 대단원 option태그 추가되므로 콤보제목 태그가 아닌 다른 태그가 들어오게됨
        await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);

        document.getElementById("firUnit").value = firUnitVal;
        document.getElementById("cusSelFirUnitTitle").innerHTML =document.getElementById("firUnit")[document.getElementById("firUnit").selectedIndex].innerText;
        document.getElementById("cusSelFirUnitDiv").classList.add("nbCustomSelected");
        trigEv.target.id= "firUnit";
        await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);
        */

        document.getElementById("secUnit").value = secUnitVal;
        document.getElementById("cusSelSecUnitTitle").innerHTML =document.getElementById("secUnit")[document.getElementById("secUnit").selectedIndex].innerText;
        document.getElementById("cusSelSecUnitDiv").classList.add("nbCustomSelected");
        trigEv.target.id= "secUnit";
        await reg_unitTypeChange(trigEv, "cusSelThrUnit","thrUnit", true);

        document.getElementById("thrUnit").value = thrUnitVal;
        document.getElementById("cusSelThrUnitTitle").innerHTML =document.getElementById("thrUnit")[document.getElementById("thrUnit").selectedIndex].innerText;
        document.getElementById("cusSelThrUnitDiv").classList.add("nbCustomSelected");
        
        //모달창에서 저장하기 버튼을 누른 경우에만 검색
        //event.isTrusted 자바스크립트 내장객체로 사용자 액션으로 실행 된 경우 true, 자바스크립트 이벤트로 강제 발생시 false
        if(!event.isTrusted) {  //사용자가 문제 등록 한 경우
            let mathContents = window.mathContents;
            let objIdx = null;
            contentsList.forEach(function(element, idx){
                if(element.contentsNo ===  mathContents.contentsNo){
                    objIdx = idx;
                    return false;
                }
            });
            contentsList[objIdx] = mathContents;
            window.mathContents = null;         //윈도우 전역변수 객체 초기화
            setWorkListChanged(false);
            setWorkListChanged(true);
            document.getElementById("imgUpdt").value = "N";
        }
        else if(event.isTrusted && document.getElementById("imgUpdt").value === "Y"){  //사용자 액션(모달창 닫기 버튼 직접 클릭 한 경우)
            let mathContents = window.mathContents;
            let objIdx = null;
            contentsList.forEach(function(element, idx){
                if(element.contentsNo ===  mathContents.contentsNo){
                    objIdx = idx;
                    return false;
                }
            });
            contentsList[objIdx] = mathContents;
            window.mathContents = null;         //윈도우 전역변수 객체 초기화
            setWorkListChanged(false);
            setWorkListChanged(true);
            document.getElementById("imgUpdt").value = "N";
        } 
        await nb_multiChoiceGridSet("quesConMultiShow");
        nb_modalScrollEnd(scrollY)
        let scrollCheck = await setInterval(()=>{
            if(isContentsListInitiated){    //컨텐츠 모두 보여지면 원래 스크롤 위치로 복귀
                document.getElementById("root").style.overflow = "unset"
                let svcInspectBtn = document.getElementsByClassName("svcInspectBtn");
                for(let i=0; i<svcInspectBtn.length; i++){
                    if(svcInspectBtn[i].dataset.contentsNo === contentsNo){
                        svcInspectBtn[i].scrollIntoView({behavior: "auto", block: "center", inline: "center"});
                        break;
                    }
                }
                clearInterval(scrollCheck);
            }
        }, 200)
        
    }
    
    const svcSttsChange = async function(event){
        let chngStts = event.target.dataset.value;
        let contentsNo = event.target.dataset.contentsNo;
        const jsonObj = await nb_dataFetch('/mathInfo/conSvcSttsChng?contentsNo='+contentsNo+"&svcStts="+chngStts, true);
        if(jsonObj.isSuccess ===1){
            let svcSttsBtn =  event.target.parentElement.querySelectorAll(".svcSttsBtn");
            for(let i=0; i<svcSttsBtn.length; i++){
                svcSttsBtn[i].classList.remove("active");
                svcSttsBtn[i].classList.add("inactive");
            }
            event.target.classList.add("active");
            event.target.classList.remove("inactive");
            contentsList.forEach(function(element){
                if(element.contentsNo ===  Number(contentsNo)){
                    element.svcPosbStts = Number(chngStts);
                    return false;
                }
            });
        }
    }

    useEffect(()=>{
        let param = nb_getParameterByName("unitUniqId");
        let param2 = nb_getParameterByName("contentsNo");
        if(currentPath === location.pathname && param === "") {
            if(contentsList.length!==0){
                setContentsList([])
                document.getElementById("subject").selectedIndex = 0;
                document.getElementById("cusSelSubTitle").innerHTML =document.getElementById("subject")[0].innerText;
                document.getElementById("cusSelSubDiv").classList.remove("nbCustomSelected");
            }
        }
        currentPath = location.pathname;
        
        const asyncUseEffect = async function(){
            let jsonObj = await nb_dataFetch('/mathInfo/unitInfo', true);
            setSubjectBox(jsonObj["mathSubjectInfo"]);
            //setfirUnitSelBox(jsonObj["mathFirUnitInfo"]);
            setSecUnitSelBox(jsonObj["mathSecUnitInfo"]);
            setThrUnitSelBox(jsonObj["mathThrUnitInfo"]);
             //초기 단원 및 유형정보 셋팅
            let trigEv = new Object();
            let sub    = new Object();
            trigEv.target= sub;
            trigEv.target.id= "subject";
            await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);
            let param = nb_getParameterByName("unitUniqId")
            //검색된 상태에서 다른 페이지 갔다가 뒤로가기로 돌아온경우
            if(param !== ""){
                historyBackSearchCondSetting(param)
            }
            if(param2 !== ""){
                searchWorkListByContentsNo(param2, false);
            }
        }
        if(!fExecuteWidth){
            asyncUseEffect();
            document.body.addEventListener('click',nb_fCustomSelClose);
        }else{
            if(contentsList.length!==0){
                nb_multiChoiceGridSet("quesConMultiShow");
            }
            fExecuteWidth = false;
        }
        window.addEventListener('scroll', nb_detectScrollPosition);
        window.addEventListener('scroll', topMenuFixed);
        return () => removeAddedEvent();
        }, [contentsList, location]);

        const historyBackSearchCondSetting = async (param)=> {
            let formData = new FormData(document.getElementById("workSearchForm"));
            formData.append("unitUniqNo",param);
            let returnObj = await nb_formDataFetch("/mathInfo/takeWorkContentsList",formData, true);
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setContentsLen(returnObj["mathContents"].length);
                    setContentsList(returnObj["mathContents"]);
                }else{
                    setContentsLen(returnObj["mathContents"].length);
                    setContentsList(returnObj["mathContents"]);
                }
            }

            //이전 검색조건 셋팅
            let trigEv = new Object();
            let sub    = new Object();
        
            trigEv.target= sub;
            trigEv.target.id= "subject";

            let subject = document.getElementById("subject");
            let selectedIdx = 0;
            let subjectOptList = subject.childNodes
            for(let i=0; i<subjectOptList.length; i++){
                if(subjectOptList[i].dataset.uniqNo > param){
                    break;
                }else{
                    selectedIdx = i;
                }
            }
            subject.selectedIndex = selectedIdx;
            subjectVal = subject.value;
            await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);
            document.getElementById("subject").value = subjectVal;
            document.getElementById("cusSelSubTitle").innerHTML =document.getElementById("subject")[document.getElementById("subject").selectedIndex].innerText;
            document.getElementById("cusSelSubDiv").classList.add("nbCustomSelected");
            

            /*
            let firUnit = document.getElementById("firUnit");
            selectedIdx = 0;
            let firUnitOptList = firUnit.childNodes
            for(let i=0; i<firUnitOptList.length; i++){
                if(firUnitOptList[i].dataset.uniqNo > param){
                    break;
                }else{
                    selectedIdx = i;
                }
            }
            firUnit.selectedIndex = selectedIdx;
            firUnitVal = firUnit.value;
            //두번 실행해야함, 자식 콤보의 첫번째 인덱스를 display:none 패스 후 자식 콤보의 대단원, 중단원, 소단원 등의 콤보 제목정보가 추가되는데
            //과목 이벤트 한번만 실행되면  대단원에는 display:none 패스 후 대단원 option태그 추가되므로 콤보제목 태그가 아닌 다른 태그가 들어오게됨
            await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);
            
            document.getElementById("firUnit").value = firUnitVal;
            document.getElementById("cusSelFirUnitTitle").innerHTML =document.getElementById("firUnit")[document.getElementById("firUnit").selectedIndex].innerText;
            document.getElementById("cusSelFirUnitDiv").classList.add("nbCustomSelected");
            trigEv.target.id= "firUnit";
            */

            let secUnit = document.getElementById("secUnit");
            selectedIdx = 0;
            let secUnitOptList = secUnit.childNodes
            for(let i=0; i<secUnitOptList.length; i++){
                if(secUnitOptList[i].dataset.uniqNo > param){
                    break;
                }else{
                    selectedIdx = i;
                }
            }
            secUnit.selectedIndex = selectedIdx;
            secUnitVal = secUnit.value;
            await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);

            document.getElementById("secUnit").value = secUnitVal;
            document.getElementById("cusSelSecUnitTitle").innerHTML =document.getElementById("secUnit")[document.getElementById("secUnit").selectedIndex].innerText;
            document.getElementById("cusSelSecUnitDiv").classList.add("nbCustomSelected");
            trigEv.target.id= "secUnit";
            let thrUnit = document.getElementById("thrUnit");
            selectedIdx = 0;
            let thrUnitOptList = thrUnit.childNodes
            for(let i=0; i<thrUnitOptList.length; i++){
                if(thrUnitOptList[i].dataset.uniqNo === param){
                    selectedIdx = i;
                }
            }
            thrUnit.selectedIndex = selectedIdx;
            thrUnitVal = thrUnit.value;
            await reg_unitTypeChange(trigEv, "cusSelThrUnit","thrUnit", true);

            document.getElementById("thrUnit").value = thrUnitVal;
            document.getElementById("cusSelThrUnitTitle").innerHTML =document.getElementById("thrUnit")[document.getElementById("thrUnit").selectedIndex].innerText;
            document.getElementById("cusSelThrUnitDiv").classList.add("nbCustomSelected");
            
        }

        const makeOrgSrcRef = async function() {
            return '<option value="0">유사 교재</option><option value="쎈수학">쎈수학</option><option value="RPM">RPM</option><option value="수학의 힘(베타)">수학의 힘(베타)</option><option value="해결의법칙">해결의법칙</option><option value="교과서">교과서</option><option value="창작">창작</option>'
        }

        const makeMathTypeClassify = async function() {
            return '<option value="0">문제 구분</option><option value="단순계산">단순계산</option><option value="응용">응용</option>';
        }

        const compContentsReg = async function(){
            let compTbBody = document.getElementById("compTbTbody");
            let compTbTr = compTbBody.querySelectorAll("tr")
            for(let i=0; i<compTbTr.length; i++){
                let orgSrcRef= compTbTr[i].querySelector(".compOrgSrcRef");
                let orgSrcNo= compTbTr[i].querySelector(".compOrgSrcNo");
                let orgSrcPage= compTbTr[i].querySelector(".compOrgSrcPage");
                let copyrightYear= compTbTr[i].querySelector(".compCopyrightYear");
                let mathTypeClassify= compTbTr[i].querySelector(".compMathTypeClassify");
                if(Number(orgSrcRef.value) === 0){
                    alert((i+1)+"번째 행의 유사 교재를 선택해주세요.");
                    return false;
                }
                if(orgSrcRef.value === "쎈수학" || orgSrcRef.value === "RPM" || orgSrcRef.value === "수학의 힘(베타)"  || orgSrcRef.value === "해결의법칙" ){
                    if(orgSrcNo.value.length===0){
                        alert((i+1)+"번째 행의 유사 문제번호를 적어주세요.");
                        return false;
                    }else if(orgSrcNo.value.length>4){
                        alert((i+1)+"번째 행의 유사 문제번호는 9999번 보다 작게 입력해주시기 바랍니다.");
                        return false;
                    }
                    if(copyrightYear.value==="" || copyrightYear.value.length > 10){
                        alert((i+1)+"번째 행의 발행일(출판연월)를 입력 해주세요.(10글자 미만)");
                        return false;
                    }
                    orgSrcPage.value = 0;
                }else if(orgSrcRef.value === "교과서" ){
                    if(orgSrcNo.value.length===0){
                        alert((i+1)+"번째 행의 유사 문제 번호를 적어주세요.");
                        return false;
                    }else if(orgSrcNo.value.length>4){
                        alert((i+1)+"번째 행의 유사 문제번호는 9999번 보다 작게 입력해주시기 바랍니다.");
                        return false;
                    }
        
                    if(orgSrcPage.value.length===0 || orgSrcPage.value.length>3){
                        alert((i+1)+"번째 행의 유사 문제 페이지를 적어주세요.(999 미만)");
                        return false;
                    }
        
                    if(copyrightYear.value==="" || copyrightYear.value.length > 10){
                        alert((i+1)+"번째 행의 발행일(출판연월)를 입력 해주세요.(10글자 미만)");
                        return false;
                    }
                }else if(orgSrcRef.value === "창작" ){
                    orgSrcNo.value = 0;
                    orgSrcPage.value = 0;
                    copyrightYear.value = "";
                }
        
                if(mathTypeClassify.selectedIndex === 0){
                    alert((i+1)+"번째 행의 문제 구분탭에서 구분 유형을 선택 해주세요.");
                    return false;
                }
            }

            let formData = new FormData(document.getElementById("compContentsForm"));
            let returnObj = await nb_formDataFetch("/mathInfo/registerCompContents",formData, true);
            if(returnObj.error!==undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }else if(returnObj.isSuccess){
                //성공한 객체로 바꾸기
                contentsList.forEach(function(element){
                    if(element.contentsNo ===  Number(returnObj.successObj[0].contentsNo)){
                        element.mathContentsComp = returnObj.successObj;
                        return false;
                    }
                });
                //comp 모달 상태변화로 유사문제 등록갯수 초기화
                setWorkListChanged(false);
                setWorkListChanged(true);

                await compContentsPopUpClose();
                await nb_multiChoiceGridSet("quesConMultiShow");
                await nb_fadeInOut("유사문제가 정상적으로 등록 되었습니다.", 2000);

            }
        }

        const compDelPrompt = async function(){
            let inputVal = document.getElementById("promptInput").value;
            if(inputVal !== "삭제"){
                document.getElementById("promptInput").classList.add("shake")
                setTimeout(function(){
                    document.getElementById("promptInput").classList.remove("shake")
                }, 500);
                return;
            }
            document.getElementById("promptBoxClose").click();

            let compSeqNo = compDelTr.querySelector(".compSeqNo");
            let compContentsNo = compDelTr.querySelector(".compContentsNo");
            let returnObj = await nb_dataFetch("/mathInfo/delCompContents?seqNo="+compSeqNo.value+"&contentsNo="+compContentsNo.value, true);
            if(returnObj.isSuccess) {
                compDelTr.remove();
                //성공한 객체로 바꾸기
                contentsList.forEach(function(element){
                if(element.contentsNo ===  Number(returnObj.successObj[0].contentsNo)){
                    element.mathContentsComp = returnObj.successObj;
                    return false;
                    }
                });
                //comp 모달 상태변화로 유사문제 등록갯수 초기화
                setWorkListChanged(false);
                setWorkListChanged(true);
                await nb_multiChoiceGridSet("quesConMultiShow");
                await nb_fadeInOut("정상적으로 삭제 되었습니다.", 2000);
            }else if(returnObj.isSuccess === false){
                await nb_fadeInOutA("삭제가 취소되었습니다.\n유사문제는 최소 1개 이상 등록 되어있어야 합니다.", 2000);
            }
        }

        const compContentsDel = async function(event){
            let targetTr = event.target.closest("tr");
            setCompDelTr(targetTr);
            let compSeqNo = targetTr.querySelector(".compSeqNo");
            if(compSeqNo === null){
                targetTr.remove();
            }else{
                await nb_promptBox("삭제를 진행하시려면 '삭제' 라고 입력해주세요. \n(따옴표 없이 입력해주시기 바랍니다.)", "삭제 라고 입력해주세요.");
            }
        }

        const compAddRow = async function(){
            let compTbTbody = document.getElementsByClassName("compTbTbody")[0];
            let rowIdx =  Number(compTbTbody.lastElementChild.dataset.rowIdx)+1;
            let tr = document.createElement("tr");
            tr.dataset.rowIdx = rowIdx
            let td1 = document.createElement("td");
            td1.className="seqNoAndRefTd"
            let refOptBox = await makeOrgSrcRef();
            let sel1 = document.createElement("select");
            sel1.name="mathContentsComp["+rowIdx+"].orgSrcRef"
            sel1.innerHTML = refOptBox;
            sel1.className = "compOrgSrcRef";
            let contentsNo = document.getElementById("compPopUp").dataset.contentsNo
            let input0 = document.createElement("input");
            input0.type= "number";
            input0.className = "compContentsNo hide"
            input0.name="mathContentsComp["+rowIdx+"].contentsNo"
            input0.value = contentsNo;
            td1.append(sel1); 
            td1.append(input0);
            let td2 = document.createElement("td");
            let input2 = document.createElement("input");
            input2.type= "number";
            input2.className = "compOrgSrcNo";
            input2.name="mathContentsComp["+rowIdx+"].orgSrcNo"
            td2.append(input2); 
            let td3 = document.createElement("td");
            let input3 = document.createElement("input");
            input3.type= "number";
            input3.className = "compOrgSrcPage";
            input3.name="mathContentsComp["+rowIdx+"].orgSrcPage"
            td3.append(input3); 
            let td4 = document.createElement("td");
            let input4 = document.createElement("input");
            input4.type= "text";
            input4.className = "compCopyrightYear";
            input4.name="mathContentsComp["+rowIdx+"].copyrightYear"
            td4.append(input4); 
            let td5 = document.createElement("td");
            let sel2 = document.createElement("select");
            sel2.className = "compMathTypeClassify";
            let mathTypeClassifyOpt = await makeMathTypeClassify();
            sel2.name="mathContentsComp["+rowIdx+"].mathTypeClassify"
            sel2.innerHTML = mathTypeClassifyOpt;
            td5.append(sel2); 
            let td6 = document.createElement("td");
            let span = document.createElement("span");
            span.className = "compDelBtn"
            span.addEventListener("click", compContentsDel);
            span.innerText = "삭제";
            td6.append(span); 
            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
            tr.append(td5);
            tr.append(td6);
            compTbTbody.append(tr);
        }

        const compContentsPopUpClose = async function(){
            document.getElementById("compPopUpScreen").classList.add("hide");
            document.getElementById("compTbTbody").innerText = "";
        }

        const compContentsPopUp = async function(event){
            let contentsNo = event.target.dataset.contentsNo;
            document.getElementById("compPopUp").dataset.contentsNo = contentsNo;
            document.getElementById("compPopUpScreen").classList.remove("hide");
            let compContentsList = contentsList.filter((element)=>{
                return element.contentsNo === Number(contentsNo);
            })
            let compTbTbody = document.getElementById("compTbTbody");
            for(let i=0; i<compContentsList[0].mathContentsComp.length; i++){
                let tr = document.createElement("tr");
                tr.dataset.rowIdx = i;
                let td1 = document.createElement("td");
                td1.className="seqNoAndRefTd"
                let input = document.createElement("input");
                input.type= "number";
                input.name="mathContentsComp["+i+"].contentsNo"
                input.className="compContentsNo hide"
                input.value = compContentsList[0].mathContentsComp[i].contentsNo;
                let input0 = document.createElement("input");
                input0.type= "number";
                input0.name="mathContentsComp["+i+"].seqNo"
                input0.className="compSeqNo hide"
                input0.value = compContentsList[0].mathContentsComp[i].seqNo;
                let sel1 = document.createElement("select");
                let refOptBox = await makeOrgSrcRef();
                sel1.name="mathContentsComp["+i+"].orgSrcRef"
                sel1.innerHTML = refOptBox;
                sel1.className = "compOrgSrcRef";
                td1.append(input);
                td1.append(input0);
                td1.append(sel1); 
                sel1.value = compContentsList[0].mathContentsComp[i].orgSrcRef;
                let td2 = document.createElement("td");
                let input2 = document.createElement("input");
                input2.type= "number";
                input2.name="mathContentsComp["+i+"].orgSrcNo"
                input2.className="compOrgSrcNo"
                input2.value = compContentsList[0].mathContentsComp[i].orgSrcNo;
                td2.append(input2); 
                let td3 = document.createElement("td");
                let input3 = document.createElement("input");
                input3.type= "number";
                input3.name="mathContentsComp["+i+"].orgSrcPage";
                input3.className="compOrgSrcPage";
                input3.value = compContentsList[0].mathContentsComp[i].orgSrcPage;
                td3.append(input3); 
                let td4 = document.createElement("td");
                let input4 = document.createElement("input");
                input4.type= "text";
                input4.name="mathContentsComp["+i+"].copyrightYear"
                input4.className="compCopyrightYear";
                input4.value = compContentsList[0].mathContentsComp[i].copyrightYear;
                td4.append(input4); 
                let td5 = document.createElement("td");
                let sel2 = document.createElement("select");
                let mathTypeClassifyOpt = await makeMathTypeClassify();
                sel2.name="mathContentsComp["+i+"].mathTypeClassify"
                sel2.innerHTML = mathTypeClassifyOpt;
                sel2.className="compMathTypeClassify";
                td5.append(sel2); 
                sel2.value = compContentsList[0].mathContentsComp[i].mathTypeClassify;
                let td6 = document.createElement("td");
                let span = document.createElement("span");
                span.className = "compDelBtn"
                span.addEventListener("click", compContentsDel);
                span.innerText = "삭제";
                td6.append(span); 
                tr.append(td1);
                tr.append(td2);
                tr.append(td3);
                tr.append(td4);
                tr.append(td5);
                tr.append(td6);
                compTbTbody.append(tr);
            }
        }

        const searchMyWorkList = async function(hasNotiPhrases){
            let customSubject = document.getElementById("cusSelSubTitle");
            let subject = document.getElementById("subject");
            //let customFirUnit = document.getElementById("cusSelFirUnitTitle");
            //let firUnit = document.getElementById("firUnit");
            let customSecUnit = document.getElementById("cusSelSecUnitTitle");
            let secUnit = document.getElementById("secUnit");
            let customThrUnit = document.getElementById("cusSelThrUnitTitle");
            let thrUnit = document.getElementById("thrUnit");

            if(customSubject.innerText=="과목" || subject.selectedIndex==0){
                alert("과목을 선택해주세요.");
                return false;
            }
            /*
            if(customFirUnit.innerText=="대단원" || firUnit.selectedIndex==0){
                    alert("대단원을 선택해주세요.");
                    return false;
            }
            */
            if(customSecUnit.innerText==="대단원" || secUnit.selectedIndex===0){
                alert("대단원을 선택해주세요.");
                return false;
            }
            if(customThrUnit.innerText==="중단원" || thrUnit.selectedIndex===0){
                alert("중단원을 선택해주세요.");
                return false;
            }

            let formData = new FormData(document.getElementById("workSearchForm"));
            formData.append("unitUniqNo", thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
            // FormData의 값 확인
            /*
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ': ' + pair[1]);
            }
            */

            let returnObj = await nb_formDataFetch("/mathInfo/takeWorkContentsList",formData, true);
            let param = nb_getParameterByName("unitUniqId")
            if(param !== thrUnit[thrUnit.selectedIndex].dataset.uniqNo){
                window.history.pushState("", "문제검색", '/admin/workContentsList?unitUniqId='+thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
            }
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setContentsLen(0);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases){
                        await nb_fadeInOut("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.", 2000);
                        setEmptyListMsg("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.");
                    }  
                    else{
                        await nb_fadeInOut("해당하는 단원에 문제 내역이 없습니다.", 2000);
                        setEmptyListMsg("검색 결과가 없습니다. 해당 단원에 등록되어있는 문제가 없습니다.");
                    } 
                }else{
                    setContentsLen(returnObj["mathContents"].length);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases)  await nb_fadeInOut("정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.", 2000);
                    else  await nb_fadeInOut("문제 내역이 정상적으로 조회되었습니다.", 2000);
                }
                
            }

        }


        const searchWorkListByContentsNo = async function(contentsNo, hasNotiPhrases){
            let returnObj = await nb_dataFetch("/mathInfo/takeWorkContentsListByContentsNo?contentsno="+contentsNo, true);
            window.history.pushState("", "문제검색", '/admin/workContentsList?unitUniqId=0&contentsNo='+contentsNo);
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setContentsLen(0);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases){
                        await nb_fadeInOut("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.", 2000);
                        setEmptyListMsg("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.");
                    }  
                    else{
                        await nb_fadeInOut("해당하는 문제가 없습니다.", 2000);
                        setEmptyListMsg("검색 결과가 없습니다. 해당 문제가 없습니다.");
                    } 
                }else{
                    setContentsLen(returnObj["mathContents"].length);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases)  await nb_fadeInOut("정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.", 2000);
                    else  await nb_fadeInOut("문제 내역이 정상적으로 조회되었습니다.", 2000);
                }
                
            }

        }

        //관리자만 다운 가능
        const convertHtmlToTex = async (event) => {
            if(!await nb_isAdmin()) {
                hwpDownPopUpClose();
                alert("관리자만 사용가능한 기능입니다.");
                return;
            }

            let contentsNo = event.target.dataset.contentsNo;

            if(contentsNo === "all"){
                convertHtmlToTexAll();
                hwpDownPopUpClose();
                return;
            }

            let contentsDiv  = document.getElementsByClassName("workContentsDiv");
            let rootTb;

            for(let i=0; i<contentsDiv.length; i++){
                if(Number(contentsDiv[i].dataset.contentsNo) === Number(contentsNo)){
                    rootTb =  contentsDiv[i];
                    break;
                }
            }

            let contentsArr = [{className:"quesContents", title:"[문제]"}, {id:"workMultiShow", className:"multiDivContents"}, {className:"ansContents", title:"[정답]"}, {className:"solContents", title:"[해설]"}];
            let hwpJsonArrForPython = new Array();
            for(let i=0; i<contentsArr.length; i++){
                if(contentsArr[i].className === "multiDivContents"){
                    //객관식 문제 아니면 건너뛰기
                    if(rootTb.querySelector("#"+contentsArr[i].id).classList.contains("hide")){
                        let breakObj = new Object();
                        breakObj.contentsType = "BreakPara";
                        hwpJsonArrForPython.push(breakObj);
                        continue;
                    }
                    
                    let tableObj = new Object();
                    tableObj.contentsType = "table";
                    tableObj.contentsDetailType = "table";
                    tableObj.borderStyle = "allNone";
                    if(rootTb.querySelector("#"+contentsArr[i].id).classList.contains("twoDivGrid")){
                        tableObj.rowCnt = 3;
                        tableObj.colCnt = 2;
                        tableObj.colWidthList = [1, 1]
                    }else if(rootTb.querySelector("#"+contentsArr[i].id).classList.contains("threeDivGrid")){
                        tableObj.rowCnt = 2;
                        tableObj.colCnt = 3;
                        tableObj.colWidthList = [1, 1, 1]
                    }else{
                        tableObj.rowCnt = 5;
                        tableObj.colCnt = 1;
                        tableObj.colWidthList = [1]
                    }
                    tableObj.contents = new Array();
                    let multiChoiceContents = [{className:"firDivContents"}, {className:"secDivContents"}, {className:"thrDivContents"}, {className:"fourDivContents"}, {className:"fifDivContents"}]; 
                    for(let j=0; j<multiChoiceContents.length; j++){
                        await cvt_initWidthHeight(rootTb.querySelector("."+multiChoiceContents[j].className));
                        let quesContents = rootTb.querySelector("."+multiChoiceContents[j].className).cloneNode(true);
                        await cvt_textNodeConvert(quesContents);
                        let contentsDiv = await cvt_convertHtmlToTex(quesContents);
                        let hwpJsonArr = await cvt_makeJsonArrForHwp(contentsDiv);
                        let newHwpJsonArr = await cvt_combineFormul(hwpJsonArr);

                        let tableCellContents = new Array();
                        let num = "";
                        if(j===0) num = "① ";
                        else if(j===1) num = "② ";
                        else if(j===2) num = "③ ";
                        else if(j===3) num = "④ ";
                        else if(j===4) num = "⑤ ";
                        let tmpNumInnerObj = new Object();
                        tmpNumInnerObj.contentsType = "text";
                        tmpNumInnerObj.contents = num;
                        let tmpNumObj = new Object();
                        tmpNumObj.contents = tmpNumInnerObj;
                        tmpNumObj.align = "alignLeft";
                        tableCellContents.push(tmpNumObj);

                        for(let k=0; k<newHwpJsonArr.length; k++){
                            //객관식 마지막 값이 줄바꿈이면 건너뛰기(객관식 줄바꿈 오류 없애기)
                            //객관식 div태그에 감싸져 있어 마지막값이 줄바꿈 됨(예전 방식은 객관식 div 태그 안 감싸져 있어 마지막 줄바꿈 안나올 수 있음)
                            if(k===newHwpJsonArr.length-1 && newHwpJsonArr[k].contentsType==="BreakPara"){
                                break;
                            }
                            let tmpObj = new Object();
                            tmpObj.contents = newHwpJsonArr[k];
                            tableCellContents.push(tmpObj);

                        }
                        tableObj.contents.push(tableCellContents);
                        await cvt_initOrgWidthHeight(rootTb.querySelector("."+multiChoiceContents[j].className));
                    }
                    hwpJsonArrForPython.push(tableObj);

                    let breakObj = new Object();
                    breakObj.contentsType = "BreakPara";
                    hwpJsonArrForPython.push(breakObj);
                }else{
                    await cvt_initWidthHeight(rootTb.querySelector("."+contentsArr[i].className));
                    let quesContents = rootTb.querySelector("."+contentsArr[i].className).cloneNode(true);
                    if(contentsArr[i].className === "ansContents") {
                        if(quesContents.querySelector(".multiAnswerSheet").innerText.length !== 0){
                            quesContents.querySelector(".multiAnswerSheet").innerText = quesContents.querySelector(".multiAnswerSheet").innerText+" ";
                        }
                        quesContents.querySelector(".answerSheet").prepend(quesContents.querySelector(".multiAnswerSheet"))
                        quesContents = quesContents.querySelector(".answerSheet");
                    }
                    await cvt_textNodeConvert(quesContents);
                    let contentsDiv = await cvt_convertHtmlToTex(quesContents);
                    let hwpJsonArr = await cvt_makeJsonArrForHwp(contentsDiv);
                    await cvt_initOrgWidthHeight(rootTb.querySelector("."+contentsArr[i].className));
                    let newHwpJsonArr = await cvt_combineFormul(hwpJsonArr);
                    let titleArr = new Array();
                    let boldObj = new Object();
                    boldObj.contentsType = "CharShapeBold";
                    titleArr.push(boldObj);
                    let titleObj = new Object();
                    titleObj.contentsType = "text";
                    titleObj.contents = contentsArr[i].title;
                    titleArr.push(titleObj);
                    titleArr.push(boldObj);

                    let breakObj = new Object();
                    breakObj.contentsType = "BreakPara";
                    newHwpJsonArr.unshift(breakObj);
                   
                    if(contentsArr[i].className!=="quesContents"){
                        newHwpJsonArr.push(breakObj);   //문제 줄바꿈은 객관식 끝나고
                    }
                    newHwpJsonArr.unshift(...titleArr);
                    hwpJsonArrForPython.push(...newHwpJsonArr);
                }
            }
       
            hwpDownPopUpClose();

            let form = new FormData();
            form.append("jsonString", JSON.stringify(hwpJsonArrForPython));
            document.getElementById("resDetailedTimeDesc").classList.remove("hide");
            document.getElementById("hourGlassDesc").innerText = "한글 파일을 생성중 입니다.\n잠시만 기다려 주세요...";
            let nowDate = await nb_dateFormat("_");
            let fileName = "[N명의수학]나의제작문제_"+nowDate+".hwp";
            await nb_formDataFileFetch("/takeHwpFile", form, fileName);
            document.getElementById("resDetailedTimeDesc").classList.add("hide");
            
        }

        const convertHtmlToTexAll = async () => {
            let workListTable = document.getElementById("contents-show").querySelectorAll(".workContentsDiv");
            let tmpNewTex = new Array();
            for(let idx=0; idx<workListTable.length;idx++){
                let rootTb =  workListTable[idx];
                let contentsArr = [{className:"quesContents", title:"[문제]"}, {id:"workMultiShow", className:"multiDivContents"}, {className:"ansContents", title:"[정답]"}, {className:"solContents", title:"[해설]"}];
                let hwpJsonArrForPython = new Array();
                for(let i=0; i<contentsArr.length; i++){
                    if(contentsArr[i].className === "multiDivContents"){
                        //객관식 문제 아니면 건너뛰기
                        if(rootTb.querySelector("#"+contentsArr[i].id).classList.contains("hide")){
                            let breakObj = new Object();
                            breakObj.contentsType = "BreakPara";
                            hwpJsonArrForPython.push(breakObj);
                            continue;
                        }
                        
                        let tableObj = new Object();
                        tableObj.contentsType = "table";
                        tableObj.contentsDetailType = "table";
                        tableObj.borderStyle = "allNone";
                        if(rootTb.querySelector("#"+contentsArr[i].id).classList.contains("twoDivGrid")){
                            tableObj.rowCnt = 3;
                            tableObj.colCnt = 2;
                            tableObj.colWidthList = [1, 1]
                        }else if(rootTb.querySelector("#"+contentsArr[i].id).classList.contains("threeDivGrid")){
                            tableObj.rowCnt = 2;
                            tableObj.colCnt = 3;
                            tableObj.colWidthList = [1, 1, 1]
                        }else{
                            tableObj.rowCnt = 5;
                            tableObj.colCnt = 1;
                            tableObj.colWidthList = [1]
                        }
                        tableObj.contents = new Array();
                        let multiChoiceContents = [{className:"firDivContents"}, {className:"secDivContents"}, {className:"thrDivContents"}, {className:"fourDivContents"}, {className:"fifDivContents"}]; 
                        for(let j=0; j<multiChoiceContents.length; j++){
                            await cvt_initWidthHeight(rootTb.querySelector("."+multiChoiceContents[j].className));
                            let quesContents = rootTb.querySelector("."+multiChoiceContents[j].className).cloneNode(true);
                            await cvt_textNodeConvert(quesContents);
                            let contentsDiv = await cvt_convertHtmlToTex(quesContents);
                            let hwpJsonArr = await cvt_makeJsonArrForHwp(contentsDiv);
                            let newHwpJsonArr = await cvt_combineFormul(hwpJsonArr);

                            let tableCellContents = new Array();
                            let num = "";
                            if(j===0) num = "① ";
                            else if(j===1) num = "② ";
                            else if(j===2) num = "③ ";
                            else if(j===3) num = "④ ";
                            else if(j===4) num = "⑤ ";
                            let tmpNumInnerObj = new Object();
                            tmpNumInnerObj.contentsType = "text";
                            tmpNumInnerObj.contents = num;
                            let tmpNumObj = new Object();
                            tmpNumObj.contents = tmpNumInnerObj;
                            tmpNumObj.align = "alignLeft";
                            tableCellContents.push(tmpNumObj);

                            for(let k=0; k<newHwpJsonArr.length; k++){
                                //객관식 마지막 값이 줄바꿈이면 건너뛰기(객관식 줄바꿈 오류 없애기)
                                //객관식 div태그에 감싸져 있어 마지막값이 줄바꿈 됨(예전 방식은 객관식 div 태그 안 감싸져 있어 마지막 줄바꿈 안나올 수 있음)
                                if(k===newHwpJsonArr.length-1 && newHwpJsonArr[k].contentsType==="BreakPara"){
                                    break;
                                }
                                let tmpObj = new Object();
                                tmpObj.contents = newHwpJsonArr[k];
                                tableCellContents.push(tmpObj);

                            }
                            tableObj.contents.push(tableCellContents);
                            await cvt_initOrgWidthHeight(rootTb.querySelector("."+multiChoiceContents[j].className));
                        }
                        hwpJsonArrForPython.push(tableObj);

                        let breakObj = new Object();
                        breakObj.contentsType = "BreakPara";
                        hwpJsonArrForPython.push(breakObj);
                    }else{
                        await cvt_initWidthHeight(rootTb.querySelector("."+contentsArr[i].className));
                        let quesContents = rootTb.querySelector("."+contentsArr[i].className).cloneNode(true);
                        if(contentsArr[i].className === "ansContents") {
                            if(quesContents.querySelector(".multiAnswerSheet").innerText.length !== 0){
                                quesContents.querySelector(".multiAnswerSheet").innerText = quesContents.querySelector(".multiAnswerSheet").innerText+" ";
                            }
                            quesContents.querySelector(".answerSheet").prepend(quesContents.querySelector(".multiAnswerSheet"))
                            quesContents = quesContents.querySelector(".answerSheet");
                        }
                        await cvt_textNodeConvert(quesContents);
                        let contentsDiv = await cvt_convertHtmlToTex(quesContents);
                        let hwpJsonArr = await cvt_makeJsonArrForHwp(contentsDiv);
                        await cvt_initOrgWidthHeight(rootTb.querySelector("."+contentsArr[i].className));
                        let newHwpJsonArr = await cvt_combineFormul(hwpJsonArr);
                        let titleArr = new Array();
                        let boldObj = new Object();
                        boldObj.contentsType = "CharShapeBold";
                        titleArr.push(boldObj);
                        let titleObj = new Object();
                        titleObj.contentsType = "text";
                        titleObj.contents = contentsArr[i].title;
                        titleArr.push(titleObj);
                        titleArr.push(boldObj);

                        let breakObj = new Object();
                        breakObj.contentsType = "BreakPara";
                        newHwpJsonArr.unshift(breakObj);
                        
                        if(contentsArr[i].className!=="quesContents"){
                            newHwpJsonArr.push(breakObj);   //문제 줄바꿈은 객관식 끝나고
                        }
                        newHwpJsonArr.unshift(...titleArr);
                        hwpJsonArrForPython.push(...newHwpJsonArr);
                    }

                }
                tmpNewTex.push(...hwpJsonArrForPython);
        }

        let form = new FormData();
        form.append("jsonString", JSON.stringify(tmpNewTex));
        document.getElementById("resDetailedTimeDesc").classList.remove("hide");
        document.getElementById("hourGlassDesc").innerText = "한글 파일을 생성중 입니다.\n제작문제가 많을수록 시간이 더 걸릴 수 있습니다.\n잠시만 기다려 주세요...";
        let nowDate = await nb_dateFormat("_");
        let fileName = "[N명의수학]나의제작문제_"+nowDate+".hwp";
        await nb_formDataFileFetch("/takeHwpFile", form, fileName);
        document.getElementById("resDetailedTimeDesc").classList.add("hide");
                   
    }

        const hwpDownPopUpClose = async () => {
            document.getElementById("confirmBoxScreen").classList.add("hide");
        }

        const workContentsList = contentsList.map( (contentsMap, idx) => {
                let quesNumber;
                if(idx<9){
                    quesNumber = "0"+(idx+1);
                }else{
                    quesNumber = idx+1;
                }

                let isMultiHide= "hide"
                if(contentsMap.firNo!==""){
                    isMultiHide=""
                }
                let isConImgHide= "hide"
                if(contentsMap.contentsImg !== null){
                    isConImgHide="";
                }
                let isSolImgHide= "hide"
                if(contentsMap.solutionImg !== null){
                    isSolImgHide="";
                }

                let quesLevel = "";
                if(contentsMap.quesLevel=="1")quesLevel="하";
                else if(contentsMap.quesLevel=="2")quesLevel="중하";
                else if(contentsMap.quesLevel=="3")quesLevel="중";
                else if(contentsMap.quesLevel=="4")quesLevel="중상";
                else if(contentsMap.quesLevel=="5")quesLevel="상";

                let isBlank="";
                if(contentsMap.choiceAnswer===null)isBlank="hide";

                let updateBtnId = "updateContenstBtn"+idx;

                let conImgPath;
                if(contentsMap.contentsImg===null) conImgPath = "";
                else conImgPath = process.env.REACT_APP_SERVER_STATIC_HOST+contentsMap.imgPath+contentsMap.contentsImg;
                let solImgPath;
                if(contentsMap.solutionImg===null) solImgPath = "";
                else solImgPath = process.env.REACT_APP_SERVER_STATIC_HOST+contentsMap.solutionImgPath+contentsMap.solutionImg;
               
                //컨텐츠가 모두 뿌려진 이후 모달팝업클로즈 이벤트에서 수정한 위치로 스크롤 찾아감
                if(contentsList.length-1 === idx) isContentsListInitiated = true;

                return  <div id="workContentsDiv" className="workContentsDiv" key={idx} data-contents-no={contentsMap.contentsNo} > 
                                <table className='workListTable'>
                                    <thead>
                                        <tr className='workListTBHead2'>
                                            <td>
                                                <div className='twoFlexLayout'>
                                                    <div>
                                                        <span className='hwpDownImgWrap' onClick={()=>{nb_confirmBox("해당 문제를 한글파일로 다운받으시겠습니까?"); document.getElementById("confirmBoxBtn").dataset.contentsNo = contentsMap.contentsNo}}>
                                                            <img className="hwpDownImg" src={hwpDownImg} alt=""/>
                                                            <div className="hwpDownDesc">한글 파일로 다운 받기</div>
                                                        </span>
                                                        <button id={updateBtnId} type="button" data-contents-no={contentsMap.contentsNo} className='updateBtn' onClick={(event) => {modalPopupOpen(event)}}>수정하기</button>
                                                    </div>
                                                    <div>
                                                        [{contentsMap.mathContentsComp[0].orgSrcRef}] {contentsMap.mathContentsComp[0].orgSrcNo}번({quesLevel}, {contentsMap.mathContentsComp[0].mathTypeClassify})<br/>
                                                        유형 : <span dangerouslySetInnerHTML={{__html: contentsMap.mathTypeInfo.quesType}}></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>정답 및 해설
                                                <div className="compContentsBtn relative" data-contents-no={contentsMap.contentsNo} onClick={(event)=>{compContentsPopUp(event)}}>
                                                    유사문제 등록 <sup className='circleUI' data-contents-no={contentsMap.contentsNo}>{contentsMap.mathContentsComp.length}</sup>
                                                </div>
                                            </td>
                                            <td>서비스 여부</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='td1'>
                                                <div id="workQuesShow" className='workQuesShow quesRootDiv'>
                                                    <div className='quesDiv'>
                                                        <div className='quesNumber'>{quesNumber}</div>
                                                        <div className='quesContents' dangerouslySetInnerHTML={{__html:contentsMap.contents}}></div> 
                                                        <div id="quesImg-show" className={"quesImg-show "+isConImgHide}>
                                                            <img src={conImgPath} id="contentsImgOutput" alt="" />
                                                        </div>
                                                        <div id="workMultiShow" className={"quesConMultiShow "+isMultiHide}>
                                                            <div className="firDiv"><span className='multiChoiceNo'>&#9312;</span><span className="firDivContents" dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                            <div className="secDiv"><span className='multiChoiceNo'>&#9313;</span><span className="secDivContents" dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                            <div className="thrDiv"><span className='multiChoiceNo'>&#9314;</span><span className="thrDivContents" dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                            <div className="fourDiv"><span className='multiChoiceNo'>&#9315;</span><span className="fourDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                            <div className="fifDiv"><span className='multiChoiceNo'>&#9316;</span><span className="fifDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='td2'>
                                                <div className='solRootDiv'>
                                                    <div className='ansSolDiv'>
                                                    
                                                        <div id="workAnsShow" className='ansShow'>
                                                            <div>
                                                                
                                                                <div className='ansContents'>
                                                                    <span className='mini-title6'>{quesNumber}. 답</span>&nbsp;&nbsp;
                                                                    <span className='multiAnswerSheet' dangerouslySetInnerHTML={{__html:contentsMap.choiceAnswer}}></span>
                                                                    <span className={"marginRFive "+isBlank}></span>
                                                                    <span className='answerSheet' dangerouslySetInnerHTML={{__html:contentsMap.answer}}></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="workSolShow" className='solShow'>
                                                            <span className='mini-title6'>해설</span>
                                                            <div id="solImg-show" className={"solImg-show "+isSolImgHide}>
                                                                <img src={solImgPath} id="solutionImgOutput" alt="" />
                                                            </div>
                                                            <div className='solContents' dangerouslySetInnerHTML={{__html:contentsMap.solution}}></div> 
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='td3'>
                                               
                                                <div className={contentsMap.svcPosbStts === 0 ? "svcSttsBtn svcImPosbBtn active" : "svcSttsBtn svcImPosbBtn inactive"} data-value="0" data-contents-no={contentsMap.contentsNo} onClick={(event)=>{svcSttsChange(event)}}>미출시</div>
                                                <div className={contentsMap.svcPosbStts === 2 ? "svcSttsBtn svcInspectBtn active" : "svcSttsBtn svcInspectBtn inactive"} data-value="2" data-contents-no={contentsMap.contentsNo} onClick={(event)=>{svcSttsChange(event)}}>검수완료</div>
                                                <div className={contentsMap.svcPosbStts === 3 ? "svcSttsBtn svcErrBtn active" : "svcSttsBtn svcErrBtn inactive"} data-value="3" data-contents-no={contentsMap.contentsNo} onClick={(event)=>{svcSttsChange(event)}}>오류</div>
                                                <div className={contentsMap.svcPosbStts === 1 ? "svcSttsBtn svcPosbBtn active" : "svcSttsBtn svcPosbBtn inactive"} data-value="1" data-contents-no={contentsMap.contentsNo} onClick={(event)=>{svcSttsChange(event)}}>출시</div> 
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
        });


  return ( <>
            <div id ="scrollMoveBtn" className='scrollMoveBtn hide'>
                <div id='conListScrollToTop' className='conListScrollToTop' tooltip="맨 위로" onClick={()=>{nb_moveToScroll(true);}}></div>
                <div id="conScrollCenterCircle" className='conScrollCenterCircle'></div>
                <div id='conListScrollToBottom' className='conListScrollToBottom' tooltip="맨 아래로" onClick={()=>{nb_moveToScroll(false);}}></div>
            </div>

            <div id="promptBoxScreen" className='promptBoxScreen hide'>
                <div id="promptBox" className='promptBox'>
                    <div className='promptBoxTop'><span id="promptBoxClose" className="promptBoxClose" onClick={()=>{document.getElementById("promptBoxScreen").classList.add('hide'); document.getElementById("promptInput").value="";}}>X</span></div>
                    <div id="promptMsg" className="promptMsg"></div>
                    <div className='promptInputDiv'>
                        <input id="promptInput" className='promptInput' type="text" onKeyDown={(event)=>{if(event.keyCode===13){compDelPrompt()} }}/>
                    </div>
                    <div className='alignCenter'>
                        <span id="promptBoxBtn" className='promptBoxBtn' onClick={()=>{compDelPrompt()}}>확인</span>
                    </div>
                </div>
            </div>
                { !modalState &&
                <div>
                    <div id="workListUnitTypeRoot" className='workListUnitTypeRoot'>
                        <form method="post" id="workSearchForm">
                            <div id="workListUnitType" className='workListUnitType'>
                                <div className='mini-title5'>
                                    &nbsp; N명의수학에서 원하는 문제를 찾아보세요.
                                </div>
                                <CustomUnitSelBox value={subjectBox} cusSelId="cusSelSub" cusChildId="cusSelSecUnit" childId="secUnit" originSel="subject" parentMethod={()=>{}} title="과목"></CustomUnitSelBox>
                                <UnitSelBox value={subjectBox} myId="subject" cusChildId="cusSelSecUnit" childId="secUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                {/*
                                <CustomUnitSelBox value={firUnitSelBox} cusSelId="cusSelFirUnit" cusChildId="cusSelSecUnit" childId="secUnit" originSel="firUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
                                <UnitSelBox value={firUnitSelBox} myId="firUnit" cusChildId="cusSelSecUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                 */}
                                <CustomUnitSelBox value={secUnitSelBox} cusSelId="cusSelSecUnit" cusChildId="cusSelThrUnit" childId="thrUnit" originSel="secUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
                                <UnitSelBox value={secUnitSelBox} myId="secUnit" cusChildId="cusSelThrUnit" childId="thrUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                
                                <CustomUnitSelBox value={thrUnitSelBox} cusSelId="cusSelThrUnit" cusChildId="cusSelQuesType" childId="quesType" originSel="thrUnit" parentMethod={()=>{}} title="중단원"></CustomUnitSelBox>
                                <UnitSelBox value={thrUnitSelBox} myId="thrUnit" cusChildId="cusSelQuesType" childId="quesType" isUnitBubbleEv={false}  parentMethod={()=>{}}></UnitSelBox>
                                
                                <button type="button" className="orangeBtn" onClick={()=>searchMyWorkList(false)}>검색</button>
                            </div>
                        </form>
                    </div>
                    <div className='workList'>
                        {workListChanged && workContentsList.length !==0 ? 
                            <div className="contents-show" id="contents-show">
                                {contentsLen !== 0 && 
                                <div id="con" className='mini-title2'>
                                    <span>변형 작업 문제 갯수 : {contentsLen}</span>
                                    <span className='hwpAllDownBtn floatRight' onClick={()=>{nb_confirmBox("나의 제작문제를 한글파일로 다운받으시겠습니까?\n사용자의 제작문제가 아닌 변형문제는 다운되지 않습니다."); document.getElementById("confirmBoxBtn").dataset.contentsNo = "all"}}>나의 제작문제 일괄 다운</span>
                                </div>
                                
                                }
                                {workContentsList}
                            </div>
                            : <EmptyList msg={emptyListMsg} imgName="searchList"  addImgClass="" /> 
                        }
                    </div>
                </div>
            }
            <div id="outerFormulaEditor" className='fixedBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState  && <FormulaEditor contentsNo={contentsNo} contentsClassify={0}/>}
            </div>
            <input id="imgUpdt" className="hide" type="text" defaultValue="N" />
            <div id="compPopUpScreen" className='compPopUpScreen hide'>
                <div id="compPopUp" className='compPopUp'>
                    <div id="compPopUpClose" className="compPopUpClose" onClick={ (event) => {compContentsPopUpClose(event);}}>X</div>
                    <form id="compContentsForm" method="post">
                        <span className='compAddRow' onClick={()=>{compAddRow()}}>행 추가</span>
                        <table className='compRegisterTb'>
                            <thead className='compRegisterTbHead'>
                                <tr>
                                <td>유사 교재</td><td>유사 문제 번호</td><td>유사 문제 페이지</td><td>발행일(출판연월)</td><td>문제 구분</td><td></td>
                                </tr>
                            </thead>
                            <tbody id="compTbTbody" className='compTbTbody'>
                            </tbody>
                        </table>
                        <div className='alignCenter'><span className='compRegBtn' onClick={()=>{compContentsReg()}}>등록하기</span></div>
                    </form>
                </div>
            </div>
            <div id="confirmBoxScreen" className='confirmBoxScreen hide'>
                <div id="confirmBox" className='confirmBox'>
                    <div className='confirmBoxTop'><span id="confirmBoxClose" className="confirmBoxClose" onClick={()=>{hwpDownPopUpClose();}}>X</span></div>
                    <div id="confirmMsg" className="confirmMsg alignCenter"></div>
                    <div className='alignCenter'>
                        <span id="confirmBoxCnclBtn" className='confirmBoxCnclBtn' onClick={()=>{hwpDownPopUpClose();}}>아니오</span>
                        <span id="confirmBoxBtn" className='confirmBoxBtn' onClick={(event)=>{convertHtmlToTex(event);}}>네</span>
                    </div>
                </div>
            </div>
            <div id="resDetailedTimeDesc" className='blindBox hide'>
                <div id="hourGlassBox" className='resDetailedTimeDesc'>
                    <div>
                        <img className="hourglass" src={hourglass} alt=""/>
                    </div>
                    <div id="hourGlassDesc"></div>
                </div>
            </div>
            </>

  );
}

export default WorkContentsList;