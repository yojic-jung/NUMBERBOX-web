import React, {useState, useEffect } from 'react';
import { Outlet } from "react-router";
import "css/page/mathDocs.css";
import {nb_dataFetch, nb_moveToScrollAllRange, nb_multiChoiceGridSet, nb_fadeInOutA} from 'js/common/common_nb.js';
import CustomPieChart from "web/common/CustomPieChart";
import CustomBarChart from "web/common/CustomBarChart";
import { ReactSortable } from "react-sortablejs";
import MyContentsSearchFilter from 'web/common/MyContentsSearchFilter';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';

const MathDocsMaker = ()=>{

    const [subjectList, setSubjectList] = useState(new Array());
    const [showChart, setShowChart] = useState(false);
    const [conArrByLvOnBar, setConArrByLvOnBar] = useState(new Array());
    const [conArrByMultiOnPie, setConArrByMultiOnPie] = useState(new Array());
    const [conTotalCnt, setConTotalCnt] = useState(0);
    const [mathContentsList, setMathContentsList] = useState(new Array());
    const [myProdContents, setMyProdContents] = useState(new Array());
    const [isSearchedMyCon, setIsSearchedMyCon] = useState(false);
    const [myRepoContents, setMyRepoContents] = useState(new Array());
    const [isSearchedMyRepo, setIsSearchedMyRepo] = useState(false);
    const [similarContents, setSimilarContents] = useState(new Array());
    const [errContentsNo, setErrContentsNo] = useState(0);

    useEffect(() => {
            const asyncUseEffect = async function(){
                let jsonObj = await nb_dataFetch('/mathInfo/unitInfo', true);
                setSubjectList(jsonObj["mathSubjectInfo"])
                unitListSetFunction(jsonObj["mathSubjectInfo"], jsonObj["mathSecUnitInfo"], jsonObj["mathThrUnitInfo"]);
            }
            asyncUseEffect();
    },[]);

    const pagePerConCnt = (event) => {
        let conCntSelTd = document.getElementsByClassName("pagePerConCnt");
        for(let i=0; i<conCntSelTd.length; i++){
            conCntSelTd[i].classList.remove("active");
        }
        event.target.classList.add("active");
        document.getElementById("pagePerConCntInp").value = event.target.innerHTML;
    }

    const conCntSelect = (event) => {
        let conCntSelTd = document.getElementsByClassName("conCntSelTd");
        for(let i=0; i<conCntSelTd.length; i++){
            conCntSelTd[i].classList.remove("active");
        }
        event.target.classList.add("active");
        document.getElementById("conCntInput").value = event.target.innerHTML;
    }

    const levelSelect = (event) => {
        let levelSelTd = document.getElementsByClassName("levelSelTd");
        for(let i=0; i<levelSelTd.length; i++){
            levelSelTd[i].classList.remove("active");
        }
        event.currentTarget.classList.add("active");
        event.currentTarget.querySelector("label").click();
    }

    const firstStepCheck = async () => {
        if(document.getElementsByClassName("typeBtn active").length === 0){
            alert("단원 또는 유형을 선택해 주세요.");
            return;
        }

        if(document.getElementsByClassName("typeBtn active").length > 300){
            alert("선택할 수 있는 세부 유형은 최대 300개 입니다."
            +"\n현재 선택한 유형 개수는 "+document.getElementsByClassName("typeBtn active").length+"개 입니다."
            +"\n단원 또는 유형을 체크 해제하여 선택하신 유형을 줄여주세요.");
            return;
        }

        let typeBtn = document.getElementsByClassName("typeBtn")
        let unitUniqNoAndTypeNo = "";
        for(let i=0; i< typeBtn.length; i++){
            if(!typeBtn[i].classList.contains("active")) continue;
            if(unitUniqNoAndTypeNo === ""){
                unitUniqNoAndTypeNo += typeBtn[i].dataset.unitUniqNo+","+typeBtn[i].dataset.typeNo;
            }else{
                unitUniqNoAndTypeNo += "-"+typeBtn[i].dataset.unitUniqNo+","+typeBtn[i].dataset.typeNo;
            }
        }

        

        let isLevelChecked = false;
        let level = document.getElementsByName("level");
        let quesLevel;
        for(let i=0; i<level.length; i++){
            if(level[i].checked){
                quesLevel=level[i].value;
                isLevelChecked = true;
                break;
            }
        }

        if(!isLevelChecked){
            alert("난이도를 선택해 주세요.");
            return;
        }

        let conCntInput = document.getElementById("conCntInput").value;
        let check = /^[0-9]+$/; 
        if (!check.test(conCntInput)) {    
            alert("문항 수를 1 이상 100 이하의 숫자로 적어주세요.");
            return;
        }

        if (conCntInput<1 || conCntInput>100) {    
            alert("문항 수는 1문항 이상 100문항 이하로 입력해주시기 바랍니다.");
            return;
        }

        let jsonObj = await nb_dataFetch('/mathDocs/mathDocs?unitUniqNoAndTypeNoList='+unitUniqNoAndTypeNo+"&quesLevel="+quesLevel+"&conCnt="+conCntInput, true);
        let mathContentsList = jsonObj["mathContentsList"];
        let lv1Len=0;
        let lv2Len=0;
        let lv3Len=0;
        let lv4Len=0;
        let lv5Len=0;

        let multiConCnt = 0;
        let essayConCnt = 0;
        for(let i=0; i<mathContentsList.length; i++){
            if(mathContentsList[i].multiChoiceType==="M"){
                multiConCnt +=1;
            }else{
                essayConCnt +=1;
            }
            if(mathContentsList[i].quesLevel === 1){
                lv1Len +=1;
            }else if(mathContentsList[i].quesLevel === 2){
                lv2Len +=1;
            }else if(mathContentsList[i].quesLevel === 3){
                lv3Len +=1;
            }else if(mathContentsList[i].quesLevel === 4){
                lv4Len +=1;
            }else if(mathContentsList[i].quesLevel === 5){
                lv5Len +=1;
            }
        }
      
        setShowChart(false);
        setConTotalCnt(mathContentsList.length);
        setMathContentsList(mathContentsList);
        let barArr = [{"labelName":"하", "value": lv1Len , "backgroundColor":"rgb(13, 53, 149, 0.2)"},
        {"labelName":"중하", "value": lv2Len , "backgroundColor":"rgb(13, 53, 149, 0.4)"},
        {"labelName":"중", "value": lv3Len , "backgroundColor":"rgb(13, 53, 149, 0.7)"},
        {"labelName":"중상", "value": lv4Len , "backgroundColor":"rgb(13, 53, 149)"},
        {"labelName":"상", "value": lv5Len , "backgroundColor":"rgb(7, 39, 113)"}];
        setConArrByLvOnBar(barArr);
        let pieArr = [
            {"labelName":"객관식", "value":multiConCnt ,"className":"multiChoicePieLabel", "backgroundColor":"rgb(13, 53, 149, 0.2)"},
            {"labelName":"주관식", "value":essayConCnt ,"className":"essayPieLabel", "backgroundColor":"rgb(13, 53, 149, 0.7)"}]
        setConArrByMultiOnPie(pieArr);
        setShowChart(true);
        document.getElementById("mathDocsDesc").innerHTML = "문제를 교체하거나 추가하여 학습지를 완성해 보세요.";
        document.getElementById("mathDocsFirstStep").classList.add("hide");
        await nb_multiChoiceGridSet("quesConMultiShow");
        window.scrollTo(0, 0);
        setIsSearchedMyCon(false);
        setIsSearchedMyRepo(false);
    }

    const gotoPreviousStep = () =>{
        document.getElementById("mathDocsDesc").innerHTML = "원하는 단원을 선택하여 학습지를 만들어보세요.<br/>(학습지 생생 문제는 넘버링크 제작 문제만 포함됩니다.)";
        setShowChart(false);
        document.getElementById("mathDocsFirstStep").classList.remove("hide");
        window.scrollTo(0, 0);
    }

    const twoStepCheck = () =>{
        document.getElementById("mathDocsThrStep").classList.remove("hide");
        document.getElementById("docsTitle").value = document.getElementsByClassName("subjectBtn active")[0].innerHTML;
    }

    const unitSelct = async (event) => {
        let subjectBtnWrap = document.getElementsByClassName("subjectBtnWrap");
        for(let i=0; i<subjectBtnWrap.length; i++){
            if(!event.target.classList.contains("active")){
                if(event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo){
                    subjectBtnWrap[i].classList.remove("hide");
                    if(event.target.dataset.typeExist === "false"){
                        let unitUniqNoList = "";
                        let thrUnitBtn = subjectBtnWrap[i].querySelectorAll(".thrUnitBtn");
                        for(let j=0; j<thrUnitBtn.length; j++){
                            if(j === 0){
                                unitUniqNoList += thrUnitBtn[j].dataset.unitUniqNo;
                            }else{
                                unitUniqNoList += ","+thrUnitBtn[j].dataset.unitUniqNo;
                            }
                        }
                        let jsonObj = await nb_dataFetch('/mathInfo/typeInfoList?unitUniqNoList='+unitUniqNoList, true);
                        let thrUnitBtnWrap = subjectBtnWrap[i].querySelectorAll(".thrUnitBtnWrap");
                        let mathTypeInfoList = jsonObj["mathTypeInfoList"];
                        for(let j=0; j<thrUnitBtnWrap.length; j++){
                            for(let k=0; k<mathTypeInfoList.length; k++){
                                if(thrUnitBtnWrap[j].querySelector(".thrUnitBtn ").dataset.unitUniqNo === mathTypeInfoList[k].mathTypeDomain.unitUniqNo){
                                    let tmpDiv = document.createElement("div");
                                    tmpDiv.className="typeBtnWrap hide"
                                    let tmpSpan = document.createElement("span");
                                    tmpSpan.innerHTML = mathTypeInfoList[k].quesType;
                                    tmpSpan.className="typeBtn"
                                    tmpSpan.dataset.unitUniqNo = mathTypeInfoList[k].mathTypeDomain.unitUniqNo;
                                    tmpSpan.dataset.typeNo = mathTypeInfoList[k].mathTypeDomain.typeNo;
                                    tmpSpan.addEventListener("click", typeClickFunction);
                                    tmpDiv.append(tmpSpan);
                                    thrUnitBtnWrap[j].append(tmpDiv);
                                }
                            }
                           
                        }
                        event.target.dataset.typeExist = "true";
                    }
                }
            }else{
                if(event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo){
                    subjectBtnWrap[i].classList.add("hide");
                    let activeBtn = subjectBtnWrap[i].querySelectorAll(".active");
                    for(let i=0; i<activeBtn.length; i++){
                        if(!(activeBtn[i].classList.contains("subjectFoldBtn") || activeBtn[i].classList.contains("secUnitFoldBtn")
                        || activeBtn[i].classList.contains("thrUnitFoldBtn"))){
                            activeBtn[i].classList.remove("active")
                        }
                    }
                }
                
            }
           
        }
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
        }else{
            event.target.classList.add("active");
        }
    }

    const subjectClickFunction = (event) => {
        let secUnitBtn = event.target.parentElement.querySelectorAll(".secUnitBtn");
        let thrUnitBtn = event.target.parentElement.querySelectorAll(".thrUnitBtn");
        let typeBtn = event.target.parentElement.querySelectorAll(".typeBtn");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.remove("active");
            }
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.remove("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.remove("active");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.add("active");
            }
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.add("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.add("active");
            }
        }
    }

    const subjectClickFoldFunction = (event) => {
        let secUnitBtn = event.target.parentElement.querySelectorAll(".secUnitBtnWrap");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.add("hide");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<secUnitBtn.length; i++){
                secUnitBtn[i].classList.remove("hide");
            }
        }
    }


    const secUnitClickFunction = (event) => {
        let thrUnitBtn = event.target.parentElement.querySelectorAll(".thrUnitBtn");
        let typeBtn = event.target.parentElement.querySelectorAll(".typeBtn");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.remove("active");
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.remove("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.remove("active");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<thrUnitBtn.length; i++){
                thrUnitBtn[i].classList.add("active");
            }
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.add("active");
            }

            let isSecAllChecked = true;
            let secUnitBtn = event.target.closest(".subjectBtnWrap").querySelectorAll(".secUnitBtn")
            for(let i=0; i<secUnitBtn.length; i++){
                if(!secUnitBtn[i].classList.contains("active")){
                    isSecAllChecked = false;
                    break;
                }
            }

            if(isSecAllChecked){
                event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.add("active");
            }
        }

        
    }

    const secUnitFoldClickFunction = (event)=>{
        let thrUnitBtnWrap = event.target.parentElement.querySelectorAll(".thrUnitBtnWrap");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<thrUnitBtnWrap.length; i++){
                thrUnitBtnWrap[i].classList.add("hide");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<thrUnitBtnWrap.length; i++){
                thrUnitBtnWrap[i].classList.remove("hide");
            }
            
        }
    }

    

    const thrUnitClickFunction = (event) => {
        let typeBtn = event.target.parentElement.querySelectorAll(".typeBtn");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.remove("active");
            event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.remove("active");
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.remove("active");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<typeBtn.length; i++){
                typeBtn[i].classList.add("active");
            }

            //중단원이 전부 체크 되어있으면 대단원 체크해주기
            let isThrAllChecked = true;
            let thrUnitBtn = event.target.closest(".secUnitBtnWrap").querySelectorAll(".thrUnitBtn");
            for(let i=0; i<thrUnitBtn.length; i++){
                if(!thrUnitBtn[i].classList.contains("active")){
                    isThrAllChecked = false;
                    break;
                }
            }

            if(isThrAllChecked){
                event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.add("active");
            }
           
            let isSecAllChecked = true;
            let secUnitBtn = event.target.closest(".subjectBtnWrap").querySelectorAll(".secUnitBtn")
            for(let i=0; i<secUnitBtn.length; i++){
                if(!secUnitBtn[i].classList.contains("active")){
                    isSecAllChecked = false;
                    break;
                }
            }

            if(isSecAllChecked){
                event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.add("active");
            }
        }
    }

    const thrUnitFoldClickFunction = (event)=>{
        let typeBtnWrap = event.target.parentElement.querySelectorAll(".typeBtnWrap");
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            for(let i=0; i<typeBtnWrap.length; i++){
                typeBtnWrap[i].classList.add("hide");
            }
        }else{
            event.target.classList.add("active");
            for(let i=0; i<typeBtnWrap.length; i++){
                typeBtnWrap[i].classList.remove("hide");
            }
            
        }
    }

    const typeClickFunction = (event) => {
        if(event.target.classList.contains("active")){
            event.target.classList.remove("active");
            event.target.closest(".thrUnitBtnWrap").querySelector(".thrUnitBtn").classList.remove("active");
            event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.remove("active");
            event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.remove("active");
        }else{
            event.target.classList.add("active");

            //유형이 전부 체크 되어있으면 중단원 체크해주기
            let isTypeAllChecked = true;
            let typeBtn = event.target.closest(".thrUnitBtnWrap").querySelectorAll(".typeBtn");
            for(let i=0; i<typeBtn.length; i++){
                if(!typeBtn[i].classList.contains("active")){
                    isTypeAllChecked = false;
                    break;
                }
            }

            if(isTypeAllChecked){
                event.target.closest(".thrUnitBtnWrap").querySelector(".thrUnitBtn").classList.add("active");
            }

            //중단원이 전부 체크 되어있으면 대단원 체크해주기
            let isThrAllChecked = true;
            let thrUnitBtn = event.target.closest(".secUnitBtnWrap").querySelectorAll(".thrUnitBtn");
            for(let i=0; i<thrUnitBtn.length; i++){
                if(!thrUnitBtn[i].classList.contains("active")){
                    isThrAllChecked = false;
                    break;
                }
            }

            if(isThrAllChecked){
                event.target.closest(".secUnitBtnWrap").querySelector(".secUnitBtn").classList.add("active");
            }
           
            let isSecAllChecked = true;
            let secUnitBtn = event.target.closest(".subjectBtnWrap").querySelectorAll(".secUnitBtn")
            for(let i=0; i<secUnitBtn.length; i++){
                if(!secUnitBtn[i].classList.contains("active")){
                    isSecAllChecked = false;
                    break;
                }
            }

            if(isSecAllChecked){
                event.target.closest(".subjectBtnWrap").querySelector(".subjectBtn").classList.add("active");
            }
        }
    }

    const unitListSetFunction = (subjectList, secUnitList, thrUnitList) => {
        for(let i=0; i<subjectList.length; i++){
            let tmpDiv = document.createElement("div");
            tmpDiv.className="subjectBtnWrap hide"
            tmpDiv.dataset.subjectInfo = subjectList[i].mainVal;
            let tmpSpanFoldBtn = document.createElement("span");
            tmpSpanFoldBtn.innerHTML = "&#10095;";
            tmpSpanFoldBtn.className="subjectFoldBtn active"
            tmpSpanFoldBtn.addEventListener("click", subjectClickFoldFunction);
            tmpDiv.append(tmpSpanFoldBtn);
            let tmpSpan = document.createElement("span");
            tmpSpan.innerHTML = subjectList[i].mainVal;
            tmpSpan.className="subjectBtn"
            tmpSpan.addEventListener("click", subjectClickFunction);
            tmpDiv.append(tmpSpan);
            document.getElementsByClassName("mathDocsSubjectListDiv")[0].append(tmpDiv);
        }

        let subjectBtnList = document.getElementsByClassName("subjectBtnWrap");
        for(let i=0; i<subjectBtnList.length; i++){
            for(let j=0; j< secUnitList.length; j++){
                if(subjectBtnList[i].dataset.subjectInfo === secUnitList[j].parentVal){
                    let tmpDiv = document.createElement("div");
                    tmpDiv.dataset.secUnitInfo = secUnitList[j].mainVal;
                    tmpDiv.className="secUnitBtnWrap"
                    let tmpSpanFoldBtn = document.createElement("span");
                    tmpSpanFoldBtn.innerHTML = "&#10095;";
                    tmpSpanFoldBtn.className="secUnitFoldBtn"
                    tmpSpanFoldBtn.addEventListener('click', secUnitFoldClickFunction);
                    tmpDiv.append(tmpSpanFoldBtn);
                    let tmpSpan = document.createElement("span");
                    tmpSpan.innerHTML = secUnitList[j].mainVal;
                    tmpSpan.className="secUnitBtn"
                    tmpSpan.addEventListener("click", secUnitClickFunction);
                    tmpDiv.append(tmpSpan);
                    subjectBtnList[i].append(tmpDiv);
                }
            }
        }

        let secUnitBtnList = document.getElementsByClassName("secUnitBtnWrap");
        for(let i=0; i<secUnitBtnList.length; i++){
            for(let j=0; j< thrUnitList.length; j++){
                if(secUnitBtnList[i].dataset.secUnitInfo === thrUnitList[j].parentVal){
                    let tmpDiv = document.createElement("div");
                    tmpDiv.dataset.thrUnitInfo = thrUnitList[j].mainVal;
                    tmpDiv.className="thrUnitBtnWrap hide"
                    let tmpSpanFoldBtn = document.createElement("span");
                    tmpSpanFoldBtn.innerHTML = "&#10095;";
                    tmpSpanFoldBtn.className="thrUnitFoldBtn"
                    tmpSpanFoldBtn.addEventListener("click", thrUnitFoldClickFunction);
                    tmpDiv.append(tmpSpanFoldBtn);
                    let tmpSpan = document.createElement("span");
                    tmpSpan.innerHTML = thrUnitList[j].mainVal;
                    tmpSpan.className="thrUnitBtn";
                    tmpSpan.dataset.unitUniqNo= thrUnitList[j].unitUniqNo;
                    tmpSpan.addEventListener("click", thrUnitClickFunction);
                    tmpDiv.append(tmpSpan);
                    secUnitBtnList[i].append(tmpDiv);
                }
            }
        }
    }

    const conCntKeyUp = (event) => {
        let conCntSelTd = document.getElementsByClassName("conCntSelTd");
        for(let i=0; i<conCntSelTd.length; i++){
            if(conCntSelTd[i].innerHTML === event.target.value){
                conCntSelTd[i].classList.add("active");
            }else{
                conCntSelTd[i].classList.remove("active");
            }
        }
    }

    const moveToContents = (event) => {
        let contentsDiv  = document.getElementsByClassName("contentsDiv");
        for(let i=0; i<contentsDiv.length; i++){
            if(contentsDiv[i].dataset.contentsNo === event.target.dataset.contentsNo){
                contentsDiv[i].scrollIntoView({
                    behavior: 'smooth'
                  });
            }
        }
    }

    const takeMyRepoContents = async () => {
        document.getElementById("mathDocsInfoTitle").innerHTML = "나의 저장소 문제";
        document.getElementById("mathDocsMyProd").classList.add("hide");
        document.getElementById("mathDocsConAdd").classList.remove("hide");
        document.getElementById("mathDocsMyRepo").classList.remove("hide");
        document.getElementById("mathDocsMyRepo").scrollTo(0,0)
        if(isSearchedMyRepo) {
            document.getElementById("subjectFilterList").childNodes[0].click();
            document.getElementById("productFilterList").childNodes[0].click();
            return;
        }
        let returnObj= await nb_dataFetch("/mathInfo/takeMyRepo", true);

        let contentsNodeList =  returnObj.mathContents.filter((contentsMap, idx) => {
            let isSame = true;
            for(let i=0; i<mathContentsList.length; i++){
                if(contentsMap.contentsNo === mathContentsList[i].contentsNo) isSame = false;
            }
            return isSame;
        });
        
        let contentsArray = [].slice.call(contentsNodeList, 0);
        contentsArray.sort(function(a, b)  {
            return Number(b.sysCreateDate) - Number(a.sysCreateDate);       //내림차순, 날짜 큰것 부터 작 순으로
          });

        if(contentsNodeList.length === 0){
            document.getElementById("mathDocsMyRepoDesc").innerHTML = "저장소에 문제가 존재하지 않거나<br/>학습지에 이미 추가되었습니다.";
        }else{
            document.getElementById("mathDocsMyRepoDesc").innerHTML = "";
        }

        setMyRepoContents(contentsArray);
        setIsSearchedMyRepo(true);
        document.getElementById("mathDocsMyRepo").classList.remove("hide")
        await nb_multiChoiceGridSet("quesConMultiShow");
        document.getElementById("subjectFilterList").childNodes[0].click();
        document.getElementById("productFilterList").childNodes[0].click();
    }

    const takeMyProdContents = async () =>{
        document.getElementById("mathDocsInfoTitle").innerHTML = "나의 제작 문제";
        document.getElementById("mathDocsMyRepo").classList.add("hide");
        document.getElementById("mathDocsConAdd").classList.remove("hide");
        document.getElementById("mathDocsMyProd").classList.remove("hide");
        document.getElementById("mathDocsMyProd").scrollTo(0,0)
        if(isSearchedMyCon) {
            document.getElementById("subjectFilterList").childNodes[0].click();
            document.getElementById("productFilterList").childNodes[0].click();
            return;
        }
        let returnObj= await nb_dataFetch("/mathInfo/takeMyContentsList", true);
        let contentsNodeList =  returnObj.myContentsList.filter((contentsMap, idx) => {
            let isSame = true;
            for(let i=0; i<mathContentsList.length; i++){
                if(contentsMap.contentsNo === mathContentsList[i].contentsNo) isSame = false;
            }
            return isSame;
        });

        if(contentsNodeList.length === 0){
            document.getElementById("mathDocsMyProdDesc").innerHTML = "나의 제작문제가 존재하지 않습니다.";
        }else{
            document.getElementById("mathDocsMyProdDesc").innerHTML = "";
        }
        setMyProdContents(contentsNodeList);
        setIsSearchedMyCon(true);
        document.getElementById("mathDocsMyProd").classList.remove("hide")
        await nb_multiChoiceGridSet("quesConMultiShow");
        document.getElementById("subjectFilterList").childNodes[0].click();
        document.getElementById("productFilterList").childNodes[0].click();
    }

    const myProdConOrRepoConOrSimConAdd = async (event, addType) =>{
        let contentsNo = Number(event.target.dataset.contentsNo);
        let newContentsList = mathContentsList;
        let isDuplicated = false;
        newContentsList.forEach( (contents, idx) => {
            if(contents.contentsNo === contentsNo){
                isDuplicated = true;
                return;
            } 
        });
        if(isDuplicated){
            alert("이미 추가된 문제입니다.");
            return;
        }

        let contentsList;
        if(addType === "myProd"){
            contentsList=myProdContents;
        }else if(addType === "myRepo"){
            contentsList=myRepoContents;
        }else {
            contentsList=similarContents;
        }

        let addContents = contentsList.filter( (contents) => {
            if(contents.contentsNo === contentsNo){
                return true;
            }else{
                return false;
            }
        });

        if(addType === "myRepo"){
            let jsonObj = await nb_dataFetch('/mathInfo/mathTypeInfo?unitUniqNo='+addContents[0].unitUniqNo+"+&typeNo="+addContents[0].typeNo, true);
            addContents[0].mathTypeInfo = jsonObj["mathTypeInfo"];
        }

        if(addType === "conChng"){
            let conNo = Number(document.getElementById("mathDocsSimConAdd").dataset.contentsNo);
            let conIdx;
            mathContentsList.forEach( (contents, idx) => {
                if(contents.contentsNo === conNo){
                    conIdx = idx;
                    return;
                } 
            });
            newContentsList[conIdx] = addContents[0];
        }else{
            newContentsList.push(addContents[0]);
        }
        
        let lv1Len=0;
        let lv2Len=0;
        let lv3Len=0;
        let lv4Len=0;
        let lv5Len=0;

        let multiConCnt = 0;
        let essayConCnt = 0;
        for(let i=0; i<newContentsList.length; i++){
            if(newContentsList[i].multiChoiceType==="M"){
                multiConCnt +=1;
            }else{
                essayConCnt +=1;
            }
            if(newContentsList[i].quesLevel === 1){
                lv1Len +=1;
            }else if(newContentsList[i].quesLevel === 2){
                lv2Len +=1;
            }else if(newContentsList[i].quesLevel === 3){
                lv3Len +=1;
            }else if(newContentsList[i].quesLevel === 4){
                lv4Len +=1;
            }else if(newContentsList[i].quesLevel === 5){
                lv5Len +=1;
            }
        }
        setConTotalCnt(newContentsList.length);
        setMathContentsList(newContentsList);
        let barArr = [{"labelName":"하", "value": lv1Len , "backgroundColor":"rgb(13, 53, 149, 0.2)"},
        {"labelName":"중하", "value": lv2Len , "backgroundColor":"rgb(13, 53, 149, 0.4)"},
        {"labelName":"중", "value": lv3Len , "backgroundColor":"rgb(13, 53, 149, 0.7)"},
        {"labelName":"중상", "value": lv4Len , "backgroundColor":"rgb(13, 53, 149)"},
        {"labelName":"상", "value": lv5Len , "backgroundColor":"rgb(7, 39, 113)"}];
        setConArrByLvOnBar(barArr);
        let pieArr = [
            {"labelName":"객관식", "value":multiConCnt ,"className":"multiChoicePieLabel", "backgroundColor":"rgb(13, 53, 149, 0.2)"},
            {"labelName":"주관식", "value":essayConCnt ,"className":"essayPieLabel", "backgroundColor":"rgb(13, 53, 149, 0.7)"}];
        setConArrByMultiOnPie(pieArr);

        if(addType === "myProd"){
            let myProdCon = myProdContents.filter((contentsMap, idx) => {
                if(contentsMap.contentsNo === contentsNo) return false;
                else return true;
            });
            setMyProdContents(myProdCon);
        }
        else if(addType === "myRepo"){
            let myRepoCon = myRepoContents.filter((contentsMap, idx) => {
                if(contentsMap.contentsNo === contentsNo) return false;
                else return true;
            });
            setMyRepoContents(myRepoCon);
        }
        else {
            let simContents = similarContents.filter((contentsMap, idx) => {
                if(contentsMap.contentsNo === contentsNo) return false;
                else return true;
            });
            setSimilarContents(simContents);
        }

        if(addType === "conChng"){
            await nb_fadeInOutA("문제가 교체 되었습니다.", 2000);
        }
        else{
            await nb_fadeInOutA("문제가 추가 되었습니다.", 2000);
        }
        
        nb_multiChoiceGridSet("quesConMultiShow");
    }


    const takeSimilarContents = async (unitUniqNo, typeNo, contentsNo) => {
        document.getElementById("mathDocsSimConAdd").classList.remove("hide");
        document.getElementById("mathDocsSimConAdd").dataset.contentsNo = contentsNo;
        let jsonObj = await nb_dataFetch('/mathDocs/similarContents?unitUniqNo='+unitUniqNo+"+&typeNo="+typeNo, true);
        let newContentsList =  jsonObj["mathSimilarConList"].filter((contentsMap, idx) => {
            let isSame = true;
            for(let i=0; i<mathContentsList.length; i++){
                if(contentsMap.contentsNo === mathContentsList[i].contentsNo) isSame = false;
            }
            return isSame;
        });
        if(newContentsList.length === 0){
            document.getElementById("mathDocsSimConDesc").innerHTML = "해당 유형의 문제가 모두 추가되어 있습니다. ";
        }else{
            document.getElementById("mathDocsSimConDesc").innerHTML = "";
        }
        setSimilarContents(newContentsList);
        await nb_multiChoiceGridSet("quesConMultiShow");
        document.getElementById("mathDocsSimCon").scrollTo(0,0)
    };

    const contentsDel = async (contentsNo) => {
        let newContentsList =  mathContentsList.filter((contentsMap, idx) => {
            if(contentsMap.contentsNo === contentsNo) return false;
            else return true;
        });
        let lv1Len=0;
        let lv2Len=0;
        let lv3Len=0;
        let lv4Len=0;
        let lv5Len=0;

        let multiConCnt = 0;
        let essayConCnt = 0;
        for(let i=0; i<newContentsList.length; i++){
            if(newContentsList[i].multiChoiceType==="M"){
                multiConCnt +=1;
            }else{
                essayConCnt +=1;
            }
            if(newContentsList[i].quesLevel === 1){
                lv1Len +=1;
            }else if(newContentsList[i].quesLevel === 2){
                lv2Len +=1;
            }else if(newContentsList[i].quesLevel === 3){
                lv3Len +=1;
            }else if(newContentsList[i].quesLevel === 4){
                lv4Len +=1;
            }else if(newContentsList[i].quesLevel === 5){
                lv5Len +=1;
            }
        }
        setConTotalCnt(newContentsList.length);
        setMathContentsList(newContentsList);
        let barArr = [{"labelName":"하", "value": lv1Len , "backgroundColor":"rgb(13, 53, 149, 0.2)"},
        {"labelName":"중하", "value": lv2Len , "backgroundColor":"rgb(13, 53, 149, 0.4)"},
        {"labelName":"중", "value": lv3Len , "backgroundColor":"rgb(13, 53, 149, 0.7)"},
        {"labelName":"중상", "value": lv4Len , "backgroundColor":"rgb(13, 53, 149)"},
        {"labelName":"상", "value": lv5Len , "backgroundColor":"rgb(7, 39, 113)"}];
        setConArrByLvOnBar(barArr);
        let pieArr = [
            {"labelName":"객관식", "value":multiConCnt ,"className":"multiChoicePieLabel", "backgroundColor":"rgb(13, 53, 149, 0.2)"},
            {"labelName":"주관식", "value":essayConCnt ,"className":"essayPieLabel", "backgroundColor":"rgb(13, 53, 149, 0.7)"}];
        setConArrByMultiOnPie(pieArr);
        await nb_multiChoiceGridSet("quesConMultiShow");

        nb_fadeInOutA("문제가 삭제 되었습니다.", 2000);
    }

    const errorReportOpen = async (contentsNo) => {
        setErrContentsNo(contentsNo);
    }

    const errorReportClose = async (contentsNo) => {
        setErrContentsNo(0);
    }

    const subjectInfoList = subjectList.map( (subjectInfo) => {
        //중등인 경우 
        if(subjectInfo.mainVal.includes("중등")){
            if( subjectInfo.mainVal.includes("1-1")){
                return <span key={subjectInfo.unitUniqNo}>
                            <span className="mathDocsGrade">중등</span>
                            <span className="mathDocsUnitBtn" data-subject-info={subjectInfo.mainVal} data-type-exist="false" onClick={(event)=>{unitSelct(event)}}>{subjectInfo.mainVal.replace("중등 ","")}</span>
                       </span>
            }
            if( subjectInfo.mainVal.includes("3-2")){
                return <span key={subjectInfo.unitUniqNo}>
                            <span className="mathDocsUnitBtn" data-subject-info={subjectInfo.mainVal} data-type-exist="false" onClick={(event)=>{unitSelct(event)}}>{subjectInfo.mainVal.replace("중등 ","")}</span>
                            <br/>
                       </span>
            }
            return <span className="mathDocsUnitBtn" key={subjectInfo.unitUniqNo} data-subject-info={subjectInfo.mainVal} data-type-exist="false" onClick={(event)=>{unitSelct(event)}}>{subjectInfo.mainVal.replace("중등 ","")}</span>
        }
    });

    const workContentsList = myProdContents.map( (contentsMap, idx) => {
        let isMultiHide= "hide"
        if(contentsMap.firNo!==""){
            isMultiHide=""
        }
        let isConImgHide= "hide"
        if(contentsMap.contentsImg !== null){
            isConImgHide="";
        }

        let conImgPath;
        if(contentsMap.contentsImg===null) conImgPath = "";
        else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;

        let sysCreateDate = contentsMap.sysCreateDate;
        let sysDateStr = "";
        for(let i=0; i<sysCreateDate.length; i++){
            sysDateStr += sysCreateDate[i];
        }

        return  <div className="contentsDiv contentsDivForFilter" key={idx}  data-contents-no={contentsMap.contentsNo} data-subject={contentsMap.mathUnitInfo.subject} data-sys-create-date={sysDateStr}> 
                        <table className='workListTable'>
                            <thead>

                                <tr className='workListTBHead2'>
                                    <td>
                                        <div className='twoFlexLayout'>
                                            <div className='twoFlexLayout'>
                                               
                                                <div>
                                                    [{contentsMap.mathUnitInfo.subject}] {contentsMap.mathUnitInfo.secUnit}
                                                </div>
                                            </div>
                                            <div>
                                                <span className='myProdAddBtn' data-contents-no={contentsMap.contentsNo} onClick={(event)=>{myProdConOrRepoConOrSimConAdd(event, "myProd")}}>추가</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='td1'>
                                        <div id="workQuesShow" className='workQuesShow quesRootDiv'>
                                            <div className='quesDiv'>
                                                <div className='quesContents' dangerouslySetInnerHTML={{__html:contentsMap.contents}}></div> 
                                                <div id="quesImg-show" className={"quesImg-show "+isConImgHide}>
                                                    <img src={conImgPath} id="contentsImgOutput" alt="" />
                                                </div>
                                                <div id="workMultiShow" className={"quesConMultiShow "+isMultiHide}>
                                                    <div className="firDiv"><span className="firDivContents" dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                    <div className="secDiv"><span className="secDivContents" dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                    <div className="thrDiv"><span className="thrDivContents" dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                    <div className="fourDiv"><span className="fourDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                    <div className="fifDiv"><span className="fifDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
        });

        const myRepoContentsList = myRepoContents.map( (contentsMap, idx) => {
            let isMultiHide= "hide"
            if(contentsMap.firNo!==""){
                isMultiHide=""
            }
            let isConImgHide= "hide"
            if(contentsMap.contentsImg !== null){
                isConImgHide="";
            }
    
            let conImgPath;
            if(contentsMap.contentsImg===null) conImgPath = "";
            else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;
    
            let sysCreateDate = contentsMap.sysCreateDate;
            let sysDateStr = "";
            for(let i=0; i<sysCreateDate.length; i++){
                sysDateStr += sysCreateDate[i];
            }
    
            return  <div className="contentsDiv contentsDivForFilter" key={idx}  data-contents-no={contentsMap.contentsNo} data-subject={contentsMap.mathUnitInfo.subject} data-sys-create-date={sysDateStr}> 
                            <table className='workListTable'>
                                <thead>
    
                                    <tr className='workListTBHead2'>
                                        <td>
                                            <div className='twoFlexLayout'>
                                                <div className='twoFlexLayout'>
                                                   
                                                    <div>
                                                        [{contentsMap.mathUnitInfo.subject}] {contentsMap.mathUnitInfo.secUnit}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='myRepoAddBtn' data-contents-no={contentsMap.contentsNo} onClick={(event)=>{myProdConOrRepoConOrSimConAdd(event, "myRepo")}}>추가</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='td1'>
                                            <div id="workQuesShow" className='workQuesShow quesRootDiv'>
                                                <div className='quesDiv'>
                                                    <div className='quesContents' dangerouslySetInnerHTML={{__html:contentsMap.contents}}></div> 
                                                    <div id="quesImg-show" className={"quesImg-show "+isConImgHide}>
                                                        <img src={conImgPath} id="contentsImgOutput" alt="" />
                                                    </div>
                                                    <div id="workMultiShow" className={"quesConMultiShow "+isMultiHide}>
                                                        <div className="firDiv"><span className="firDivContents" dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                        <div className="secDiv"><span className="secDivContents" dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                        <div className="thrDiv"><span className="thrDivContents" dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                        <div className="fourDiv"><span className="fourDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                        <div className="fifDiv"><span className="fifDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
            });

            const similarContentsList = similarContents.map( (contentsMap, idx) => {
                let isMultiHide= "hide"
                if(contentsMap.firNo!==""){
                    isMultiHide=""
                }
                let isConImgHide= "hide"
                if(contentsMap.contentsImg !== null){
                    isConImgHide="";
                }
        
                let conImgPath;
                if(contentsMap.contentsImg===null) conImgPath = "";
                else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;
        
                let sysCreateDate = contentsMap.sysCreateDate;
                let sysDateStr = "";
                for(let i=0; i<sysCreateDate.length; i++){
                    sysDateStr += sysCreateDate[i];
                }
        
                return  <div className="contentsDiv simConRootDiv" key={idx}  data-contents-no={contentsMap.contentsNo} data-sys-create-date={sysDateStr}> 
                                <table className='workListTable'>
                                    <thead>
                                        <tr className='workListTBHead2'>
                                            <td>
                                                <div className='alignRight'>
                                                    <span className='simConAddBtn' data-contents-no={contentsMap.contentsNo} onClick={(event)=>{myProdConOrRepoConOrSimConAdd(event, "simCon")}}>추가</span>
                                                    <span className='simConChngBtn' data-contents-no={contentsMap.contentsNo} onClick={(event)=>{myProdConOrRepoConOrSimConAdd(event, "conChng")}}>교체</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='td1'>
                                                <div id="workQuesShow" className='workQuesShow quesRootDiv'>
                                                    <div className='quesDiv'>
                                                        <div className='quesContents' dangerouslySetInnerHTML={{__html:contentsMap.contents}}></div> 
                                                        <div id="quesImg-show" className={"quesImg-show "+isConImgHide}>
                                                            <img src={conImgPath} id="contentsImgOutput" alt="" />
                                                        </div>
                                                        <div id="workMultiShow" className={"quesConMultiShow "+isMultiHide}>
                                                            <div className="firDiv"><span className="firDivContents" dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                            <div className="secDiv"><span className="secDivContents" dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                            <div className="thrDiv"><span className="thrDivContents" dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                            <div className="fourDiv"><span className="fourDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                            <div className="fifDiv"><span className="fifDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                });
        

