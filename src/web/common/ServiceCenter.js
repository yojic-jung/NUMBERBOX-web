import React, {useState} from 'react';
import image from 'img/plus.png';
import {nb_dataFetch, nb_formDataFetch, nb_loadFile, nb_fadeInOutA, nb_fadeInOutB} from 'js/common/common_nb.js';

const ServiceCenter = ({myNickName})=>{
    
    const [myErrReport, setMyErrReport] = useState(new Array());

    const serviceCenterMenuClick = async (event, targetId) =>{
        let serviceCenterTab = document.getElementsByClassName("serviceCenterTab active");
        for(let i=0; i<serviceCenterTab.length; i++){
            serviceCenterTab[i].classList.remove("active");
        }
        event.target.classList.add("active");

        
        let serviceCenterMenuCon = document.getElementsByClassName("serviceCenterMenuCon");
        for(let i=0; i<serviceCenterMenuCon.length; i++){
            serviceCenterMenuCon[i].classList.add("hide");
        }

        document.getElementById(targetId).classList.remove("hide")

        if(targetId === "myQnA"){
            let returnVal = await nb_dataFetch("/serviceCenter/takeMyErrReport", true);
            setMyErrReport(returnVal.myErrReport);
        }
    }

    const imgFileChange = async (event, outputId) => {
        if(event.target.files[0] === undefined){
            document.getElementById(outputId).src=image;
        }else{
            let fileNames = event.target.files[0].name.split(".");
            let filetype = fileNames[fileNames.length-1].toUpperCase();
            if(!( filetype === "PNG" || filetype=='JPG' || filetype=='GIF' || filetype=='PNG' || filetype=='JPEG' || filetype=='BMP')){
                alert("이미지 파일만 등록 가능합니다.(PNG, JPG, GIF, PNG, JPEG, BMP 확장자만 가능)");
                event.target.value = "";
                document.getElementById(outputId).src=image;
                return false;
            }

            if(fileNames[0].length > 40){
                alert("파일 이름은 40글자 미만으로 설정해주시기 바랍니다.");
                event.target.value = "";
                document.getElementById(outputId).src=image;
                return false;
            }

            if(event.target.files[0].size > 1024*1024*3){
                alert("파일 사이즈는 3MB 이하의 파일만 업로드 가능합니다.");
                event.target.value = "";
                document.getElementById(outputId).src=image;
                return false;
            }

            await nb_loadFile(event, outputId, undefined);
        }
    }

    const showDetaildErrReport = async (errReport) => {
        document.getElementById("myQnAList").classList.add("hide");
        document.getElementById("detailedMyQna").classList.remove("hide");

        if(errReport.replyContents !== null){
            document.getElementById("replyContentsDiv").classList.remove("hide");
            document.getElementById("replyContents").innerText = errReport.replyContents;
        }
        

        let reportStts = "접수"
        if(errReport.reportStts === 1){
            reportStts = "답변완료"
            document.getElementById("detailedReportStts").classList.remove("orgText");
            document.getElementById("detailedReportStts").classList.add("greenText");
        }else{
            document.getElementById("detailedReportStts").classList.remove("greenText");
            document.getElementById("detailedReportStts").classList.add("orgText");
        }

        document.getElementById("detailedReportStts").innerHTML = reportStts;
        

        document.getElementById("detailedSysCreateDate").innerHTML = errReport.sysCreateDate;
        document.getElementById("detailedReportContents").innerHTML = errReport.reportContents;
        if(errReport.firstImgName !== null){
            document.getElementById("detailedFirstImgShow").classList.remove("hide");
            document.getElementById("detailedFirstImgShow").src = process.env.REACT_APP_SERVER_STATIC_HOST+errReport.firstImgPath + errReport.firstImgName
        }else{
            document.getElementById("detailedFirstImgShow").classList.add("hide");
        }
        
        if(errReport.secondImgName !== null){
            document.getElementById("detailedSecondImgShow").classList.remove("hide");
            document.getElementById("detailedSecondImgShow").src = process.env.REACT_APP_SERVER_STATIC_HOST+errReport.secondImgPath + errReport.secondImgName
        }else{
            document.getElementById("detailedSecondImgShow").classList.add("hide");
        }

        if(errReport.thirdImgName !== null){
            document.getElementById("detailedThirdImgShow").classList.remove("hide");
            document.getElementById("detailedThirdImgShow").src = process.env.REACT_APP_SERVER_STATIC_HOST+errReport.thirdImgPath + errReport.thirdImgName
        }else{
            document.getElementById("detailedThirdImgShow").classList.add("hide");
        }
        

    }

    const registerError = async () => {
        if(!(window.errType>=0 && window.errType<5)){   //사용자가 errType 조작한 경우
            window.errType=0;
        }
        if (document.getElementById("questionText").value.length < 5){
            nb_fadeInOutB("문의 내용은 최소 5글자 이상 작성하여 주시기 바랍니다.", 2000);
            return;
        }
        if (document.getElementById("questionText").value.length > 500){
            nb_fadeInOutB("1:1 문의 내용은 500글자 미만으로 입력 해주세요.", 2000);
            return;
        }
        let formData = new FormData(document.getElementById("oneToOneQuestion"));
        formData.append("errType", window.errType);
        let userAgent = navigator.userAgent.toLowerCase();
        if(userAgent.indexOf("windows")>-1){
            formData.append("osInfo", "windows");
            if(userAgent.indexOf("opr")>-1){
                formData.append("browser", "opr");
            }else if(userAgent.indexOf("edg")>-1){
                formData.append("browser", "edg");
            }else if(userAgent.indexOf("whale")>-1){
                formData.append("browser", "whale");
            }else if(userAgent.indexOf("firefox")>-1){
                formData.append("browser", "firefox");
            }else if(userAgent.indexOf("chrome")>-1){
                formData.append("browser", "chrome");
            }else{
                formData.append("browser", "etc");
            }
        }else if(userAgent.indexOf("mac")>-1){
            formData.append("osInfo", "mac");
            if(userAgent.indexOf("opr")>-1){
                formData.append("browser", "opr");
            }else if(userAgent.indexOf("edg")>-1){
                formData.append("browser", "edg");
            }else if(userAgent.indexOf("whale")>-1){
                formData.append("browser", "whale");
            }else if(userAgent.indexOf("firefox")>-1){
                formData.append("browser", "firefox");
            }else if(!(userAgent.indexOf("chrome")>-1) && userAgent.indexOf("safari")>-1){
                formData.append("browser", "safari");
            }else if(userAgent.indexOf("chrome")>-1 && userAgent.indexOf("safari")>-1){
                formData.append("browser", "chrome");
            }else{
                formData.append("browser", "etc");
            }
        }else{
            formData.append("osInfo", "etc");
            formData.append("browser", "etc");
        }
        let returnVal = await nb_formDataFetch("/serviceCenter/registerError", formData, true);
        if(returnVal.isSuccess === true){
            await nb_fadeInOutA("1:1 문의가 정상적으로 등록되었습니다.", 1500);
            document.getElementById("oneToOneQuestion").reset();
            document.getElementById("firstImgShow").src=image;
            document.getElementById("secondImgShow").src=image;
            document.getElementById("thirdImgShow").src=image;
            document.getElementById("errCloseBtn").click();
        }
      }

      const myErrList = myErrReport.map((errMap, idx) => {
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
                    <td>{errType}</td>
                    <td className='myQnATbContents' onClick={(event)=>{showDetaildErrReport(errMap)}}>{errMap.reportContents}</td>
                    <td className='alignCenter'>{errMap.sysCreateDate}</td>
                    <td className={reportSttsClassName + ' reportStts'}>{reportStts}</td>
                </tr>
      })

return (
    <>
        <div id="serviceCenter" className='blindBox hide'>
            <div className='serviceCenterRootDiv'>
                <div id="serviceCenterRootTitle" className='serviceCenterRootTitle'>{myNickName}님, 무엇을 도와 드릴까요?</div>
                <div className='serviceCenterTabMenu'>
                    <span id="servicePolicyTab" className='serviceCenterTab active' onClick={(event)=>{serviceCenterMenuClick(event, "servicePolicy")}}>운영정책</span>
                    <span id="serviceQuestionTab" className='serviceCenterTab' onClick={(event)=>{serviceCenterMenuClick(event, "serviceQuestion")}}>1:1 문의</span>
                    <span className='serviceCenterTab' onClick={(event)=>{serviceCenterMenuClick(event, "myQnA")}}>나의 문의내역</span>
                </div>
                <div id="errCloseBtn" className='closeBtn errCloseBtn' onClick={()=>{document.getElementById("serviceCenter").classList.add("hide");document.getElementById("serviceCenterQnADesc").innerHTML = "";window.errType = 0;}}>X</div>
                <div>
                   <div id="servicePolicy" className='serviceCenterMenuCon'>
                        <div className='mini-title9'>N명의수학 이용시 지켜주세요!</div>
                        <div>저작권</div>
                        <div>
                            <ul className='marginTenVetical'>
                                <li>N명의수학에서 제공되는 문제는 N명의수학 및 사용자가 정의한 저작권 범위를 따릅니다.</li>
                                <li>타인의 저작권을 침해하는 경우 이에대한 책임은 당사자에게 있으며 별도의 플랫폼 사용 제재가 있을 수 있습니다.</li>
                            </ul>
                        </div>
                        <div>유해 컨텐츠 제한</div>
                        <div>
                            <ul className='marginTenVetical'>
                                <li>욕설, 비하, 유해 등의 다른 사용자에게 불편함을 줄 수 있는 컨텐츠를 제공한 경우에는 컨텐츠 삭제(또는 비공개) 처리 되거나 사용에 제재가 있을 수 있습니다.</li>
                            </ul>
                        </div>
                   </div>
                   <div id="serviceQuestion" className='serviceCenterMenuCon hide'>
                        <div id="serviceCenterQnADesc" className="serviceCenterQnADesc"></div>
                        <div className='alignCenter'>
                            <form method="post" id="oneToOneQuestion" encType="multipart/form-data">
                                <textarea id="questionText" name="reportContents" className='questionText' placeholder='문의 사항을 남겨주세요...' />
                                <div className='imgAddDesc'>이미지는 최대 3장 등록 가능합니다.</div>
                                <div>
                                    <input id="firstImgName" className='hide' type="file" name="firstImgFile" accept="image/*" onChange={(event)=>{imgFileChange(event, "firstImgShow")}}/>
                                    <img id="firstImgShow" className='imgAddBtn' onClick={()=>{document.getElementById("firstImgName").click()}} src={image} alt=""/>
                                    <input id="secondImgName" className='hide' type="file" name="secondImgFile" accept="image/*" onChange={(event)=>{imgFileChange(event, "secondImgShow")}}/>
                                    <img id="secondImgShow" className='imgAddBtn' onClick={()=>{document.getElementById("secondImgName").click()}} src={image} alt=""/>
                                    <input id="thirdImgName" className='hide' type="file" name="thirdImgFile" accept="image/*" onChange={(event)=>{imgFileChange(event, "thirdImgShow")}}/>
                                    <img id="thirdImgShow" className='imgAddBtn' onClick={()=>{document.getElementById("thirdImgName").click()}} src={image} alt=""/>
                                </div>
                            </form>
                            <div id="oneToOneQustionBtn" className='errRegisterBtn marginTenAuto' onClick={()=>{registerError()}}>접수하기</div>
                        </div>
                   </div>
                   <div id="myQnA" className='serviceCenterMenuCon hide'>
                        <div id="myQnAList">
                            <table className='myQnATb'>
                                <tbody>
                                    <tr>
                                        <td>서비스 구분</td>
                                        <td>문의 내용</td>
                                        <td>등록일</td>
                                        <td className='reportStts'>상태</td>
                                    </tr>
                                    {myErrList}
                                </tbody>
                            </table>
                        </div>
                        <div id="detailedMyQna" className='detailedMyQna hide'>
                            <div className='backBtn' onClick={()=>{document.getElementById("detailedMyQna").classList.add("hide");document.getElementById("myQnAList").classList.remove("hide");document.getElementById("replyContentsDiv").classList.add("hide");}}>&#60; 뒤로가기</div>
                            <div className='detailedErrReportWrap'>
                                <div className='detailedErrReportTitle bi-jutify-align'>
                                    <span id="detailedReportStts" className='detailedReportStts'></span>
                                    <span id="detailedSysCreateDate" className='detailedSysCreateDate'></span>
                                </div>
                                <div id="detailedReportContents" className='detailedReportContents'></div>
                                <div className='alignCenter'>
                                    <img id="detailedFirstImgShow" className='imgAddBtn' src={image} alt=""/>
                                    <img id="detailedSecondImgShow" className='imgAddBtn' src={image} alt=""/>
                                    <img id="detailedThirdImgShow" className='imgAddBtn' src={image} alt=""/>
                                </div>
                            </div>
                            <div id="replyContentsDiv" className='hide detailedReplyDiv'>
                                <div className='detailedReplyTitle'>N명의수학 고객센터에서 답변 드립니다.</div>
                                <div id="replyContents"></div>
                            </div>
                            <div className='paddingFiveZero'></div>
                        </div>
                   </div> 
                </div>
            </div>
        </div>
    </>
    )
}

export default ServiceCenter;