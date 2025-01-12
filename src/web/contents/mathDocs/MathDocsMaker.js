import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserView, MobileView, isBrowser } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import 'css/page/mathDocs.css';
import { cvt_htmlToTexAll } from 'js/convertGrammer/nbToTexConvert_cvt.js';
import {
  nb_isLogin,
  nb_dataFetch,
  nb_formDataFetch,
  nb_moveToScrollAllRange,
  nb_multiChoiceGridSet,
  nb_fadeInOutA,
  nb_fadeInOutB,
  nb_confirmBox,
  nb_getParameterByName,
  nb_getRequest,
  nb_postRequest,
  nb_putRequest,
  nb_postForm,
  nb_getClientOS,
  nb_getClientBrowser,
} from 'js/common/common_nb.js';
import CustomPieChart from 'web/common/CustomPieChart';
import CustomBarChart from 'web/common/CustomBarChart';
import { ReactSortable } from 'react-sortablejs';
import MyContentsSearchFilter from 'web/common/MyContentsSearchFilter';
import ErrorReportForMathCon from 'web/common/ErrorReportForMathCon';
import MultiRangeSlider from 'web/common/MultiRangeSlider';
import MathDocsPaperA from 'web/contents/mathDocs/MathDocsPaperA';
import { reg_removeStyleAttribute } from 'js/contents/register/contents_reg';
import hourglass from 'img/hourglass.gif';

