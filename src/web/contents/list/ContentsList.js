import React, { useState, useEffect } from 'react';
import { BrowserView, MobileView, isBrowser } from 'react-device-detect';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FormulaEditor from 'web/contents/register/FormulaEditor';
import EmptyList from 'web/common/EmptyList';
import CustomUnitSelBox from 'web/common/CustomUnitSelBox';
import UnitSelBox from 'web/common/UnitSelBox';
import DetailedContentsWrap from 'web/common/DetailedContentsWrap';
import {
  nb_dataFetch,
  nb_isLogin,
  nb_fCustomSelClose,
  nb_fadeInOut,
  nb_licenseUiCheck,
  nb_closeBtn,
  nb_detectScrollPosition,
  nb_moveToScroll,
  nb_modalScrollStrt,
  nb_modalScrollEnd,
  nb_multiChoiceGridSet,
  nb_getParameterByName,
  nb_topMenuFixed2,
  nb_getRequest,
  nb_postRequest,
  nb_deleteRequest,
} from 'js/common/common_nb.js';
import { reg_unitTypeChange, reg_eraseEditTbUI } from 'js/contents/register/contents_reg.js';
import 'css/common/nbScreen.css';
import defaultProfile from 'img/defaultProfileWhite.png';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';

let fExecuteWidth = false; //객관식 너비 변경 함수 실행여부 결정 변수
let scrollY = 0; //모달 팝업시 부모창 스크롤 위치
let subjectVal;
//let firUnitVal;
let secUnitVal;
let thrUnitVal;
let currentPath = '';
let curPageNum = 0;
let pageVolume = 100;
const ContentsList = () => {
  let location = useLocation();

  const [contentsList, setContentsList] = useState(new Array());
  const [subjectBox, setSubjectBox] = useState(new Array());
  //const [firUnitSelBox, setfirUnitSelBox] = useState(new Array());
  const [secUnitSelBox, setSecUnitSelBox] = useState(new Array());
  const [thrUnitSelBox, setThrUnitSelBox] = useState(new Array());
  const [contentsNo, setContentsNo] = useState('');
  const [modalState, setModalState] = useState(false); //모달시에 부모창 단원,유형정보 hide, 모달창은 쇼
  const [workListChanged, setWorkListChanged] = useState(true);
  const [emptyListMsg, setEmptyListMsg] = useState('단원 정보를 선택하여 원하는 문제를 찾아보세요.');
  const [errContentsNo, setErrContentsNo] = useState(0);

  const removeAddedEvent = () => {
    window.removeEventListener('scroll', nb_detectScrollPosition);
    if (isBrowser) window.removeEventListener('scroll', topMenuFixed);
  };

  const topMenuFixed = () => {
    if (isBrowser) nb_topMenuFixed2('workListUnitTypeRoot');
  };

  const modalPopupOpen = async (event) => {
    subjectVal = document.getElementById('subject').value;
    //firUnitVal = document.getElementById("firUnit").value;
    secUnitVal = document.getElementById('secUnit').value;
    thrUnitVal = document.getElementById('thrUnit').value;
    scrollY = nb_modalScrollStrt();

    document.getElementById('outerFormulaEditor').classList.remove('hide');
    let contentsNo = document.getElementById(event.target.id).dataset.contentsNo;
    await setContentsNo(contentsNo);
    setModalState(true);
  };

  const modalPopupClose = async (event, isSearch) => {
    window.removeEventListener('click', reg_eraseEditTbUI);
    await nb_closeBtn('outerFormulaEditor');
    await setModalState(false);

    //이전 검색조건 셋팅
    let trigEv = new Object();
    let sub = new Object();

    trigEv.target = sub;
    trigEv.target.id = 'subject';
    document.getElementById('subject').value = subjectVal;
    await reg_unitTypeChange(trigEv, 'cusSelSecUnit', 'secUnit', true);
    document.getElementById('subject').value = subjectVal;
    document.getElementById('cusSelSubTitle').innerHTML = document.getElementById('subject')[document.getElementById('subject').selectedIndex].innerText;
    document.getElementById('cusSelSubDiv').classList.add('nbCustomSelected');
    await reg_unitTypeChange(trigEv, 'cusSelSecUnit', 'secUnit', true);
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

    if (secUnitVal !== '대단원') {
      document.getElementById('secUnit').value = secUnitVal;
      document.getElementById('cusSelSecUnitTitle').innerHTML = document.getElementById('secUnit')[document.getElementById('secUnit').selectedIndex].innerText;
      document.getElementById('cusSelSecUnitDiv').classList.add('nbCustomSelected');
      trigEv.target.id = 'secUnit';
      await reg_unitTypeChange(trigEv, 'cusSelThrUnit', 'thrUnit', true);
    }
    if (thrUnitVal !== '중단원') {
      document.getElementById('thrUnit').value = thrUnitVal;
      document.getElementById('cusSelThrUnitTitle').innerHTML = document.getElementById('thrUnit')[document.getElementById('thrUnit').selectedIndex].innerText;
      document.getElementById('cusSelThrUnitDiv').classList.add('nbCustomSelected');
    }

    //모달창에서 저장하기 버튼을 누른 경우에만 검색
    //event.isTrusted 자바스크립트 내장객체로 사용자 액션으로 실행 된 경우 true, 자바스크립트 이벤트로 강제 발생시 false
    if (!event.isTrusted) {
      //사용자가 문제 등록 한 경우
      let mathContents = window.mathContents;
      let objIdx = null;
      if (mathContents !== undefined) {
        //변형문제에서는 문제가 수정되는게 아니라 추가되기 때문에 수정한 컨텐츠가 없으므로 컨텐츠 가져오지 않음
        contentsList.forEach(function (element, idx) {
          if (element.contentsId === mathContents.contentsId) {
            objIdx = idx;
            return false;
          }
        });
        contentsList[objIdx] = mathContents;
        window.mathContents = null; //윈도우 전역변수 객체 초기화
        setWorkListChanged(false);
        setWorkListChanged(true);
      } else {
        window.mathContents = null; //윈도우 전역변수 객체 초기화
      }

      document.getElementById('imgUpdt').value = 'N';
    } else if (event.isTrusted && document.getElementById('imgUpdt').value === 'Y') {
      //사용자 액션(모달창 닫기 버튼 직접 클릭 한 경우)
      let mathContents = window.mathContents;
      let objIdx = null;
      contentsList.forEach(function (element, idx) {
        if (element.contentsNo === mathContents.contentsNo) {
          objIdx = idx;
          return false;
        }
      });
      contentsList[objIdx] = mathContents;
      window.mathContents = null; //윈도우 전역변수 객체 초기화
      setWorkListChanged(false);
      setWorkListChanged(true);
      document.getElementById('imgUpdt').value = 'N';
    }
    await nb_multiChoiceGridSet('quesConMultiShow');
    nb_modalScrollEnd(scrollY);
  };

  const makeQueryString = () => {
    let unitId = nb_getParameterByName('unitId');
    let contentsNo = nb_getParameterByName('contentsNo');

    let queryString = '?searchType=' + nb_getParameterByName('searchType');
    if (unitId !== '') queryString += '&unitId=' + unitId;
    else if (contentsNo !== '') queryString += '?contentsNo=' + contentsNo;
    return queryString;
  };

  useEffect(() => {
    let queryString = makeQueryString();
    if (currentPath === location.pathname && queryString === '') {
      if (contentsList.length !== 0) {
        setContentsList([]);
        document.getElementById('subject').selectedIndex = 0;
        document.getElementById('cusSelSubTitle').innerHTML = document.getElementById('subject')[0].innerText;
        document.getElementById('cusSelSubDiv').classList.remove('nbCustomSelected');
      }
    }
    currentPath = location.pathname;
    const asyncUseEffect = async function () {
      let jsonObj = await nb_dataFetch('/public/math/menu/unit?onlyExistUnit=true', true);
      setSubjectBox(jsonObj.data['subjectList']);
      setSecUnitSelBox(jsonObj.data['secUnitList']);
      setThrUnitSelBox(jsonObj.data['thrUnitList']);
      //초기 단원 및 유형정보 셋팅
      let trigEv = new Object();
      let sub = new Object();
      trigEv.target = sub;
      trigEv.target.id = 'subject';
      await reg_unitTypeChange(trigEv, 'cusSelSecUnit', 'secUnit', true);

      let queryString = makeQueryString();
      if (queryString !== '' && queryString.includes('unitId')) {
        historyBackSearchCondSetting(queryString);
      } else if (queryString !== '' && queryString.includes('contentsId')) {
        searchWorkListByContentsNo(param2, false);
      }
    };
    if (!fExecuteWidth) {
      asyncUseEffect();
      document.body.addEventListener('click', nb_fCustomSelClose);
    } else {
      if (contentsList.length !== 0) {
        nb_multiChoiceGridSet('quesConMultiShow');
      }
      fExecuteWidth = false;
    }
    window.addEventListener('scroll', nb_detectScrollPosition);
    window.addEventListener('scroll', topMenuFixed);
    return () => removeAddedEvent();
  }, [contentsList, location]);

  const historyBackSearchCondSetting = async (queryString) => {
    curPageNum = 0;
    queryString += '&pageNum=' + curPageNum;
    queryString += '&pageVolume=' + pageVolume;

    let returnObj = await nb_getRequest('/math/content/list' + queryString, true);

    if (returnObj.status === 200) {
      fExecuteWidth = true;
      setContentsList(returnObj.data.contents);
    }

    if (returnObj.data.contents.length == pageVolume) document.getElementById('showMoreContents').classList.remove('hide');
    else document.getElementById('showMoreContents').classList.add('hide');

    //이전 검색조건 셋팅
    let trigEv = new Object();
    let sub = new Object();

    trigEv.target = sub;
    trigEv.target.id = 'subject';

    let searchType = await nb_getParameterByName('searchType');

    let subject = document.getElementById('subject');
    let selectedIdx = 0;
    let subjectOptList = subject.childNodes;

    const urlParams = new URLSearchParams(queryString);

    let unitId = '';
    let searchTypeArr = ['Subject', 'FirUnit', 'SecUnit', 'ThrUnit'];
    if (searchTypeArr.includes(searchType)) unitId = urlParams.get('unitId');

    for (let i = 0; i < subjectOptList.length; i++) {
      if (subjectOptList[i].dataset.uniqNo > unitId) break;
      else selectedIdx = i;
    }
    subject.selectedIndex = selectedIdx;
    subjectVal = subject.value;
    await reg_unitTypeChange(trigEv, 'cusSelSecUnit', 'secUnit', true);
    document.getElementById('subject').value = subjectVal;
    document.getElementById('cusSelSubTitle').innerHTML = document.getElementById('subject')[document.getElementById('subject').selectedIndex].innerText;
    document.getElementById('cusSelSubDiv').classList.add('nbCustomSelected');

    let secUnit = document.getElementById('secUnit');
    selectedIdx = 0;
    let secUnitOptList = secUnit.childNodes;
    for (let i = 0; i < secUnitOptList.length; i++) {
      if (secUnitOptList[i].dataset.uniqNo > unitId) {
        break;
      } else {
        selectedIdx = i;
      }
    }

    if (searchType === 'Subject') return;
    secUnit.selectedIndex = selectedIdx;
    secUnitVal = secUnit.value;
    await reg_unitTypeChange(trigEv, 'cusSelThrUnit', 'thrUnit', true);

    document.getElementById('secUnit').value = secUnitVal;
    document.getElementById('cusSelSecUnitTitle').innerHTML = document.getElementById('secUnit')[document.getElementById('secUnit').selectedIndex].innerText;
    document.getElementById('cusSelSecUnitDiv').classList.add('nbCustomSelected');
    trigEv.target.id = 'secUnit';
    let thrUnit = document.getElementById('thrUnit');
    selectedIdx = 0;
    let thrUnitOptList = thrUnit.childNodes;
    for (let i = 0; i < thrUnitOptList.length; i++) {
      if (thrUnitOptList[i].dataset.uniqNo === unitId) {
        selectedIdx = i;
      }
    }

    if (searchType === 'SecUnit') return;
    thrUnit.selectedIndex = selectedIdx;
    thrUnitVal = thrUnit.value;
    await reg_unitTypeChange(trigEv, 'cusSelThrUnit', 'thrUnit', true);

    document.getElementById('thrUnit').value = thrUnitVal;
    document.getElementById('cusSelThrUnitTitle').innerHTML = document.getElementById('thrUnit')[document.getElementById('thrUnit').selectedIndex].innerText;
    document.getElementById('cusSelThrUnitDiv').classList.add('nbCustomSelected');
  };

  const errorReportOpen = async (contentsNo) => {
    setErrContentsNo(contentsNo);
  };

  const errorReportClose = async (contentsNo) => {
    setErrContentsNo(0);
  };

  const modalBaseLikeChange = async (contentsno, isDel) => {
    if (isDel) {
      document.getElementById('contentsLike' + contentsno).classList.remove('active');
    } else {
      document.getElementById('contentsLike' + contentsno).classList.add('active');
    }
  };

  const modalBaseRepoChange = async (contentsno, isDel) => {
    if (isDel) {
      document.getElementById('contentsRepo' + contentsno).classList.remove('active');
    } else {
      document.getElementById('contentsRepo' + contentsno).classList.add('active');
    }
  };

  const putInMyRepo = async (event, contentsId) => {
    let jsonReq = new Object();
    jsonReq.contentsId = contentsId;
    if (event.target.classList.contains('active')) {
      let rsBody = await nb_deleteRequest('/math/repo/content/' + contentsId, null, false);
      if (rsBody.status == 200) event.target.classList.remove('active');
    } else {
      let rsBody = await nb_postRequest('/math/repo/content', jsonReq, false);
      if (rsBody.status == 200) event.target.classList.add('active');
    }
  };

  const likeContents = async (event, contentsId) => {
    let jsonReq = new Object();
    jsonReq.contentsId = contentsId;
    if (event.target.classList.contains('active')) {
      let rsBody = await nb_deleteRequest('/math/like/content/' + contentsId, null, false);
      if (rsBody.status == 200) event.target.classList.remove('active');
    } else {
      let rsBody = await nb_postRequest('/math/like/content', jsonReq, false);
      if (rsBody.status == 200) event.target.classList.add('active');
    }
  };

  const searchMyWorkList = async function (hasNotiPhrases) {
    if (!nb_isLogin()) {
      if (isBrowser) alert('로그인 이후 사용해주시기 바랍니다.');
      else alert('PC에서 사용 가능한 서비스 입니다.');
      return;
    }
    curPageNum = 0;
    let customSubject = document.getElementById('cusSelSubTitle');
    let subject = document.getElementById('subject');
    let secUnit = document.getElementById('secUnit');
    let thrUnit = document.getElementById('thrUnit');

    if (customSubject.innerText == '과목' || subject.selectedIndex == 0) {
      alert('과목을 선택해주세요.');
      return false;
    }

    let unitId = '';
    // 학년으로 검색한 경우
    if (subject.selectedIndex !== 0) {
      unitId = '?searchType=Subject&unitId=' + subject[subject.selectedIndex].dataset.unitId;
    }

    // 중단원으로 검색한 경우
    if (secUnit.selectedIndex !== 0) {
      unitId = '?searchType=SecUnit&unitId=' + secUnit[secUnit.selectedIndex].dataset.unitId;
    }

    // 소단원으로 검색한 경우
    if (thrUnit.selectedIndex !== 0) {
      unitId = '?searchType=ThrUnit&unitId=' + thrUnit[thrUnit.selectedIndex].dataset.unitId;
    }
    unitId += '&pageNum=' + curPageNum + '&pageVolume=' + pageVolume;

    let returnObj = await nb_getRequest('/math/content/list' + unitId, true);

    let param = nb_getParameterByName('unitId');
    if (param !== thrUnit[thrUnit.selectedIndex].dataset.uniqNo) {
      if (unitId !== '') {
        window.history.pushState('', '문제검색', '/contentsList' + unitId);
      } else {
        window.history.pushState('', '문제검색', '/contentsList' + thrUnit[thrUnit.selectedIndex].dataset.uniqNo);
      }
    }

    if (returnObj.status == 200) {
      fExecuteWidth = true;
      if (returnObj.data.total === 0) {
        // setConRepoInfoList(returnObj.data.contents);
        // setConLikeInfoList(returnObj.data.contents);
        setContentsList(returnObj.data.contents);
        if (hasNotiPhrases) {
          await nb_fadeInOut('단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.', 2000);
          setEmptyListMsg('단원정보를 수정하신 경우 수정한 단원에서 확인이 가능합니다.');
        } else {
          await nb_fadeInOut('해당하는 단원에 문제 내역이 없습니다.', 2000);
          setEmptyListMsg('검색 결과가 없습니다. 해당 단원에 등록되어있는 문제가 없습니다.', 2000);
        }
      } else {
        if (returnObj.data.contents.length == pageVolume) {
          document.getElementById('showMoreContents').classList.remove('hide');
        } else {
          document.getElementById('showMoreContents').classList.add('hide');
        }

        setContentsList(returnObj.data.contents);
        if (hasNotiPhrases) await nb_fadeInOut('정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.', 2000);
        else await nb_fadeInOut('문제 내역이 정상적으로 조회되었습니다.', 2000);
      }
    }
  };

  const showMoreContents = async function () {
    let queryString = '?searchType=' + (await nb_getParameterByName('searchType'));
    queryString += '&unitId=' + (await nb_getParameterByName('unitId'));

    curPageNum++;
    queryString += '&pageNum=' + curPageNum;
    queryString += '&pageVolume=' + pageVolume;
    let returnObj = await nb_getRequest('/math/content/list' + queryString, true);
    if (returnObj.data.contents.length == pageVolume) {
      document.getElementById('showMoreContents').classList.remove('hide');
    } else {
      document.getElementById('showMoreContents').classList.add('hide');
    }
    fExecuteWidth = true;

    setContentsList([...contentsList, ...returnObj.data.contents]);
    await nb_fadeInOut('문제 내역이 정상적으로 조회되었습니다.', 2000);
  };

  const searchWorkListByContentsNo = async function (contentsNoParam, hasNotiPhrases) {
    let returnObj = await nb_dataFetch('/mathInfo/takeContentsListByContentsNo?contentsno=' + contentsNoParam, true);
    if (returnObj.error != undefined) {
      alert('[' + returnObj.status + ' ' + returnObj.error + ']\n에러 메시지 : ' + returnObj.message);
    }

    if (returnObj['isSearched']) {
      fExecuteWidth = true;
      if (returnObj['mathContents'].length === 0) {
        // setConRepoInfoList(returnObj.data.contents);
        // setConLikeInfoList(returnObj.data.contents);
        setContentsList(returnObj['mathContents']);
        await nb_fadeInOut('해당하는 문제가 없습니다.', 2000);
        setEmptyListMsg('검색 결과가 없습니다. 해당 문제가 없습니다.', 2000);
      } else {
        window.history.pushState('', '문제검색', '/contentsList?unitId=0&contentsno=' + contentsNoParam);

        // setConRepoInfoList(returnObj.data.contents);
        // setConLikeInfoList(returnObj.data.contents);
        setContentsList(returnObj['mathContents']);
        if (hasNotiPhrases) await nb_fadeInOut('정상적으로 수정되었습니다. 수정된 결과를 확인해보세요.', 2000);
        else await nb_fadeInOut('문제 내역이 정상적으로 조회되었습니다.', 2000);

        if (contentsNoParam === 'allUserContents') {
          let allBtn = document.querySelectorAll('.userSearchBtn, .updateBtn, .errBtn');
          for (let i = 0; i < allBtn.length; i++) {}
        } else {
          let allBtn = document.querySelectorAll('.userSearchBtn, .updateBtn, .errBtn');
          for (let i = 0; i < allBtn.length; i++) {}
        }
      }
    }
  };

  const showDetailConInfo = async (event, contentsId, userNo) => {
    if (event.target.classList.contains('errBtn')) return;
    document.getElementById('detailedContentsLike').classList.remove('active');
    document.getElementById('detailedContentsRepo').classList.remove('active');

    document.getElementById('detailedContentsLike').dataset.contentsNo = contentsId;
    if (document.getElementById('contentsLike' + contentsId).classList.contains('active')) {
      document.getElementById('detailedContentsLike').classList.add('active');
    } else {
      document.getElementById('detailedContentsLike').classList.remove('active');
    }

    document.getElementById('detailedContentsRepo').dataset.contentsNo = contentsId;
    if (document.getElementById('contentsRepo' + contentsId).classList.contains('active')) {
      document.getElementById('detailedContentsRepo').classList.add('active');
    } else {
      document.getElementById('detailedContentsRepo').classList.remove('active');
    }

    document.getElementById('detailedConDiv').classList.remove('hide');
    document.getElementById('likeRepoWrap').classList.remove('hide');
    let contents;
    contentsList.forEach(function (element, idx) {
      if (element.contentsId === Number(contentsId)) {
        contents = element;
        return false;
      }
    });
    document.getElementById('quesDetailedContents').innerHTML = contents.contents;

    if (contents.firNo !== '') {
      document.getElementById('workMultiDetailedShow').classList.remove('hide');
      document.getElementById('firDetailedDiv').innerHTML = contents.firNo;
      document.getElementById('secDetailedDiv').innerHTML = contents.secNo;
      document.getElementById('thrDetailedDiv').innerHTML = contents.thrNo;
      document.getElementById('fourDetailedDiv').innerHTML = contents.fourNo;
      document.getElementById('fifDetailedDiv').innerHTML = contents.fifNo;
    } else {
      document.getElementById('workMultiDetailedShow').classList.add('hide');
    }

    if (contents.contentsImg !== null && contents.contentsImg !== undefined) {
      document.getElementById('quesDetailedImg-show').classList.remove('hide');
      document.getElementById('contentsDetailedImgOutput').src = process.env.REACT_APP_SERVER_STATIC_HOST + contents.imgPath + contents.contentsImg;
    } else {
      document.getElementById('quesDetailedImg-show').classList.add('hide');
    }
    if (contents.solutionImg !== null && contents.solutionImg !== undefined) {
      document.getElementById('solDetailedImg-show').classList.remove('hide');
      document.getElementById('solutionDetailedImgOutput').src = process.env.REACT_APP_SERVER_STATIC_HOST + contents.solutionImgPath + contents.solutionImg;
    } else {
      document.getElementById('solDetailedImg-show').classList.add('hide');
    }

    document.getElementById('solDetailedContents').innerHTML = contents.solution;

    if (contents.answer !== null && contents.answer !== undefined) {
      document.getElementById('answerDetailedSheet').innerHTML = contents.answer;
    }
    if (contents.choiceAnswer !== null && contents.choiceAnswer !== undefined) {
      document.getElementById('answerDetailedSheet').innerHTML = contents.choiceAnswer;
    }

    if (contents.contentsClassify === 'UserCustom') {
      let profileImgPath = defaultProfile;
      if (contents.profileImgName !== null && contents.profileImgPath !== null) {
        profileImgPath = process.env.REACT_APP_SERVER_STATIC_HOST + contents.profileImgPath + contents.profileImgName;
      }
      document.getElementById('detailedConImg').classList.remove('hide');
      document.getElementById('detailedConImg').src = profileImgPath;
      document.getElementById('userNickname').innerHTML = contents.membersProfile.nickname;
      document.getElementById('nicknamewrap').classList.remove('manager');
      document.getElementById('nicknamewrap').dataset.userNo = userNo;
      await nb_licenseUiCheck(contents.mathContentsLicense[0]);
    } else {
      document.getElementById('detailedConImg').classList.add('hide');
      document.getElementById('userNickname').innerHTML = 'N명의수학';
      document.getElementById('nicknamewrap').classList.add('manager');
      document.getElementById('nicknamewrap').dataset.userNo = 0;
      await nb_licenseUiCheck();
    }
    await nb_multiChoiceGridSet('quesDetailedConMultiShow');
  };

  const workContentsList = contentsList.map((contentsMap, idx) => {
    let isMultiHide = 'hide';
    if (contentsMap.firNo !== '') {
      isMultiHide = '';
    }
    let isConImgHide = 'hide';
    if (contentsMap.contentsImg !== null) {
      isConImgHide = '';
    }

    let updateBtnId = 'updateContenstBtn' + idx;

    let conImgPath;
    if (contentsMap.contentsImg === null) conImgPath = '';
    else conImgPath = process.env.REACT_APP_S3_PATH + contentsMap.imgPath + contentsMap.contentsImg;
    let profileImgPath = defaultProfile;
    if (contentsMap.profileImgPath !== null && contentsMap.profileImgName !== null) {
      profileImgPath = process.env.REACT_APP_S3_PATH + contentsMap.profileImgPath + contentsMap.profileImgName;
    }

    //이미지로 등록한 문제 여부
    let isImgRegContents = false;
    if (contentsMap.contentsImg !== null && contentsMap.imgPath !== null) {
      isImgRegContents = true;
    }

    let isMyRepoContents = '';
    if (contentsMap.isMyRepoContents) isMyRepoContents = ' active';

    let isLikeContents = '';
    if (contentsMap.isLikeContents) isLikeContents = ' active';

    return (
      <div id='workContentsDiv' className='contentsDiv userSearchPage' key={idx}>
        <table className='workListTable userSearchPage'>
          <thead>
            <tr className='workListTBHead2'>
              <td>
                <div className='justifyAlign'>
                  <div>
                    <span className='userSearchBtn'>
                      <span
                        id={'contentsRepo' + contentsMap.contentsId}
                        className={'putRepoBtn' + isMyRepoContents}
                        onClick={(event) => {
                          putInMyRepo(event, contentsMap.contentsId);
                        }}></span>
                      <span className='putRepoToolTip'>나의 저장소에 저장되었습니다</span>
                    </span>
                    <span className='userSearchBtn'>
                      <span
                        id={'contentsLike' + contentsMap.contentsId}
                        className={'likeBtn' + isLikeContents}
                        onClick={(event) => {
                          likeContents(event, contentsMap.contentsId);
                        }}></span>
                    </span>
                    {contentsMap.contentsClassify === 'InHouse' ? (
                      <span className='userSearchBtn manager'>N명의수학</span>
                    ) : (
                      <Link className='linkNoneCss' to={'/userProfile?userNo=' + contentsMap.profileId}>
                        <span className='userSearchBtn'>
                          <img src={profileImgPath} alt='' className='contentsListProfile' /> {contentsMap.nickname}
                        </span>
                      </Link>
                    )}
                  </div>
                  {!isImgRegContents && (
                    <div className='relative'>
                      <button
                        id={updateBtnId}
                        type='button'
                        data-contents-no={contentsMap.contentsId}
                        className='updateBtn'
                        onClick={(event) => {
                          modalPopupOpen(event);
                        }}>
                        변형문제 만들기
                        {contentsMap.transConCnt !== 0 && <span className='transConCntCircle'>{contentsMap.transConCnt}</span>}
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                className='td1 userSearchPage backHover'
                onClick={(event) => {
                  showDetailConInfo(event, contentsMap.contentsId, contentsMap.profileId);
                }}>
                <div className='userSearchCon'>
                  <div id='workQuesShow' className='workQuesShow quesRootDiv'>
                    <div className='quesDiv'>
                      <div
                        className='quesContents'
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.contents,
                        }}></div>
                      <div id='quesImg-show' className={'quesImg-show ' + isConImgHide}>
                        <img src={conImgPath} id='contentsImgOutput' alt='' />
                      </div>
                      <div id='workMultiShow' className={'quesConMultiShow ' + isMultiHide}>
                        <div className='firDiv'>
                          <span className='multiChoiceNo'>&#9312;</span>
                          <span
                            className='firDivContents'
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.firNo,
                            }}></span>
                        </div>
                        <div className='secDiv'>
                          <span className='multiChoiceNo'>&#9313;</span>
                          <span
                            className='secDivContents'
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.secNo,
                            }}></span>
                        </div>
                        <div className='thrDiv'>
                          <span className='multiChoiceNo'>&#9314;</span>
                          <span
                            className='thrDivContents'
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.thrNo,
                            }}></span>
                        </div>
                        <div className='fourDiv'>
                          <span className='multiChoiceNo'>&#9315;</span>
                          <span
                            className='fourDivContents'
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.fourNo,
                            }}></span>
                        </div>
                        <div className='fifDiv'>
                          <span className='multiChoiceNo'>&#9316;</span>
                          <span
                            className='fifDivContents'
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.fifNo,
                            }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className='errBtn topErrBtn'
                  onClick={() => {
                    errorReportOpen(contentsMap.contentsId);
                  }}
                  onMouseOver={(event) => {
                    event.target.closest('.td1').classList.remove('backHover');
                  }}
                  onMouseOut={(event) => {
                    event.target.closest('.td1').classList.add('backHover');
                  }}></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  });

  return (
    <>
      <Helmet>
        <title>수학문제 목록</title>
        <meta name='description' content='원하는 수학문제를 찾아보세요!' />
        <link rel='canonical' href='https://nsoohak.com/contentsList' />
        <meta property='og:title' content='수학문제 목록' />
        <meta property='og:description' content='원하는 수학문제를 찾아보세요!' />
      </Helmet>
      <BrowserView>
        <div id='scrollMoveBtn' className='scrollMoveBtn hide'>
          <div
            id='conListScrollToTop'
            className='conListScrollToTop'
            tooltip='맨 위로'
            onClick={() => {
              nb_moveToScroll(true);
            }}></div>
          <div id='conScrollCenterCircle' className='conScrollCenterCircle'></div>
          <div
            id='conListScrollToBottom'
            className='conListScrollToBottom'
            tooltip='맨 아래로'
            onClick={() => {
              nb_moveToScroll(false);
            }}></div>
        </div>

        {!modalState && (
          <div>
            <div id='workListUnitTypeRoot' className='workListUnitTypeRoot'>
              <form method='post' id='workSearchForm'>
                <div id='workListUnitType' className='workListUnitType'>
                  <div className='mini-title5'>&nbsp; N명의수학에서 원하는 문제를 찾아보세요.</div>
                  <CustomUnitSelBox
                    value={subjectBox}
                    cusSelId='cusSelSub'
                    cusChildId='cusSelSecUnit'
                    childId='secUnit'
                    originSel='subject'
                    parentMethod={() => {}}
                    title='과목'></CustomUnitSelBox>
                  <UnitSelBox value={subjectBox} myId='subject' cusChildId='cusSelSecUnit' childId='secUnit' isUnitBubbleEv={true} parentMethod={() => {}}></UnitSelBox>
                  {/*
                                <CustomUnitSelBox value={firUnitSelBox} cusSelId="cusSelFirUnit" cusChildId="cusSelSecUnit" childId="secUnit" originSel="firUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
                                <UnitSelBox value={firUnitSelBox} myId="firUnit" cusChildId="cusSelSecUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                */}
                  <CustomUnitSelBox
                    value={secUnitSelBox}
                    cusSelId='cusSelSecUnit'
                    cusChildId='cusSelThrUnit'
                    childId='thrUnit'
                    originSel='secUnit'
                    parentMethod={() => {}}
                    title='대단원'></CustomUnitSelBox>
                  <UnitSelBox value={secUnitSelBox} myId='secUnit' cusChildId='cusSelThrUnit' childId='thrUnit' isUnitBubbleEv={true} parentMethod={() => {}}></UnitSelBox>

                  <CustomUnitSelBox
                    value={thrUnitSelBox}
                    cusSelId='cusSelThrUnit'
                    cusChildId='cusSelQuesType'
                    childId='quesType'
                    originSel='thrUnit'
                    parentMethod={() => {}}
                    title='중단원'></CustomUnitSelBox>
                  <UnitSelBox value={thrUnitSelBox} myId='thrUnit' cusChildId='cusSelQuesType' childId='quesType' isUnitBubbleEv={false} parentMethod={() => {}}></UnitSelBox>

                  <button type='button' className='orangeBtn' onClick={() => searchMyWorkList(false)}>
                    검색
                  </button>
                </div>
              </form>
            </div>
            <div className='workList'>
              {workListChanged && workContentsList.length !== 0 ? (
                <div className='contents-show userSearchPage' id='contents-show'>
                  {workContentsList}
                </div>
              ) : (
                <EmptyList msg={emptyListMsg} imgName='searchList' addImgClass='' />
              )}
              <DetailedContentsWrap isBasedParent={true} modalRepoChange={modalBaseRepoChange} modalLikeChange={modalBaseLikeChange} />
            </div>
          </div>
        )}
        <div
          id='showMoreContents'
          className='showMoreContents hide'
          onClick={() => {
            showMoreContents();
          }}>
          검색정보 더보기
        </div>
        <div className='paddingFiveZero'></div>

        <div id='outerFormulaEditor' className='fixedBox popupBox hide'>
          <div
            id='modalFormulCloseBtn'
            className='closeBtn'
            onClick={(event) => {
              modalPopupClose(event);
            }}>
            &#88;
          </div>
          {modalState && <FormulaEditor contentsNo={contentsNo} isUser={true} contentsClassify={'Modified'} />}
        </div>
        <input id='imgUpdt' className='hide' type='text' defaultValue='N' />

        {errContentsNo !== 0 && <ErrorReportForMathCon parentMethod={errorReportClose} conNo={errContentsNo} errType={1} title='문제 오류 신고' />}
      </BrowserView>
      <MobileView>
        <div id='scrollMoveBtn' className='scrollMoveBtn hide'>
          <div
            id='conListScrollToTop'
            className='conListScrollToTop'
            tooltip='맨 위로'
            onClick={() => {
              nb_moveToScroll(true);
            }}></div>
          <div id='conScrollCenterCircle' className='conScrollCenterCircle'></div>
          <div
            id='conListScrollToBottom'
            className='conListScrollToBottom'
            tooltip='맨 아래로'
            onClick={() => {
              nb_moveToScroll(false);
            }}></div>
        </div>

        {!modalState && (
          <div>
            <div id='workListUnitTypeRoot' className='workListUnitTypeRoot mobile'>
              <form method='post' id='workSearchForm'>
                <div id='workListUnitType' className='workListUnitType mobile'>
                  <div className='mini-title5'>&nbsp; PC버전으로 접속하여 원하는 문제를 찾아보세요.</div>
                  <CustomUnitSelBox
                    value={subjectBox}
                    cusSelId='cusSelSub'
                    cusChildId='cusSelSecUnit'
                    childId='secUnit'
                    originSel='subject'
                    parentMethod={() => {}}
                    title='과목'></CustomUnitSelBox>
                  <UnitSelBox value={subjectBox} myId='subject' cusChildId='cusSelSecUnit' childId='secUnit' isUnitBubbleEv={true} parentMethod={() => {}}></UnitSelBox>
                  {/*
                                <CustomUnitSelBox value={firUnitSelBox} cusSelId="cusSelFirUnit" cusChildId="cusSelSecUnit" childId="secUnit" originSel="firUnit" parentMethod={()=>{}} title="대단원"></CustomUnitSelBox>
                                <UnitSelBox value={firUnitSelBox} myId="firUnit" cusChildId="cusSelSecUnit" childId="secUnit"  isUnitBubbleEv={true} parentMethod={()=>{}}></UnitSelBox>
                                */}
                  <CustomUnitSelBox
                    value={secUnitSelBox}
                    cusSelId='cusSelSecUnit'
                    cusChildId='cusSelThrUnit'
                    childId='thrUnit'
                    originSel='secUnit'
                    parentMethod={() => {}}
                    title='대단원'></CustomUnitSelBox>
                  <UnitSelBox value={secUnitSelBox} myId='secUnit' cusChildId='cusSelThrUnit' childId='thrUnit' isUnitBubbleEv={true} parentMethod={() => {}}></UnitSelBox>

                  <CustomUnitSelBox
                    value={thrUnitSelBox}
                    cusSelId='cusSelThrUnit'
                    cusChildId='cusSelQuesType'
                    childId='quesType'
                    originSel='thrUnit'
                    parentMethod={() => {}}
                    title='중단원'></CustomUnitSelBox>
                  <UnitSelBox value={thrUnitSelBox} myId='thrUnit' cusChildId='cusSelQuesType' childId='quesType' isUnitBubbleEv={false} parentMethod={() => {}}></UnitSelBox>

                  <button type='button' className='orangeBtn' onClick={() => searchMyWorkList(false)}>
                    검색
                  </button>
                </div>
              </form>
            </div>
            <div className='workList mobile'>
              {workListChanged && workContentsList.length !== 0 ? (
                <div className='contents-show userSearchPage' id='contents-show'>
                  {workContentsList}
                </div>
              ) : (
                <EmptyList msg='' imgName='searchList' addImgClass='' />
              )}
              <DetailedContentsWrap isBasedParent={true} modalRepoChange={modalBaseRepoChange} modalLikeChange={modalBaseLikeChange} />
            </div>
          </div>
        )}

        <div id='outerFormulaEditor' className='fixedBox popupBox hide'>
          <div
            id='modalFormulCloseBtn'
            className='closeBtn'
            onClick={(event) => {
              modalPopupClose(event);
            }}>
            &#88;
          </div>
          {modalState && <FormulaEditor contentsNo={contentsNo} isUser={true} contentsClassify={'Modified'} />}
        </div>
        <input id='imgUpdt' className='hide' type='text' defaultValue='N' />

        {errContentsNo !== 0 && <ErrorReportForMathCon parentMethod={errorReportClose} conNo={errContentsNo} errType={1} title='문제 오류 신고' />}
      </MobileView>
    </>
  );
};

export default ContentsList;
