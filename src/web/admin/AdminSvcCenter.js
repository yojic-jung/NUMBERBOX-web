import React, {useState, useEffect} from 'react';
import "css/admin/admin.css";
import {nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB, nb_isAdmin} from 'js/common/common_nb.js';

const AdminSvcCenter = ()=>{
    let isAdmin = nb_isAdmin();
    const [currentErrType, setCurrentErrType] = useState(0);
    const [oneToOneQuestion, setOneToOneQuestion] = useState(0);
    const [conErrCnt, setConErrCnt] = useState(0);
    const [resErrCnt, setResErrCnt] = useState(0);
    const [mathDocsErrCnt, setmMathDocsErrCnt] = useState(0);
    const [makeContentsErrCnt, setMakeContentsErrCnt] = useState(0);

    const [errList, setErrList] = useState(new Array());

    useEffect(() => {
        if(!isAdmin) window.location.href = "/";
        const asyncUseEffect = async () =>{
            let returnVal = await nb_dataFetch("/serviceCenter/takeErrReportCount?reportStts=0", true);
            let returnObj = await nb_dataFetch("/serviceCenter/takeErrReportByAdmin?reportStts=0", true);
            setOneToOneQuestion(returnVal.oneToOneQuestionCnt);
            setmMathDocsErrCnt(returnVal.mathDocsErrCnt);
            setMakeContentsErrCnt(returnVal.makeContentsErrCnt);
            setConErrCnt(returnVal.conErrCnt);
            setResErrCnt(returnVal.resErrCnt);
            setErrList(returnObj.errReportList);
        }

        asyncUseEffect();
    },[]);

    const showErrReport = async (event, errType) => {
        let errorList = document.getElementsByClassName("errListErrType");
        for(let i=0; i<errorList.length; i++){
            if(!errorList[i].classList.contains(errType)){
                errorList[i].classList.add("hide");
            }else{
                errorList[i].classList.remove("hide");
            }
        }
        setCurrentErrType(errType)
        
        let adminErrReportTbDiv = document.getElementsByClassName("adminErrReportTbDiv");
        for(let i=0; i<adminErrReportTbDiv.length; i++){
            adminErrReportTbDiv[i].classList.remove('active');
        }
        event.currentTarget.classList.add("active");
    }

    const showReportCompleteList = async (targetId, errType) => {
        let reportStts =  document.getElementById(targetId).value;
        let returnVal = await nb_dataFetch("/serviceCenter/takeErrReportCount?reportStts="+reportStts, true);
        if(reportStts !== "-1"){
            let returnObj = await nb_dataFetch("/serviceCenter/takeErrReportByAdmin?reportStts="+reportStts, true);
            setOneToOneQuestion(returnVal.oneToOneQuestionCnt);
            setmMathDocsErrCnt(returnVal.mathDocsErrCnt);
            setMakeContentsErrCnt(returnVal.makeContentsErrCnt);
            setConErrCnt(returnVal.conErrCnt);
            setResErrCnt(returnVal.resErrCnt);
            setErrList(returnObj.errReportList);
        }else{
            let returnObj = await nb_dataFetch("/serviceCenter/takeErrReportSearchBySttsAndTypeByAdmin?reportStts="+reportStts+"&errType="+errType, true);
            setErrList(returnObj.errReportList);
        }
    }

    const showDetailedErrReport = async (errReport) => {
        document.getElementById("detailedAdminQna").classList.remove("hide");
        document.getElementById("questionReply").innerHTML = "";
        
        let errType = "1:1 문의"
        if(errReport.errType === 1){
            errType = "문제 오류 신고"
        }else if(errReport.errType === 2){
            errType = "컨텐츠 오류 신고"
        }else if(errReport.errType === 3){
            errType = "학습지 오류 신고"
        }else if(errReport.errType === 4){
            errType = "문제만들기 오류 신고"
        }

        document.getElementById("reportId").value=errReport.reportId;
        document.getElementById("errTypeAdmin").value=errReport.errType;
        

        document.getElementById("detailedErrReportTitleAdmin").innerHTML = errType;

        let reportStts = "접수"
        if(errReport.reportStts === 1){
            reportStts = "답변완료"
            document.getElementById("detailedReportSttsAdmin").classList.add("greenText");
            document.getElementById("detailedReportSttsAdmin").classList.remove("orgText");
        }else{
            document.getElementById("detailedReportSttsAdmin").classList.add("orgText");
            document.getElementById("detailedReportSttsAdmin").classList.remove("greenText");
        }
        document.getElementById("detailedReportSttsAdmin").innerHTML = reportStts;

        if(errReport.contentsNo !== 0){
            
            if(errReport.errType === 1){
                document.getElementById("detailedErrReportConNoAdmin").innerHTML = "문제 고유 번호 : "+errReport.contentsNo;
                document.getElementById("orgContentsLink").innerHTML = "문제검색에서 열기"
                document.getElementById("orgContentsLink").href = "/contentsList?contentsNo="+errReport.contentsNo;
                document.getElementById("orgContentsLink").classList.remove("hide");
                document.getElementById("orgContentsLink2").classList.remove("hide");
                document.getElementById("orgContentsLink2").href = "/admin/workContentsList?contentsNo="+errReport.contentsNo;
            }else if(errReport.errType === 2){
                document.getElementById("detailedErrReportConNoAdmin").innerHTML = "컨텐츠 번호 : "+errReport.contentsNo;
                document.getElementById("orgContentsLink2").classList.add("hide");
                document.getElementById("orgContentsLink").classList.remove("hide");
                document.getElementById("orgContentsLink").innerHTML = "컨텐츠 열기"
                document.getElementById("orgContentsLink").href = "/shareResource?resourceNo="+errReport.contentsNo;
            }else if(errReport.errType === 3){
                document.getElementById("detailedErrReportConNoAdmin").innerHTML = "학습지 번호 : "+errReport.contentsNo;
                document.getElementById("orgContentsLink2").classList.add("hide");
                document.getElementById("orgContentsLink").classList.remove("hide");
                document.getElementById("orgContentsLink").innerHTML = "학습지 열기"
                document.getElementById("orgContentsLink").href = "/makeMathDocs?docsNo="+errReport.contentsNo;
            }
            document.getElementById("detailedErrReportConNoAdmin").classList.remove("hide");
        }else{
            document.getElementById("orgContentsLink").classList.add("hide");
            document.getElementById("orgContentsLink2").classList.add("hide");
            document.getElementById("detailedErrReportConNoAdmin").classList.add("hide");
        }

        
        document.getElementById("detailedSysCreateDateAdmin").innerHTML = errReport.sysCreateDate;
        document.getElementById("detailedReportContentsAdmin").innerHTML = errReport.reportContents;
        if(errReport.firstImgName !== null){
            document.getElementById("detailedFirstImgShowAdmin").classList.remove("hide");
            document.getElementById("detailedFirstImgShowAdmin").src = process.env.REACT_APP_SERVER_STATIC_HOST+errReport.firstImgPath+errReport.firstImgName;
        }else{
            document.getElementById("detailedFirstImgShowAdmin").classList.add("hide");
        }

        if(errReport.secondImgName !== null){
            document.getElementById("detailedSecondImgShowAdmin").classList.remove("hide");
            document.getElementById("detailedSecondImgShowAdmin").src = process.env.REACT_APP_SERVER_STATIC_HOST+errReport.secondImgPath+errReport.secondImgName;
        }else{
            document.getElementById("detailedSecondImgShowAdmin").classList.add("hide");
        }

        if(errReport.thirdImgName !== null){
            document.getElementById("detailedThirdImgShowAdmin").classList.remove("hide");
            document.getElementById("detailedThirdImgShowAdmin").src = process.env.REACT_APP_SERVER_STATIC_HOST+errReport.thirdImgPath+errReport.thirdImgName;
        }else{
            document.getElementById("detailedThirdImgShowAdmin").classList.add("hide");
        }

        //운영체제 정보 및 브라우저 정보
        document.getElementById("userOsAndBrowser").innerHTML = errReport.osInfo+"/"+errReport.browser;

        if(errReport.replyContents !== null){
            document.getElementById("questionReply").innerHTML = errReport.replyContents;
            document.getElementById("errReportReplyBtn").innerHTML = "수정하기";
        }else{
            document.getElementById("errReportReplyBtn").innerHTML = "답변하기";
        }
        
    }

    const errorReplyByAdmin = async () =>{
        if (document.getElementById("questionReply").value.length < 20){
            nb_fadeInOutB("문의 내용은 최소 20글자 이상 작성하여 주시기 바랍니다.", 2000);
            return;
        }
        
        let formData = new FormData(document.getElementById("replyErrReportForm"));
        let returnVal = await nb_formDataFetch("/serviceCenter/replyErrorReport", formData, true);
        if(returnVal.isSuccess){
            await nb_fadeInOutA("정상적으로 답변이 등록 되었습니다.", 2000);
            
            let reportId = Number(document.getElementById("reportId").value);
            let errType = Number(document.getElementById("errTypeAdmin").value);
            let newErrList = errList.filter((errMap, idx)=>{
                if(reportId === errMap.reportId) return false;
                else return true;
            })
            if(errType === 0){
                setOneToOneQuestion(newErrList.length);
            }else if(errType === 1){
                setConErrCnt(newErrList.length);
            }else if(errType === 2){
                setResErrCnt(newErrList.length);
            }else if(errType === 3){
                setmMathDocsErrCnt(newErrList.length);
            }else if(errType === 4){
                setMakeContentsErrCnt(newErrList.length);
            }
            document.getElementById("replyErrReportForm").reset();
            document.getElementById("detailedAdminQnaClose").click();
        }
    }
   
    const mathDocsErrReportList = errList.map((errMap)=>{
        let errType = "1:1 문의"
        if(errMap.errType === 1){
            errType = "문제 오류 신고"
        }else if(errMap.errType === 2){
            errType = "컨텐츠 오류 신고"
        }else if(errMap.errType === 3){
            errType = "학습지 오류"
        }else if(errMap.errType === 4){
            errType = "문제만들기 오류"
        }

        let reportStts = "접수"
        let reportSttsClassName = "orgText";
        if(errMap.reportStts === 1){
            reportStts = "답변완료"
            reportSttsClassName = "greenText";
        }
        let display=""
        if(errMap.errType !== currentErrType) display=" hide"
        return <tr key={errMap.reportId} className={"errListErrType "+errMap.errType+display}>
                    <td className='reportErrType'>{errType}</td>
                    <td className='reportConNo'>{errMap.contentsNo}</td>
                    <td className='myQnATbContents' onClick={()=>{showDetailedErrReport(errMap)}}>{errMap.reportContents}</td>
                    <td className='reportDate'>{errMap.sysCreateDate}</td>
                    <td className={reportSttsClassName + ' reportStts admin'}>{reportStts}</td>
                </tr>
    })

return (
    <div className='workListUnitType'>
        <div className='adminErrReportTitle'>고객문의 내역 보기</div>
        <table className='adminErrReportTb'>
            <tbody>
                <tr>
                    <td><div className='adminErrReportTbDiv active' onClick={(event)=>{showErrReport(event, 0)}}>1:1 문의 내역<span className='errReportCnt'>+{oneToOneQuestion}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event,  1)}}>문제 오류 신고 내역<span className='errReportCnt'>+{conErrCnt}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event, 2)}}>컨텐츠 오류 신고 내역<span className='errReportCnt'>+{resErrCnt}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event, 3)}}>학습지 오류 신고 내역<span className='errReportCnt'>+{mathDocsErrCnt}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event, 4)}}>문제만들기 오류 내역<span className='errReportCnt'>+{makeContentsErrCnt}</span></div></td>
                </tr>
            </tbody>
        </table>

        <div className="adminServiceCenter">
            <div>
            검색 필터 : &nbsp;
                <select id="reportSttsSel" defaultValue="0">
                    <option value="-1">전체</option>
                    <option value="0">접수</option>
                    <option value="1">답변 완료</option>
                </select>
                <span className='adminBtn' onClick={()=>{showReportCompleteList("reportSttsSel", currentErrType)}}>검색</span>
            </div>
            <table className='myQnATb'>
                <tbody>
                    <tr>
                        <td>서비스 구분</td>
                        <td>번호</td>
                        <td>문의 내용</td>
                        <td>등록일</td>
                        <td className='reportStts admin'>상태</td>
                    </tr>
                    {mathDocsErrReportList}
                </tbody>
            </table>
        </div>
        <div id="detailedAdminQna" className='blindBox hide'>
            <div className='detailedErrReportAdminWrap'>
                <div id="detailedAdminQnaClose" className='closeBtn2 admin' onClick={()=>{document.getElementById("detailedAdminQna").classList.add("hide");}}>X</div>
                <div id="detailedErrReportTitleAdmin" className='detailedErrReportTitle admin'>
                </div>
                <div className='bi-jutify-align'>
                    <span id="detailedReportSttsAdmin" className='detailedReportStts'></span>
                    <span id="detailedSysCreateDateAdmin" className='detailedSysCreateDateAdmin'></span>
                </div>
                <div className='alignLeft'>사용자 브라우저 : <span id="userOsAndBrowser"></span></div>
                <div id="detailedErrReportConNoAdmin" className='detailedErrReportConNoAdmin hide'></div>
                <div className='alignLeft'>
                    <a id="orgContentsLink" href="/" target='_blank'>문제 열기</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a id="orgContentsLink2" href="/" target='_blank' className='hide'>작업내역에서 문제 열기</a>
                </div>
                <div className='alignLeft'>문의 내용 :</div>
                <div id="detailedReportContentsAdmin" className='detailedReportContentsAdmin'></div>
                <div className='alignCenter'>
                    <img id="detailedFirstImgShowAdmin" className='imgAddBtn' src="" alt=""/>
                    <img id="detailedSecondImgShowAdmin" className='imgAddBtn' src="" alt=""/>
                    <img id="detailedThirdImgShowAdmin" className='imgAddBtn' src="" alt=""/>
                </div>
                <div className='alignCenter'>
                    <hr/>
                    <div>문의 답변하기</div>
                    
                    <form method="post" id="replyErrReportForm" encType="multipart/form-data">
                        <div className='paddingFive alignLeft'>
                            <input id="errTypeAdmin" type="number" name="errType" className='hide'/>
                            <input id="reportId" type="number" name="reportId" className='hide'/>
                            <textarea id="questionReply" name="replyContents" className='questionText admin'/>
                        </div>
                        <span id="errReportReplyBtn" className='errRegisterBtn marginTenAuto' onClick={()=>{errorReplyByAdmin()}}>답변하기</span>
                    </form>
                </div>
                
            </div>
            <div className='paddingFiveZero'></div>
        </div>
        <div className='paddingFiveZero'></div>
    </div>
    )
}

export default AdminSvcCenter;