let currentPath = '';
let curPageNumByProd = 0;
let curPageNumByRepo = 0;
let pageVolume = 100;
const MathDocsMaker = () => {
  let location = useLocation();

  const [showFinalPopup, setShowFinalPopup] = useState(true);
  const [mathDocsId, setMathDocsId] = useState(0);
  const [isInnerPage, setIsInnerPage] = useState(false);
  const [mathDocsPerPageCnt, setMathDocsPerPageCnt] = useState(4);
  const [mathDocsSubTitle, setMathDocsSubTitle] = useState('');
  const [mathDocsTitle, setMathDocsTitle] = useState('');
  const [mathDocsGrade, setMathDocsGrade] = useState('');
  const [mathDocsOwner, setMathDocsOwner] = useState('');
  const [rerenderVal, setRerenderVal] = useState(0);
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
  const [errContentsTitle, setErrContentsTitle] = useState('');
  const [errContentsNo, setErrContentsNo] = useState(0);
  const [errType, setErrType] = useState(0);
  const [showMathPaper, setShowMathPaper] = useState(false);
  const [isIpsiContents, setIsIpsiContents] = useState(false);
  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(100);
  const [minYear, setMinYear] = useState(0);
  const [maxYear, setMaxYear] = useState(0);
  const [impMinYear, setImpMinYear] = useState(0);
  const [impMaxYear, setImpMaxYear] = useState(0);
  const [impYearRender, setImpYearRender] = useState(false);
  const [isHangeulDown, setIsHangeulDown] = useState(false);

  const removeAddedEvent = async () => {
    window.removeEventListener('popstate', gotoPreviousStep);
  };

  useEffect(() => {
    let param = nb_getParameterByName('docsId');
    if (currentPath === location.pathname && subjectList.length !== 0) {
      //url 같은 경우
      window.location.reload();
      return;
    }
    currentPath = location.pathname;

    const asyncUseEffect = async function () {
      window.addEventListener('popstate', gotoPreviousStep);
      let jsonObj = await nb_getRequest('/public/math/menu/unit', true);
      setSubjectList(jsonObj.data.subjectList);
      unitListSetFunction(jsonObj.data.subjectList, jsonObj.data.secUnitList, jsonObj.data.thrUnitList);

      let returnObj = await nb_getRequest('/public/math/menu/ipsi-year', true);
      let impYearMin = 0;
      let impYearMax = 0;
      for (let i = 0; i < returnObj.data.ipsiYear.length; i++) {
        if (i === 0) {
          impYearMin = returnObj.data.ipsiYear[i];
          impYearMax = returnObj.data.ipsiYear[i];
        }
        if (returnObj.data.ipsiYear[i] < impYearMin) {
          impYearMin = returnObj.data.ipsiYear[i];
        }
        if (returnObj.data.ipsiYear[i] > impYearMax) {
          impYearMax = returnObj.data.ipsiYear[i];
        }
      }
      setImpMaxYear(impYearMax);
      setImpMinYear(impYearMin);
      setMaxYear(impYearMax);
      setMinYear(impYearMin);
      setImpYearRender(true);

      if (param !== '') {
        document.getElementById('page-transit').classList.remove('hide');
        document.getElementById('page-transit-img').classList.remove('hide');
        setIsInnerPage(true);
        setMathDocsId(Number(param));
        showMathDocsByMyMathDocsPage(param);
      }
    };
    asyncUseEffect();
    return () => removeAddedEvent();
  }, [location]);

  const showMathDocsByMyMathDocsPage = async (mathDocsId) => {
    document.getElementById('mathDocsFirstStep').classList.add('hide');
    let jsonObj = await nb_dataFetch('/math/docs/' + mathDocsId, true);
    let mathContentsList = jsonObj.data.docs;
    let mathDocsPaper = jsonObj.data.docsPaper;

    if (mathDocsPaper.docsStts === 'MyContents') {
      setShowFinalPopup(false);
      document.getElementById('topMenuBar').classList.add('hide');
      if (document.getElementsByClassName('manager-menu')[0] != null) document.getElementsByClassName('manager-menu')[0].classList.add('hide');
    }

    let barArr = [];
    let ipsiConCnt = 0;
    let lv1Len = 0;
    let lv2Len = 0;
    let lv3Len = 0;
    let lv4Len = 0;
    let lv5Len = 0;
    let multiConCnt = 0;
    let essayConCnt = 0;
    for (let i = 0; i < mathContentsList.length; i++) {
      if (mathContentsList[i].contentsClassify === 'Ipsi') {
        ipsiConCnt++;
      }
      if (mathContentsList[i].multiChoiceType === 'Multiple') {
        multiConCnt += 1;
      } else {
        essayConCnt += 1;
      }
    }

    let showWrongRatioChart = false;
    //수능 문제가 절반 이상이면 오답률로 차트 제공(하, 중하, 중은 60%미만 중상은 70~80%, 상은 70~80%로 셋팅)
    if (ipsiConCnt > mathContentsList.length - ipsiConCnt) {
      setIsIpsiContents(true);
      showWrongRatioChart = true;
      for (let i = 0; i < mathContentsList.length; i++) {
        if (mathContentsList[i].contentsClassify === 'Ipsi') {
          if (mathContentsList[i].wrongRatio < 60) {
            lv1Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 60 && mathContentsList[i].wrongRatio < 70) {
            lv2Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 70 && mathContentsList[i].wrongRatio < 80) {
            lv3Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 80 && mathContentsList[i].wrongRatio < 90) {
            lv4Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 90) {
            lv5Len += 1;
          }
        } else {
          if (mathContentsList[i].quesLevel === 1 || mathContentsList[i].quesLevel === 2 || mathContentsList[i].quesLevel === 3) {
            lv1Len += 1;
          } else if (mathContentsList[i].quesLevel === 4) {
            lv2Len += 1;
          } else if (mathContentsList[i].quesLevel === 5) {
            lv3Len += 1;
          }
        }
      }

      barArr = [
        {
          labelName: '60%미만',
          value: lv1Len,
          backgroundColor: 'rgb(13, 53, 149, 0.2)',
        },
        {
          labelName: '60%~70%',
          value: lv2Len,
          backgroundColor: 'rgb(13, 53, 149, 0.4)',
        },
        {
          labelName: '70%~80%',
          value: lv3Len,
          backgroundColor: 'rgb(13, 53, 149, 0.7)',
        },
        {
          labelName: '80%~90%',
          value: lv4Len,
          backgroundColor: 'rgb(13, 53, 149)',
        },
        {
          labelName: '90%~100%',
          value: lv5Len,
          backgroundColor: 'rgb(7, 39, 113)',
        },
      ];
    } else {
      //수능 문제가 절반이 안되는 경우 난이도별로 차트 제공
      setIsIpsiContents(false);
      for (let i = 0; i < mathContentsList.length; i++) {
        if (mathContentsList[i].quesLevel === 1) {
          lv1Len += 1;
        } else if (mathContentsList[i].quesLevel === 2) {
          lv2Len += 1;
        } else if (mathContentsList[i].quesLevel === 3) {
          lv3Len += 1;
        } else if (mathContentsList[i].quesLevel === 4) {
          lv4Len += 1;
        } else if (mathContentsList[i].quesLevel === 5) {
          lv5Len += 1;
        }
      }
      barArr = [
        {
          labelName: '하',
          value: lv1Len,
          backgroundColor: 'rgb(13, 53, 149, 0.2)',
        },
        {
          labelName: '중하',
          value: lv2Len,
          backgroundColor: 'rgb(13, 53, 149, 0.4)',
        },
        {
          labelName: '중',
          value: lv3Len,
          backgroundColor: 'rgb(13, 53, 149, 0.7)',
        },
        {
          labelName: '중상',
          value: lv4Len,
          backgroundColor: 'rgb(13, 53, 149)',
        },
        { labelName: '상', value: lv5Len, backgroundColor: 'rgb(7, 39, 113)' },
      ];
    }
    setShowChart(false);
    setConTotalCnt(mathContentsList.length);
    setMathContentsList(mathContentsList);
    setConArrByLvOnBar(barArr);
    let pieArr = [
      {
        labelName: '객관식',
        value: multiConCnt,
        className: 'multiChoicePieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '주관식',
        value: essayConCnt,
        className: 'essayPieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
    ];
    setConArrByMultiOnPie(pieArr);
    setShowChart(true);
    document.getElementById('mathDocsDesc').innerHTML = '문제를 교체하거나 추가할 수 있습니다.';

    await nb_multiChoiceGridSet('quesConMultiShow');
    window.scrollTo(0, 0);
    setIsSearchedMyCon(false);
    setIsSearchedMyRepo(false);

    document.getElementById('docsGrade').value = mathDocsPaper.docsGrade;
    document.getElementById('docsTitle').value = mathDocsPaper.docsTitle;
    document.getElementById('docsSubTitle').value = mathDocsPaper.docsSubTitle;
    document.getElementById('mathDocsOwner').value = mathDocsPaper.docsOwner;

    document.getElementById('docsPreviousBtn').classList.add('hide');
    if (document.getElementById('docsPreviousPage') !== null) document.getElementById('docsPreviousPage').classList.remove('hide');
    document.getElementById('page-transit').classList.add('hide');
    document.getElementById('page-transit-img').classList.add('hide');

    if (showWrongRatioChart) {
      document.getElementById('barChartTitle').innerText = '오답률별 문항 수';
    } else {
      document.getElementById('barChartTitle').innerText = '난이도별 문항 수';
    }
  };

  const pagePerConCnt = (event) => {
    let conCntSelTd = document.getElementsByClassName('pagePerConCnt');
    for (let i = 0; i < conCntSelTd.length; i++) {
      conCntSelTd[i].classList.remove('active');
    }
    event.target.classList.add('active');
    document.getElementById('pagePerConCntInp').value = event.target.innerHTML;
  };

  const conCntSelect = (event) => {
    let conCntSelTd = document.getElementsByClassName('conCntSelTd');
    for (let i = 0; i < conCntSelTd.length; i++) {
      conCntSelTd[i].classList.remove('active');
    }
    event.target.classList.add('active');
    document.getElementById('conCntInput').value = event.target.innerHTML;
  };

  const levelSelect = (event) => {
    let levelSelTd = document.getElementsByClassName('levelSelTd');
    for (let i = 0; i < levelSelTd.length; i++) {
      levelSelTd[i].classList.remove('active');
    }
    event.currentTarget.classList.add('active');
    event.currentTarget.querySelector('label').click();
  };

  const onlyMyProdOrRepoContents = async () => {
    if (!nb_isLogin()) {
      if (isBrowser) alert('로그인 이후 사용해 주시기 바랍니다.');
      else alert('PC로 접속하여 사용해 주시기 바랍니다.');

      return;
    }

    setShowChart(false);
    setConTotalCnt(0);
    setMathContentsList([]);
    let barArr = [
      { labelName: '하', value: 0, backgroundColor: 'rgb(13, 53, 149, 0.2)' },
      { labelName: '중하', value: 0, backgroundColor: 'rgb(13, 53, 149, 0.4)' },
      { labelName: '중', value: 0, backgroundColor: 'rgb(13, 53, 149, 0.7)' },
      { labelName: '중상', value: 0, backgroundColor: 'rgb(13, 53, 149)' },
      { labelName: '상', value: 0, backgroundColor: 'rgb(7, 39, 113)' },
    ];
    let pieArr = [
      {
        labelName: '객관식',
        value: 0,
        className: 'multiChoicePieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '주관식',
        value: 0,
        className: 'essayPieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
    ];
    setConArrByLvOnBar(barArr);
    setConArrByMultiOnPie(pieArr);
    setShowChart(true);
    setIsSearchedMyCon(false);
    setIsSearchedMyRepo(false);
    document.getElementById('mathDocsFirstStep').classList.add('hide');
    document.getElementById('mathDocsDesc').innerHTML = '나의 제작문제 및 저장소 문제를 추가하여 학습지를 만들어 보세요.';
    window.history.pushState('', '학습지 만들기 2단계', '/makeMathDocsTwoStep');
  };

  const ipsiConFirstStepCheck = async () => {
    let isIpsiMonthChecked = false;
    let ipsiMonthDom = document.getElementsByName('ipsiMonth');

    let ipsiMonth = '';
    for (let i = 0; i < ipsiMonthDom.length; i++) {
      if (ipsiMonthDom[i].checked) {
        if (ipsiMonth === '') {
          ipsiMonth += ipsiMonthDom[i].value;
        } else {
          ipsiMonth += ',' + ipsiMonthDom[i].value;
        }
        isIpsiMonthChecked = true;
      }
    }

    if (!isIpsiMonthChecked) {
      alert('시행월을 선택해 주세요.');
      return;
    }

    let typeBtn = document.getElementsByClassName('typeBtn');
    let unitIdAndTypeId = '';
    for (let i = 0; i < typeBtn.length; i++) {
      if (!typeBtn[i].classList.contains('active')) continue;
      if (unitIdAndTypeId === '') {
        unitIdAndTypeId += typeBtn[i].dataset.unitId + ',' + typeBtn[i].dataset.typeId;
      } else {
        unitIdAndTypeId += '-' + typeBtn[i].dataset.unitId + ',' + typeBtn[i].dataset.typeId;
      }
    }

    let level = document.getElementsByName('level');
    let quesLevel = '';
    for (let i = 0; i < level.length; i++) {
      if (level[i].checked) {
        if (quesLevel === '') {
          quesLevel += level[i].value;
        } else {
          quesLevel += ',' + level[i].value;
        }
      }
    }

    let conCntInput = document.getElementById('conCntInput').value;
    let ipsiYearMin = document.getElementsByName('ipsiYearMin')[0].value;
    let ipsiYearMax = document.getElementsByName('ipsiYearMax')[0].value;
    let wrongRatioMin = document.getElementsByName('wrongRatioMin')[0].value;
    let wrongRatioMax = document.getElementsByName('wrongRatioMax')[0].value;
    let jsonObj = await nb_getRequest(
      '/math/docs/ipsi?unitIdAndTypeId=' +
        unitIdAndTypeId +
        '&quesLevel=' +
        quesLevel +
        '&count=' +
        conCntInput +
        '&wrongRatioMin=' +
        wrongRatioMin +
        '&wrongRatioMax=' +
        wrongRatioMax +
        '&ipsiYearStrt=' +
        ipsiYearMin +
        '&ipsiYearEnd=' +
        ipsiYearMax +
        '&ipsiMonth=' +
        ipsiMonth,
      true
    );
    document.getElementById('ipsiContentsSelWrap').classList.add('hide');
    let mathContentsList = jsonObj.data.docs;
    let lv1Len = 0;
    let lv2Len = 0;
    let lv3Len = 0;
    let lv4Len = 0;
    let lv5Len = 0;

    let multiConCnt = 0;
    let essayConCnt = 0;
    for (let i = 0; i < mathContentsList.length; i++) {
      if (mathContentsList[i].multiChoiceType === 'Multiple') {
        multiConCnt += 1;
      } else {
        essayConCnt += 1;
      }
      if (mathContentsList[i].wrongRatio < 60) {
        lv1Len += 1;
      } else if (mathContentsList[i].wrongRatio >= 60 && mathContentsList[i].wrongRatio < 70) {
        lv2Len += 1;
      } else if (mathContentsList[i].wrongRatio >= 70 && mathContentsList[i].wrongRatio < 80) {
        lv3Len += 1;
      } else if (mathContentsList[i].wrongRatio >= 80 && mathContentsList[i].wrongRatio < 90) {
        lv4Len += 1;
      } else if (mathContentsList[i].wrongRatio >= 90) {
        lv5Len += 1;
      }
    }

    setShowChart(false);
    setConTotalCnt(mathContentsList.length);
    setMathContentsList(mathContentsList);
    let barArr = [
      {
        labelName: '60% 미만',
        value: lv1Len,
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '60%~70%',
        value: lv2Len,
        backgroundColor: 'rgb(13, 53, 149, 0.4)',
      },
      {
        labelName: '70%~80%',
        value: lv3Len,
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
      {
        labelName: '80%~90%',
        value: lv4Len,
        backgroundColor: 'rgb(13, 53, 149)',
      },
      {
        labelName: '90%~99%',
        value: lv5Len,
        backgroundColor: 'rgb(7, 39, 113)',
      },
    ];
    setConArrByLvOnBar(barArr);
    let pieArr = [
      {
        labelName: '객관식',
        value: multiConCnt,
        className: 'multiChoicePieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '주관식',
        value: essayConCnt,
        className: 'essayPieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
    ];
    setConArrByMultiOnPie(pieArr);
    setShowChart(true);
    document.getElementById('mathDocsDesc').innerHTML = '문제를 교체하거나 추가하여 학습지를 완성해 보세요.';
    document.getElementById('mathDocsFirstStep').classList.add('hide');
    await nb_multiChoiceGridSet('quesConMultiShow');
    window.scrollTo(0, 0);
    setIsSearchedMyCon(false);
    setIsSearchedMyRepo(false);

    let docsSubTitle = '';
    if (ipsiYearMin !== ipsiYearMax) {
      docsSubTitle = ipsiYearMin + '~' + ipsiYearMax + '년 시행 기출';
    } else {
      docsSubTitle = ipsiYearMin + '년 시행 기출';
    }

    document.getElementById('docsGrade').value = '고3';
    document.getElementById('docsTitle').value = '수능 및 모의고사';
    document.getElementById('docsSubTitle').value = docsSubTitle;
    window.history.pushState('', '학습지 만들기 2단계', '/makeMathDocsTwoStep');

    document.getElementById('barChartTitle').innerText = '오답률별 문항 수';
  };

  const firstStepCheck = async () => {
    if (!nb_isLogin()) {
      if (isBrowser) alert('로그인 이후 사용해 주시기 바랍니다.');
      else alert('PC로 접속하여 사용해 주시기 바랍니다.');

      return;
    }

    if (document.getElementsByClassName('typeBtn active').length === 0) {
      alert('단원 또는 유형을 선택해 주세요.');
      return;
    }

    if (document.getElementsByClassName('typeBtn active').length > 300) {
      alert(
        '선택할 수 있는 세부 유형은 최대 300개 입니다.' +
          '\n현재 선택한 유형 개수는 ' +
          document.getElementsByClassName('typeBtn active').length +
          '개 입니다.' +
          '\n단원 또는 유형을 체크 해제하여 선택하신 유형을 줄여주세요.'
      );
      return;
    }

    let typeBtn = document.getElementsByClassName('typeBtn');
    let unitIdAndTypeId = '';
    for (let i = 0; i < typeBtn.length; i++) {
      if (!typeBtn[i].classList.contains('active')) continue;
      if (unitIdAndTypeId === '') {
        unitIdAndTypeId += typeBtn[i].dataset.unitId + ',' + typeBtn[i].dataset.typeId;
      } else {
        unitIdAndTypeId += '-' + typeBtn[i].dataset.unitId + ',' + typeBtn[i].dataset.typeId;
      }
    }

    let isLevelChecked = false;
    let level = document.getElementsByName('level');
    let quesLevel;
    for (let i = 0; i < level.length; i++) {
      if (level[i].checked) {
        quesLevel = level[i].value;
        isLevelChecked = true;
        break;
      }
    }

    if (!isLevelChecked) {
      if (isIpsiContents) {
        alert('배점을 선택해 주세요.');
      } else {
        alert('난이도를 선택해 주세요.');
      }
      return;
    }

    let conCntInput = document.getElementById('conCntInput').value;
    let check = /^[0-9]+$/;
    if (!check.test(conCntInput)) {
      alert('문항 수를 1 이상 100 이하의 숫자로 적어주세요.');
      return;
    }

    if (conCntInput < 1 || conCntInput > 100) {
      alert('문항 수는 1문항 이상 100문항 이하로 입력해주시기 바랍니다.');
      return;
    }

    if (isIpsiContents) {
      document.getElementById('ipsiContentsSelWrap').classList.remove('hide');
      return;
    }

    let jsonObj = await nb_getRequest('/math/docs/in-house?unitIdAndTypeId=' + unitIdAndTypeId + '&quesLevel=' + quesLevel + '&count=' + conCntInput, true);
    let mathContentsList = jsonObj.data.docs;
    let lv1Len = 0;
    let lv2Len = 0;
    let lv3Len = 0;
    let lv4Len = 0;
    let lv5Len = 0;

    let multiConCnt = 0;
    let essayConCnt = 0;
    for (let i = 0; i < mathContentsList.length; i++) {
      if (mathContentsList[i].multiChoiceType === 'Multiple') {
        multiConCnt += 1;
      } else {
        essayConCnt += 1;
      }
      if (mathContentsList[i].quesLevel === 1) {
        lv1Len += 1;
      } else if (mathContentsList[i].quesLevel === 2) {
        lv2Len += 1;
      } else if (mathContentsList[i].quesLevel === 3) {
        lv3Len += 1;
      } else if (mathContentsList[i].quesLevel === 4) {
        lv4Len += 1;
      } else if (mathContentsList[i].quesLevel === 5) {
        lv5Len += 1;
      }
    }

    setShowChart(false);
    setConTotalCnt(mathContentsList.length);
    setMathContentsList(mathContentsList);
    let barArr = [
      {
        labelName: '하',
        value: lv1Len,
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '중하',
        value: lv2Len,
        backgroundColor: 'rgb(13, 53, 149, 0.4)',
      },
      {
        labelName: '중',
        value: lv3Len,
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
      { labelName: '중상', value: lv4Len, backgroundColor: 'rgb(13, 53, 149)' },
      { labelName: '상', value: lv5Len, backgroundColor: 'rgb(7, 39, 113)' },
    ];
    setConArrByLvOnBar(barArr);
    let pieArr = [
      {
        labelName: '객관식',
        value: multiConCnt,
        className: 'multiChoicePieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '주관식',
        value: essayConCnt,
        className: 'essayPieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
    ];
    setConArrByMultiOnPie(pieArr);
    setShowChart(true);
    document.getElementById('mathDocsDesc').innerHTML = '문제를 교체하거나 추가하여 학습지를 완성해 보세요.';
    document.getElementById('mathDocsFirstStep').classList.add('hide');
    await nb_multiChoiceGridSet('quesConMultiShow');
    window.scrollTo(0, 0);
    setIsSearchedMyCon(false);
    setIsSearchedMyRepo(false);

    let grade = '';
    if (document.getElementsByClassName('mathDocsUnitBtn active')[0].dataset.subjectInfo.includes('중등 1')) {
      grade = '중1';
    } else if (document.getElementsByClassName('mathDocsUnitBtn active')[0].dataset.subjectInfo.includes('중등 2')) {
      grade = '중2';
    } else if (document.getElementsByClassName('mathDocsUnitBtn active')[0].dataset.subjectInfo.includes('중등 3')) {
      grade = '중3';
    }

    let subTitle = '';
    if (document.getElementsByClassName('secUnitBtn active').length === 0) {
      if (document.getElementsByClassName('thrUnitBtn active').length === 0) {
        subTitle =
          document.getElementsByClassName('typeBtn active')[0].innerHTML +
          ' ~ ' +
          document.getElementsByClassName('typeBtn active')[document.getElementsByClassName('typeBtn active').length - 1].innerHTML;
        if (document.getElementsByClassName('typeBtn active').length === 1) subTitle = document.getElementsByClassName('typeBtn active')[0].innerHTML;

        //수식 요소가 포함된 경우
        if (document.getElementsByClassName('typeBtn active')[0].querySelectorAll('*').length !== 0) {
          subTitle = '';
        }
        if (document.getElementsByClassName('typeBtn active').length !== 1 && document.getElementsByClassName('typeBtn active')[1].querySelectorAll('*').length !== 0) {
          subTitle = '';
        }
      } else {
        subTitle =
          document.getElementsByClassName('thrUnitBtn active')[0].innerHTML +
          ' ~ ' +
          document.getElementsByClassName('thrUnitBtn active')[document.getElementsByClassName('thrUnitBtn active').length - 1].innerHTML;
        if (document.getElementsByClassName('thrUnitBtn active').length === 1) subTitle = document.getElementsByClassName('thrUnitBtn active')[0].innerHTML;

        //수식 요소가 포함된 경우
        if (document.getElementsByClassName('thrUnitBtn active')[0].querySelectorAll('*').length !== 0) {
          subTitle = '';
        }
        if (document.getElementsByClassName('thrUnitBtn active').length !== 1 && document.getElementsByClassName('thrUnitBtn active')[1].querySelectorAll('*').length !== 0) {
          subTitle = '';
        }
      }
    } else {
      subTitle =
        document.getElementsByClassName('secUnitBtn active')[0].innerHTML +
        ' ~ ' +
        document.getElementsByClassName('secUnitBtn active')[document.getElementsByClassName('secUnitBtn active').length - 1].innerHTML;
      if (document.getElementsByClassName('secUnitBtn active').length === 1) subTitle = document.getElementsByClassName('secUnitBtn active')[0].innerHTML;
    }

    document.getElementById('docsGrade').value = grade;
    document.getElementById('docsTitle').value = document.getElementsByClassName('mathDocsUnitBtn active')[0].dataset.subjectInfo + ' 학습지';
    document.getElementById('docsSubTitle').value = subTitle;
    window.history.pushState('', '학습지 만들기 2단계', '/makeMathDocsTwoStep');

    document.getElementById('barChartTitle').innerText = '난이도별 문항 수';
  };

  const gotoPreviousStep = () => {
    document.getElementById('mathDocsDesc').innerHTML = '원하는 단원을 선택하여 학습지를 만들어보세요.<br/>(학습지 생성 문제는 N명의수학 제작 문제만 포함됩니다.)';
    setShowChart(false);
    document.getElementById('mathDocsFirstStep').classList.remove('hide');
    window.scrollTo(0, 0);
  };

  const twoStepCheck = () => {
    document.getElementById('mathDocsThrStep').classList.remove('hide');
  };

  /*
   * 정의 : 수능모의고사 문제 클릭 이벤트
   */
  const ipsiContentsSelect = async (event) => {
    //수능 모의고사 문제는 다른 문제와 같이 사용될 수 없음
    let mathDocsUnitBtn = document.getElementsByClassName('mathDocsUnitBtn');
    for (let i = 0; i < mathDocsUnitBtn.length; i++) {
      if (mathDocsUnitBtn[i].classList.contains('active') && event.target !== mathDocsUnitBtn[i]) {
        mathDocsUnitBtn[i].click();
      }
    }

    let subjectBtnWrap = document.getElementsByClassName('subjectBtnWrap');
    for (let i = 0; i < subjectBtnWrap.length; i++) {
      if (!event.target.classList.contains('active')) {
        if (subjectBtnWrap[i].dataset.subjectInfo.indexOf('중등') > -1 || subjectBtnWrap[i].dataset.subjectInfo.indexOf('고등') > -1) {
          continue;
        }
        subjectBtnWrap[i].classList.remove('hide');

        if (event.target.dataset.typeExist === 'false') {
          let unitIdList = '';
          let thrUnitBtn = subjectBtnWrap[i].querySelectorAll('.thrUnitBtn');

          for (let j = 0; j < thrUnitBtn.length; j++) {
            if (j === 0) {
              unitIdList += thrUnitBtn[j].dataset.unitId;
            } else {
              unitIdList += ',' + thrUnitBtn[j].dataset.unitId;
            }
          }
          let jsonObj = await nb_getRequest('/public/math/menu/type?unitId=' + unitIdList, true);
          let thrUnitBtnWrap = subjectBtnWrap[i].querySelectorAll('.thrUnitBtnWrap');
          let mathTypeInfoList = jsonObj.data.mathTypeList;
          for (let j = 0; j < thrUnitBtnWrap.length; j++) {
            for (let k = 0; k < mathTypeInfoList.length; k++) {
              if (Number(thrUnitBtnWrap[j].querySelector('.thrUnitBtn ').dataset.unitId) === mathTypeInfoList[k].unitId) {
                let tmpDiv = document.createElement('div');
                tmpDiv.className = 'typeBtnWrap hide';
                let tmpSpan = document.createElement('span');
                tmpSpan.innerHTML = mathTypeInfoList[k].quesType;
                tmpSpan.className = 'typeBtn';
                tmpSpan.dataset.unitId = mathTypeInfoList[k].unitId;
                tmpSpan.dataset.typeId = mathTypeInfoList[k].typeId;
                tmpSpan.addEventListener('click', typeClickFunction);
                tmpDiv.append(tmpSpan);
                thrUnitBtnWrap[j].append(tmpDiv);
              }
            }
          }
        }

        //폴드 다 접기
        if (subjectBtnWrap[i].querySelector('.subjectFoldBtn').classList.contains('active')) {
          subjectBtnWrap[i].querySelector('.subjectFoldBtn').click();
        }
      } else {
        subjectBtnWrap[i].classList.add('hide');
        let activeBtn = subjectBtnWrap[i].querySelectorAll('.active');
        for (let i = 0; i < activeBtn.length; i++) {
          if (!(activeBtn[i].classList.contains('subjectFoldBtn') || activeBtn[i].classList.contains('secUnitFoldBtn') || activeBtn[i].classList.contains('thrUnitFoldBtn'))) {
            activeBtn[i].classList.remove('active');
          }
        }
      }
    }
    event.target.dataset.typeExist = 'true';

    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      setIsIpsiContents(false);
    } else {
      event.target.classList.add('active');
      if (!isIpsiContents) {
        let quesLvDom = document.getElementsByName('level');
        for (let i = 0; i < quesLvDom.length; i++) {
          quesLvDom[i].checked = false;
        }
      }
      setIsIpsiContents(true);
    }
  };

  const unitSelect = async (event) => {
    //일반 문제는 수능 모의고사 문제와 같이 사용될 수 없음
    if (document.querySelector('.mathDocsUnitBtn.ipsi').classList.contains('active')) {
      document.querySelector('.mathDocsUnitBtn.ipsi').click();
    }

    let subjectBtnWrap = document.getElementsByClassName('subjectBtnWrap');
    for (let i = 0; i < subjectBtnWrap.length; i++) {
      if (!event.target.classList.contains('active')) {
        if (event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo) {
          subjectBtnWrap[i].classList.remove('hide');
          if (event.target.dataset.typeExist === 'false') {
            let unitIdList = '';
            let thrUnitBtn = subjectBtnWrap[i].querySelectorAll('.thrUnitBtn');
            for (let j = 0; j < thrUnitBtn.length; j++) {
              if (j === 0) {
                unitIdList += thrUnitBtn[j].dataset.unitId;
              } else {
                unitIdList += ',' + thrUnitBtn[j].dataset.unitId;
              }
            }
            let jsonObj = await nb_dataFetch('/public/math/menu/type?unitId=' + unitIdList, true);
            let thrUnitBtnWrap = subjectBtnWrap[i].querySelectorAll('.thrUnitBtnWrap');
            let mathTypeInfoList = jsonObj.data.mathTypeList;
            for (let j = 0; j < thrUnitBtnWrap.length; j++) {
              for (let k = 0; k < mathTypeInfoList.length; k++) {
                if (Number(thrUnitBtnWrap[j].querySelector('.thrUnitBtn ').dataset.unitId) === mathTypeInfoList[k].unitId) {
                  let tmpDiv = document.createElement('div');
                  tmpDiv.className = 'typeBtnWrap hide';
                  let tmpSpan = document.createElement('span');
                  tmpSpan.innerHTML = mathTypeInfoList[k].quesType;
                  tmpSpan.className = 'typeBtn';
                  tmpSpan.dataset.unitId = mathTypeInfoList[k].unitId;
                  tmpSpan.dataset.typeId = mathTypeInfoList[k].typeId;
                  tmpSpan.addEventListener('click', typeClickFunction);
                  tmpDiv.append(tmpSpan);
                  thrUnitBtnWrap[j].append(tmpDiv);
                }
              }
            }
            event.target.dataset.typeExist = 'true';
          }
        }
      } else {
        if (event.target.dataset.subjectInfo === subjectBtnWrap[i].dataset.subjectInfo) {
          subjectBtnWrap[i].classList.add('hide');
          let activeBtn = subjectBtnWrap[i].querySelectorAll('.active');
          for (let i = 0; i < activeBtn.length; i++) {
            if (!(activeBtn[i].classList.contains('subjectFoldBtn') || activeBtn[i].classList.contains('secUnitFoldBtn') || activeBtn[i].classList.contains('thrUnitFoldBtn'))) {
              activeBtn[i].classList.remove('active');
            }
          }
        }
      }
    }

    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
    } else {
      event.target.classList.add('active');
      if (isIpsiContents) {
        let quesLvDom = document.getElementsByName('level');
        for (let i = 0; i < quesLvDom.length; i++) {
          quesLvDom[i].checked = false;
        }
      }
      setIsIpsiContents(false);
    }
  };

  const foldClickFunction = (event, btnWrapClass) => {
    let btnWrap = event.target.parentElement.querySelectorAll(btnWrapClass);
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      for (let i = 0; i < btnWrap.length; i++) {
        btnWrap[i].classList.add('hide');
      }
    } else {
      event.target.classList.add('active');
      for (let i = 0; i < btnWrap.length; i++) {
        btnWrap[i].classList.remove('hide');
      }
    }
  };

  const subjectClickFunction = (event) => {
    let secUnitBtn = event.target.parentElement.querySelectorAll('.secUnitBtn');
    let thrUnitBtn = event.target.parentElement.querySelectorAll('.thrUnitBtn');
    let typeBtn = event.target.parentElement.querySelectorAll('.typeBtn');
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      for (let i = 0; i < secUnitBtn.length; i++) {
        secUnitBtn[i].classList.remove('active');
      }
      for (let i = 0; i < thrUnitBtn.length; i++) {
        thrUnitBtn[i].classList.remove('active');
      }
      for (let i = 0; i < typeBtn.length; i++) {
        typeBtn[i].classList.remove('active');
      }
    } else {
      event.target.classList.add('active');
      for (let i = 0; i < secUnitBtn.length; i++) {
        secUnitBtn[i].classList.add('active');
      }
      for (let i = 0; i < thrUnitBtn.length; i++) {
        thrUnitBtn[i].classList.add('active');
      }
      for (let i = 0; i < typeBtn.length; i++) {
        typeBtn[i].classList.add('active');
      }
    }
  };

  const secUnitClickFunction = (event) => {
    let thrUnitBtn = event.target.parentElement.querySelectorAll('.thrUnitBtn');
    let typeBtn = event.target.parentElement.querySelectorAll('.typeBtn');
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      event.target.closest('.subjectBtnWrap').querySelector('.subjectBtn').classList.remove('active');
      for (let i = 0; i < thrUnitBtn.length; i++) {
        thrUnitBtn[i].classList.remove('active');
      }
      for (let i = 0; i < typeBtn.length; i++) {
        typeBtn[i].classList.remove('active');
      }
    } else {
      event.target.classList.add('active');
      for (let i = 0; i < thrUnitBtn.length; i++) {
        thrUnitBtn[i].classList.add('active');
      }
      for (let i = 0; i < typeBtn.length; i++) {
        typeBtn[i].classList.add('active');
      }

      let isSecAllChecked = true;
      let secUnitBtn = event.target.closest('.subjectBtnWrap').querySelectorAll('.secUnitBtn');
      for (let i = 0; i < secUnitBtn.length; i++) {
        if (!secUnitBtn[i].classList.contains('active')) {
          isSecAllChecked = false;
          break;
        }
      }

      if (isSecAllChecked) {
        event.target.closest('.subjectBtnWrap').querySelector('.subjectBtn').classList.add('active');
      }
    }
  };

  const thrUnitClickFunction = (event) => {
    let typeBtn = event.target.parentElement.querySelectorAll('.typeBtn');
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      event.target.closest('.secUnitBtnWrap').querySelector('.secUnitBtn').classList.remove('active');
      event.target.closest('.subjectBtnWrap').querySelector('.subjectBtn').classList.remove('active');
      for (let i = 0; i < typeBtn.length; i++) {
        typeBtn[i].classList.remove('active');
      }
    } else {
      event.target.classList.add('active');
      for (let i = 0; i < typeBtn.length; i++) {
        typeBtn[i].classList.add('active');
      }

      //중단원이 전부 체크 되어있으면 대단원 체크해주기
      let isThrAllChecked = true;
      let thrUnitBtn = event.target.closest('.secUnitBtnWrap').querySelectorAll('.thrUnitBtn');
      for (let i = 0; i < thrUnitBtn.length; i++) {
        if (!thrUnitBtn[i].classList.contains('active')) {
          isThrAllChecked = false;
          break;
        }
      }

      if (isThrAllChecked) {
        event.target.closest('.secUnitBtnWrap').querySelector('.secUnitBtn').classList.add('active');
      }

      let isSecAllChecked = true;
      let secUnitBtn = event.target.closest('.subjectBtnWrap').querySelectorAll('.secUnitBtn');
      for (let i = 0; i < secUnitBtn.length; i++) {
        if (!secUnitBtn[i].classList.contains('active')) {
          isSecAllChecked = false;
          break;
        }
      }

      if (isSecAllChecked) {
        event.target.closest('.subjectBtnWrap').querySelector('.subjectBtn').classList.add('active');
      }
    }
  };

  const typeClickFunction = (event) => {
    if (event.target.classList.contains('active')) {
      event.target.classList.remove('active');
      event.target.closest('.thrUnitBtnWrap').querySelector('.thrUnitBtn').classList.remove('active');
      event.target.closest('.secUnitBtnWrap').querySelector('.secUnitBtn').classList.remove('active');
      event.target.closest('.subjectBtnWrap').querySelector('.subjectBtn').classList.remove('active');
    } else {
      event.target.classList.add('active');

      //유형이 전부 체크 되어있으면 중단원 체크해주기
      let isTypeAllChecked = true;
      let typeBtn = event.target.closest('.thrUnitBtnWrap').querySelectorAll('.typeBtn');
      for (let i = 0; i < typeBtn.length; i++) {
        if (!typeBtn[i].classList.contains('active')) {
          isTypeAllChecked = false;
          break;
        }
      }

      if (isTypeAllChecked) {
        event.target.closest('.thrUnitBtnWrap').querySelector('.thrUnitBtn').classList.add('active');
      }

      //중단원이 전부 체크 되어있으면 대단원 체크해주기
      let isThrAllChecked = true;
      let thrUnitBtn = event.target.closest('.secUnitBtnWrap').querySelectorAll('.thrUnitBtn');
      for (let i = 0; i < thrUnitBtn.length; i++) {
        if (!thrUnitBtn[i].classList.contains('active')) {
          isThrAllChecked = false;
          break;
        }
      }

      if (isThrAllChecked) {
        event.target.closest('.secUnitBtnWrap').querySelector('.secUnitBtn').classList.add('active');
      }

      let isSecAllChecked = true;
      let secUnitBtn = event.target.closest('.subjectBtnWrap').querySelectorAll('.secUnitBtn');
      for (let i = 0; i < secUnitBtn.length; i++) {
        if (!secUnitBtn[i].classList.contains('active')) {
          isSecAllChecked = false;
          break;
        }
      }

      if (isSecAllChecked) {
        event.target.closest('.subjectBtnWrap').querySelector('.subjectBtn').classList.add('active');
      }
    }
  };

  const unitListSetFunction = (subjectList, secUnitList, thrUnitList) => {
    for (let i = 0; i < subjectList.length; i++) {
      let tmpDiv = document.createElement('div');
      tmpDiv.className = 'subjectBtnWrap hide';
      tmpDiv.dataset.subjectInfo = subjectList[i].unitName;
      let tmpSpanFoldBtn = document.createElement('span');
      tmpSpanFoldBtn.innerHTML = '&#10095;';
      tmpSpanFoldBtn.className = 'subjectFoldBtn active';
      tmpSpanFoldBtn.addEventListener('click', (event) => foldClickFunction(event, '.secUnitBtnWrap'));
      tmpDiv.append(tmpSpanFoldBtn);
      let tmpSpan = document.createElement('span');
      tmpSpan.innerHTML = subjectList[i].unitName;
      tmpSpan.className = 'subjectBtn';
      tmpSpan.addEventListener('click', subjectClickFunction);
      tmpDiv.append(tmpSpan);
      document.getElementsByClassName('mathDocsSubjectListDiv')[0].append(tmpDiv);
    }

    let subjectBtnList = document.getElementsByClassName('subjectBtnWrap');
    for (let i = 0; i < subjectBtnList.length; i++) {
      for (let j = 0; j < secUnitList.length; j++) {
        if (subjectBtnList[i].dataset.subjectInfo === secUnitList[j].parentUnitName) {
          let tmpDiv = document.createElement('div');
          tmpDiv.dataset.secUnitInfo = secUnitList[j].unitName;
          tmpDiv.className = 'secUnitBtnWrap';
          let tmpSpanFoldBtn = document.createElement('span');
          tmpSpanFoldBtn.innerHTML = '&#10095;';
          tmpSpanFoldBtn.className = 'secUnitFoldBtn';
          tmpSpanFoldBtn.addEventListener('click', (event) => foldClickFunction(event, '.thrUnitBtnWrap'));
          tmpDiv.append(tmpSpanFoldBtn);
          let tmpSpan = document.createElement('span');
          tmpSpan.innerHTML = secUnitList[j].unitName;
          tmpSpan.className = 'secUnitBtn';
          tmpSpan.addEventListener('click', secUnitClickFunction);
          tmpDiv.append(tmpSpan);
          subjectBtnList[i].append(tmpDiv);
        }
      }
    }

    let secUnitBtnList = document.getElementsByClassName('secUnitBtnWrap');
    for (let i = 0; i < secUnitBtnList.length; i++) {
      for (let j = 0; j < thrUnitList.length; j++) {
        if (secUnitBtnList[i].dataset.secUnitInfo === thrUnitList[j].parentUnitName) {
          let tmpDiv = document.createElement('div');
          tmpDiv.dataset.thrUnitInfo = thrUnitList[j].unitName;
          tmpDiv.className = 'thrUnitBtnWrap hide';
          let tmpSpanFoldBtn = document.createElement('span');
          tmpSpanFoldBtn.innerHTML = '&#10095;';
          tmpSpanFoldBtn.className = 'thrUnitFoldBtn';
          tmpSpanFoldBtn.addEventListener('click', (event) => foldClickFunction(event, '.typeBtnWrap'));
          tmpDiv.append(tmpSpanFoldBtn);
          let tmpSpan = document.createElement('span');
          tmpSpan.innerHTML = thrUnitList[j].unitName;
          tmpSpan.className = 'thrUnitBtn';
          tmpSpan.dataset.unitId = thrUnitList[j].unitId;
          tmpSpan.addEventListener('click', thrUnitClickFunction);
          tmpDiv.append(tmpSpan);
          secUnitBtnList[i].append(tmpDiv);
        }
      }
    }
  };

  const conCntKeyUp = (event) => {
    let conCntSelTd = document.getElementsByClassName('conCntSelTd');
    for (let i = 0; i < conCntSelTd.length; i++) {
      if (conCntSelTd[i].innerHTML === event.target.value) {
        conCntSelTd[i].classList.add('active');
      } else {
        conCntSelTd[i].classList.remove('active');
      }
    }
  };

  const moveToContents = (event) => {
    let contentsDiv = document.getElementsByClassName('contentsDiv');
    for (let i = 0; i < contentsDiv.length; i++) {
      if (contentsDiv[i].dataset.contentsId === event.target.dataset.contentsId) {
        contentsDiv[i].scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  const takeMyRepoContents = async () => {
    document.getElementById('mathDocsInfoTitle').innerHTML = '나의 저장소 문제';
    document.getElementById('mathDocsMyProd').classList.add('hide');
    document.getElementById('mathDocsConAdd').classList.remove('hide');
    document.getElementById('mathDocsMyRepo').classList.remove('hide');
    document.getElementById('mathDocsMyRepo').scrollTo(0, 0);
    if (isSearchedMyRepo) {
      document.getElementById('subjectFilterList').childNodes[0].click();
      document.getElementById('productFilterList').childNodes[0].click();
      return;
    }
    curPageNumByRepo = 0;
    let returnObj = await nb_getRequest('/math/content/repo?pageNum=' + curPageNumByRepo + '&pageVolume=' + pageVolume, true);

    let contentsNodeList = returnObj.data.contents.filter((contentsMap, idx) => {
      let isSame = true;
      for (let i = 0; i < mathContentsList.length; i++) {
        if (contentsMap.contentsId === mathContentsList[i].contentsId) isSame = false;
      }
      return isSame;
    });

    let contentsArray = [].slice.call(contentsNodeList, 0);
    contentsArray.sort(function (a, b) {
      return Number(b.sysCreateDate) - Number(a.sysCreateDate); //내림차순, 날짜 큰것 부터 작 순으로
    });

    if (contentsNodeList.length === 0) {
      document.getElementById('mathDocsMyRepoDesc').innerHTML = '저장소에 문제가 존재하지 않거나<br/>학습지에 이미 추가되었습니다.';
      document.getElementById('mathDocsMyRepoDesc').classList.add('marginTopSevenZero');
    } else {
      document.getElementById('mathDocsMyRepoDesc').innerHTML = '';
      document.getElementById('mathDocsMyRepoDesc').classList.remove('marginTopSevenZero');
    }

    if (returnObj.totalPageCnt > 1) {
      document.getElementById('showMoreContentsByRepo').classList.remove('hide');
    } else {
      document.getElementById('showMoreContentsByRepo').classList.add('hide');
    }

    setMyRepoContents(contentsArray);
    setIsSearchedMyRepo(true);
    document.getElementById('mathDocsMyRepo').classList.remove('hide');
    await nb_multiChoiceGridSet('quesConMultiShow');
    document.getElementById('subjectFilterList').childNodes[0].click();
    document.getElementById('productFilterList').childNodes[0].click();
  };

  const takeMyProdContents = async () => {
    document.getElementById('mathDocsInfoTitle').innerHTML = '나의 제작 문제';
    document.getElementById('mathDocsMyRepo').classList.add('hide');
    document.getElementById('mathDocsConAdd').classList.remove('hide');
    document.getElementById('mathDocsMyProd').classList.remove('hide');
    document.getElementById('mathDocsMyProd').scrollTo(0, 0);
    if (isSearchedMyCon) {
      document.getElementById('subjectFilterList').childNodes[0].click();
      document.getElementById('productFilterList').childNodes[0].click();
      return;
    }
    curPageNumByProd = 0;
    let returnObj = await nb_getRequest('/math/content/my?pageNum=' + curPageNumByProd + '&pageVolume=' + pageVolume, true);
    let contentsNodeList = returnObj.data.contents.filter((contentsMap, idx) => {
      let isSame = true;
      for (let i = 0; i < mathContentsList.length; i++) {
        if (contentsMap.contentsId === mathContentsList[i].contentsId) isSame = false;
      }
      return isSame;
    });

    if (contentsNodeList.length === 0) {
      document.getElementById('mathDocsMyProdDesc').innerHTML = '나의 제작문제가 존재하지 않습니다.';
      document.getElementById('mathDocsMyProdDesc').classList.add('marginTopSevenZero');
    } else {
      document.getElementById('mathDocsMyProdDesc').innerHTML = '';
      document.getElementById('mathDocsMyProdDesc').classList.remove('marginTopSevenZero');
    }

    if (returnObj.data.contents.length == pageVolume) {
      document.getElementById('showMoreContentsByProd').classList.remove('hide');
    } else {
      document.getElementById('showMoreContentsByProd').classList.add('hide');
    }

    setMyProdContents(contentsNodeList);
    setIsSearchedMyCon(true);
    document.getElementById('mathDocsMyProd').classList.remove('hide');
    await nb_multiChoiceGridSet('quesConMultiShow');
    document.getElementById('subjectFilterList').childNodes[0].click();
    document.getElementById('productFilterList').childNodes[0].click();
  };

  const myProdConOrRepoConOrSimConAdd = async (event, addType) => {
    let contentsId = Number(event.target.dataset.contentsId);
    let newContentsList = mathContentsList;
    let isDuplicated = false;
    newContentsList.forEach((contents, idx) => {
      if (contents.contentsId === contentsId) {
        isDuplicated = true;
        return;
      }
    });
    if (isDuplicated) {
      alert('이미 추가된 문제입니다.');
      return;
    }

    if (conTotalCnt >= 100) {
      alert('학습지는 최대 100문항까지 제작 가능합니다.');
      return;
    }

    let contentsList;
    if (addType === 'myProd') {
      contentsList = myProdContents;
    } else if (addType === 'myRepo') {
      contentsList = myRepoContents;
    } else {
      contentsList = similarContents;
    }

    let addContents = contentsList.filter((contents) => {
      if (contents.contentsId === contentsId) {
        return true;
      } else {
        return false;
      }
    });

    if (addType === 'myRepo') {
      let jsonObj = await nb_dataFetch('/mathInfo/mathTypeInfo?unitId=' + addContents[0].unitId + '+&typeId=' + addContents[0].typeId, true);
      addContents[0].mathTypeInfo = jsonObj['mathTypeInfo'];
    }

    if (addType === 'conChng') {
      let contentsId = Number(document.getElementById('mathDocsSimConAdd').dataset.contentsId);
      let conIdx;
      mathContentsList.forEach((contents, idx) => {
        if (contents.contentsId === contentsId) {
          conIdx = idx;
          return;
        }
      });
      newContentsList[conIdx] = addContents[0];
    } else {
      newContentsList.push(addContents[0]);
    }

    let lv1Len = 0;
    let lv2Len = 0;
    let lv3Len = 0;
    let lv4Len = 0;
    let lv5Len = 0;

    let multiConCnt = 0;
    let essayConCnt = 0;
    /*
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
        */

    let ipsiConCnt = 0;
    for (let i = 0; i < mathContentsList.length; i++) {
      if (mathContentsList[i].contentsClassify === 'Ipsi') {
        ipsiConCnt++;
      }
      if (mathContentsList[i].multiChoiceType === 'Multiple') {
        multiConCnt += 1;
      } else {
        essayConCnt += 1;
      }
    }

    let barArr = [];
    //수능 문제가 절반 이상이면 오답률로 차트 제공(하, 중하, 중은 60%미만 중상은 70~80%, 상은 70~80%로 셋팅)
    if (ipsiConCnt > mathContentsList.length - ipsiConCnt) {
      //setIsIpsiContents(true);
      document.getElementById('barChartTitle').innerText = '오답률별 문항 수';
      for (let i = 0; i < mathContentsList.length; i++) {
        if (mathContentsList[i].contentsClassify === 'Ipsi') {
          if (mathContentsList[i].wrongRatio < 60) {
            lv1Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 60 && mathContentsList[i].wrongRatio < 70) {
            lv2Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 70 && mathContentsList[i].wrongRatio < 80) {
            lv3Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 80 && mathContentsList[i].wrongRatio < 90) {
            lv4Len += 1;
          } else if (mathContentsList[i].wrongRatio >= 90) {
            lv5Len += 1;
          }
        } else {
          if (mathContentsList[i].quesLevel === 1 || mathContentsList[i].quesLevel === 2 || mathContentsList[i].quesLevel === 3) {
            lv1Len += 1;
          } else if (mathContentsList[i].quesLevel === 4) {
            lv2Len += 1;
          } else if (mathContentsList[i].quesLevel === 5) {
            lv3Len += 1;
          }
        }
      }

      barArr = [
        {
          labelName: '60%미만',
          value: lv1Len,
          backgroundColor: 'rgb(13, 53, 149, 0.2)',
        },
        {
          labelName: '60%~70%',
          value: lv2Len,
          backgroundColor: 'rgb(13, 53, 149, 0.4)',
        },
        {
          labelName: '70%~80%',
          value: lv3Len,
          backgroundColor: 'rgb(13, 53, 149, 0.7)',
        },
        {
          labelName: '80%~90%',
          value: lv4Len,
          backgroundColor: 'rgb(13, 53, 149)',
        },
        {
          labelName: '90%~100%',
          value: lv5Len,
          backgroundColor: 'rgb(7, 39, 113)',
        },
      ];
    } else {
      //수능 문제가 절반이 안되는 경우 난이도별로 차트 제공
      //setIsIpsiContents(false);
      document.getElementById('barChartTitle').innerText = '난이도별 문항 수';
      for (let i = 0; i < mathContentsList.length; i++) {
        if (mathContentsList[i].quesLevel === 1) {
          lv1Len += 1;
        } else if (mathContentsList[i].quesLevel === 2) {
          lv2Len += 1;
        } else if (mathContentsList[i].quesLevel === 3) {
          lv3Len += 1;
        } else if (mathContentsList[i].quesLevel === 4) {
          lv4Len += 1;
        } else if (mathContentsList[i].quesLevel === 5) {
          lv5Len += 1;
        }
      }
      barArr = [
        {
          labelName: '하',
          value: lv1Len,
          backgroundColor: 'rgb(13, 53, 149, 0.2)',
        },
        {
          labelName: '중하',
          value: lv2Len,
          backgroundColor: 'rgb(13, 53, 149, 0.4)',
        },
        {
          labelName: '중',
          value: lv3Len,
          backgroundColor: 'rgb(13, 53, 149, 0.7)',
        },
        {
          labelName: '중상',
          value: lv4Len,
          backgroundColor: 'rgb(13, 53, 149)',
        },
        { labelName: '상', value: lv5Len, backgroundColor: 'rgb(7, 39, 113)' },
      ];
    }

    setConTotalCnt(newContentsList.length);
    setMathContentsList(newContentsList);

    setConArrByLvOnBar(barArr);
    let pieArr = [
      {
        labelName: '객관식',
        value: multiConCnt,
        className: 'multiChoicePieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '주관식',
        value: essayConCnt,
        className: 'essayPieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
    ];
    setConArrByMultiOnPie(pieArr);

    if (addType === 'myProd') {
      event.target.closest('.contentsDiv').classList.add('customHide');
      /*
            let myProdCon = myProdContents.filter((contentsMap, idx) => {
                if(contentsMap.contentsNo === contentsNo) return false;
                else return true;
            });
            setMyProdContents(myProdCon);
            */
    } else if (addType === 'myRepo') {
      event.target.closest('.contentsDiv').classList.add('customHide');
      /*
            let myRepoCon = myRepoContents.filter((contentsMap, idx) => {
                if(contentsMap.contentsNo === contentsNo) return false;
                else return true;
            });
            setMyRepoContents(myRepoCon);
            */
    } else {
      let simContents = similarContents.filter((contentsMap, idx) => {
        if (contentsMap.contentsId === contentsId) return false;
        else return true;
      });
      setSimilarContents(simContents);
    }

    if (addType === 'conChng') {
      await nb_fadeInOutA('문제가 교체 되었습니다.', 2000);
    } else {
      await nb_fadeInOutA('문제가 추가 되었습니다.', 2000);
    }

    nb_multiChoiceGridSet('quesConMultiShow');
  };

  const takeSimilarContents = async (unitId, typeId, contentsId, contentsClassify) => {
    document.getElementById('mathDocsSimConAdd').classList.remove('hide');
    document.getElementById('mathDocsSimConAdd').dataset.contentsId = contentsId;

    if (contentsClassify === 'UserCustom') contentsClassify = 'InHouse'; //사용자 제작문제인 경우 N명의수학 같은 유형문제로 추천
    let jsonObj = await nb_getRequest('/math/docs/additional?unitId=' + unitId + '&typeId=' + typeId + '&contentsClassifyType=' + contentsClassify, true);
    let newContentsList = jsonObj.data.docs.filter((contentsMap, idx) => {
      let isSame = true;
      for (let i = 0; i < mathContentsList.length; i++) {
        if (contentsMap.contentsId === mathContentsList[i].contentsId) isSame = false;
      }
      return isSame;
    });
    if (newContentsList.length === 0) {
      document.getElementById('mathDocsSimConDesc').innerHTML = '해당 유형의 문제가 모두 추가되어 있습니다. ';
    } else {
      document.getElementById('mathDocsSimConDesc').innerHTML = '';
    }
    setSimilarContents(newContentsList);
    await nb_multiChoiceGridSet('quesConMultiShow');
    document.getElementById('mathDocsSimCon').scrollTo(0, 0);
  };

  const contentsDel = async (contentsId) => {
    let newContentsList = mathContentsList.filter((contentsMap, idx) => {
      if (contentsMap.contentsId === contentsId) return false;
      else return true;
    });
    let lv1Len = 0;
    let lv2Len = 0;
    let lv3Len = 0;
    let lv4Len = 0;
    let lv5Len = 0;

    let multiConCnt = 0;
    let essayConCnt = 0;
    for (let i = 0; i < newContentsList.length; i++) {
      if (newContentsList[i].multiChoiceType === 'M') {
        multiConCnt += 1;
      } else {
        essayConCnt += 1;
      }
      if (newContentsList[i].quesLevel === 1) {
        lv1Len += 1;
      } else if (newContentsList[i].quesLevel === 2) {
        lv2Len += 1;
      } else if (newContentsList[i].quesLevel === 3) {
        lv3Len += 1;
      } else if (newContentsList[i].quesLevel === 4) {
        lv4Len += 1;
      } else if (newContentsList[i].quesLevel === 5) {
        lv5Len += 1;
      }
    }
    setConTotalCnt(newContentsList.length);
    setMathContentsList(newContentsList);
    let barArr = [
      {
        labelName: '하',
        value: lv1Len,
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '중하',
        value: lv2Len,
        backgroundColor: 'rgb(13, 53, 149, 0.4)',
      },
      {
        labelName: '중',
        value: lv3Len,
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
      { labelName: '중상', value: lv4Len, backgroundColor: 'rgb(13, 53, 149)' },
      { labelName: '상', value: lv5Len, backgroundColor: 'rgb(7, 39, 113)' },
    ];
    setConArrByLvOnBar(barArr);
    let pieArr = [
      {
        labelName: '객관식',
        value: multiConCnt,
        className: 'multiChoicePieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.2)',
      },
      {
        labelName: '주관식',
        value: essayConCnt,
        className: 'essayPieLabel',
        backgroundColor: 'rgb(13, 53, 149, 0.7)',
      },
    ];
    setConArrByMultiOnPie(pieArr);
    await nb_multiChoiceGridSet('quesConMultiShow');

    let mathDocsMyProd = document.getElementById('mathDocsMyProd').querySelectorAll('.contentsDiv');
    for (let i = 0; i < mathDocsMyProd.length; i++) {
      if (Number(mathDocsMyProd[i].dataset.contentsId) === contentsId) {
        mathDocsMyProd[i].classList.remove('customHide');
      }
    }

    let mathDocsMyRepo = document.getElementById('mathDocsMyRepo').querySelectorAll('.contentsDiv');
    for (let i = 0; i < mathDocsMyRepo.length; i++) {
      if (Number(mathDocsMyRepo[i].dataset.contentsId) === contentsId) {
        mathDocsMyRepo[i].classList.remove('customHide');
      }
    }

    nb_fadeInOutA('문제가 삭제 되었습니다.', 2000);
  };

  const mathDocsErrorReport = async () => {
    const contentsIdList = mathContentsList.map((item) => item.contentsId);
    let reqBody = new Object();
    reqBody.docsGrade = document.getElementById('docsGrade').value;
    reqBody.docsTitle = document.getElementById('docsTitle').value;
    reqBody.docsSubTitle = document.getElementById('docsSubTitle').value;
    reqBody.docsOwner = document.getElementById('mathDocsOwner').value;
    reqBody.docsStts = 'Error';
    reqBody.contentsIdList = contentsIdList;
    let jsonObj = await nb_postRequest('/math/docs', reqBody, false);
    if (jsonObj.status == 200) {
      let formData = new FormData();
      formData.append('errType', 'MathDocs');
      formData.append('contentsId', jsonObj.data.docsId);
      formData.append('reportContents', document.getElementById('reportContents').value);
      formData.append('clientOs', await nb_getClientOS());
      formData.append('clientBrowser', await nb_getClientBrowser());
      let returnVal = await nb_postForm('/cs/error', formData, true);
      if (returnVal.status === 200) {
        await nb_fadeInOutA('오류 신고가 정상적으로 등록되었습니다.\n학습지를 재생성하여 다시 시도해주시기 바랍니다.', 1500);
        await mathDocsInit();
      }
    }
  };
  const errorReportOpen = async (contentsId, errTitle, errType) => {
    setErrContentsTitle(errTitle);
    setErrType(errType);
    setErrContentsNo(contentsId);
  };

  const errorReportClose = async () => {
    setErrContentsNo(0);
  };

  const mathDocsTitleInfoValid = async () => {
    if (document.getElementById('docsGrade').value.length > 7) {
      nb_fadeInOutB('학년은 7글자 이하로 입력 해주세요.', 2000);
      return false;
    }
    if (document.getElementById('docsTitle').value.length > 20) {
      nb_fadeInOutB('학습지 제목은 20글자 이하로 입력 해주세요.', 2000);
      return false;
    }
    if (document.getElementById('docsSubTitle').value.length > 100) {
      nb_fadeInOutB('학습지 부제목은 100글자 이하로 입력 해주세요.', 2000);
      return false;
    }
    if (document.getElementById('mathDocsOwner').value.length > 20) {
      nb_fadeInOutB('출제자명은 20글자 이하로 입력 해주세요.', 2000);
      return false;
    }
    return true;
  };

  const printMathDocsPaper = async () => {
    setIsHangeulDown(false);
    let isValid = await mathDocsTitleInfoValid();
    if (!isValid) {
      return;
    }
    document.getElementById('mathDocsThrStep').classList.add('hide');
    let mathDocsA4Frame = document.getElementsByClassName('mathDocsA4Frame');
    for (let i = 0; i < mathDocsA4Frame.length; i++) {
      mathDocsA4Frame[i].remove();
    }

    //프린트 전 프린트시 달라지는 수식 속성 입히기
    document.getElementById('mathContents').classList.add('mathDocsTmpDivForHeightBugFix');

    setMathDocsGrade(document.getElementById('docsGrade').value);
    setMathDocsTitle(document.getElementById('docsTitle').value);
    await reg_removeStyleAttribute('mathContents');
    setMathDocsPerPageCnt(Number(document.getElementById('pagePerConCntInp').value));
    setMathDocsSubTitle(document.getElementById('docsSubTitle').value);
    setMathDocsOwner(document.getElementById('mathDocsOwner').value);
    setRerenderVal(rerenderVal + 1);
    setShowMathPaper(true);
    registerMathDocsUsage();
  };

  const saveMathDocsPaper = async () => {
    if (!showFinalPopup) {
      return;
    }
    if (isInnerPage) {
      nb_confirmBox('학습지를 수정하신 경우\n수정한 내용으로 저장됩니다. 저장하시겠습니까?');
    } else {
      nb_confirmBox('학습지를 [나의 학습지] 페이지에 저장하시겠습니까?');
    }
  };

  const mathDocsInit = async () => {
    let mathDocsUnitBtn = document.getElementsByClassName('mathDocsUnitBtn active');
    while (mathDocsUnitBtn.length > 0) {
      mathDocsUnitBtn[0].click();
    }

    let levelSelTd = document.getElementsByClassName('levelSelTd active');
    for (let i = 0; i < levelSelTd.length; i++) {
      levelSelTd[i].classList.remove('active');
    }

    document.getElementById('level1').checked = false;
    document.getElementById('level3').checked = false;
    document.getElementById('level5').checked = false;

    let conCntSelTd = document.getElementsByClassName('conCntSelTd active');
    for (let i = 0; i < conCntSelTd.length; i++) {
      conCntSelTd[i].classList.remove('active');
    }

    document.getElementById('conCntInput').value = '';

    document.getElementById('confirmBoxClose').click();
    window.history.back();
  };

  const registerMathDocsPaper = async () => {
    document.title = 'N명의수학';

    const contentsIdList = mathContentsList.map((item) => item.contentsId);
    let reqBody = new Object();
    reqBody.docsGrade = document.getElementById('docsGrade').value;
    reqBody.docsTitle = document.getElementById('docsTitle').value;
    reqBody.docsSubTitle = document.getElementById('docsSubTitle').value;
    reqBody.docsOwner = document.getElementById('mathDocsOwner').value;
    reqBody.docsStts = 'None';
    reqBody.contentsIdList = contentsIdList;
    let jsonObj;
    if (isInnerPage) {
      reqBody.id = Number(mathDocsId);
      jsonObj = await nb_putRequest('/math/docs', reqBody, false);
    } else {
      jsonObj = await nb_postRequest('/math/docs', reqBody, false);
    }
    if (jsonObj.status == 200) {
      if (!isInnerPage) {
        await mathDocsInit();
        nb_fadeInOutA('[나의 학습지] 페이지에 정상적으로 저장 되었습니다.', 2000);
      } else {
        window.history.back();
      }
    } else {
      nb_fadeInOutB(
        '학습지 저장 도중 에러가 발생 했습니다.\n다시 시도해주시거나 새로고침 후 다시 시도해주시기 바랍니다.\n지속적으로 문제 발생시 고객센터에 신고해주시면 감사하겠습니다.'
      );
    }
  };

  const registerMathDocsUsage = async () => {
    let jsonReq = new Object();
    const contentsIdList = mathContentsList.map((item) => item.contentsId);
    jsonReq.contentsIdList = contentsIdList;
    jsonReq.docsGrade = document.getElementById('docsGrade').value;
    jsonReq.docsTitle = document.getElementById('docsTitle').value;
    jsonReq.docsSubTitle = document.getElementById('docsSubTitle').value;
    jsonReq.docsOwner = document.getElementById('mathDocsOwner').value;
    nb_postRequest('/math/docs/usage', jsonReq, true);
  };

  const registerMathDocsPaperPopClose = async () => {
    document.getElementById('confirmBoxScreen').classList.add('hide');
    document.title = 'N명의수학';
    //프린트 후 프린트시 입혀진 속성 다시 제거하기
    document.getElementById('mathContents').classList.remove('mathDocsTmpDivForHeightBugFix');
  };

  const initImpRangeSlider = async (minVal, maxVal) => {
    setMinYear(minVal);
    setMaxYear(maxVal);
  };

  const initWrongRatioRangeSlider = async (minVal, maxVal) => {
    setMinVal(minVal);
    setMaxVal(maxVal);
  };

  const hanguelDocsDown = async () => {
    setIsHangeulDown(true);
    let isValid = await mathDocsTitleInfoValid();
    if (!isValid) {
      return;
    }
    // let returnObj = await nb_dataFetch('/myContentsCheckForHwpDown?contentsNo=all', true);

    // if (returnObj.contentsNo === -1) {
    //   return;
    // }

    document.getElementById('mathDocsThrStep').classList.add('hide');
    await cvt_htmlToTexAll('mathContents', '.contentsDiv', document.getElementById('docsTitle').value, document.getElementById('mathDocsOwner').value, true);
    saveMathDocsPaper();
    registerMathDocsUsage();
  };

  const showMoreContentsByProd = async function () {
    //필터 풀기
    if (document.getElementById('mySubFilterOff') !== null && document.getElementById('mySubFilterOff') !== undefined) {
      document.getElementById('mySubFilterOff').click();
    }
    curPageNumByProd++;
    let returnObj = await nb_getRequest('/math/content/my?pageNum=' + curPageNumByProd + '&pageVolume=' + pageVolume, true);
    setMyProdContents([...myProdContents, ...returnObj.data.contents]);
    document.getElementById('mathDocsMyProd').classList.remove('hide');
    await nb_multiChoiceGridSet('quesConMultiShow');
    document.getElementById('subjectFilterList').childNodes[0].click();
    document.getElementById('productFilterList').childNodes[0].click();
    if (returnObj.data.contents.length == pageVolume) {
      document.getElementById('showMoreContentsByProd').classList.remove('hide');
    } else {
      document.getElementById('showMoreContentsByProd').classList.add('hide');
    }
  };

  const showMoreContentsByRepo = async function () {
    //필터 풀기
    if (document.getElementById('mySubFilterOff') !== null && document.getElementById('mySubFilterOff') !== undefined) {
      document.getElementById('mySubFilterOff').click();
    }
    curPageNumByRepo++;
    let returnObj = await nb_getRequest('/math/content/repo?pageNum=' + curPageNumByRepo + '&pageVolume=' + pageVolume, true);

    let contentsNodeList = returnObj.data.contents.filter((contentsMap, idx) => {
      let isSame = true;
      for (let i = 0; i < mathContentsList.length; i++) {
        if (contentsMap.contentsId === mathContentsList[i].contentsId) isSame = false;
      }
      return isSame;
    });

    let contentsArray = [].slice.call(contentsNodeList, 0);
    contentsArray.sort(function (a, b) {
      return Number(b.sysCreateDate) - Number(a.sysCreateDate); //내림차순, 날짜 큰것 부터 작 순으로
    });

    if (returnObj.data.contents.length == pageVolume) {
      document.getElementById('showMoreContentsByRepo').classList.remove('hide');
    } else {
      document.getElementById('showMoreContentsByRepo').classList.add('hide');
    }

    setMyRepoContents([...myRepoContents, ...contentsArray]);
    document.getElementById('mathDocsMyRepo').classList.remove('hide');
    await nb_multiChoiceGridSet('quesConMultiShow');
    document.getElementById('subjectFilterList').childNodes[0].click();
    document.getElementById('productFilterList').childNodes[0].click();

    if (curPageNumByRepo !== returnObj.totalPageCnt - 1) {
      document.getElementById('showMoreContentsByRepo').classList.remove('hide');
    } else {
      document.getElementById('showMoreContentsByRepo').classList.add('hide');
    }
  };

  const subjectInfoList = subjectList.map((subjectInfo) => {
    //중등인 경우
    if (subjectInfo.unitName.includes('중등')) {
      if (subjectInfo.unitName.includes('1-1')) {
        return (
          <span key={subjectInfo.unitId}>
            <span className='mathDocsGrade'>중등</span>
            <span
              className='mathDocsUnitBtn'
              data-subject-info={subjectInfo.unitName}
              data-type-exist='false'
              onClick={(event) => {
                unitSelect(event);
              }}>
              {subjectInfo.unitName.replace('중등 ', '')}
            </span>
          </span>
        );
      }
      if (subjectInfo.unitName.includes('1-2') || subjectInfo.unitName.includes('2-2') || subjectInfo.unitName.includes('3-2')) {
        return <span key={subjectInfo.unitId}></span>;
      }
      if (subjectInfo.unitName.includes('3-2')) {
        return (
          <span key={subjectInfo.unitId}>
            <span
              className='mathDocsUnitBtn'
              data-subject-info={subjectInfo.unitName}
              data-type-exist='false'
              onClick={(event) => {
                unitSelect(event);
              }}>
              {subjectInfo.unitName.replace('중등 ', '')}
            </span>
            <br />
          </span>
        );
      }
      return (
        <span
          className='mathDocsUnitBtn'
          key={subjectInfo.unitId}
          data-subject-info={subjectInfo.unitName}
          data-type-exist='false'
          onClick={(event) => {
            unitSelect(event);
          }}>
          {subjectInfo.unitName.replace('중등 ', '')}
        </span>
      );
    } else {
      return <span key={subjectInfo.unitId}></span>;
    }
  });

  const workContentsList = myProdContents.map((contentsMap, idx) => {
    let isMultiHide = 'hide';
    if (contentsMap.firNo !== '') {
      isMultiHide = '';
    }
    let isConImgHide = 'hide';
    if (contentsMap.contentsImg !== null) {
      isConImgHide = '';
    }

    let conImgPath;
    if (contentsMap.contentsImg === null) conImgPath = '';
    else conImgPath = process.env.REACT_APP_S3_PATH + contentsMap.imgPath + contentsMap.contentsImg;

    let sysCreateDate = contentsMap.sysCreateDate;
    let sysDateStr = '';
    for (let i = 0; i < sysCreateDate.length; i++) {
      sysDateStr += sysCreateDate[i];
    }

    return (
      <div
        className='contentsDiv contentsDivForFilter'
        key={idx}
        data-contents-id={contentsMap.contentsId}
        data-subject={contentsMap.subject}
        data-sec-unit={contentsMap.secUnit}
        data-sys-create-date={sysDateStr}>
        <table className='workListTable'>
          <thead>
            <tr className='workListTBHead2'>
              <td>
                <div className='twoFlexLayout'>
                  <div className='twoFlexLayout'>
                    <div>
                      [
                      <span
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.subject,
                        }}></span>
                      ]&nbsp;
                      <span
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.secUnit,
                        }}></span>
                    </div>
                  </div>
                  <div>
                    <span
                      className='myProdAddBtn'
                      data-contents-id={contentsMap.contentsId}
                      onClick={(event) => {
                        myProdConOrRepoConOrSimConAdd(event, 'myProd');
                      }}>
                      추가
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='td1'>
                <div id='workQuesShow' className='workQuesShow quesRootDiv'>
                  <div className='quesDiv'>
                    <div className='quesContents' dangerouslySetInnerHTML={{ __html: contentsMap.contents }}></div>
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
                    <div className='mathDocsMinPadding'></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  });

  const myRepoContentsList = myRepoContents.map((contentsMap, idx) => {
    let isMultiHide = 'hide';
    if (contentsMap.firNo !== '') {
      isMultiHide = '';
    }
    let isConImgHide = 'hide';
    if (contentsMap.contentsImg !== null) {
      isConImgHide = '';
    }

    let conImgPath;
    if (contentsMap.contentsImg === null) conImgPath = '';
    else conImgPath = process.env.REACT_APP_S3_PATH + contentsMap.imgPath + contentsMap.contentsImg;

    let sysCreateDate = contentsMap.sysCreateDate;
    let sysDateStr = '';
    for (let i = 0; i < sysCreateDate.length; i++) {
      sysDateStr += sysCreateDate[i];
    }

    return (
      <div
        className='contentsDiv contentsDivForFilter'
        key={idx}
        data-contents-id={contentsMap.contentsId}
        data-subject={contentsMap.subject}
        data-sec-unit={contentsMap.secUnit}
        data-sys-create-date={sysDateStr}>
        <table className='workListTable'>
          <thead>
            <tr className='workListTBHead2'>
              <td>
                <div className='twoFlexLayout'>
                  <div className='twoFlexLayout'>
                    <div>
                      [
                      <span
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.subject,
                        }}></span>
                      ]&nbsp;
                      <span
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.secUnit,
                        }}></span>
                    </div>
                  </div>
                  <div>
                    <span
                      className='myRepoAddBtn'
                      data-contents-id={contentsMap.contentsId}
                      onClick={(event) => {
                        myProdConOrRepoConOrSimConAdd(event, 'myRepo');
                      }}>
                      추가
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='td1'>
                <div id='workQuesShow' className='workQuesShow quesRootDiv'>
                  <div className='quesDiv'>
                    <div className='quesContents' dangerouslySetInnerHTML={{ __html: contentsMap.contents }}></div>
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
                    <div className='mathDocsMinPadding'></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  });

  const similarContentsList = similarContents.map((contentsMap, idx) => {
    let isMultiHide = 'hide';
    if (contentsMap.firNo !== '') {
      isMultiHide = '';
    }
    let isConImgHide = 'hide';
    if (contentsMap.contentsImg !== null) {
      isConImgHide = '';
    }

    let conImgPath;
    if (contentsMap.contentsImg === null) conImgPath = '';
    else conImgPath = process.env.REACT_APP_S3_PATH + contentsMap.imgPath + contentsMap.contentsImg;

    let sysCreateDate = contentsMap.sysCreateDate;
    let sysDateStr = '';
    for (let i = 0; i < sysCreateDate.length; i++) {
      sysDateStr += sysCreateDate[i];
    }

    return (
      <div className='contentsDiv simConRootDiv' key={idx} data-contents-id={contentsMap.contentsId} data-sys-create-date={sysDateStr}>
        <table className='workListTable'>
          <thead>
            <tr className='workListTBHead2'>
              <td>
                <div className='twoFlexLayout'>
                  <div className='twoFlexLayout'>
                    <div>
                      [
                      <span
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.subject,
                        }}></span>
                      ]&nbsp;
                      <span
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.secUnit,
                        }}></span>
                    </div>
                  </div>
                  <div className='alignRight'>
                    <span
                      className='simConAddBtn'
                      data-contents-id={contentsMap.contentsId}
                      onClick={(event) => {
                        myProdConOrRepoConOrSimConAdd(event, 'simCon');
                      }}>
                      추가{' '}
                    </span>
                    <span
                      className='simConChngBtn'
                      data-contents-id={contentsMap.contentsId}
                      onClick={(event) => {
                        myProdConOrRepoConOrSimConAdd(event, 'conChng');
                      }}>
                      교체{' '}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='td1'>
                <div id='workQuesShow' className='workQuesShow quesRootDiv'>
                  <div className='quesDiv'>
                    <div className='quesContents' dangerouslySetInnerHTML={{ __html: contentsMap.contents }}></div>
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
                    <div className='mathDocsMinPadding'></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  });

  const workContentsList2 = mathContentsList.map((contentsMap, idx) => {
    let quesNumber;
    if (idx < 9) {
      quesNumber = '0' + (idx + 1);
    } else {
      quesNumber = idx + 1;
    }

    let isSolImgHide = 'hide';
    if (contentsMap.solutionImg !== null) {
      isSolImgHide = '';
    }

    let isBlank = '';
    if (contentsMap.choiceAnswer === null) isBlank = 'hide';

    let solImgPath;
    if (contentsMap.solutionImg === null) solImgPath = '';
    else solImgPath = process.env.REACT_APP_S3_PATH + contentsMap.solutionImgPath + contentsMap.solutionImg;

    let lvScore = '';
    if (contentsMap.contentsClassify === 'Ipsi') {
      if (contentsMap.quesLevel === 3) {
        lvScore = '2점';
      } else if (contentsMap.quesLevel === 4) {
        lvScore = '3점';
      } else if (contentsMap.quesLevel === 5) {
        lvScore = '4점';
      }
    }

    return (
      <div id='workContentsDiv' className='workContentsDiv' key={idx}>
        <table className='workListTable'>
          <tbody>
            <tr>
              <td className='td2'>
                <div className='solRootDiv'>
                  <div className='ansSolDiv'>
                    <div id='workAnsShow' className='ansShow'>
                      <div>
                        <div className='ansContents'>
                          <span className='mini-title6'>{quesNumber}. 답</span>
                          &nbsp;&nbsp;
                          <span
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.choiceAnswer,
                            }}></span>
                          <span className={'marginRFive ' + isBlank}></span>
                          <span
                            className='answerSheet'
                            dangerouslySetInnerHTML={{
                              __html: contentsMap.answer,
                            }}></span>
                        </div>
                      </div>
                    </div>
                    <div id='workSolShow' className='solShow'>
                      {contentsMap.contentsClassify === 'Ipsi' && (
                        <div>
                          <div>
                            <span className='mini-title6'>출처</span>
                            &nbsp;&nbsp;
                            {contentsMap.impYear + 1}학년도 {contentsMap.impMonth === 11 ? '수능' : contentsMap.impMonth + '월 모의고사'} {contentsMap.paperType === 2 && '가형'}{' '}
                            {contentsMap.paperType === 3 && '나형'} {contentsMap.oddQuesNum + '번'} (시행 {contentsMap.impYear}/{contentsMap.impMonth})
                          </div>
                          <div>
                            <span className='mini-title6'>배점</span>
                            &nbsp;&nbsp;
                            {lvScore}&nbsp;&nbsp;
                            <span className='mini-title6'>오답률</span>
                            &nbsp;&nbsp;{contentsMap.wrongRatio}%
                          </div>
                          <div>
                            <span className='mini-title6'>단원정보</span>
                            &nbsp;&nbsp;
                            <span
                              dangerouslySetInnerHTML={{
                                __html: contentsMap.subject,
                              }}></span>{' '}
                            &gt;&nbsp;
                            <span
                              dangerouslySetInnerHTML={{
                                __html: contentsMap.secUnit,
                              }}></span>{' '}
                            &gt;&nbsp;
                            <span
                              dangerouslySetInnerHTML={{
                                __html: contentsMap.thrUnit,
                              }}></span>{' '}
                            &gt;&nbsp;
                            <span
                              dangerouslySetInnerHTML={{
                                __html: contentsMap.quesType,
                              }}></span>
                          </div>
                        </div>
                      )}
                      <span className='mini-title6'>해설</span>
                      <div id='solImg-show' className={'solImg-show ' + isSolImgHide}>
                        <img src={solImgPath} id='solutionImgOutput' alt='' />
                      </div>

                      <div
                        className='solContents'
                        dangerouslySetInnerHTML={{
                          __html: contentsMap.solution,
                        }}></div>
                    </div>
                  </div>
                </div>
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
        <title>학습지 만들기</title>
        <meta name='description' content='학습지를 만들어 출력해보세요!' />
        <link rel='canonical' href='https://nsoohak.com/makeMathDocs' />
        <meta property='og:title' content='학습지 만들기' />
        <meta property='og:description' content='학습지를 만들어 출력해보세요!' />
      </Helmet>
      <Outlet />
      <BrowserView className='mathDocsBrowserView'>
        <div id='mathDocsDesc' className='mathDocsPageTitle mini-title5'>
          원하는 단원을 선택하여 학습지를 만들어보세요.
          <br />
          (학습지 생성 문제는 N명의수학 제작 문제만 포함됩니다.)
        </div>
        <div className='noSelect mathDocsRootDiv'>
          <div id='mathDocsFirstStep' className='mathDocsFirstStep'>
            <div
              className='onlyMyProdOrRepoConBtn hide'
              onClick={() => {
                onlyMyProdOrRepoContents();
              }}>
              나의 제작문제로 학습지 만들기
            </div>
            <div className='mini-title3'>&#8251; N명의수학은 현재 중등 1학기 수학 문제들만 제공 중입니다. 주기적인 업데이트로 새로운 문제들을 추가 제공 예정입니다.</div>
            <div className='mathDocsSubjectInfoDiv'>
              {subjectInfoList}
              <div className=''>
                {' '}
                <span className='mathDocsGrade'>대입</span>
                <span
                  className='mathDocsUnitBtn ipsi'
                  data-type-exist='false'
                  onClick={(event) => {
                    ipsiContentsSelect(event);
                  }}>
                  수능모의고사
                </span>
              </div>
            </div>
            <div className='mathDocsSubjectListDiv'></div>
            <div className='bottomFixed'>
              <div className='mathDocsLevelDiv'>
                <div className='inBlock'>
                  {isIpsiContents ? (
                    <table className='levelSelTb'>
                      <tbody>
                        <tr>
                          <td>배점</td>
                          <td className='levelSelTd paddingNone'>
                            <label className='levelSelLabel' htmlFor='level1'>
                              <input type='checkbox' id='level1' name='level' value='3' className='hide' /> 2점
                            </label>
                          </td>
                          <td className='levelSelTd paddingNone'>
                            <label className='levelSelLabel' htmlFor='level3'>
                              <input type='checkbox' id='level3' name='level' value='4' className='hide' /> 3점
                            </label>
                          </td>
                          <td className='levelSelTd paddingNone'>
                            <label className='levelSelLabel' htmlFor='level5'>
                              <input type='checkbox' id='level5' name='level' value='5' className='hide' /> 4점
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className='levelSelTb'>
                      <tbody>
                        <tr>
                          <td>난이도</td>
                          <td
                            className='levelSelTd'
                            onClick={(event) => {
                              levelSelect(event);
                            }}>
                            <label htmlFor='level1'>
                              <input type='radio' id='level1' name='level' value='1' className='hide' /> 하
                            </label>
                          </td>
                          <td
                            className='levelSelTd'
                            onClick={(event) => {
                              levelSelect(event);
                            }}>
                            <label htmlFor='level3'>
                              <input type='radio' id='level3' name='level' value='3' className='hide' /> 중
                            </label>
                          </td>
                          <td
                            className='levelSelTd'
                            onClick={(event) => {
                              levelSelect(event);
                            }}>
                            <label htmlFor='level5'>
                              <input type='radio' id='level5' name='level' value='5' className='hide' /> 상
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
                <div className='inBlock'>
                  <table className='levelSelTb'>
                    <tbody>
                      <tr>
                        <td>문항 수</td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          5
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          10
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          15
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          20
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          25
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          30
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          50
                        </td>
                        <td
                          className='conCntSelTd'
                          onClick={(event) => {
                            conCntSelect(event);
                          }}>
                          100
                        </td>
                        <td>
                          <input
                            id='conCntInput'
                            className='conCnt'
                            type='text'
                            onKeyUp={(event) => {
                              conCntKeyUp(event);
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  className='inBlock orangeBtn nextStep'
                  onClick={(event) => {
                    firstStepCheck();
                  }}>
                  다음단계
                </div>
              </div>
            </div>

            <div id='ipsiContentsSelWrap' className='blindBox hide'>
              <div id='ipsiContentsSelBox' className='ipsiContentsSelBox'>
                <div
                  className='closeBtn2'
                  onClick={() => {
                    document.getElementById('ipsiContentsSelWrap').classList.add('hide');
                  }}>
                  X
                </div>
                <div className='mathDocsIpsiTitle'>
                  시행연월{' '}
                  <span className='mathDocsWrongRatio'>
                    {minYear} ~ {maxYear}년
                  </span>
                </div>
                <div className='mathDocsIpsiDiv year'>
                  {impYearRender && <MultiRangeSlider name='ipsiYear' min={impMinYear} max={impMaxYear} onChange={() => {}} parentMethod={initImpRangeSlider} />}
                </div>
                <div className='mathDocsIpsiDiv month'>
                  <span className='mathDocIpsiConBtn'>
                    <label className='levelSelLabel' htmlFor='ipsiMonth'>
                      <input type='checkbox' id='ipsiMonth' name='ipsiMonth' value='11' className='hide' /> 11월(수능)
                    </label>
                  </span>
                  <span className='mathDocIpsiConBtn'>
                    <label className='levelSelLabel' htmlFor='ipsiMonth2'>
                      <input type='checkbox' id='ipsiMonth2' name='ipsiMonth' value='9' className='hide' /> 9월
                    </label>
                  </span>
                  <span className='mathDocIpsiConBtn'>
                    <label className='levelSelLabel' htmlFor='ipsiMonth3'>
                      <input type='checkbox' id='ipsiMonth3' name='ipsiMonth' value='6' className='hide' /> 6월
                    </label>
                  </span>
                </div>
                <div className='mathDocsIpsiTitle'>
                  오답률{' '}
                  <span className='mathDocsWrongRatio'>
                    {minVal}% ~ {maxVal}%
                  </span>
                </div>
                <MultiRangeSlider name='wrongRatio' min={0} max={100} onChange={() => {}} parentMethod={initWrongRatioRangeSlider} />
                <div className='paddingTen'></div>
                <div className='alignCenter marginTen'>
                  <div
                    className='inBlock orangeBtn alignCenter'
                    onClick={(event) => {
                      ipsiConFirstStepCheck();
                    }}>
                    다음단계
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showChart && (
            <div id='mathDocsTwoStep' className='mathDocsTwoStep'>
              <div>
                <div className='mathDocsStatistics'>
                  <div id='chartWrap' className='chartWrap'>
                    <div className='conTotalCnt'>총 문항 수 : {conTotalCnt}문항</div>
                    <div className='chartTitleWrap'>
                      <span id='barChartTitle' className='barChartTitle'>
                        난이도별 문항 수
                      </span>
                      <span className='pieChartTitle'>객관식 주관식 분포</span>
                    </div>
                    <CustomBarChart barArr={conArrByLvOnBar} />
                    <CustomPieChart pieArr={conArrByMultiOnPie} />
                  </div>
                </div>
                <div className='inBlock'>
                  <div className='mathDocsErrDesc'>
                    <span
                      className='errBtnWrap mathDocs'
                      onClick={() => {
                        document.getElementById('mathDocsErrTitle').innerHTML = '학습지 오류 내용을 적어주세요.';
                        document.getElementById('reportContents').value = '';
                        document.getElementById('mathDocsErrReportBox').classList.remove('hide');
                      }}>
                      <div className='errBtn mathDocs'></div>학습지 오류 신고
                    </span>
                  </div>
                  <div className='conAddBtnWrap'>
                    <table className='conAddBtnTb'>
                      <tbody>
                        <tr>
                          <td>
                            <span
                              className='mathDocsInfoBtn'
                              onClick={() => {
                                document.getElementById('mathDocsInfoShow').classList.remove('hide');
                              }}>
                              문제 간략 요약 보기
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span
                              className='mathDocsMyCon'
                              onClick={() => {
                                takeMyProdContents();
                              }}>
                              나의 제작 문제 추가
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span
                              className='mathDocsMyRepo'
                              onClick={() => {
                                takeMyRepoContents();
                              }}>
                              나의 저장소 문제 추가
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id='mathDocsInfoShow' className='blindBox hide'>
                  <div className='mathDocsInfoRootDiv'>
                    <div className='mathDocsInfoTitle'>문제 간략 요약 보기</div>
                    <div className='mini-title8'>드래그하여 문제 순서를 변경할 수 있습니다.</div>
                    <div
                      className='mathDocsInfoClose'
                      onClick={() => {
                        document.getElementById('mathDocsInfoShow').classList.add('hide');
                      }}>
                      X
                    </div>
                    <div className='mathDocsInfo'>
                      <div className='mathDocsInfoLineDiv'>
                        <span className='mathDocsInfoNumber title'>번호</span>
                        <span className='mathDocsInfoQuesType title'>유형</span>
                        <span className='mathDocsInfoMultiType'>문항 구분</span>
                        <span className='mathDocsInfoLv'>난이도</span>
                        <span className='mathDocsInfoDrag title'>순서변경</span>
                      </div>
                      <ReactSortable list={mathContentsList} animation={200} setList={setMathContentsList}>
                        {mathContentsList.map((contents, idx) => {
                          let quesNumber;
                          if (idx < 9) {
                            quesNumber = '0' + (idx + 1);
                          } else {
                            quesNumber = idx + 1;
                          }
                          let quesLevel;
                          if (contents.quesLevel === 1) {
                            quesLevel = '하';
                          } else if (contents.quesLevel === 2) {
                            quesLevel = '중하';
                          } else if (contents.quesLevel === 3) {
                            quesLevel = '중';
                          } else if (contents.quesLevel === 4) {
                            quesLevel = '중상';
                          } else if (contents.quesLevel === 5) {
                            quesLevel = '상';
                          }
                          let multiChoiceType;
                          if (contents.multiChoiceType === 'M') {
                            multiChoiceType = '객관식';
                          } else if (contents.multiChoiceType === 'E') {
                            multiChoiceType = '주관식';
                          }
                          return (
                            <div key={contents.contentsId} className='mathDocsInfoLineDiv'>
                              <span
                                className='mathDocsInfoNumber'
                                data-contents-id={contents.contentsId}
                                onClick={(event) => {
                                  moveToContents(event);
                                }}>
                                {quesNumber}
                              </span>
                              <span
                                className='mathDocsInfoQuesType'
                                dangerouslySetInnerHTML={{
                                  __html: contents.quesType,
                                }}></span>
                              <span className='mathDocsInfoMultiType'>{multiChoiceType}</span>
                              <span className='mathDocsInfoLv'>{quesLevel}</span>
                              <span className='mathDocsInfoDrag'></span>
                            </div>
                          );
                        })}
                      </ReactSortable>
                    </div>
                  </div>
                </div>
                <div id='mathDocsConAdd' className='blindBox hide'>
                  <div className='mathDocsMyProdWrap'>
                    <div id='mathDocsInfoTitle' className='mathDocsInfoTitle'>
                      나의 제작 문제
                    </div>
                    <div
                      className='mathDocsInfoClose'
                      onClick={() => {
                        document.getElementById('mathDocsConAdd').classList.add('hide');
                      }}>
                      X
                    </div>
                    <MyContentsSearchFilter makeContentsShow={false} descMsg='' />
                    <hr />
                    <div id='mathDocsMyProd' className='mathDocsMyProdDiv'>
                      <div className='workList myContentsList'>
                        <div className='contents-show filterContents'>{workContentsList}</div>
                        <div id='mathDocsMyProdDesc' className='mathDocsSimConDesc'></div>
                      </div>
                      <div
                        id='showMoreContentsByProd'
                        className='showMoreContents hide'
                        onClick={() => {
                          showMoreContentsByProd();
                        }}>
                        검색정보 더보기
                      </div>
                      <div className='paddingFiveZero'></div>
                    </div>
                    <div id='mathDocsMyRepo' className='mathDocsMyRepoDiv'>
                      <div className='workList myContentsList'>
                        <div className='contents-show filterContents'>{myRepoContentsList}</div>
                        <div id='mathDocsMyRepoDesc' className='mathDocsSimConDesc'></div>
                        <div
                          id='showMoreContentsByRepo'
                          className='showMoreContents hide'
                          onClick={() => {
                            showMoreContentsByRepo();
                          }}>
                          검색정보 더보기
                        </div>
                        <div className='paddingFiveZero'></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id='mathDocsSimConAdd' className='blindBox hide'>
                  <div className='mathDocsSimConWrap'>
                    <div id='mathDocsSimTitle' className='mathDocsInfoTitle'>
                      유형 문제
                    </div>
                    <div className='simConDesc'>
                      선택하신 문항과 같은 유형의 문제 내역입니다.
                      <br />
                      원하는 문제를 추가 또는 교체해보세요.
                    </div>
                    <div
                      className='mathDocsInfoClose'
                      onClick={() => {
                        document.getElementById('mathDocsSimConAdd').classList.add('hide');
                      }}>
                      X
                    </div>
                    <hr />
                    <div id='mathDocsSimCon' className='mathDocsMyRepoDiv'>
                      <div className='workList'>
                        <div className='contents-show'>{similarContentsList}</div>
                        <div id='mathDocsSimConDesc' className='mathDocsSimConDesc'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className='workList mathDocsContents'>
                  <div className='mini-title8'>드래그하여 문제 순서를 변경할 수 있습니다.</div>
                  <ReactSortable list={mathContentsList} animation={200} setList={setMathContentsList} id='mathContents' className='contents-show userSearchPage grab'>
                    {mathContentsList.map((contentsMap, idx) => {
                      let quesNumber;
                      if (idx < 9) {
                        quesNumber = '0' + (idx + 1);
                      } else {
                        quesNumber = idx + 1;
                      }
                      let isMultiHide = 'hide';
                      if (contentsMap.firNo !== '') {
                        isMultiHide = '';
                      }
                      let isConImgHide = 'hide';
                      if (contentsMap.contentsImg !== null) {
                        isConImgHide = '';
                      }

                      let lvScore = '';
                      if (contentsMap.contentsClassify === 'Ipsi') {
                        if (contentsMap.quesLevel === 3) {
                          lvScore = '2점';
                        } else if (contentsMap.quesLevel === 4) {
                          lvScore = '3점';
                        } else if (contentsMap.quesLevel === 5) {
                          lvScore = '4점';
                        }
                      }

                      let conImgPath;
                      if (contentsMap.contentsImg === null) conImgPath = '';
                      else conImgPath = process.env.REACT_APP_S3_PATH + contentsMap.imgPath + contentsMap.contentsImg;

                      let contentsId = 'workContentsDiv' + contentsMap.contentsId;
                      return (
                        <div id={contentsId} className='contentsDiv userSearchPage' key={contentsMap.contentsId} data-contents-id={contentsMap.contentsId}>
                          <table className='workListTable userSearchPage'>
                            <thead>
                              <tr>
                                <td>
                                  <div className='bi-jutify-align backLightGray'>
                                    <div>
                                      <span className='quesNumber paddingLTen'>{quesNumber}</span>
                                    </div>
                                    <div className='alignRight'>
                                      <div
                                        className='mathDocsConChngBtn'
                                        onClick={() => {
                                          takeSimilarContents(contentsMap.unitId, contentsMap.typeId, contentsMap.contentsId, contentsMap.contentsClassify);
                                        }}>
                                        문항 교체
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className='td1 userSearchPage backHover'>
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
                                        <div className='mathDocsMinPadding'></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className='errBtn'
                                    onClick={() => {
                                      errorReportOpen(contentsMap.contentsId, '문제 오류 신고', 1);
                                    }}></div>
                                  <div
                                    className='delBtn'
                                    onClick={() => {
                                      contentsDel(contentsMap.contentsId);
                                    }}></div>
                                </td>
                                {isHangeulDown && (
                                  <td className='td2 hide'>
                                    <div className='solRootDiv'>
                                      <div className='ansSolDiv'>
                                        <div id='workAnsShow' className='ansShow'>
                                          <div>
                                            <div className='ansContents'>
                                              <span className='ansDesc mini-title6'>답 &nbsp;&nbsp;</span>
                                              <span
                                                className='multiAnswerSheet'
                                                dangerouslySetInnerHTML={{
                                                  __html: contentsMap.choiceAnswer,
                                                }}></span>
                                              <span
                                                className='answerSheet'
                                                dangerouslySetInnerHTML={{
                                                  __html: contentsMap.answer,
                                                }}></span>
                                            </div>
                                          </div>
                                        </div>

                                        <div id='workSolShow' className='solShow'>
                                          <div className='solContents'>
                                            {contentsMap.contentsClassify === 'Ipsi' && (
                                              <div>
                                                <div>
                                                  {contentsMap.impYear + 1}
                                                  학년도 {contentsMap.impMonth === 11 ? '수능' : contentsMap.impMonth + '월 모의고사'} {contentsMap.paperType === 2 && '가형'}{' '}
                                                  {contentsMap.paperType === 3 && '나형'} {contentsMap.oddQuesNum + '번'} [{lvScore}] &nbsp;
                                                  <span className='mini-title6'>오답률</span>
                                                  &nbsp;{contentsMap.wrongRatio}%
                                                </div>
                                              </div>
                                            )}
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: contentsMap.solution,
                                              }}></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </ReactSortable>
                </div>
                <div className='bottomFixed'>
                  <div className='twoStepDiv'>
                    <div
                      id='docsPreviousBtn'
                      className='inBlock orangeBorderBtn previousStep'
                      onClick={() => {
                        window.history.back();
                      }}>
                      이전단계
                    </div>
                    {showFinalPopup && (
                      <div
                        id='docsPreviousPage'
                        className='inBlock orangeBorderBtn previousStep hide'
                        onClick={() => {
                          window.history.back();
                        }}>
                        이전 페이지
                      </div>
                    )}
                    <div
                      id='docsMakeBtn'
                      className='inBlock orangeBtn nextStep'
                      onClick={() => {
                        twoStepCheck();
                      }}>
                      학습지 만들기
                    </div>
                  </div>
                </div>
                <div id='scrollMoveBtn' className='scrollMoveBtn'>
                  <div
                    id='conListScrollToTop'
                    className='conListScrollToTop'
                    tooltip='맨 위로'
                    onClick={() => {
                      nb_moveToScrollAllRange(true);
                    }}></div>
                  <div id='conScrollCenterCircle' className='conScrollCenterCircle'></div>
                  <div
                    id='conListScrollToBottom'
                    className='conListScrollToBottom'
                    tooltip='맨 아래로'
                    onClick={() => {
                      nb_moveToScrollAllRange(false);
                    }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div id='mathDocsThrStep' className='blindBox hide'>
          <div className='mathDocsThrStep'>
            <div className='mathDocsThrStepTitle'>설정을 마무리하고 학습지를 사용해보세요...!</div>
            <div
              className='mathDocsThrStepClose closeBtn'
              onClick={() => {
                document.getElementById('mathDocsThrStep').classList.add('hide');
              }}>
              X
            </div>
            <div className='mathDocsThrStepDesc'>
              <div>
                <table className='mathDocsThrStepTb'>
                  <tbody>
                    <tr>
                      <td>
                        <div className='mathDocsThrStepDetailTitle'>페이지당 문제 수</div>
                      </td>
                      <td
                        className='pagePerConCnt active'
                        onClick={(event) => {
                          pagePerConCnt(event);
                        }}>
                        4
                      </td>
                      <td
                        className='pagePerConCnt'
                        onClick={(event) => {
                          pagePerConCnt(event);
                        }}>
                        6
                      </td>
                      <td
                        className='pagePerConCnt'
                        onClick={(event) => {
                          pagePerConCnt(event);
                        }}>
                        8
                      </td>
                      <td>
                        <input id='pagePerConCntInp' className='hide' type='number' defaultValue={4} />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan='3' className='pagePerConCntDesc'>
                        페이지당 문제 수는 문제 길이에 따라 달라질 수 있습니다.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='mathDocsThrStepDetailTitle'>학년</div>
                      </td>
                      <td colSpan='3'>
                        <input id='docsGrade' name='' className='mathDocsThrStepInput' type='text' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='mathDocsThrStepDetailTitle'>학습지 제목</div>
                      </td>
                      <td colSpan='3'>
                        <input id='docsTitle' name='docsTitle' className='mathDocsThrStepInput' type='text' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='mathDocsThrStepDetailTitle'>학습지 부제목</div>
                      </td>
                      <td colSpan='3'>
                        <input id='docsSubTitle' name='docsSubTitle' className='mathDocsThrStepInput' type='text' />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className='mathDocsThrStepDetailTitle'>출제자(선택)</div>
                      </td>
                      <td colSpan='3'>
                        <input id='mathDocsOwner' name='' className='mathDocsThrStepInput' type='text' />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className='mathDocsDown'
              onClick={() => {
                hanguelDocsDown();
              }}>
              학습지 한글다운
            </div>
            <div
              className='mathDocsPrint'
              onClick={() => {
                printMathDocsPaper();
              }}>
              학습지 출력
            </div>
          </div>
        </div>

        <div id='confirmBoxScreen' className='confirmBoxScreen hide'>
          <div id='confirmBox' className='confirmBox'>
            <div className='confirmBoxTop'>
              <span
                id='confirmBoxClose'
                className='confirmBoxClose'
                onClick={() => {
                  registerMathDocsPaperPopClose();
                }}>
                X
              </span>
            </div>
            <div id='confirmMsg' className='confirmMsg'></div>
            <div className='alignCenter'>
              <span
                id='confirmBoxCnclBtn'
                className='confirmBoxCnclBtn'
                onClick={() => {
                  registerMathDocsPaperPopClose();
                }}>
                아니오
              </span>
              <span
                id='confirmBoxBtn'
                className='confirmBoxBtn'
                onClick={() => {
                  registerMathDocsPaper();
                }}>
                네
              </span>
            </div>
          </div>
        </div>
        <div className='hide'>{workContentsList2}</div>

        {errContentsNo !== 0 && <ErrorReportForMathCon title={errContentsTitle} errType={errType} parentMethod={errorReportClose} conNo={errContentsNo} />}

        {showMathPaper && (
          <MathDocsPaperA
            perPageCnt={mathDocsPerPageCnt}
            mathContentsList={mathContentsList}
            mathDocsTitle={mathDocsTitle}
            mathDocsSubTitle={mathDocsSubTitle}
            mathDocsGrade={mathDocsGrade}
            mathDocsOwner={mathDocsOwner}
            key={rerenderVal}
            parentMethod={saveMathDocsPaper}
          />
        )}

        <div id='mathDocsErrReportBox' className='blindBox hide'>
          <div className='confirmBox'>
            <div
              className='closeBtn2'
              onClick={() => {
                document.getElementById('mathDocsErrReportBox').classList.add('hide');
              }}>
              X
            </div>
            <div id='mathDocsErrTitle' className='mathDocsErrTitle'>
              학습지가 생성되지 않으시나요?
            </div>
            <div>
              <div className='paddingTen'></div>
              <textarea id='reportContents' name='reportContents' className='errorReportContents' />
            </div>
            <div
              id='mathDocsErrBtn'
              className='mathDocsErrBtn'
              onClick={() => {
                document.getElementById('mathDocsErrReportBox').classList.add('hide');
                mathDocsErrorReport();
              }}>
              학습지 오류 신고
            </div>
            <div
              className='mathDocsErrBtn2'
              onClick={() => {
                document.getElementById('mathDocsErrReportBox').classList.add('hide');
              }}>
              취소
            </div>
          </div>
        </div>

        <div id='resDetailedTimeDesc' className='blindBox hide'>
          <div id='hourGlassBox' className='resDetailedTimeDesc'>
            <div>
              <img className='hourglass' src={hourglass} alt='' />
            </div>
            <div id='hourGlassDesc'></div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div id='mathDocsDesc' className='mathDocsPageTitle mini-title5 mobile'>
          원하는 단원을 선택하여 학습지를 만들어보세요.
        </div>
        <div className='noSelect mathDocsRootDiv mobile'>
          <div id='mathDocsFirstStep' className='mathDocsFirstStep'>
            <div className='mathDocsSubjectInfoDiv mobile'>{subjectInfoList}</div>
            <div className='mathDocsSubjectListDiv mobile'></div>
            <div className='bottomFixed'>
              <div
                className='inBlock orangeBtn mobile'
                onClick={(event) => {
                  firstStepCheck();
                }}>
                다음단계
              </div>
            </div>
          </div>
        </div>
      </MobileView>
    </>
  );
};

export default MathDocsMaker;