return (
    <>
    <Outlet />
        <div id="mathDocsDesc" className='mathDocsPageTitle mini-title5'>원하는 단원을 선택하여 학습지를 만들어보세요.<br/>(학습지 생생 문제는 넘버링크 제작 문제만 포함됩니다.)</div>
        <div className='noSelect mathDocsRootDiv'>
            <div id="mathDocsFirstStep" className='mathDocsFirstStep'>
                <div className="mathDocsSubjectInfoDiv">
                    {subjectInfoList}
                </div>
                <div className="mathDocsSubjectListDiv"></div>
                <div className='bottomFixed'>
                <div className='mathDocsLevelDiv'>
                    <div className='inBlock'>
                        <table className='levelSelTb'>
                            <tbody>
                                <tr>
                                    <td>난이도</td>
                                        <td className='levelSelTd' onClick={(event)=>{levelSelect(event)}}>
                                        <label htmlFor='level1'>
                                            <input type="radio" id="level1" name="level" value="1" className='hide' /> 하
                                        </label>
                                        </td>
                                    <td className='levelSelTd' onClick={(event)=>{levelSelect(event)}}>
                                        <label htmlFor='level3'>
                                            <input type="radio" id="level3" name="level" value="3" className='hide' /> 중
                                        </label>
                                    </td>
                                    <td className='levelSelTd' onClick={(event)=>{levelSelect(event)}}>
                                        <label htmlFor='level5'>
                                            <input type="radio" id="level5" name="level" value="5" className='hide' /> 상
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='inBlock'>
                        <table className='levelSelTb'>
                            <tbody>
                                <tr>
                                    <td>문항 수</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>5</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>10</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>15</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>20</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>25</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>30</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>50</td>
                                    <td className='conCntSelTd' onClick={(event)=>{conCntSelect(event)}}>100</td>
                                    <td><input id="conCntInput" className='conCnt' type="text" onKeyUp={(event)=>{conCntKeyUp(event)}} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='inBlock orangeBtn nextStep' onClick={(event)=>{firstStepCheck()}}>다음단계</div>
                </div>
                </div>
            </div>
            
            {showChart &&
            <div id="mathDocsTwoStep" className='mathDocsTwoStep'>
                    <div>
                        <div className='mathDocsStatistics'>
                            <div id="chartWrap" className='chartWrap'> 
                                <div className='conTotalCnt'>총 문항 수 : {conTotalCnt}문항</div>
                                <div className='chartTitleWrap'>
                                    <span className='barChartTitle'>난이도별 문항 수</span>
                                    <span className='pieChartTitle'>객관식 주관식 분포</span>
                                </div>
                                <CustomBarChart barArr={conArrByLvOnBar}/>
                                <CustomPieChart pieArr={conArrByMultiOnPie}/>
                            </div>
                        </div>
                        
                        <div className='conAddBtnWrap'>
                            <table className='conAddBtnTb'>
                                <tbody>
                                    <tr>
                                        <td><span className='mathDocsInfoBtn' onClick={()=>{document.getElementById("mathDocsInfoShow").classList.remove("hide")}}>문제 간략 요약 보기</span></td>
                                    </tr>
                                    <tr>
                                        <td><span className='mathDocsMyCon' onClick={()=>{takeMyProdContents()}}>나의 제작 문제 추가</span></td>
                                    </tr>
                                    <tr>
                                        <td><span className='mathDocsMyRepo' onClick={()=>{takeMyRepoContents()}}>나의 저장소 문제 추가</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="mathDocsInfoShow" className="blindBox hide">
                            <div className='mathDocsInfoRootDiv'>
                                    <div className='mathDocsInfoTitle'>문제 간략 요약 보기</div>
                                    <div className='mini-title8'>드래그하여 문제 순서를 변경할 수 있습니다.</div>
                                    <div className='mathDocsInfoClose' onClick={()=>{document.getElementById("mathDocsInfoShow").classList.add("hide")}}>X</div>
                                    <div className='mathDocsInfo'>
                                        <div className='mathDocsInfoLineDiv'>
                                            <span className="mathDocsInfoNumber title" >번호</span>
                                            <span className="mathDocsInfoQuesType title">유형</span>
                                            <span className="mathDocsInfoMultiType">문항 구분</span>
                                            <span className="mathDocsInfoLv">난이도</span>
                                            <span className="mathDocsInfoDrag title">순서변경</span>
                                        </div>
                                        <ReactSortable list={mathContentsList} animation={200} setList={setMathContentsList}>
                                            {mathContentsList.map( (contents, idx) => {
                                                let quesNumber;
                                                if(idx<9){
                                                    quesNumber = "0"+(idx+1);
                                                }else{
                                                    quesNumber = idx+1;
                                                }
                                                let quesLevel ;
                                                if(contents.quesLevel === 1){
                                                    quesLevel = '하';
                                                }else if(contents.quesLevel === 2){
                                                    quesLevel = '중하';
                                                }else if(contents.quesLevel === 3){
                                                    quesLevel = '중';
                                                }else if(contents.quesLevel === 4){
                                                    quesLevel = '중상';
                                                }else if(contents.quesLevel === 5){
                                                    quesLevel = '상';
                                                }
                                                let multiChoiceType;
                                                if(contents.multiChoiceType === "M"){
                                                    multiChoiceType = '객관식';
                                                }else if(contents.multiChoiceType === "E"){
                                                    multiChoiceType = '주관식';
                                                }
                                                return <div key={contents.contentsNo} className='mathDocsInfoLineDiv'>
                                                            <span className="mathDocsInfoNumber" data-contents-no={contents.contentsNo} onClick={(event)=>{moveToContents(event)}}>{quesNumber}</span>
                                                            <span className="mathDocsInfoQuesType" dangerouslySetInnerHTML={{__html:contents.mathTypeInfo.quesType}}></span>
                                                            <span className="mathDocsInfoMultiType">{multiChoiceType}</span>
                                                            <span className="mathDocsInfoLv">{quesLevel}</span>
                                                            <span className="mathDocsInfoDrag"></span>
                                                        </div>
                                            })}
                                        </ReactSortable>
                                    </div>
                            </div>
                        </div>
                        <div id="mathDocsConAdd" className="blindBox hide">
                            <div className='mathDocsMyProdWrap'>
                                <div id="mathDocsInfoTitle" className='mathDocsInfoTitle'>나의 제작 문제</div>
                                <div className='mathDocsInfoClose' onClick={()=>{document.getElementById("mathDocsConAdd").classList.add("hide")}}>X</div>
                                    <MyContentsSearchFilter makeContentsShow={false} descMsg="" />
                                    <hr/>
                                    <div id="mathDocsMyProd" className='mathDocsMyProdDiv'>
                                        <div className='workList myContentsList'>
                                            <div className='contents-show filterContents'>
                                            {workContentsList}
                                            </div>
                                            <div id="mathDocsMyProdDesc" className='mathDocsSimConDesc'></div>
                                        </div>
                                    </div>
                                    <div id="mathDocsMyRepo" className='mathDocsMyRepoDiv'>
                                        <div className='workList myContentsList'>
                                            <div className='contents-show filterContents'>
                                            {myRepoContentsList}
                                            </div>
                                            <div id="mathDocsMyRepoDesc" className='mathDocsSimConDesc'></div>
                                        </div>
                                    </div>
                            </div>
                        </div>

                        <div id="mathDocsSimConAdd" className="blindBox hide">
                            <div className='mathDocsSimConWrap'>
                                <div id="mathDocsSimTitle" className='mathDocsInfoTitle'>유형 문제</div>
                                <div className='simConDesc'>선택하신 문항과 같은 유형의 문제 내역입니다.<br/>원하는 문제를 추가 또는 교체해보세요.</div>
                                <div className='mathDocsInfoClose' onClick={()=>{document.getElementById("mathDocsSimConAdd").classList.add("hide")}}>X</div>
                                    <hr/>
                                    <div id="mathDocsSimCon" className='mathDocsMyRepoDiv'>
                                        <div className='workList'>
                                            <div className='contents-show'>
                                                {similarContentsList}
                                            </div>
                                            <div id="mathDocsSimConDesc" className='mathDocsSimConDesc'></div>
                                        </div>
                                    </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className='workList mathDocsContents'>
                        <div className='mini-title8'>드래그하여 문제 순서를 변경할 수 있습니다.</div>
                            <ReactSortable list={mathContentsList} animation={200} setList={setMathContentsList} className='contents-show userSearchPage grab'>
                                {mathContentsList.map( (contentsMap, idx) => {
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

                                let conImgPath;
                                if(contentsMap.contentsImg===null) conImgPath = "";
                                else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;

                                let contentsId = "workContentsDiv"+contentsMap.contentsNo;
                                return  <div id={contentsId} className="contentsDiv userSearchPage" key={contentsMap.contentsNo} data-contents-no={contentsMap.contentsNo}> 
                                                <table className='workListTable userSearchPage'>
                                                    <thead>
                                                        <tr>
                                                            <td>
                                                                <div className='bi-jutify-align backLightGray'>
                                                                    <div><span className='quesNumber paddingLTen'>{quesNumber}</span></div>
                                                                    <div className='alignRight'>
                                                                        <div className='mathDocsConChngBtn' onClick={()=>{takeSimilarContents(contentsMap.unitUniqNo, contentsMap.mathTypeInfo.mathTypeDomain.typeNo, contentsMap.contentsNo)}}>문항 교체</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='td1 userSearchPage backHover' >
                                                                <div className='userSearchCon'>
                                                                    <div id="workQuesShow" className='workQuesShow quesRootDiv'>
                                                                        <div className='quesDiv'>
                                                                            <div className='quesContents' dangerouslySetInnerHTML={{__html:contentsMap.contents}}></div> 
                                                                            <div id="quesImg-show" className={"quesImg-show "+isConImgHide}>
                                                                                <img src={conImgPath} id="contentsImgOutput" alt="" />
                                                                            </div>
                                                                            <div id="workMultiShow" className={"quesConMultiShow "+isMultiHide}>
                                                                                <div className="firDiv"><span className="firDivContents" dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                                                <div className="secDiv"><span className="secDivContents" dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                                                <div className="thrDiv"><span className="thrDivContents" dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                                                <div className="fourDiv"><span className="fourDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                                                <div className="fifDiv"><span className="fifDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='errBtn' onClick={()=>{errorReportOpen(contentsMap.contentsNo)}}></div>
                                                                <div className='delBtn' onClick={()=>{contentsDel(contentsMap.contentsNo)}}></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                })}
                                </ReactSortable>
                        </div>
                        <div className='bottomFixed'>
                            <div className='twoStepDiv'>
                                <div className='inBlock orangeBorderBtn previousStep' onClick={(event)=>{gotoPreviousStep()}}>이전단계</div>
                                <div className='inBlock orangeBtn nextStep' onClick={(event)=>{twoStepCheck()}}>학습지 만들기</div>
                            </div>
                        </div>
                        <div id ="scrollMoveBtn" className='scrollMoveBtn'>
                            <div id='conListScrollToTop' className='conListScrollToTop' tooltip="맨 위로" onClick={()=>{nb_moveToScrollAllRange(true);}}></div>
                            <div id="conScrollCenterCircle" className='conScrollCenterCircle'></div>
                            <div id='conListScrollToBottom' className='conListScrollToBottom' tooltip="맨 아래로" onClick={()=>{nb_moveToScrollAllRange(false);}}></div>
                        </div>
                    </div>
            </div>
            }
        </div>

        <div id="mathDocsThrStep" className='blindBox hide'>
            <div className='mathDocsThrStep'>
                <div className='mathDocsThrStepTitle'>설정을 마무리하고 학습지를 사용해보세요...!</div>
                <div className='mathDocsThrStepClose closeBtn' onClick={()=>{document.getElementById("mathDocsThrStep").classList.add("hide")}}>X</div>
                <div className='mathDocsThrStepDesc'>
                    <div>
                        <table className='mathDocsThrStepTb'>
                            <tbody>
                                <tr>
                                    <td><div className='mathDocsThrStepDetailTitle'>페이지당 문제수</div></td>
                                    <td className='pagePerConCnt active' onClick={(event)=>{pagePerConCnt(event)}}>4</td>
                                    <td className='pagePerConCnt' onClick={(event)=>{pagePerConCnt(event)}}>6</td>
                                    <td><input id="pagePerConCntInp" className='hide' type="number"/></td>
                                </tr>
                                <tr>
                                    <td><div className='mathDocsThrStepDetailTitle'>학습지 제목</div></td>
                                    <td colSpan="2"><input id="docsTitle" name="docsTitle" className='mathDocsThrStepInput' type="text" /></td>
                                </tr>
                                <tr>
                                    <td><div className='mathDocsThrStepDetailTitle'>출제자(선택)</div></td>
                                    <td colSpan="2"><input id=""name="" className='mathDocsThrStepInput'  type="text" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                    <div className='mathDocsDown'>학습지 다운</div>
                    <div className='mathDocsPrint'>학습지 출력</div>
            </div>
        </div>
        
        {errContentsNo !== 0 &&
            <ErrorReportForMathCon title="문제 오류 신고" errType={1} parentMethod={errorReportClose} conNo={errContentsNo} />
        }
        
    </>
    )
}

export default MathDocsMaker;