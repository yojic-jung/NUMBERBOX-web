import React, {useState, useEffect } from 'react';
import { BrowserView, MobileView, isBrowser} from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import {Link} from "react-router-dom";
import FormulaEditor from 'web/contents/register/FormulaEditor'
import EmptyList from 'web/common/EmptyList';
import {nb_dataFetch} from 'js/common/common_nb.js';
import CustomUnitSelBox from 'web/common/CustomUnitSelBox';
import UnitSelBox from 'web/common/UnitSelBox';
import DetailedContentsWrap from 'web/common/DetailedContentsWrap';
import {nb_isLogin, nb_fCustomSelClose, nb_formDataFetch, nb_fadeInOut, nb_licenseUiCheck, nb_closeBtn, nb_detectScrollPosition, nb_moveToScroll,
    nb_modalScrollStrt, nb_modalScrollEnd, nb_multiChoiceGridSet, nb_getParameterByName, nb_topMenuFixed2} from 'js/common/common_nb.js';
import {reg_unitTypeChange, reg_eraseEditTbUI} from 'js/contents/register/contents_reg.js';
import "css/common/nbScreen.css";
import defaultProfile from 'img/defaultProfileWhite.png';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';

let fExecuteWidth = false;  //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0;            //모달 팝업시 부모창 스크롤 위치
let subjectVal;
//let firUnitVal;
let secUnitVal;
let thrUnitVal;
let currentPath = "";
const ContentsList = ()=>{
    let location = useLocation();

    const [contentsList, setContentsList] = useState(new Array());
    const [subjectBox, setSubjectBox] = useState(new Array());
    //const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
    const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
    const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
    const [contentsNo, setContentsNo] = useState("");
    const [modalState, setModalState] = useState(false);        //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼
    const [workListChanged, setWorkListChanged] = useState(true); 
    const [emptyListMsg, setEmptyListMsg] = useState("단원 정보를 선택하여 원하는 문제를 찾아보세요.");
    const [conLikeInfoList, setConLikeInfoList] = useState(new Array());
    const [conRepoInfoList, setConRepoInfoList] = useState(new Array());
    const [errContentsNo, setErrContentsNo] = useState(0);

    const removeAddedEvent = () => {
        window.removeEventListener('scroll', nb_detectScrollPosition);
        if(isBrowser) window.removeEventListener('scroll', topMenuFixed);
    }

    const topMenuFixed = () => {
        if(isBrowser) nb_topMenuFixed2("workListUnitTypeRoot")
    }

    const modalPopupOpen = async (event)  =>{
        subjectVal = document.getElementById("subject").value;
        //firUnitVal = document.getElementById("firUnit").value;
        secUnitVal = document.getElementById("secUnit").value;
        thrUnitVal = document.getElementById("thrUnit").value;
        scrollY=nb_modalScrollStrt();
        
        document.getElementById("outerFormulaEditor").classList.remove("hide")
        let contentsNo = document.getElementById(event.target.id).dataset.contentsNo;
        await setContentsNo(contentsNo);
        setModalState(true);
    }


    const modalPopupClose = async (event, isSearch) =>{
        window.removeEventListener('click', reg_eraseEditTbUI);
        await nb_closeBtn("outerFormulaEditor"); 
        await setModalState(false);

        setMyLikeInfo();
        setMyRepoInfo();
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
        await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);

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
            if(mathContents !== undefined){ //변형문제에서는 문제가 수정되는게 아니라 추가되기 때문에 수정한 컨텐츠가 없으므로 컨텐츠 가져오지 않음
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
            }else{
                window.mathContents = null;         //윈도우 전역변수 객체 초기화
            }
            
            
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
            
            //검색된 상태에서 다른 페이지 갔다가 뒤로가기로 돌아온경우
            if(param !== ""){
                historyBackSearchCondSetting(param)
            }

            if(param2 !== ""){
                searchWorkListByContentsNo(param2, false)
            }
        }
        if(!fExecuteWidth){
            asyncUseEffect();
            document.body.addEventListener('click',nb_fCustomSelClose);
        }else{
            if(contentsList.length!==0){
                nb_multiChoiceGridSet("quesConMultiShow");
                setMyLikeInfo();
                setMyRepoInfo();
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
            let returnObj = await nb_formDataFetch("/mathInfo/takeContentsList",formData, true);
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setConRepoInfoList(returnObj["mathconRepoInfo"]);
                    setConLikeInfoList(returnObj["mathConLikeInfo"]);
                    setContentsList(returnObj["mathContents"]);
                }else{
                    setConRepoInfoList(returnObj["mathconRepoInfo"]);
                    setConLikeInfoList(returnObj["mathConLikeInfo"]);
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

        
        
        const errorReportOpen = async (contentsNo) => {
            setErrContentsNo(contentsNo);
        }
    
        const errorReportClose = async (contentsNo) => {
            setErrContentsNo(0);
        }

        const modalBaseRepoChange = async (contentsno, isDel)=>{
            if(isDel){
                let list = conRepoInfoList.filter((element) => {
                    if(element.mathConRepoDomain.contentsNo !== Number(contentsno)){
                        return element;
                    }
                });
                setConRepoInfoList(list);
            }else{
                let repoObj = new Object() ;
                let mathConRepoDomain = new Object() ;
                mathConRepoDomain.contentsNo=contentsno;
                mathConRepoDomain.userUniqId=null;
                repoObj.mathConRepoDomain = mathConRepoDomain;
                let current_datetime = new Date()
                repoObj.sysCreateDate = current_datetime.getFullYear() + "" + (current_datetime.getMonth() + 1) + "" + current_datetime.getDate() + "" + current_datetime.getHours() + "" + current_datetime.getMinutes() + "" + current_datetime.getSeconds();
                conRepoInfoList.push(repoObj);
            }
            
        }

        const putInMyRepo = async (event, contentsno)=>{
            if(event.target.classList.contains("active") || event.target.classList.contains("active2")){
                event.target.classList.remove("active");
                event.target.classList.remove("active2");
                let list = conRepoInfoList.filter((element) => {
                    if(element.mathConRepoDomain.contentsNo !== Number(contentsno)){
                        return element;
                    }
                });
                setConRepoInfoList(list);
            }else{
                event.target.classList.add("active");
                let repoObj = new Object() ;
                let mathConRepoDomain = new Object() ;
                mathConRepoDomain.contentsNo=contentsno;
                mathConRepoDomain.userUniqId=null;
                repoObj.mathConRepoDomain = mathConRepoDomain;
                let current_datetime = new Date()
                repoObj.sysCreateDate = current_datetime.getFullYear() + "" + (current_datetime.getMonth() + 1) + "" + current_datetime.getDate() + "" + current_datetime.getHours() + "" + current_datetime.getMinutes() + "" + current_datetime.getSeconds();
                conRepoInfoList.push(repoObj);
            }
            nb_dataFetch('/mathInfo/putInMyRepo?contentsno='+contentsno, false);
        }

        //검색 후 저장목록 셋팅
        const setMyRepoInfo = async () => {
            let putRepoBtn = document.getElementsByClassName("putRepoBtn");
            for(let i=0; i<putRepoBtn.length; i++){
                putRepoBtn[i].classList.remove("active");
                putRepoBtn[i].classList.remove("active2");
            }

            conRepoInfoList.forEach(function(element){
                document.getElementById("contentsRepo"+element.mathConRepoDomain.contentsNo).classList.add("active2");
            });
        } 


        const modalBaseLikeChange = async (contentsno, isDel)=>{
            if(isDel){
                let list = conLikeInfoList.filter((element) => {
                    if(element.mathConLikeDomain.contentsNo !== Number(contentsno)){
                        return element;
                    }
                });
                setConLikeInfoList(list);
            }else{
                let repoObj = new Object() ;
                let mathConLikeDomain = new Object() ;
                mathConLikeDomain.contentsNo=contentsno;
                mathConLikeDomain.userUniqId=null;
                repoObj.mathConLikeDomain = mathConLikeDomain;
                conLikeInfoList.push(repoObj);
            }
            
        }


        const likeContents = async (event, contentsno)=>{
            if(event.target.classList.contains("active") || event.target.classList.contains("active2")){
                event.target.classList.remove("active");
                event.target.classList.remove("active2");
                let list = conLikeInfoList.filter((element) => {
                    if(element.mathConLikeDomain.contentsNo !== Number(contentsno)){
                        return element;
                    }
                });
                setConLikeInfoList(list);
            }else{
                event.target.classList.add("active");
                let repoObj = new Object() ;
                let mathConLikeDomain = new Object() ;
                mathConLikeDomain.contentsNo=contentsno;
                mathConLikeDomain.userUniqId=null;
                repoObj.mathConLikeDomain = mathConLikeDomain;
                conLikeInfoList.push(repoObj);
            }
            nb_dataFetch('/mathInfo/likeContents?contentsno='+contentsno, false);
        }

        //검색 후 좋아요목록 셋팅
        const setMyLikeInfo = async () => {
            let likeBtn = document.getElementsByClassName("likeBtn");
            for(let i=0; i<likeBtn.length; i++){
                likeBtn[i].classList.remove("active");
                likeBtn[i].classList.remove("active2");
            }
            
            conLikeInfoList.forEach(function(element){
                document.getElementById("contentsLike"+element.mathConLikeDomain.contentsNo).classList.add("active2");
            });
        } 
        
        const searchMyWorkList = async function(hasNotiPhrases){
            if(!nb_isLogin()) {
                if(isBrowser) alert("로그인 이후 사용해주시기 바랍니다.");
                else alert("PC에서 사용 가능한 서비스 입니다.");
                return;
            }
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
                
            let returnObj = await nb_formDataFetch("/mathInfo/takeContentsList",formData, true);
           
            let param = nb_getParameterByName("unitUniqId")
            if(param !== thrUnit[thrUnit.selectedIndex].dataset.uniqNo){
                window.history.pushState("", "문제검색", '/contentsList?unitUniqId='+thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
            }
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setConRepoInfoList(returnObj["mathconRepoInfo"]);
                    setConLikeInfoList(returnObj["mathConLikeInfo"]);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases){
                        await nb_fadeInOut("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.", 2000);
                        setEmptyListMsg("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.");
                    }  
                    else{
                        await nb_fadeInOut("해당하는 단원에 문제 내역이 없습니다.", 2000);
                        setEmptyListMsg("검색 결과가 없습니다. 해당 단원에 등록되어있는 문제가 없습니다.", 2000);
                    } 
                }else{
                    setConRepoInfoList(returnObj["mathconRepoInfo"]);
                    setConLikeInfoList(returnObj["mathConLikeInfo"]);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases)  await nb_fadeInOut("정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.", 2000);
                    else  await nb_fadeInOut("문제 내역이 정상적으로 조회되었습니다.", 2000);
                }
                
            }

        }
        

        const searchWorkListByContentsNo = async function(contentsNoParam, hasNotiPhrases){
            let returnObj = await nb_dataFetch("/mathInfo/takeContentsListByContentsNo?contentsno="+contentsNoParam, true);
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setConRepoInfoList(returnObj["mathconRepoInfo"]);
                    setConLikeInfoList(returnObj["mathConLikeInfo"]);
                    setContentsList(returnObj["mathContents"]);
                    await nb_fadeInOut("해당하는 문제가 없습니다.", 2000);
                    setEmptyListMsg("검색 결과가 없습니다. 해당 문제가 없습니다.", 2000);
                }else{
                    window.history.pushState("", "문제검색", '/contentsList?unitUniqId=0&conentsNo='+contentsNoParam);
                    setConRepoInfoList(returnObj["mathconRepoInfo"]);
                    setConLikeInfoList(returnObj["mathConLikeInfo"]);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases)  await nb_fadeInOut("정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.", 2000);
                    else  await nb_fadeInOut("문제 내역이 정상적으로 조회되었습니다.", 2000);
                }
                
            }
        }

        const showDetailConInfo = async (event, contentsNo, userNo)=>{
            if(event.target.classList.contains("errBtn")) return;
            document.getElementById("detailedContentsLike").dataset.contentsNo = contentsNo;
            if(document.getElementById("contentsLike"+contentsNo).classList.contains("active") || document.getElementById("contentsLike"+contentsNo).classList.contains("active2")){
                document.getElementById("detailedContentsLike").classList.remove('active');
                document.getElementById("detailedContentsLike").classList.add("active2");
            }else{
                document.getElementById("detailedContentsLike").classList.remove('active');
                document.getElementById("detailedContentsLike").classList.remove('active2');
            }

            document.getElementById("detailedContentsRepo").dataset.contentsNo = contentsNo;
            if(document.getElementById("contentsRepo"+contentsNo).classList.contains("active") || document.getElementById("contentsRepo"+contentsNo).classList.contains("active2")){
                document.getElementById("detailedContentsRepo").classList.remove('active');
                document.getElementById("detailedContentsRepo").classList.add("active2");
            }else{
                document.getElementById("detailedContentsRepo").classList.remove('active');
                document.getElementById("detailedContentsRepo").classList.remove('active2');
            }
            
            document.getElementById("detailedConDiv").classList.remove("hide")
            document.getElementById("likeRepoWrap").classList.remove("hide")
            let contents;
            contentsList.forEach(function(element, idx){
                if(element.contentsNo ===  Number(contentsNo)){
                    contents = element;
                    return false;
                }
            });
            document.getElementById("quesDetailedContents").innerHTML = contents.contents;

            if(contents.firNo !== ""){
                document.getElementById("workMultiDetailedShow").classList.remove("hide");
                document.getElementById("firDetailedDiv").innerHTML = contents.firNo;
                document.getElementById("secDetailedDiv").innerHTML = contents.secNo;
                document.getElementById("thrDetailedDiv").innerHTML = contents.thrNo;
                document.getElementById("fourDetailedDiv").innerHTML = contents.fourNo;
                document.getElementById("fifDetailedDiv").innerHTML = contents.fifNo;
            }else{
                document.getElementById("workMultiDetailedShow").classList.add("hide");
            }
            
            if(contents.contentsImg !== null && contents.contentsImg !== undefined){
                document.getElementById("quesDetailedImg-show").classList.remove("hide");
                document.getElementById("contentsDetailedImgOutput").src = contents.imgPath+"/"+contents.contentsImg;
            }else{
                document.getElementById("quesDetailedImg-show").classList.add("hide");
                
            }
            if(contents.solutionImg !== null && contents.solutionImg !== undefined){
                document.getElementById("solDetailedImg-show").classList.remove("hide");
                document.getElementById("solutionDetailedImgOutput").src = contents.solutionImgPath+"/"+contents.solutionImg;
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

            

            if(contents.contentsClassify === 1){
                let profileImgPath=defaultProfile;
                if(contents.membersProfile.profileImgPath !== null && contents.membersProfile.profileImgName !== null){
                    profileImgPath=contents.membersProfile.profileImgPath+contents.membersProfile.profileImgName;
                }
                document.getElementById("detailedConImg").classList.remove("hide");
                document.getElementById("detailedConImg").src = profileImgPath;
                document.getElementById("userNickname").innerHTML = contents.membersProfile.nickname;
                document.getElementById("nicknamewrap").classList.remove('manager');
                document.getElementById("nicknamewrap").dataset.userNo = userNo;
                await nb_licenseUiCheck(contents.mathContentsLicense[0]);
            }else{
                document.getElementById("detailedConImg").classList.add("hide");
                document.getElementById("userNickname").innerHTML = "N명의수학";
                document.getElementById("nicknamewrap").classList.add('manager');
                document.getElementById("nicknamewrap").dataset.userNo = 0;
                await nb_licenseUiCheck();
            }
            await nb_multiChoiceGridSet("quesDetailedConMultiShow");
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

                let updateBtnId = "updateContenstBtn"+idx;

                let conImgPath;
                if(contentsMap.contentsImg===null) conImgPath = "";
                else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;
                let profileImgPath=defaultProfile;
                if(contentsMap.membersProfile.profileImgPath !== null && contentsMap.membersProfile.profileImgName !== null){
                    profileImgPath=contentsMap.membersProfile.profileImgPath+contentsMap.membersProfile.profileImgName;
                }
                return  <div id="workContentsDiv" className="contentsDiv userSearchPage" key={idx}> 
                                <table className='workListTable userSearchPage'>
                                    <thead>
                                        <tr className='workListTBHead2'>
                                            <td>
                                                <div className='justifyAlign'>
                                                    <div>
                                                        <span className='userSearchBtn'>
                                                            <span id={"contentsRepo"+contentsMap.contentsNo} className="putRepoBtn"  onClick={(event)=>{putInMyRepo(event, contentsMap.contentsNo)}}></span>
                                                            <span className='putRepoToolTip'>나의 저장소에 저장되었습니다</span>
                                                        </span>
                                                        <span className='userSearchBtn'>
                                                            <span id={"contentsLike"+contentsMap.contentsNo} className="likeBtn" onClick={(event)=>{likeContents(event, contentsMap.contentsNo);}}></span>
                                                        </span>
                                                        {contentsMap.contentsClassify === 0 ?
                                                        <span className='userSearchBtn manager'>N명의수학</span>
                                                        :  <Link className='linkNoneCss' to={"/userProfile?userNo="+contentsMap.membersProfile.userNo}><span className='userSearchBtn'><img src={profileImgPath} alt="" className='contentsListProfile'/> {contentsMap.membersProfile.nickname}</span></Link>
                                                        }
                                                    </div>
                                                    <div className='relative'>
                                                        <button id={updateBtnId} type="button" data-contents-no={contentsMap.contentsNo} className='updateBtn' onClick={(event) => {modalPopupOpen(event)}}>
                                                            변형문제 만들기
                                                            {contentsMap.transConCnt !==0 &&
                                                                <span className='transConCntCircle hide'>{contentsMap.transConCnt}</span>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='td1 userSearchPage backHover' onClick={(event)=>{showDetailConInfo(event, contentsMap.contentsNo, contentsMap.membersProfile.userNo)}} >
                                                <div className='userSearchCon'>
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
                                                </div>
                                                <div className='errBtn topErrBtn' onClick={()=>{errorReportOpen(contentsMap.contentsNo)}} onMouseOver={(event)=>{event.target.closest(".td1").classList.remove("backHover")}} onMouseOut={(event)=>{event.target.closest(".td1").classList.add("backHover")}}></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
        });


  return ( <>
            <BrowserView>
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
                            <div className="contents-show userSearchPage" id="contents-show">{workContentsList}</div>
                            : <EmptyList msg={emptyListMsg} imgName="searchList" addImgClass="" /> 
                        }
                        <DetailedContentsWrap isBasedParent={true} modalRepoChange={modalBaseRepoChange} modalLikeChange={modalBaseLikeChange}/>

                    </div>
                </div>
            }
                   
            <div id="outerFormulaEditor" className='fixedBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState  && <FormulaEditor contentsNo={contentsNo} isUser={true} contentsClassify={2}/>}
            </div>
            <input id="imgUpdt" className="hide" type="text" defaultValue="N" />
            
            {errContentsNo !== 0 &&
            <ErrorReportForMathCon parentMethod={errorReportClose} conNo={errContentsNo} errType={1} title="문제 오류 신고"/>
            }
            </BrowserView>
            <MobileView>
            <div id ="scrollMoveBtn" className='scrollMoveBtn hide'>
                    <div id='conListScrollToTop' className='conListScrollToTop' tooltip="맨 위로" onClick={()=>{nb_moveToScroll(true);}}></div>
                    <div id="conScrollCenterCircle" className='conScrollCenterCircle'></div>
                    <div id='conListScrollToBottom' className='conListScrollToBottom' tooltip="맨 아래로" onClick={()=>{nb_moveToScroll(false);}}></div>
                </div>
            
                { !modalState &&
                <div>
                    <div id="workListUnitTypeRoot" className='workListUnitTypeRoot mobile'>
                        <form method="post" id="workSearchForm">
                            <div id="workListUnitType" className='workListUnitType mobile'>
                                <div className='mini-title5'>
                                    &nbsp; PC버전으로 접속하여 원하는 문제를 찾아보세요.
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
                    <div className='workList mobile'>
                        {workListChanged && workContentsList.length !==0 ? 
                            <div className="contents-show userSearchPage" id="contents-show">{workContentsList}</div>
                            : <EmptyList msg="" imgName="searchList" addImgClass="" /> 
                        }
                        <DetailedContentsWrap isBasedParent={true} modalRepoChange={modalBaseRepoChange} modalLikeChange={modalBaseLikeChange}/>

                    </div>
                </div>
            }
                   
            <div id="outerFormulaEditor" className='fixedBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState  && <FormulaEditor contentsNo={contentsNo} isUser={true} contentsClassify={2}/>}
            </div>
            <input id="imgUpdt" className="hide" type="text" defaultValue="N" />
            
            {errContentsNo !== 0 &&
            <ErrorReportForMathCon parentMethod={errorReportClose} conNo={errContentsNo} errType={1} title="문제 오류 신고"/>
            }
            </MobileView>
            </>

  );
}

export default ContentsList;