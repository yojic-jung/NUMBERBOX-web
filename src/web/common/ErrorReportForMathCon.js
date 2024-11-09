import React, { useState, useEffect } from 'react';
import { nb_fadeInOutA, nb_postRequest, nb_getClientOS, nb_getClientBrowser, nb_postForm } from 'js/common/common_nb.js';
import { cs_toCsErrType } from 'js/cs/common_cs.js';

const ErrorReportForMathCon = ({ title, errType, parentMethod, conNo }) => {
  useEffect(() => {
    const asyncUseEffect = async function () {
      /*
        let returnVal = await nb_dataFetch("/serviceCenter/takeErrReport?contentsNo="+conNo+"&errType="+errType, true);
        if(returnVal.existErrReport !== null){
          document.getElementById("reportContents").value = returnVal.existErrReport.reportContents;
          document.getElementById("errRegisterBtn").innerHTML = "수정하기"
        }
        */
    };
    asyncUseEffect();
  }, []);

  const registerError = async () => {
    let formData = new FormData();
    formData.append('errType', await cs_toCsErrType(errType));
    formData.append('contentsId', conNo);
    formData.append('reportContents', document.getElementById('reportContents').value);
    formData.append('clientOs', await nb_getClientOS());
    formData.append('clientBrowser', await nb_getClientBrowser());
    let returnVal = await nb_postForm('/cs/error', formData, true);
    if (returnVal.status === 200) {
      await nb_fadeInOutA('오류 신고가 정상적으로 등록되었습니다.', 1500);
      document.getElementById('erroReportForConForm').reset();
      parentMethod(conNo);
    }
  };

  return (
    <div id='errorReportForContentsDiv' className='blindBox'>
      <div className='errorReportRootDiv'>
        <div id='errorReportRootTitle' className='errorReportRootTitle'>
          {title}
        </div>
        <div className='errorReportRootDesc'>오류 내용을 적어 주세요...(선택)</div>
        <div
          id='errCloseBtn'
          className='closeBtn errCloseBtn'
          onClick={() => {
            parentMethod();
          }}>
          X
        </div>
        <div>
          <form method='post' id='erroReportForConForm' encType='multipart/form-data'>
            <textarea id='reportContents' name='reportContents' className='errorReportContents' />
          </form>
        </div>
        <div
          id='errRegisterBtn'
          className='errRegisterBtn'
          onClick={() => {
            registerError();
          }}>
          접수하기
        </div>
      </div>
    </div>
  );
};

export default ErrorReportForMathCon;
