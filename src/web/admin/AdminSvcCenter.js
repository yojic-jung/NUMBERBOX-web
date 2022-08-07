import React, {useState, useEffect} from 'react';
import "css/admin/admin.css";
import {nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB, nb_isAdmin} from 'js/common/common_nb.js';

const AdminSvcCenter = ()=>{
    let isAdmin = nb_isAdmin();

    const [oneToOneQuestion, setOneToOneQuestion] = useState(0);
    const [conErrCnt, setConErrCnt] = useState(0);
    const [resErrCnt, setResErrCnt] = useState(0);
    const [mathDocsErrCnt, setmMathDocsErrCnt] = useState(0);

    const [oneToOneList, setOneToOneList] = useState(new Array());
    const [conErrList, setConErrList] = useState(new Array());
    const [resErrList, setResErrList] = useState(new Array());
    const [mathDocsErrList, setMathDocsErrList] = useState(new Array());

    useEffect(() => {
        if(!isAdmin) window.location.href = "/";
        const asyncUseEffect = async () =>{
            let returnVal = await nb_dataFetch("/serviceCenter/takeErrReportCount", true);
            let returnObj = await nb_dataFetch("/serviceCenter/takeErrReportByAdmin?reportStts=0", true);
            setOneToOneQuestion(returnVal.oneToOneQuestionCnt);
            setmMathDocsErrCnt(returnVal.mathDocsErrCnt);
            setConErrCnt(returnVal.conErrCnt);
            setResErrCnt(returnVal.resErrCnt);
            setOneToOneList(returnObj.oneToOneList);
            setConErrList(returnObj.conErrList);
            setResErrList(returnObj.resErrList);
            setMathDocsErrList(returnObj.mathDocsErrList);
        }

        asyncUseEffect();
    },[]);

    const showErrReport = async (event, targetId) => {
        let adminServiceCenter = document.getElementsByClassName("adminServiceCenter");
        for(let i=0; i<adminServiceCenter.length; i++){
            adminServiceCenter[i].classList.add('hide');
        }
        document.getElementById(targetId).classList.remove("hide");

        let adminErrReportTbDiv = document.getElementsByClassName("adminErrReportTbDiv");
        for(let i=0; i<adminErrReportTbDiv.length; i++){
            adminErrReportTbDiv[i].classList.remove('active');
        }
        event.currentTarget.classList.add("active");
    }

    const showReportCompleteList = async (targetId, errType) => {
        let reportStts =  document.getElementById(targetId).value;
        let returnObj = await nb_dataFetch("/serviceCenter/takeErrReportSearchBySttsAndTypeByAdmin?reportStts="+reportStts+"&errType="+errType, true);
        if(errType === 0){
            setOneToOneList(returnObj.errReportList);
        }else if(errType === 1){
            setConErrList(returnObj.errReportList);
        }else if(errType === 2){
            setResErrList(returnObj.errReportList);
        }else if(errType === 3){
            setMathDocsErrList(returnObj.errReportList);
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
            }else if(errReport.errType === 2){
                document.getElementById("detailedErrReportConNoAdmin").innerHTML = "컨텐츠 번호 : "+errReport.contentsNo;
            }else if(errReport.errType === 3){
                document.getElementById("detailedErrReportConNoAdmin").innerHTML = "학습지 번호 : "+errReport.contentsNo;
            }
            document.getElementById("detailedErrReportConNoAdmin").classList.remove("hide");
        }else{
            document.getElementById("detailedErrReportConNoAdmin").classList.add("hide");
        }

        
        document.getElementById("detailedSysCreateDateAdmin").innerHTML = errReport.sysCreateDate;
        document.getElementById("detailedReportContentsAdmin").innerHTML = errReport.reportContents;
        if(errReport.firstImgName !== null){
            document.getElementById("detailedFirstImgShowAdmin").classList.remove("hide");
            document.getElementById("detailedFirstImgShowAdmin").src = errReport.firstImgPath+"/"+errReport.firstImgName;
        }else{
            document.getElementById("detailedFirstImgShowAdmin").classList.add("hide");
        }

        if(errReport.secondImgName !== null){
            document.getElementById("detailedSecondImgShowAdmin").classList.remove("hide");
            document.getElementById("detailedSecondImgShowAdmin").src = errReport.secondImgPath+"/"+errReport.secondImgName;
        }else{
            document.getElementById("detailedSecondImgShowAdmin").classList.add("hide");
        }

        if(errReport.thirdImgName !== null){
            document.getElementById("detailedThirdImgShowAdmin").classList.remove("hide");
            document.getElementById("detailedThirdImgShowAdmin").src = errReport.thirdImgPath+"/"+errReport.thirdImgName;
        }else{
            document.getElementById("detailedThirdImgShowAdmin").classList.add("hide");
        }

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
            if(errType === 0){
                let newOneToOneList = oneToOneList.filter((errMap, idx)=>{
                    if(reportId === errMap.reportId) return false;
                    else return true;
                })
                setOneToOneList(newOneToOneList);
                setOneToOneQuestion(newOneToOneList.length);
            }else if(errType === 1){
                let newConErrList = conErrList.filter((errMap, idx)=>{
                    if(reportId === errMap.reportId) return false;
                    else return true;
                })
                setConErrList(newConErrList);
                setConErrCnt(newConErrList.length);
            }else if(errType === 2){
                let newResErrList = resErrList.filter((errMap, idx)=>{
                    if(reportId === errMap.reportId) return false;
                    else return true;
                })
                setResErrList(newResErrList);
                setResErrCnt(newResErrList.length);
            }else if(errType === 3){
                let newDocsErrList = mathDocsErrList.filter((errMap, idx)=>{
                    if(reportId === errMap.reportId) return false;
                    else return true;
                })
                setMathDocsErrList(newDocsErrList);
                setmMathDocsErrCnt(newDocsErrList.length);
            }
            document.getElementById("replyErrReportForm").reset();
            document.getElementById("detailedAdminQnaClose").click();
        }
    }
   
    const mathDocsErrReportList = mathDocsErrList.map((errMap)=>{
        let errType = "1:1 문의"
        if(errMap.errType === 1){
            errType = "문제 오류 신고"
        }else if(errMap.errType === 2){
            errType = "컨텐츠 오류 신고"
        }else if(errMap.errType === 3){
            errType = "학습지 오류"
        }

        let reportStts = "접수"
        let reportSttsClassName = "orgText";
        if(errMap.reportStts === 1){
            reportStts = "답변완료"
            reportSttsClassName = "greenText";
        }
        return <tr key={errMap.reportId}>
                    <td className='reportErrType'>{errType}</td>
                    <td className='reportConNo'>{errMap.contentsNo}</td>
                    <td className='myQnATbContents' onClick={(event)=>{showDetailedErrReport(errMap)}}>{errMap.reportContents}</td>
                    <td className='reportDate'>{errMap.sysCreateDate}</td>
                    <td className={reportSttsClassName + ' reportStts admin'}>{reportStts}</td>
                </tr>
    })

    const conErrReportList = conErrList.map((errMap)=>{
        let errType = "1:1 문의"
        if(errMap.errType === 1){
            errType = "문제 오류 신고"
        }else if(errMap.errType === 2){
            errType = "컨텐츠 오류 신고"
        }

        let reportStts = "접수"
        let reportSttsClassName = "orgText";
        if(errMap.reportStts === 1){
            reportStts = "답변완료"
            reportSttsClassName = "greenText";
        }
        return <tr key={errMap.reportId}>
                    <td className='reportErrType'>{errType}</td>
                    <td className='reportConNo'>{errMap.contentsNo}</td>
                    <td className='myQnATbContents' onClick={(event)=>{showDetailedErrReport(errMap)}}>{errMap.reportContents}</td>
                    <td className='reportDate'>{errMap.sysCreateDate}</td>
                    <td className={reportSttsClassName + ' reportStts admin'}>{reportStts}</td>
                </tr>
    })

    const resErrReportList = resErrList.map((errMap)=>{
        let errType = "1:1 문의"
        if(errMap.errType === 1){
            errType = "문제 오류 신고"
        }else if(errMap.errType === 2){
            errType = "컨텐츠 오류 신고"
        }

        let reportStts = "접수"
        let reportSttsClassName = "orgText";
        if(errMap.reportStts === 1){
            reportStts = "답변완료"
            reportSttsClassName = "greenText";
        }
        return <tr key={errMap.reportId}>
                    <td className='reportErrType'>{errType}</td>
                    <td className='reportConNo'>{errMap.contentsNo}</td>
                    <td className='myQnATbContents' onClick={(event)=>{showDetailedErrReport(errMap)}}>{errMap.reportContents}</td>
                    <td className='reportDate'>{errMap.sysCreateDate}</td>
                    <td className={reportSttsClassName + ' reportStts admin'}>{reportStts}</td>
                </tr>
    })

    const oneToOneErrReportList = oneToOneList.map((errMap, idx)=>{
        let errType = "1:1 문의"
        if(errMap.errType === 1){
            errType = "문제 오류 신고"
        }else if(errMap.errType === 2){
            errType = "컨텐츠 오류 신고"
        }

        let reportStts = "접수"
        let reportSttsClassName = "orgText";
        if(errMap.reportStts === 1){
            reportStts = "답변완료"
            reportSttsClassName = "greenText";
        }
        return <tr key={errMap.reportId}>
                    <td className='reportErrType'>{errType}</td>
                    <td className='myQnATbContents' onClick={(event)=>{showDetailedErrReport(errMap)}}>{errMap.reportContents}</td>
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
                    <td><div className='adminErrReportTbDiv active' onClick={(event)=>{showErrReport(event, "docsListDiv")}}>학습지 오류 신고 내역<span className='errReportCnt'>+{mathDocsErrCnt}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event, "conListDiv")}}>문제 오류 신고 내역<span className='errReportCnt'>+{conErrCnt}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event, "resListDiv")}}>컨텐츠 오류 신고 내역<span className='errReportCnt'>+{resErrCnt}</span></div></td>
                    <td><div className='adminErrReportTbDiv' onClick={(event)=>{showErrReport(event, "oneToOneDiv")}}>1:1 문의 내역<span className='errReportCnt'>+{oneToOneQuestion}</span></div></td>
                </tr>
            </tbody>
        </table>

        <div id="docsListDiv" className="adminServiceCenter">
            <div>
            검색 필터 : &nbsp;
                <select id="reportSttsSel0" defaultValue="0">
                    <option value="-1">전체</option>
                    <option value="0">접수</option>
                    <option value="1">답변 완료</option>
                </select>
                <span className='adminBtn' onClick={()=>{showReportCompleteList("reportSttsSel0", 3)}}>검색</span>
            </div>
            <table className='myQnATb'>
                <tbody>
                    <tr>
                        <td>서비스 구분</td>
                        <td>학습지 번호</td>
                        <td>문의 내용</td>
                        <td>등록일</td>
                        <td className='reportStts admin'>상태</td>
                    </tr>
                    {mathDocsErrReportList}
                </tbody>
            </table>
        </div>

        <div id="conListDiv" className="adminServiceCenter hide">
            <div>
            검색 필터 : &nbsp;
                <select id="reportSttsSel1" defaultValue="0">
                    <option value="-1">전체</option>
                    <option value="0">접수</option>
                    <option value="1">답변 완료</option>
                </select>
                <span className='adminBtn' onClick={()=>{showReportCompleteList("reportSttsSel1", 1)}}>검색</span>
            </div>
            <table className='myQnATb'>
                <tbody>
                    <tr>
                        <td>서비스 구분</td>
                        <td>문제 고유 번호</td>
                        <td>문의 내용</td>
                        <td>등록일</td>
                        <td className='reportStts admin'>상태</td>
                    </tr>
                    {conErrReportList}
                </tbody>
            </table>
        </div>
        <div id="resListDiv" className="adminServiceCenter hide">
        <div>
                검색 필터 : &nbsp;
                <select id="reportSttsSel2" defaultValue="0">
                    <option value="-1">전체</option>
                    <option value="0">접수</option>
                    <option value="1">답변 완료</option>
                </select>
                <span className='adminBtn' onClick={()=>{showReportCompleteList("reportSttsSel2", 2)}}>검색</span>
            </div>
            <table className='myQnATb'>
                <tbody>
                    <tr>
                        <td>서비스 구분</td>
                        <td>문제 고유 번호</td>
                        <td>문의 내용</td>
                        <td>등록일</td>
                        <td className='reportStts admin'>상태</td>
                    </tr>
                    {resErrReportList}
                </tbody>
            </table>
        </div>
        <div id="oneToOneDiv" className="adminServiceCenter oneToOne hide">
            <div>
            검색 필터 : &nbsp;
                <select id="reportSttsSel3" defaultValue="0">
                    <option value="-1">전체</option>
                    <option value="0">접수</option>
                    <option value="1">답변 완료</option>
                </select>
                <span className='adminBtn' onClick={()=>{showReportCompleteList("reportSttsSel3", 0)}}>검색</span>
            </div>
            <table className='myQnATb'>
                <tbody>
                    <tr>
                        <td>서비스 구분</td>
                        <td>문의 내용</td>
                        <td>등록일</td>
                        <td className='reportStts admin'>상태</td>
                    </tr>
                    {oneToOneErrReportList}
                </tbody>
            </table>
            <div id="oneToOneDetailedDiv" className=''>

            </div>
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
                <div id="detailedErrReportConNoAdmin" className='detailedErrReportConNoAdmin hide'></div>
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