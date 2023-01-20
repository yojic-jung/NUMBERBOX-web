import React, {useState, useEffect } from 'react';
import FormulaEditor from 'web/contents/register/FormulaEditor'
import EmptyList from 'web/common/EmptyList';
import {nb_dataFetch} from 'js/common/common_nb.js';
import {nb_isAdmin, nb_fCustomSelClose, nb_formDataFetch, nb_formDataFileFetch,  nb_dateFormat, nb_confirmBox, nb_fadeInOut, nb_fadeInOutA, nb_promptBox, nb_detectScrollPosition, nb_moveToScroll, 
    nb_closeBtn, nb_modalScrollStrt, nb_modalScrollEnd, nb_multiChoiceGridSet, nb_topMenuFixed2} from 'js/common/common_nb.js';
import {reg_eraseEditTbUI} from 'js/contents/register/contents_reg.js';
import "css/common/nbScreen.css";
import {cvt_textNodeConvert, cvt_initWidthHeight, cvt_initOrgWidthHeight, cvt_convertHtmlToTex, cvt_makeJsonArrForHwp, cvt_combineFormul} from 'js/convertGrammer/nbToTexConvert_cvt.js';
import hwpDownImg from 'img/hwpDownImg.png';
import hourglass from 'img/hourglass.gif';

