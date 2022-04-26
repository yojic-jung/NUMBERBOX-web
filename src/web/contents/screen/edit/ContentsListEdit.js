import React, {useState, useEffect } from 'react';
import FormulaEditor from 'web/contents/register/FormulaEditor'
import {nb_dataFetch} from 'js/common/common_nb.js';
import CustomUnitSelBox from 'web/common/CustomUnitSelBox';
import UnitSelBox from 'web/common/UnitSelBox';
import {nb_fCustomSelClose, nb_formDataFetch, nb_fadeInOut} from 'js/common/common_nb.js';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';
import "css/common/nbScreen.css";
import {nb_closeBtn, nb_modalScrollStrt, nb_modalScrollEnd} from 'js/common/common_nb.js';
import TopMenuBar from 'web/common/TopMenuBar';

let fExecuteWidth = false;  //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0;            //모달 팝업시 부모창 스크롤 위치
let subjectVal;
let firUnitVal;
let secUnitVal;
let thrUnitVal;
const ContentsListEdit = ()=>{
    const [contentsList, setContentsList] = useState(new Array());
    const [subjectBox, setSubjectBox] = useState(new Array());
    const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
    const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
    const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
    const [contentsLen, setContentsLen] = useState(0);
    const [contentsNo, setContentsNo] = useState("");
    const [modalState, setModalState] = useState(false);        //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼


    const modalPopupOpen = async (event)  =>{
        subjectVal = document.getElementById("subject").value;
        firUnitVal = document.getElementById("firUnit").value;
        secUnitVal = document.getElementById("secUnit").value;
        thrUnitVal = document.getElementById("thrUnit").value;
        scrollY=nb_modalScrollStrt();
        
        document.getElementById("outerFormulaEditor").classList.remove("hide")
        await setContentsNo(document.getElementById(event.target.id).dataset.contentsNo);
        setModalState(true);
    }


    const modalPopupClose = async (event, isSearch) =>{
        await nb_closeBtn("outerFormulaEditor"); 
        await setModalState(false);

        //이전 검색조건 셋팅
        let trigEv = new Object();
        let sub    = new Object();
       
        
        trigEv.target= sub;
        trigEv.target.id= "subject";
        document.getElementById("subject").value = subjectVal;
        await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);
        document.getElementById("subject").value = subjectVal;
        document.getElementById("cusSelSubTitle").innerHTML =document.getElementById("subject")[document.getElementById("subject").selectedIndex].innerText;
        document.getElementById("cusSelSubDiv").classList.add("nbCustomSelected");
        //두번 실행해야함, 자식 콤보의 첫번째 인덱스를 display:none 패스 후 자식 콤보의 대단원, 중단원, 소단원 등의 콤보 제목정보가 추가되는데
        //과목 이벤트 한번만 실행되면  대단원에는 display:none 패스 후 대단원 option태그 추가되므로 콤보제목 태그가 아닌 다른 태그가 들어오게됨
        await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);

        document.getElementById("firUnit").value = firUnitVal;
        document.getElementById("cusSelFirUnitTitle").innerHTML =document.getElementById("firUnit")[document.getElementById("firUnit").selectedIndex].innerText;
        document.getElementById("cusSelFirUnitDiv").classList.add("nbCustomSelected");
        trigEv.target.id= "firUnit";
        await reg_unitTypeChange(trigEv, "cusSelSecUnit","secUnit", true);

        document.getElementById("secUnit").value = secUnitVal;
        document.getElementById("cusSelSecUnitTitle").innerHTML =document.getElementById("secUnit")[document.getElementById("secUnit").selectedIndex].innerText;
        document.getElementById("cusSelSecUnitDiv").classList.add("nbCustomSelected");
        trigEv.target.id= "secUnit";
        await reg_unitTypeChange(trigEv, "cusSelThrUnit","thrUnit", true);

        document.getElementById("thrUnit").value = thrUnitVal;
        document.getElementById("cusSelThrUnitTitle").innerHTML =document.getElementById("thrUnit")[document.getElementById("thrUnit").selectedIndex].innerText;
        document.getElementById("cusSelThrUnitDiv").classList.add("nbCustomSelected");
        
        //모달창에서 저장하기 버튼을 누른 경우에만 검색, event.isTrusted객체는 사용자 액션, 자바스크립트 강제 이벤트 발생 구분 객체
        if(!event.isTrusted) await searchMyWorkList(true);
        else if(document.getElementById("imgUpdt").value === "Y"){
            await searchMyWorkList(true);
            document.getElementById("imgUpdt").value = "N";
        } 
        await multiChoiceGridSet();
        nb_modalScrollEnd(scrollY)
        
    }
    

    const  multiChoiceGridSet = async () => {
        let multiShowDiv = document.getElementsByClassName("quesConMultiShow");
        let maxWidth;
        
        for(let i=0; i<multiShowDiv.length; i++){
            multiShowDiv[i].classList.remove("oneDivGrid");
            multiShowDiv[i].classList.remove("twoDivGrid");
            multiShowDiv[i].classList.remove("threeDivGrid");
    
            maxWidth = multiShowDiv[i].querySelector(".firDiv").offsetWidth;
            if(maxWidth < multiShowDiv[i].querySelector(".secDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".secDiv").offsetWidth;
            if(maxWidth < multiShowDiv[i].querySelector(".thrDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".thrDiv").offsetWidth;
            if(maxWidth < multiShowDiv[i].querySelector(".fourDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".fourDiv").offsetWidth;
            if(maxWidth < multiShowDiv[i].querySelector(".fifDiv").offsetWidth) maxWidth =multiShowDiv[i].querySelector(".fifDiv").offsetWidth;
    
            if(maxWidth<170 && maxWidth>90)  multiShowDiv[i].classList.add("twoDivGrid");
            else if(maxWidth<=90) multiShowDiv[i].classList.add("threeDivGrid");
            else multiShowDiv[i].classList.add("oneDivGrid");
        }
    }


    useEffect(()=>{
        const asyncUseEffect = async function(){
            let jsonObj = await nb_dataFetch('/mathInfo/unitInfo', true);
            setSubjectBox(jsonObj["mathSubjectInfo"]);
            setfirUnitSelBox(jsonObj["mathFirUnitInfo"]);
            setSecUnitSelBox(jsonObj["mathSecUnitInfo"]);
            setThrUnitSelBox(jsonObj["mathThrUnitInfo"]);
             //초기 단원 및 유형정보 셋팅
            let trigEv = new Object();
            let sub    = new Object();
            trigEv.target= sub;
            trigEv.target.id= "subject";
            await reg_unitTypeChange(trigEv, "cusSelFirUnit","firUnit", true);
        }
        if(!fExecuteWidth){
            asyncUseEffect();
            document.body.addEventListener('click',nb_fCustomSelClose);
        }else{
            if(contentsList.length!==0){
                multiChoiceGridSet();
            }
            fExecuteWidth = false;
        }

        }, [contentsList]);


        const searchMyWorkList = async function(hasNotiPhrases){
            let customSubject = document.getElementById("cusSelSubTitle");
            let subject = document.getElementById("subject");
            let customFirUnit = document.getElementById("cusSelFirUnitTitle");
            let firUnit = document.getElementById("firUnit");
            let customSecUnit = document.getElementById("cusSelSecUnitTitle");
            let secUnit = document.getElementById("secUnit");
            let customThrUnit = document.getElementById("cusSelThrUnitTitle");
            let thrUnit = document.getElementById("thrUnit");

            if(customSubject.innerText=="과목" || subject.selectedIndex==0){
                alert("과목을 선택해주세요.");
                return false;
            }
            if(customFirUnit.innerText=="대단원" || firUnit.selectedIndex==0){
                    alert("대단원을 선택해주세요.");
                    return false;
            }
            if(customSecUnit.innerText=="중단원" || secUnit.selectedIndex==0){
                alert("중단원을 선택해주세요.");
                return false;
            }
            if(customThrUnit.innerText=="소단원" || thrUnit.selectedIndex==0){
                alert("소단원을 선택해주세요.");
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
                
            let returnObj = await nb_formDataFetch("/mathInfo/takeContents",formData, true);
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                fExecuteWidth = true;
                if(returnObj["mathContents"].length===0){
                    setContentsLen(0);
                    setContentsList(returnObj["mathContents"]);
                    document.getElementById("freshImgPage").classList.remove("hide");
                    if(hasNotiPhrases){
                        await nb_fadeInOut("단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.");
                        document.getElementById("searchDesc").innerText="단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.";
                    }  
                    else{
                        await nb_fadeInOut("해당하는 단원에 문제 내역이 없습니다.");
                        document.getElementById("searchDesc").innerText="검색 결과가 없습니다. 단원을 확인하여 다시 검색 해주세요.";
                    } 
                }else{
                    setContentsLen(returnObj["mathContents"].length);
                    setContentsList(returnObj["mathContents"]);
                    if(hasNotiPhrases)  await nb_fadeInOut("정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.");
                    else  await nb_fadeInOut("문제 내역이 정상적으로 조회되었습니다.");
                   
                    document.getElementById("freshImgPage").classList.add("hide");
                }
                
            }

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
                else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;

                let solImgPath;
                if(contentsMap.solutionImg===null) solImgPath = "";
                else solImgPath = contentsMap.imgPath+contentsMap.solutionImg;

                return  <div id="workContentsDiv" className="workContentsDiv" key={idx}> 
                                <table className='workListTable'>
                                    <thead>
                                        <tr>
                                            <td>
                                                <div className='twoFlexLayout'>
                                                    <div><button id={updateBtnId} type="button" data-contents-no={contentsMap.contentsNo} className='updateBtn' onClick={(event) => {modalPopupOpen(event)}}>수정하기</button></div>
                                                    <div>
                                                        원본교재: {contentsMap.originRef}, 원본문제: {contentsMap.originNo}, 난이도: {quesLevel}<br/>
                                                        <span className='hide'>유형 : {contentsMap.mathTypeInfo.quesType}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>정답 및 해설</td>
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
                                                            <div className="firDiv"><span className="firDivContents" dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                            <div className="secDiv"><span className="secDivContents" dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                            <div className="thrDiv"><span className="thrDivContents" dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                            <div className="fourDiv"><span className="fourDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                            <div className="fifDiv"><span className="fifDivContents" dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
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
                                                                    <span  dangerouslySetInnerHTML={{__html:contentsMap.choiceAnswer}}></span>
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
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
        });


  return ( <>
            <TopMenuBar isMain={false}/>
  		    <div id="notifyBox" className='notifyBox'></div>
                { !modalState &&
                <div>
                    <div id="workListUnitTypeRoot" className='workListUnitTypeRoot'>
                        <form method="post" id="workSearchForm">
                            <div id="workListUnitType" className='workListUnitType'>
                                <div className='mini-title5'>
                                    &nbsp; 단원정보를 선택하여 원하는 문제를 찾아보세요.
                                </div>
                                <CustomUnitSelBox value={subjectBox} cusSelId="cusSelSub" cusChildId="cusSelFirUnit" childId="firUnit" originSel="subject" parentMethod={()=>{}} title="과목"></CustomUnitSelBox>
                                <UnitSelBox value={subjectBox} myId="subject" cusChildId="cusSelFirUnit" childId="firUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                
                                <CustomUnitSelBox value={firUnitSelBox} cusSelId="cusSelFirUnit" cusChildId="cusSelSecUnit" childId="secUnit" originSel="firUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
                                <UnitSelBox value={firUnitSelBox} myId="firUnit" cusChildId="cusSelSecUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                
                                <CustomUnitSelBox value={secUnitSelBox} cusSelId="cusSelSecUnit" cusChildId="cusSelThrUnit" childId="thrUnit" originSel="secUnit" parentMethod={()=>{}} title="중단원"></CustomUnitSelBox>
                                <UnitSelBox value={secUnitSelBox} myId="secUnit" cusChildId="cusSelThrUnit" childId="thrUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                
                                <CustomUnitSelBox value={thrUnitSelBox} cusSelId="cusSelThrUnit" cusChildId="cusSelQuesType" childId="quesType" originSel="thrUnit" parentMethod={()=>{}} title="소단원"></CustomUnitSelBox>
                                <UnitSelBox value={thrUnitSelBox} myId="thrUnit" cusChildId="cusSelQuesType" childId="quesType" isUnitBubbleEv={false}  parentMethod={()=>{}}></UnitSelBox>
                                
                                <button type="button" className="orangeBtn" onClick={()=>searchMyWorkList(false)}>검색</button>
                            </div>
                        </form>
                    </div>
                    <div className='workList'>
                        <div className="contents-show" id="contents-show">
                            {contentsLen !== 0 && <div id="con" className='mini-title2'>변형 작업 문제 갯수 : {contentsLen}</div>}
                            {workContentsList}
                        </div>
                    </div>
                </div>
            }
                    <div id="freshImgPage" className='freshImgPage'>
                        <div id="searchDesc" className='mini-title5'>넘버링크는 사용자와 함께 컨텐츠를 만들어 나갑니다.</div>
                        <img className="" src="/webapp/static/nbImg/paper.gif" alt="" />
                    </div> 
            <div id="outerFormulaEditor" className='fixedBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState  && <FormulaEditor contentsNo={contentsNo}/>}
            </div>
            <input id="imgUpdt" className="hide" type="text" defaultValue="N" />
            </>

  );
}

export default ContentsListEdit;