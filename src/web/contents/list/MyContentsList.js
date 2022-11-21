import React, {useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import FormulaEditor from 'web/contents/register/FormulaEditor'
import RegisterContentsForImg from 'web/contents/register/RegisterContentsForImg'
import "css/common/nbScreen.css";
import {nb_dataFetch, nb_formDataFileFetch, nb_fadeInOut, nb_closeBtn, nb_modalScrollEnd, nb_modalScrollStrt, nb_multiChoiceGridSet, nb_licenseUiCheck, nb_promptBox
    , nb_detectScrollPosition, nb_moveToScroll, nb_confirmBox, nb_dateFormat} from 'js/common/common_nb.js';
import {reg_eraseEditTbUI} from 'js/contents/register/contents_reg.js';
import {cvt_textNodeConvert, cvt_initWidthHeight, cvt_initOrgWidthHeight, cvt_convertHtmlToTex, cvt_makeJsonArrForHwp, cvt_combineFormul} from 'js/convertGrammer/nbToTexConvert_cvt.js';
import MyContentsSearchFilter from 'web/common/MyContentsSearchFilter';
import EmptyList from 'web/common/EmptyList';
import DetailedContentsWrap from 'web/common/DetailedContentsWrap';
import defaultProfile from 'img/defaultProfileWhite.png';
import hwpDownImg from 'img/hwpDownImg.png';
import hourglass from 'img/hourglass.gif';

let fExecuteWidth = false;  //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0;       
let subjectVal;
let firUnitVal;
let secUnitVal;
let thrUnitVal;
let isContentsListInitiated = false;    //모달 팝업이후 컨텐츠가 모두 뿌려졌는지 판단여부
const MyContentsList = ({isMine, userNo})=>{
    const [contentsList, setContentsList] = useState(new Array());
    const [contentsNo, setContentsNo] = useState("");
    const [modalState, setModalState] = useState(false);        //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼
    const [imgRegMode, setImgRegMode] = useState(false);        //이미지로 등록한 파일 여부
    const [workListChanged, setWorkListChanged] = useState(false); 
    const [emptyListMsg, setEmptyListMsg] = useState("나의 제작문제가 존재하지 않습니다. \n문제를 만들어 공유해 보세요.");
    const [contentsClassify, setContentsClassify] = useState(null);
    const [delTargetConNo, setDelTargetConNo] = useState(null);
    const [conLikeInfoList, setConLikeInfoList] = useState(new Array());
    const [conRepoInfoList, setConRepoInfoList] = useState(new Array());

    const removeAddedEvent = () => {
        window.removeEventListener('scroll', nb_detectScrollPosition);
    }
    const modalPopupOpen = async (event, isImgRegContents)  =>{
        scrollY=nb_modalScrollStrt();
        document.getElementById("outerFormulaEditor").classList.remove("hide")
        setContentsNo(document.getElementById(event.target.id).dataset.contentsNo);
        setContentsClassify(Number(document.getElementById(event.target.id).dataset.contentsClassify))
        setImgRegMode(isImgRegContents)
        setModalState(true);
    }


    const modalPopupClose = async (event, isSearch) =>{
        isContentsListInitiated = false;
        window.removeEventListener('click', reg_eraseEditTbUI);
        await nb_closeBtn("outerFormulaEditor"); 
        setModalState(false);

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
            setWorkListChanged(true);
            setWorkListChanged(false);
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
            setWorkListChanged(true);
            setWorkListChanged(false);
            document.getElementById("imgUpdt").value = "N";
        } 
        await nb_multiChoiceGridSet("quesConMultiShow");
        nb_modalScrollEnd(scrollY)
        let scrollCheck = await setInterval(()=>{
            if(isContentsListInitiated){    //컨텐츠 모두 보여지면 원래 스크롤 위치로 복귀
                let contentsDiv = document.getElementsByClassName("contentsDiv");
                for(let i=0; i<contentsDiv.length; i++){
                    if(contentsDiv[i].dataset.contentsNo === contentsNo){
                        contentsDiv[i].scrollIntoView({behavior: "auto", block: "center", inline: "center"});
                        break;
                    }
                }
                clearInterval(scrollCheck);
            }
        }, 200)
       
    }
    

    useEffect(()=>{
        const asyncUseEffect = async function(){
            
            if(isMine){
                document.getElementById("myPageProd").classList.add("active");
                document.getElementById("myPageRepo").classList.remove("active");
                document.getElementById("myMathDocs").classList.remove("active");
                document.getElementById("myResource").classList.remove("active");
                setEmptyListMsg("나의 제작문제가 존재하지 않습니다. \n문제를 만들어 공유해 보세요.");
            }else{
                setEmptyListMsg("사용자의 제작문제가 존재하지 않습니다.");
            }
            
            let returnObj;
            if(isMine){
                returnObj= await nb_dataFetch("/mathInfo/takeMyContentsList", true);
            }else{
                returnObj= await nb_dataFetch("/mathInfo/takeUserContentsList?userNo="+userNo, true);
                setConRepoInfoList(returnObj.mathconRepoInfo);
                setConLikeInfoList(returnObj.mathConLikeInfo);
            }
            setContentsList(returnObj.myContentsList);
            if(returnObj.myContentsList.length === 0){
                document.getElementById("mySubFilterTitle").classList.add("hide");
                document.getElementById("mySortFilterTitle").classList.add("hide");
                document.getElementById("filetedEmptyMsg").classList.add("hide");
            }
            fExecuteWidth=true;
        }
        if(!fExecuteWidth){
            asyncUseEffect();
        }else{
            if(contentsList.length!==0){
                nb_multiChoiceGridSet("quesConMultiShow");
                setMyLikeInfo();
                setMyRepoInfo();
            }
            fExecuteWidth = false;
        }
        window.addEventListener('scroll', nb_detectScrollPosition);
        return () => removeAddedEvent();
        }, [contentsList]);


        const putInMyRepo = async (event, contentsno)=>{
            if(event.target.classList.contains("active") || event.target.classList.contains("active2")){
                event.target.classList.remove("active");
                event.target.classList.remove("active2");
            }else{
                event.target.classList.add("active");

                //(사용자 프로필 페이지) 2초 뒤에 active를 active2로 변환, 변환하지 않으면 정렬기능 사용시에 계속 저장소에 저장됬다는 문구 계속 나타남
                setTimeout(()=>{
                    event.target.classList.remove("active");
                    event.target.classList.add("active2");
                }, 2000);
            }
            nb_dataFetch('/mathInfo/putInMyRepo?contentsno='+contentsno, false);
        }

        //검색 후 저장목록 셋팅
        const setMyRepoInfo = async () => {
            conRepoInfoList.forEach(function(element){
                document.getElementById("contentsRepo"+element.mathConRepoDomain.contentsNo).classList.add("active2");
            });
        } 


        const likeContents = async (event, contentsno)=>{
            if(event.target.classList.contains("active") || event.target.classList.contains("active2")){
                event.target.classList.remove("active");
                event.target.classList.remove("active2");
            }else{
                event.target.classList.add("active");
            }
            nb_dataFetch('/mathInfo/likeContents?contentsno='+contentsno, false);
        }

        //검색 후 좋아요 목록 셋팅
        const setMyLikeInfo = async () => {
            conLikeInfoList.forEach(function(element){
                document.getElementById("contentsLike"+element.mathConLikeDomain.contentsNo).classList.add("active2");
            });
        } 
        
        const myContentsDel = async function(contentsNo){
            let inputVal = document.getElementById("promptInput").value;
            if(inputVal !== "삭제"){
                document.getElementById("promptInput").classList.add("shake")
                setTimeout(function(){
                    document.getElementById("promptInput").classList.remove("shake")
                }, 500);
                return;
            }
            document.getElementById("promptBoxClose").click();
            let returnObj = await nb_dataFetch("/mathInfo/myContentsDel?contentsno="+Number(delTargetConNo), true);
            if(!returnObj.existMsg){
                let contentsListTmp = contentsList.filter(function(element, idx){
                    if(element.contentsNo !==  Number(contentsNo)){
                        return element;
                    }
                });
                setContentsList(contentsListTmp);
                if(contentsListTmp.length === 0){
                    document.getElementById("mySubFilterTitle").classList.add("hide");
                    document.getElementById("mySortFilterTitle").classList.add("hide");
                    document.getElementById("filetedEmptyMsg").classList.add("hide");
                }
                let contentsDiv = document.getElementsByClassName("contentsDiv");
                for(let i=0; i<contentsDiv.length; i++){
                    if(Number(contentsDiv[i].dataset.contentsNo) === contentsNo){
                        contentsDiv[i].remove();
                        break;
                    }
                }
                nb_fadeInOut("정상적으로 삭제되었습니다.", 2000);

            }
        }

        const convertHtmlToTex = async (event) => {
            let contentsNo = event.target.dataset.contentsNo;
            let returnObj = await nb_dataFetch("/myContentsCheckForHwpDown?contentsNo="+contentsNo, true);

            if(returnObj.contentsNo === -1){
                hwpDownPopUpClose();
                return;
            }

            if(contentsNo === "all"){
                convertHtmlToTexAll();
                hwpDownPopUpClose();
                return;
            }

            let contentsDiv  = document.getElementsByClassName("contentsDiv");
            let rootTb;

            for(let i=0; i<contentsDiv.length; i++){
                if(Number(contentsDiv[i].dataset.contentsNo) === returnObj.contentsNo){
                    rootTb =  contentsDiv[i].querySelector(".workListTable")
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
                let workListTable = document.getElementById("contents-show").querySelectorAll(".contentsDiv");
                let tmpNewTex = new Array();
                for(let idx=0; idx<workListTable.length;idx++){
                    let isTransContents = false;
                    contentsList.forEach(element => {
                        if(element.contentsClassify !== 1 && Number(workListTable[idx].dataset.contentsNo) === element.contentsNo) {
                            isTransContents = true;
                        }
                    });

                    if(isTransContents) continue;

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

        const showOrgContents = async function(orgContentsNo){
            let returnObj= await nb_dataFetch("/mathInfo/takeContentsByContentsNo?contentsno="+orgContentsNo, true);
            
            document.getElementById("detailedConDiv").classList.remove("hide")

            let contents = returnObj.myContents;

            if(contents.contentsClassify === 1){
                let profileImgPath=defaultProfile;
                if(contents.membersProfile.profileImgPath !== null && contents.membersProfile.profileImgName !== null){
                    profileImgPath=contents.membersProfile.profileImgPath+contents.membersProfile.profileImgName;
                }
                document.getElementById("detailedConImg").classList.remove("hide");
                document.getElementById("detailedConImg").src = profileImgPath;
                document.getElementById("userNickname").innerHTML = contents.membersProfile.nickname;
                document.getElementById("nicknamewrap").classList.remove('manager');
                document.getElementById("nicknamewrap").dataset.userNo = contents.membersProfile.userNo;
                await nb_licenseUiCheck(contents.mathContentsLicense[0]);
            }else{
                document.getElementById("detailedConImg").classList.add("hide");
                document.getElementById("userNickname").innerHTML = "N명의수학";
                document.getElementById("nicknamewrap").classList.add('manager');
                document.getElementById("nicknamewrap").dataset.userNo = 0;
                await nb_licenseUiCheck();
            }
            

            if(contents.contentsClassify === 3){
                document.getElementById("workContentsDetailedDiv").classList.add("hide");
                document.getElementById("workContentsDetailedDiv2").classList.remove("hide");
                document.getElementById("detailedLicenseTable2").classList.add("hide");
                return;
            }else{
                document.getElementById("workContentsDetailedDiv").classList.remove("hide");
                document.getElementById("workContentsDetailedDiv2").classList.add("hide");
                document.getElementById("detailedLicenseTable2").classList.remove("hide");
            }
            
            document.getElementById("detailedContentsLike").dataset.contentsNo = contents.contentsNo;
            document.getElementById("detailedContentsRepo").dataset.contentsNo = contents.contentsNo;

            let mathConLikeInfo = returnObj.mathConLikeInfo;
            let mathconRepoInfo = returnObj.mathconRepoInfo;
            if(mathConLikeInfo.length !== 0){
                document.getElementById("detailedContentsLike").classList.remove("active");
                document.getElementById("detailedContentsLike").classList.add("active2");
            }else{
                document.getElementById("detailedContentsLike").classList.remove("active");
                document.getElementById("detailedContentsLike").classList.remove("active2");
            }
            if(mathconRepoInfo.length !== 0){
                document.getElementById("detailedContentsRepo").classList.remove("active");
                document.getElementById("detailedContentsRepo").classList.add("active2");
            }else{
                document.getElementById("detailedContentsRepo").classList.remove("active");
                document.getElementById("detailedContentsRepo").classList.remove("active2");
            }

            document.getElementById("quesDetailedContents").innerHTML = contents.contents;

            if(contents.firNo !== ""){
                document.getElementById("workMultiDetailedShow").classList.remove("hide");
                document.getElementById("firDetailedDiv").innerHTML = contents.firNo;
                document.getElementById("secDetailedDiv").innerHTML = contents.secNo;
                document.getElementById("thrDetailedDiv").innerHTML = contents.thrNo;
                document.getElementById("fourDetailedDiv").innerHTML = contents.fourNo;
                document.getElementById("fifDetailedDiv").innerHTML = contents.fifNo;
                await nb_multiChoiceGridSet("quesDetailedConMultiShow");
            }else{
                document.getElementById("workMultiDetailedShow").classList.add("hide");
            }
            
            if(contents.contentsImg !== null && contents.contentsImg !== undefined){
                document.getElementById("quesDetailedImg-show").classList.remove("hide");
                document.getElementById("contentsDetailedImgOutput").src = process.env.REACT_APP_SERVER_STATIC_HOST+contents.imgPath+contents.contentsImg;
            }else{
                document.getElementById("quesDetailedImg-show").classList.add("hide");
                
            }
            if(contents.solutionImg !== null && contents.solutionImg !== undefined){
                document.getElementById("solDetailedImg-show").classList.remove("hide");
                document.getElementById("solutionDetailedImgOutput").src = process.env.REACT_APP_SERVER_STATIC_HOST+contents.solutionImgPath+contents.solutionImg;
            }else{
                document.getElementById("solDetailedImg-show").classList.add("hide");
            }

            document.getElementById("solDetailedContents").innerHTML = contents.solution;

            if(contents.answer !== null && contents.answer !== undefined){
                document.getElementById("answerDetailedSheet").innerHTML = contents.answer;
            }
            if(contents.choiceAnswer !== null && contents.choiceAnswer !== undefined){
                document.getElementById("answerDetailedSheet").innerHTML = contents.choiceAnswer;
            }

        }


        

        const workContentsList = contentsList.map( (contentsMap, idx) => {
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

                let isBlank="";
                if(contentsMap.choiceAnswer===null)isBlank="hide";

                let updateBtnId = "updateContenstBtn"+idx;

                let conImgPath;
                if(contentsMap.contentsImg===null) conImgPath = "";
                else conImgPath = process.env.REACT_APP_SERVER_STATIC_HOST+contentsMap.imgPath+contentsMap.contentsImg;
                let solImgPath;
                if(contentsMap.solutionImg===null) solImgPath = "";
                else solImgPath = process.env.REACT_APP_SERVER_STATIC_HOST+contentsMap.solutionImgPath+contentsMap.solutionImg;
               
                let sysCreateDate = contentsMap.sysCreateDate;
                let sysDateStr = "";
                for(let i=0; i<sysCreateDate.length; i++){
                    sysDateStr += sysCreateDate[i];
                }

                let hasLicense = false;
                let shareDesc = "공개";
                if(contentsMap.contentsClassify ===1 && contentsMap.mathContentsLicense[0] !== undefined){
                    hasLicense=true;
                    if(contentsMap.mathContentsLicense[0].shareStts === 0){
                        shareDesc ="비공개"
                    }
                }

                let isNoSelect="";
                if(contentsMap.contentsClassify === 2){
                    isNoSelect=" transContents"
                }

                //이미지로 등록한 문제 여부
                let isImgRegContents = false;
                if(contentsMap.contentsImg !==null && contentsMap.imgPath !==null) {
                    isImgRegContents = true;
                }

                //컨텐츠가 모두 뿌려진 이후 모달팝업클로즈 이벤트에서 수정한 위치로 스크롤 찾아감
                if(contentsList.length-1 === idx) isContentsListInitiated = true;

                return  <div id="workContentsDiv" className="contentsDiv contentsDivForFilter" key={idx}  data-contents-no={contentsMap.contentsNo} data-subject={contentsMap.mathUnitInfo.subject} data-sys-create-date={sysDateStr}> 
                                <table className='workListTable'>
                                    <thead>
                                        <tr className='workListTBHead2'>
                                            <td>
                                                <div>
                                                    {!isMine && 
                                                    <>
                                                        <span className='userSearchBtn'>
                                                            <span id={"contentsRepo"+contentsMap.contentsNo} className="putRepoBtn"  onClick={(event)=>{putInMyRepo(event, contentsMap.contentsNo)}}></span>
                                                            <span className='putRepoToolTip'>나의 저장소에 저장되었습니다</span>
                                                        </span>
                                                        <span className='userSearchBtn'>
                                                            <span id={"contentsLike"+contentsMap.contentsNo} className="likeBtn" onClick={(event)=>{likeContents(event, contentsMap.contentsNo);}}></span>
                                                        </span>
                                                    </>
                                                    }
                                                    {isMine && !isImgRegContents && contentsMap.contentsClassify ===1 && 
                                                        <span className='hwpDownImgWrap' onClick={(event)=>{nb_confirmBox("해당 문제를 한글파일로 다운받으시겠습니까?\n(일일 3회 제한)"); document.getElementById("confirmBoxBtn").dataset.contentsNo = event.target.closest(".contentsDiv").dataset.contentsNo}}>
                                                            <img className="hwpDownImg" src={hwpDownImg} alt=""/>
                                                            <div className="hwpDownDesc">한글 파일로 다운 받기</div>
                                                        </span>
                                                    }
                                                    [{contentsMap.mathUnitInfo.subject}] {contentsMap.mathUnitInfo.secUnit}
                                                    {isMine &&
                                                        <>
                                                            {hasLicense  &&
                                                            <span className='miniCircle'>{shareDesc}</span>
                                                            }
                                                        </>
                                                    }
                                                    
                                                    {contentsMap.contentsClassify ===2 &&
                                                    <>
                                                        <span className='miniCircle'>변형문제</span>
                                                        <span className="miniBtn" onClick={()=>showOrgContents(Number(contentsMap.orgContentsNo))}>원본문제 보기</span>
                                                    </>
                                                    }
                                                </div>
                                            </td>
                                            <td className=''>
                                                <div className='bi-jutify-align'>
                                                    <div>정답 및 해설</div>
                                                    <div>
                                                        {isMine && !isImgRegContents &&
                                                        <>
                                                            <button id={updateBtnId} type="button" data-contents-no={contentsMap.contentsNo} data-contents-classify={contentsMap.contentsClassify} className='updateBtn' onClick={(event) => {modalPopupOpen(event, false)}}>수정하기</button>
                                                            <span className='hide'>유형 : {contentsMap.mathTypeInfo.quesType}</span>
                                                        </>
                                                        }
                                                        {isMine && isImgRegContents &&
                                                        <>
                                                            <button id={updateBtnId} type="button" data-contents-no={contentsMap.contentsNo} data-contents-classify={contentsMap.contentsClassify} className='updateBtn' onClick={(event) => {modalPopupOpen(event, true)}}>수정하기</button>
                                                            <span className='hide'>유형 : {contentsMap.mathTypeInfo.quesType}</span>
                                                        </>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className={'td1'+isNoSelect}>
                                                <div id="workQuesShow" className='workQuesShow quesRootDiv'>
                                                    <div className='quesDiv'>
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
                                            <td  className={'td2'+isNoSelect}>
                                                <div className='solRootDiv'>
                                                    <div className='ansSolDiv'>
                                                    
                                                        <div id="workAnsShow" className='ansShow'>
                                                            <div>
                                                                
                                                                <div className='ansContents'>
                                                                    <span className='ansDesc mini-title6'>답 &nbsp;&nbsp;</span>
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
                                                {isMine && 
                                                    <span className='delBtn' onClick={()=>{ setDelTargetConNo(contentsMap.contentsNo); nb_promptBox("삭제를 진행하시려면 '삭제' 라고 입력해주세요. \n(따옴표 없이 입력해주시기 바랍니다.)", "삭제 라고 입력해주세요.")}}></span>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
        });

        const hwpDownPopUpClose = async () => {
            document.getElementById("confirmBoxScreen").classList.add("hide");
        }

  return ( <>
  {isMine ? <Helmet>
                <title>나의 제작문제</title>
                <meta name="description" content="나의 제작문제를 확인해 보세요!"/>
                <link rel="canonical" href="https://nsoohak.com/myContentsList" />
                <meta property="og:title" content="나의 제작문제" />
                <meta property="og:description" content="나의 제작문제를 확인해 보세요!" />
            </Helmet>
            :
            <Helmet>
                <title>사용자 피드</title>
                <meta name="description" content="사용자 피드를 확인해보세요!"/>
                <meta property="og:title" content="사용자 피드" />
                <meta property="og:description" content="사용자 피드를 확인해보세요!" />
            </Helmet>}
            
            <div id ="scrollMoveBtn" className='scrollMoveBtn hide'>
                <div id='conListScrollToTop' className='conListScrollToTop' tooltip="맨 위로" onClick={()=>{nb_moveToScroll(true);}}></div>
                <div id="conScrollCenterCircle" className='conScrollCenterCircle'></div>
                <div id='conListScrollToBottom' className='conListScrollToBottom' tooltip="맨 아래로" onClick={()=>{nb_moveToScroll(false);}}></div>
            </div>
            {isMine ? 
            <MyContentsSearchFilter makeContentsShow={true} descMsg="" />
            : <MyContentsSearchFilter makeContentsShow={false} descMsg="" />
            }
                { !modalState &&
                <div>
                    <div className='workList myContentsList'>
                        <div className='contentsDiv'>
                            <span className='hwpAllDownBtn' onClick={(event)=>{nb_confirmBox("나의 제작문제를 한글파일로 다운받으시겠습니까?\n사용자의 제작문제가 아닌 변형문제는 다운되지 않습니다.\n(일일 3회 제한)"); document.getElementById("confirmBoxBtn").dataset.contentsNo = "all"}}>나의 제작문제 일괄 다운</span>
                        </div>
                        <div className="contents-show filterContents" id="contents-show">
                        {workContentsList.length !== 0 ? 
                        <>
                            {workContentsList}
                        </>
                        : <EmptyList msg={emptyListMsg} imgName="myContentEmpty"  addImgClass="miniSize" /> }
                        </div>
                        <DetailedContentsWrap isBasedParent={false} modalRepoChange={()=>{}} modalLikeChange={()=>{}} />
                    </div>
                </div>
            }

            <div id="outerFormulaEditor" className='fixedBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState && ( imgRegMode ?
                    <RegisterContentsForImg contentsNo={contentsNo} /> :
                    <FormulaEditor contentsNo={contentsNo} contentsClassify={contentsClassify}/>
                    )}
            </div>
            <input id="imgUpdt" className="hide" type="text" defaultValue="N" />

            <div id="promptBoxScreen" className='promptBoxScreen hide'>
                <div id="promptBox" className='promptBox'>
                    <div className='promptBoxTop'><span id="promptBoxClose" className="promptBoxClose" onClick={()=>{document.getElementById("promptBoxScreen").classList.add('hide'); document.getElementById("promptInput").value="";}}>X</span></div>
                    <div id="promptMsg" className="promptMsg"></div>
                    <div className='promptInputDiv'>
                        <input id="promptInput" className='promptInput' type="text" onKeyDown={(event)=>{if(event.keyCode===13){myContentsDel()} }}/>
                    </div>
                    <div className='alignCenter'>
                        <span id="promptBoxBtn" className='promptBoxBtn' onClick={()=>{myContentsDel()}}>확인</span>
                    </div>
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

export default MyContentsList;