let fExecuteWidth = false;  //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0;            //모달 팝업시 부모창 스크롤 위치
let yearVal;
let monthVal;
let isContentsListInitiated = false;    //모달 팝업이후 컨텐츠가 모두 뿌려졌는지 판단여부
const IpsiWorkContentsListy = ()=>{

    const [contentsList, setContentsList] = useState(new Array());
    const [impYearList, setImpYearList] = useState(new Array());
    const [impMonthList, setImpMonthList] = useState(new Array());
    //const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
    const [contentsLen, setContentsLen] = useState(0);
    const [contentsNo, setContentsNo] = useState("");
    const [modalState, setModalState] = useState(false);        //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼
    const [workListChanged, setWorkListChanged] = useState(true); 
    const [emptyListMsg, setEmptyListMsg] = useState("수능/모의고사의 시행연월을 선택하여 원하는 문제를 찾아보세요.");

    const removeAddedEvent = () => {
        window.removeEventListener('scroll', nb_detectScrollPosition);
        window.removeEventListener('scroll', topMenuFixed);
    }

    //테스트필요
    const modalPopupOpen = async (event)  =>{
        yearVal = document.getElementById("impYearSelBox").value;
        monthVal = document.getElementById("impMonthSelBox").value;
        scrollY=nb_modalScrollStrt();
        
        document.getElementById("outerFormulaEditor").classList.remove("hide")
        await setContentsNo(document.getElementById(event.target.id).dataset.contentsNo);
        setModalState(true);
    }

    const topMenuFixed = () => {
        nb_topMenuFixed2("workListUnitTypeRoot")
    }

    //테스트필요
    const modalPopupClose = async (event, isSearch) =>{
        isContentsListInitiated = false;
        window.removeEventListener('click', reg_eraseEditTbUI);
        await nb_closeBtn("outerFormulaEditor"); 
        await setModalState(false);

        document.getElementById("impYearSelBox").value = yearVal;
        document.getElementById("impMonthSelBox").value = monthVal;
        
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
        const asyncUseEffect = async function(){
            let returnObj = await nb_dataFetch("/mathInfo/takeIpsiYear", true);
            setImpYearList(returnObj.impYearList);
        }
        if(!fExecuteWidth){
            asyncUseEffect();
            document.body.addEventListener('click',nb_fCustomSelClose);
        }else{
            if(contentsList.length!==0){
            }
            fExecuteWidth = false;
        }
        window.addEventListener('scroll', nb_detectScrollPosition);
        window.addEventListener('scroll', topMenuFixed);
        return () => removeAddedEvent();
        }, [contentsList]);



        //테스트필요
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
        
        const initImpMonth = async (event) => {
            if(event.target.value === 0) return;
            let ipsiMonth = await nb_dataFetch("/mathInfo/takeIpsiMonth?impYear="+event.target.value, true);
            setImpMonthList(ipsiMonth.impMonthList);
        }

        const takeIpsiContents = async () => {
            fExecuteWidth = true;
            let impYearSelVal = document.getElementById("impYearSelBox").value;
            let impMonthSelVal = document.getElementById("impMonthSelBox").value;
            let ipsiContents = await nb_dataFetch("/mathInfo/takeIpsiContentsByYear?impYear="+impYearSelVal+"&impMonth="+impMonthSelVal, true);
            setContentsList(ipsiContents.mathContentsList);
            setWorkListChanged(false);
            setWorkListChanged(true);
            setContentsLen(ipsiContents.mathContentsList.length);
            nb_multiChoiceGridSet("quesConMultiShow");
        }

        const impYearOptList = impYearList.map( (contentsMap, idx) => {
            return (<option key={idx} value={contentsMap}>{contentsMap}</option>)
        });

        const impMonthOptList = impMonthList.map( (contentsMap, idx) => {
            return (<option key={idx} value={contentsMap}>{contentsMap}</option>)
        });

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
                if(contentsMap.quesLevel===1)quesLevel="오류";
                else if(contentsMap.quesLevel===2)quesLevel="오류";
                else if(contentsMap.quesLevel===3)quesLevel="2점";
                else if(contentsMap.quesLevel===4)quesLevel="3점";
                else if(contentsMap.quesLevel===5)quesLevel="4점";

                let paperType = "";
                if(contentsMap.mathContentsIpsi[0].paperType===1) paperType="통합";
                else if(contentsMap.mathContentsIpsi[0].paperType===2) paperType="가형";
                else if(contentsMap.mathContentsIpsi[0].paperType===3) paperType="나형";

                let isBlank="";
                if(contentsMap.choiceAnswer===null)isBlank="hide";

                let updateBtnId = "updateContenstBtn"+idx;

                let manageIns = "";
                if(contentsMap.mathContentsIpsi[0].manageIns === 1){
                    manageIns = "평가원";
                }else if(contentsMap.mathContentsIpsi[0].manageIns === 2){
                    manageIns = "교육청";
                }

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
                                                        {contentsMap.mathContentsIpsi[0].impYear}년 {contentsMap.mathContentsIpsi[0].impMonth}월&nbsp;
                                                        {manageIns} [{paperType}]<br/>
                                                        홀수형 번호 : {contentsMap.mathContentsIpsi[0].oddQuesNum}, 배점 : {quesLevel}, 오답률 : {contentsMap.mathContentsIpsi[0].wrongRatio}%<br/>
                                                        [<span dangerouslySetInnerHTML={{__html:contentsMap.mathUnitInfo.subject}}></span>]&nbsp;
                                                        <span dangerouslySetInnerHTML={{__html:contentsMap.mathUnitInfo.secUnit}}></span> /
                                                        <span dangerouslySetInnerHTML={{__html:contentsMap.mathUnitInfo.thrUnit}}></span>
                                                        <br/>
                                                        유형 : <span dangerouslySetInnerHTML={{__html:contentsMap.mathTypeInfo.quesType}}></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>정답 및 해설</td>
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

                { !modalState &&
                <div>
                    <div id="workListUnitTypeRoot" className='workListUnitTypeRoot'>
                        <form method="post" id="workSearchForm">
                            <div id="workListUnitType" className='workListUnitType'>
                                <div className='mini-title5'>
                                    &nbsp; N명의수학에서 원하는 문제를 찾아보세요.
                                </div>
                                <select id="impYearSelBox" className='impYearSelBox' onChange={(event)=>{initImpMonth(event)}}>
                                    <option value="0">시행연도 선택</option>
                                    {impYearOptList}
                                </select>
                                <select id="impMonthSelBox" className='impMonthSelBox'>
                                    <option value="0">전체</option>
                                    {impMonthOptList}
                                </select>
                                <button type="button" className='orangeBtn' onClick={()=>{takeIpsiContents()}}>검색</button>
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
            <div id="outerFormulaEditor" className='fixedBox popupBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState  && <FormulaEditor contentsNo={contentsNo} contentsClassify={4}/>}
            </div>
            <input id="imgUpdt" className="hide" type="text" defaultValue="N" />
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

export default IpsiWorkContentsListy;