import React, {useState, useEffect } from 'react';
import FormulaEditor from 'web/contents/register/FormulaEditor'
import DetailedContentsWrap from 'web/common/DetailedContentsWrap';
import MyContentsSearchFilter from 'web/common/MyContentsSearchFilter';
import EmptyList from 'web/common/EmptyList';
import {nb_dataFetch, nb_fadeInOut, nb_multiChoiceGridSet, nb_modalScrollStrt, nb_licenseUiCheck, nb_modalScrollEnd,
    nb_closeBtn, nb_promptBox, nb_detectScrollPosition, nb_moveToScroll} from 'js/common/common_nb.js';
import defaultProfile from 'img/defaultProfileWhite.png';

let fExecuteWidth = false;  //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0;            //모달 팝업시 부모창 스크롤 위치
const MyRepository = ()=>{
    const [contentsList, setContentsList] = useState(new Array());
    const [contentsNo, setContentsNo] = useState("");
    const [modalState, setModalState] = useState(false);        //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼
    const [workListChanged, setWorkListChanged] = useState(false); 
    const [emptyListMsg, setEmptyListMsg] = useState("저장된 문제 내역이 없습니다.\n문제 검색 페이지에서 원하는 문제를 저장소에 담아보세요.");
    const [contentsClassify, setContentsClassify] = useState(null);
    const [delTargetConNo, setDelTargetConNo] = useState(null);


    const removeAddedEvent = () => {
        window.removeEventListener('scroll', nb_detectScrollPosition);
    }
    
    useEffect(()=>{
        const asyncUseEffect = async function(){
            document.getElementById("myResource").classList.remove("active");
            document.getElementById("myPageProd").classList.remove("active");
            document.getElementById("myPageRepo").classList.add("active");
            document.getElementById("myMathDocs").classList.remove("active");
            let returnObj= await nb_dataFetch("/mathInfo/takeMyRepo", true);
            let contentsNodeList = returnObj.mathContents;
            var contentsArray = [].slice.call(contentsNodeList, 0);
            contentsArray.sort(function(a, b)  {
                return Number(b.sysCreateDate) - Number(a.sysCreateDate);       //내림차순, 날짜 큰것 부터 작 순으로
              });
            setContentsList(contentsArray);
            if(contentsArray.length === 0){
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
                nb_multiChoiceGridSet("quesConMultiShow ");
            }
            fExecuteWidth = false;
        }
        window.addEventListener('scroll', nb_detectScrollPosition);
        return () => removeAddedEvent();
        }, [contentsList]);

        const modalPopupClose = async (event, isSearch) =>{
            await nb_closeBtn("outerFormulaEditor"); 
            await setModalState(false);
    
           
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

        const modalPopupOpen = async (event)  =>{
            scrollY=nb_modalScrollStrt();
            
            document.getElementById("outerFormulaEditor").classList.remove("hide")
            let contentsNo = document.getElementById(event.target.id).dataset.contentsNo;
            await setContentsNo(contentsNo);
            setModalState(true);
        }
        
        const showDetailConInfo = async (contentsNo, userNo, event)=>{
            if(event.target.classList.contains("delBtn")) return;
            document.getElementById("detailedConDiv").classList.remove("hide");
            document.getElementById("likeRepoWrap").classList.add("hide");
            
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
            let returnObj = await nb_dataFetch("/mathInfo/myRepoDel?contentsno="+Number(delTargetConNo), true);
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
            
            let sysCreateDate = contentsMap.sysCreateDate;
            let sysDateStr = "";
            for(let i=0; i<sysCreateDate.length; i++){
                sysDateStr += sysCreateDate[i];
            }

            let conImgPath;
            if(contentsMap.contentsImg===null) conImgPath = "";
            else conImgPath = contentsMap.imgPath+contentsMap.contentsImg;
            let profileImgPath=defaultProfile;
            if(contentsMap.membersProfile.profileImgPath !== null && contentsMap.membersProfile.profileImgName !== null){
                //profileImgPath=contentsMap.membersProfile.profileImgPath+contentsMap.membersProfile.profileImgName;
            }
            return  <div id="workContentsDiv" className="contentsDiv contentsDivForFilter userSearchPage" key={idx}  data-contents-no={contentsMap.contentsNo} data-subject={contentsMap.mathUnitInfo.subject} data-sys-create-date={sysDateStr}> 
                            <table className='workListTable userSearchPage'>
                                <thead>
                                    <tr className='workListTBHead2'>
                                        <td>
                                            <div className='justifyAlign'>
                                                <div>
                                                    {contentsMap.contentsClassify === 0 ?
                                                    <span className='userSearchBtn manager hide'>N명의수학</span>
                                                    :  <span className='userSearchBtn hide'><img src={profileImgPath} alt="" className='contentsListProfile'/> {contentsMap.membersProfile.nickname}</span>
                                                    }
                                                    <span>[{contentsMap.mathUnitInfo.subject}] {contentsMap.mathUnitInfo.secUnit}</span>
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
                                        <td className='td1 userSearchPage backHover' onClick={(event)=>{showDetailConInfo(contentsMap.contentsNo, contentsMap.membersProfile.userNo, event)}} >
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
                                            <span className='delBtn' onClick={()=>{ setDelTargetConNo(contentsMap.contentsNo); nb_promptBox("삭제를 진행하시려면 '삭제' 라고 입력해주세요. \n(따옴표 없이 입력해주시기 바랍니다.)", "삭제 라고 입력해주세요.")}}></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
    });

  return (
        <>
            <div id ="scrollMoveBtn" className='scrollMoveBtn hide'>
                <div id='conListScrollToTop' className='conListScrollToTop' tooltip="맨 위로" onClick={()=>{nb_moveToScroll(true);}}></div>
                <div id="conScrollCenterCircle" className='conScrollCenterCircle'></div>
                <div id='conListScrollToBottom' className='conListScrollToBottom' tooltip="맨 아래로" onClick={()=>{nb_moveToScroll(false);}}></div>
            </div>
            <MyContentsSearchFilter makeContentsShow={false} descMsg="문제 제작자가 문제를 삭제한 경우 저장소에서 삭제 될 수 있습니다."/>
                { !modalState &&
                <div>
                    <div className='workList'>
                        {workContentsList.length !==0 ? 
                                <div>
                                    <div className="contents-show userSearchPage filterContents" id="contents-show">{workContentsList}</div>
                                </div>
                            : <EmptyList msg={emptyListMsg} imgName="myRepoEmpty" addImgClass="miniSize" /> 
                        }
                        <DetailedContentsWrap isBasedParent={false}/>

                    </div>
                </div>
            }
                   
            <div id="outerFormulaEditor" className='fixedBox hide'>
                <div id="modalFormulCloseBtn" className="closeBtn" onClick={ (event) => {modalPopupClose(event);}}>&#88;</div>
                { modalState  && <FormulaEditor contentsNo={contentsNo} isUser={true} contentsClassify={2}/>}
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
            </>
  );
}

export default MyRepository;