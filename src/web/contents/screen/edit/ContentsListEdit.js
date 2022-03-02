import React, {useState, useEffect } from 'react';
import {nb_dataFetch} from 'js/common/common_nb.js';
import CustomUnitSelBox from 'web/common/CustomUnitSelBox';
import UnitSelBox from 'web/common/UnitSelBox';
import {nb_fCustomSelClose, nb_completeBlueBox, nb_formDataFetch, nb_fadeInOut} from 'js/common/common_nb.js';
import {reg_unitTypeChange} from 'js/contents/register/contents_reg.js';

const ContentsListEdit = ()=>{
    const [contentsList, setContentsList] = useState(new Array());
    const [subjectBox, setSubjectBox] = useState(new Array());
    const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
    const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
    const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
    const [contentsLen, setContentsLen] = useState(0);

    useEffect(()=>{
        const asyncUseEffect = async function(){
            let jsonObj = await nb_dataFetch('/unitInfo', true);
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
        asyncUseEffect();
        document.body.addEventListener('click',(event)=>nb_fCustomSelClose(event));
        }, []);
        const searchMyWorkListByEnter = async function(event){
            console.log(event.keyCode);
            if(event.keyCode === 13){
                event.preventDefault();
                await searchMyWorkList();
                
            }
        }
        const searchMyWorkList = async function(){
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
            if(document.getElementById("workMem").value.length<2){
                alert("이름을 적어주세요.")
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
                
            let returnObj = await nb_formDataFetch("/takeContents",formData, true);
            if(returnObj.error!=undefined){
                alert("["+returnObj.status+" "+returnObj.error+"]\n에러 메시지 : "+returnObj.message);
            }

            if(returnObj["isSearched"]){
                console.log(returnObj["mathContents"].length);
                if(returnObj["mathContents"].length===0){
                    setContentsLen(0);
                    setContentsList(returnObj["mathContents"]);
                    await nb_fadeInOut("해당하는 단원에 문제 내역이 없습니다.");
                    document.getElementById("freshImgPage").classList.remove("hide");
                    document.getElementById("searchDesc").innerText="검색 결과가 없습니다. 단원을 확인하여 다시 검색 해주세요.";
                }else{
                    setContentsLen(returnObj["mathContents"].length);
                    setContentsList(returnObj["mathContents"]);
                    await nb_fadeInOut("문제 내역이 정상적으로 조회되었습니다.");
                    document.getElementById("freshImgPage").classList.add("hide");
                }
                
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

                let quesLevel = "";
                if(contentsMap.quesLevel=="1")quesLevel="하";
                else if(contentsMap.quesLevel=="2")quesLevel="중하";
                else if(contentsMap.quesLevel=="3")quesLevel="중";
                else if(contentsMap.quesLevel=="4")quesLevel="중상";
                else if(contentsMap.quesLevel=="5")quesLevel="상";

                let firNoLen = contentsMap.firNo.length;
                let secNoLen = contentsMap.firNo.length;
                let thrNoLen = contentsMap.firNo.length;
                let fourNoLen = contentsMap.firNo.length;
                let fifNoLen = contentsMap.firNo.length;
            
                let threeDivGrid = "";
                if(firNoLen < 4 && secNoLen < 4 && thrNoLen < 4 && fourNoLen < 4 && fifNoLen < 4){
                    threeDivGrid = " threeDivGrid";
                }

                return  <div id="workContentsDiv" className="workContentsDiv" key={idx}> 
                                <table className='workListTable'>
                                    <thead>
                                        <tr>
                                            <td>문제{idx+1}.(원본교재:{contentsMap.originRef}, 원본문제:{contentsMap.originNo}, 난이도:{quesLevel})</td>
                                            <td>해설</td>
                                            <td>정답</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='td1'>
                                                <div id="workQuesShow" className='workQuesShow'>
                                                    <div dangerouslySetInnerHTML={{__html:contentsMap.contents}}></div> 
                                                    <div id="quesImg-show" className={" "+isConImgHide}>
                                                        <img src={contentsMap.imgPath+contentsMap.contentsImg} id="contentsImgOutput" alt="" />
                                                    </div>
                                                    <div id="workMultiShow" className={"workMultiShow "+isMultiHide+threeDivGrid}>
                                                        <div><span id="workFirNoShow">&#9312; </span><span dangerouslySetInnerHTML={{__html:contentsMap.firNo}}></span></div>
                                                        <div><span id="workSecNoShow">&#9313; </span><span dangerouslySetInnerHTML={{__html:contentsMap.secNo}}></span></div>
                                                        <div><span id="workThrNoShow">&#9314; </span><span dangerouslySetInnerHTML={{__html:contentsMap.thrNo}}></span></div>
                                                        <div><span id="workFourNoShow">&#9315; </span><span dangerouslySetInnerHTML={{__html:contentsMap.fourNo}}></span></div>
                                                        <div><span id="workFifNoShow">&#9316; </span><span dangerouslySetInnerHTML={{__html:contentsMap.fifNo}}></span></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='td2'>
                                                <div id="workSolShow" className='workSolShow'>
                                                    <div dangerouslySetInnerHTML={{__html:contentsMap.solution}}></div> 
                                                    <div id="quesImg-show" className={isSolImgHide}>
                                                        <img src={contentsMap.imgPath+contentsMap.solutionImg} id="solutionImgOutput" alt="" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='td3'>
                                                <div id="workAnsShow" className='workAnsShow'>
                                                <div>
                                                    <span dangerouslySetInnerHTML={{__html:contentsMap.choiceAnswer}}></span>
                                                    <span dangerouslySetInnerHTML={{__html:contentsMap.answer}}></span>
                                                </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
        });

  return ( <>
  		    <div id="notifyBox" className='notifyBox'></div>
            <form method="post" id="workSearchForm">
                <div className='staff-title'>문제 변형 작업내역</div>
                <div className='workListUnitType'>
                    <div className='mini-title5'>
                        <input id="workMem" name="workMem" className='customBlueBox' type="text" placeholder='이름을 적어주세요...' onKeyDown={(event)=>{searchMyWorkListByEnter(event);}} onClick={event => nb_completeBlueBox(event, 2)} onBlur={event => nb_completeBlueBox(event, 2)}/>
                        &nbsp; 단원정보를 선택하여 나의 문제를 확인 해보세요. 
                    </div>
                    <CustomUnitSelBox value={subjectBox} cusSelId="cusSelSub" cusChildId="cusSelFirUnit" childId="firUnit" originSel="subject" parentMethod={()=>{}} title="과목"></CustomUnitSelBox>
                    <UnitSelBox value={subjectBox} myId="subject" cusChildId="cusSelFirUnit" childId="firUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                    
                    <CustomUnitSelBox value={firUnitSelBox} cusSelId="cusSelFirUnit" cusChildId="cusSelSecUnit" childId="secUnit" originSel="firUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
                    <UnitSelBox value={firUnitSelBox} myId="firUnit" cusChildId="cusSelSecUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                    
                    <CustomUnitSelBox value={secUnitSelBox} cusSelId="cusSelSecUnit" cusChildId="cusSelThrUnit" childId="thrUnit" originSel="secUnit" parentMethod={()=>{}} title="중단원"></CustomUnitSelBox>
                    <UnitSelBox value={secUnitSelBox} myId="secUnit" cusChildId="cusSelThrUnit" childId="thrUnit" isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                    
                    <CustomUnitSelBox value={thrUnitSelBox} cusSelId="cusSelThrUnit" cusChildId="cusSelQuesType" childId="quesType" originSel="thrUnit" parentMethod={()=>{}} title="소단원"></CustomUnitSelBox>
                    <UnitSelBox value={thrUnitSelBox} myId="thrUnit" cusChildId="cusSelQuesType" childId="quesType" isUnitBubbleEv={false}  parentMethod={()=>{}}></UnitSelBox>
                    
                    <button type="button" className="orangeBtn" onClick={()=>searchMyWorkList()}>검색</button>
                </div>
                <div className='workList'>
                    <div className="contents-show" id="contents-show">
                         {contentsLen !== 0 && <div id="con" className='mini-title2'>변형 작업 문제 갯수 : {contentsLen}</div>}
                        {workContentsList}
                    </div>
                </div>
                <div id="freshImgPage" className='freshImgPage'>
                    <div id="searchDesc" className='mini-title5'>내가 만든 문제를 검색 해보세요.</div>
                    <img className="" src="/webapp/static/nbImg/paper.gif" alt="" />
                </div>
            </form>
            </>

  );
}

export default ContentsListEdit;