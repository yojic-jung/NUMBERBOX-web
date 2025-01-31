import React, { useState, useEffect } from 'react';
import EmptyList from 'web/common/EmptyList';
import FormulaShortCutKey from 'web/contents/register/FormulaShortCutKey';
import TabButton from 'web/common/TabButton';
import NbWebEditor from 'web/contents/register/NbWebEditor';
import 'css/main/main.css';
import 'css/common/nbFormula.css';
import 'css/staff/staff.css';
import 'css/common/common.css';
import 'css/fileConvert/fileConvert.css';
import hourglass from 'img/hourglass.gif';
import {
  nb_dataFetch,
  nb_extensionCheck2,
  nb_isLogin,
  nb_isManger,
  nb_base64ImgRegisterToS3,
  nb_formDataFetch,
  nb_confirmBox,
  nb_topMenuFixed,
  nb_getParameterByName,
  nb_base64ImgRegisterToS3ByTargetId,
  nb_getByteLengthOfString,
  nb_getClientOS,
  nb_getClientBrowser,
  nb_postForm,
  nb_putRequest,
  nb_getRequest,
  nb_deleteRequest,
} from 'js/common/common_nb.js';
import {
  reg_preventKeyEvent,
  reg_selectCheck,
  reg_dressSelectionBackColor,
  reg_dressYellowBox,
  reg_formulaTapMoveEv,
  reg_tbPasteInPastePrevent,
  reg_tbCellKeyUp,
  reg_nbComplie,
  reg_imageCopy,
  reg_mDownTdWidthChange,
  reg_mMoveTdWidthChange,
  reg_convertFigureTagRemove,
  reg_mUpTdWidthChange,
  reg_selStartTdWidthChange,
  reg_tbSelBackgroundRemove,
  reg_tbCellMouseUp,
  reg_tbCellCopy,
  reg_convertNotTransferdNbBox,
  reg_removeSelectionBackColor,
  reg_newSelectFormulaElement,
  reg_removeResizeFrame,
  reg_enableImageResizeInDiv,
  reg_oneLineOneDiv,
  reg_undoRedoSetting,
  reg_undoRedoInitialize,
  reg_tbCellMouseDown,
  reg_tbCellMouseMove,
  reg_vacantTextNodeRemove,
} from 'js/contents/register/contents_reg';
import { cvt_convertTexToNbFormul, replaceTexToNbFormul, replaceTexToNbBoxFormul, cvt_findRightBrck } from 'js/convertGrammer/nbToTexConvert_cvt.js';

const formulaTabList = [
  {
    id: 'mainFormulaTap',
    tabName: '기본수식(alt 단축키)',
    className: 'formulaTap selectedTab',
  },
  {
    id: 'highFormulaTap',
    tabName: '기타 수식(alt+shift 단축키)',
    className: 'formulaTap',
  },
  {
    id: 'etcFormulaTap',
    tabName: '기타 기호(alt+shift+ctrl 단축키)',
    className: 'formulaTap',
  },
  { id: 'etcFormulaTap2', tabName: '기타 기호2', className: 'formulaTap' },
];

const HwpToHtml = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [myUpldFile, setMyUpldFile] = useState(new Array());
  const [emptyListMsg, setEmptyListMsg] = useState(
    '한글파일로 관리하는 수학문제를 N명의수학을 통해 DB화 해서 관리해보세요!\nN명의수학에서 제공하는 여러 문제 관리 기능을 사용하실 수 있습니다!'
  );
  const [shortCutKey, setShortCutKey] = useState('');
  const [shortCutKeyAll, setShortCutKeyAll] = useState(new Array());
  const [isFetchShotCutKey, setIsFetchShotCutKey] = useState(false);

  useEffect(() => {
    const asyncUseEffect = async function () {
      let jsonObj = await nb_getRequest('/public/math/menu/shortCutKey', true);
      const shortCutKey = jsonObj.data.shortCutKey;
      setShortCutKey(jsonObj.data);
      setShortCutKeyAll(shortCutKey);
      setIsFetchShotCutKey(true);
      window.shortCutKeyList = shortCutKey['Main'];
      window.shortCutKeyHigh1 = shortCutKey['High1'];
      window.shortCutKeyEtc = shortCutKey['Etc'];
      window.shortCutKeyEtc = shortCutKey['Etc2'];

      //convertNo 파라미터 있고 관리자 및 매니저이면 convertNo 파일 내용 볼 수 있음(관리자 및 매니저 아닌 경우 파라미터 없는 로직 그대로 수행)
      let resourceMenu;
      let param = nb_getParameterByName('convertNo');
      if (param !== '' && nb_isManger()) {
        // resourceMenu = await nb_getRequest('/convert/errHwpConvertContents?convertNo=' + param, true);
        // document.getElementsByClassName('hwpToWebUpldBtn')[0].classList.add('hide');
        // setMyUpldFile(resourceMenu.data.contentsList);
        // document.getElementsByClassName('myHwpContentsMenuThead')[0].innerText = '오류 파일';
        // setIsAdminMode(true);
      } else {
        resourceMenu = await nb_getRequest('/hwp/contents/my', true);
        setMyUpldFile(resourceMenu.data.contentsList);
      }

      reg_enableImageResizeInDiv('myHwpContents');
      if (resourceMenu.data.contentsList.length !== 0) {
        document.getElementsByClassName('convertFileNameRoot')[0].click();
        if (!isAdminMode) {
          window.addEventListener('beforeunload', beforeUnloadSaveContent);
        }
      }

      window.addEventListener('scroll', topMenuFixed);
      window.addEventListener('resize', topMenuWidth);
      //window.addEventListener('scroll', reg_removeResizeFrame);

      window.addEventListener('keydown', reg_formulaTapMoveEv);
      //테이블 너비 변경 이벤트
      window.addEventListener('mousedown', await reg_mDownTdWidthChange);
      window.addEventListener('mousemove', await reg_mMoveTdWidthChange);
      window.addEventListener('mouseup', await reg_mUpTdWidthChange);
      window.addEventListener('selectstart', await reg_selStartTdWidthChange);
      //테이블 셀렉트 색상 이벤트
      window.addEventListener('mousedown', reg_tbSelBackgroundRemove);
      window.addEventListener('mouseup', await reg_tbCellMouseUp);
      document.addEventListener('copy', await reg_tbCellCopy);
      //수식요소 배경색 지정
      window.addEventListener('mousedown', await reg_removeSelectionBackColor);
      //수식요소 마우스 셀렉트 규칙
      window.addEventListener('mouseup', await reg_newSelectFormulaElement);
    };
    asyncUseEffect();
    return () => removeAddedEvent();
  }, []);

  const removeAddedEvent = () => {
    window.shortCutKeyList = null;
    window.shortCutKeyHigh1 = null;
    window.shortCutKeyEtc = null;
    window.shortCutKeyEtc2 = null;
    window.removeEventListener('scroll', topMenuFixed);
    window.removeEventListener('resize', topMenuWidth);
    //window.removeEventListener('scroll',reg_removeResizeFrame);
    window.removeEventListener('keydown', reg_formulaTapMoveEv);
    //테이블 너비 변경 이벤트
    window.removeEventListener('mousedown', reg_mDownTdWidthChange);
    window.removeEventListener('mousemove', reg_mMoveTdWidthChange);
    window.removeEventListener('mouseup', reg_mUpTdWidthChange);
    window.removeEventListener('selectstart', reg_selStartTdWidthChange);
    //테이블 셀렉트 색상 이벤트
    window.removeEventListener('mousedown', reg_tbSelBackgroundRemove);
    window.removeEventListener('mouseup', reg_tbCellMouseUp);
    document.removeEventListener('copy', reg_tbCellCopy);
    //수식요소 배경색 지정
    window.removeEventListener('mousedown', reg_removeSelectionBackColor);
    //수식요소 마우스 셀렉트 규칙
    window.removeEventListener('mouseup', reg_newSelectFormulaElement);
  };

  const topMenuFixed = () => {
    nb_topMenuFixed('topShortkeyDiv', targetDomWidth, null);
  };

  let targetDomWidth = 800;
  const topMenuWidth = () => {
    targetDomWidth = document.getElementsByClassName('right')[0].offsetWidth;
    document.getElementById('topShortkeyDiv').style.width = targetDomWidth + 'px';
  };

  const hwpToWebBtn = async () => {
    if (await nb_isLogin()) {
      //목록에 하나라도 있으면 현재 파일 저장하고 파일 업로드 변환 과정 실행
      if (document.getElementById('myHwpContents') !== null) {
        //undo, redo 초기화 및 변환된 상태 저장
        let fakeEv = new Object();
        fakeEv.isTrusted = true;
        await reg_undoRedoInitialize();
        await reg_undoRedoSetting();

        await saveMyHwpContents(fakeEv, true, false);
      }
      document.getElementById('hwpToWebUpld').click();
    } else {
      alert('로그인 이후 사용해주시기 바랍니다.');
    }
  };

  const checkStrtEnd = async (textStr) => {
    let isValid = true;
    let strtIdx = 0;
    while (true) {
      if (textStr.substr(strtIdx).indexOf('$strt/') < 0) {
        break;
      }
      strtIdx += textStr.substr(strtIdx).indexOf('$strt/');

      let endIdx = textStr.substr(strtIdx).indexOf('$end/');
      if (endIdx < 0) {
        isValid = false;
        break;
      }
      strtIdx = strtIdx + endIdx;
    }
    return isValid;
  };

  const combineStrtEndTextNode = async (a_array) => {
    let isExecuted = false;
    for (let i = 0; i < a_array.length; i++) {
      let isValid = await checkStrtEnd(a_array[i].nodeValue);
      if (!isValid) {
        if (i !== a_array.length - 1) {
          isExecuted = true;
          a_array[i].nodeValue = a_array[i].nodeValue + '' + a_array[i + 1].nodeValue;
          a_array[i + 1].nodeValue = '';
        }
      }
    }
    for (let i = a_array.length - 1; i >= 0; i--) {
      if (a_array[i].nodeValue === '') {
        a_array[i].remove();
      }
    }
    return isExecuted;
  };

  const hwpHtmlToNbHtml = async (domId, isFirst, s3FileUrl, convertNo) => {
    //이미지 파일 셋팅
    let imgDom = document.getElementById('myHwpContents').querySelectorAll('img');
    for (let i = 0; i < imgDom.length; i++) {
      let lastIdx = imgDom[i].src.lastIndexOf('/');
      let imgName = imgDom[i].src.substring(lastIdx + 1, imgDom[i].src.length);
      console.log(s3FileUrl);
      if (s3FileUrl !== undefined) {
        imgName = s3FileUrl + imgName;
      }
      imgDom[i].src = imgName;
    }

    //메타 태그 제거
    let metaTag = document.getElementById(domId).querySelectorAll('meta, title, link, style');
    while (metaTag.length > 0) {
      metaTag[0].remove();
      metaTag = document.getElementById(domId).querySelectorAll('meta, title, link, style');
    }

    if (isFirst) {
      //width, height 제외한 속성 제거
      let allDom = document.getElementById(domId).querySelectorAll('*');
      for (let i = 0; i < allDom.length; i++) {
        let width = allDom[i].style.width;
        let height = allDom[i].style.height;
        allDom[i].style = '';
        allDom[i].classList = '';
        allDom[i].style.width = width;
        allDom[i].style.height = height;
        /*
                if((allDom[i].tagName === "DIV" && allDom[i].innerText === "") || (allDom[i].tagName === "P" && allDom[i].innerText === "")){
                    let existImg = allDom[i].querySelectorAll("img");
                    if(existImg.length === 0){
                        allDom[i].classList = "emptyDom"
                    }
                }
                */
      }
    }

    //빈 div 또는 p 태그 제거
    //let emptyDom = document.getElementById(domId).querySelectorAll(".emptyDom")
    /*
        while(emptyDom.length >0){
            emptyDom[0].remove();
            emptyDom = document.getElementById(domId).querySelectorAll(".emptyDom")
        }
        */

    //테이블 N명의수학 테이블로 변경
    let tableDom = document.getElementById(domId).querySelectorAll('table');
    for (let i = 0; i < tableDom.length; i++) {
      if (tableDom[i].classList.contains('nbBox')) continue;
      tableDom[i].style = '';
      tableDom[i].classList = 'editInnerTable';
      tableDom[i].id = 'editInnerTable' + (i + 1);
      let trDom = tableDom[i].querySelectorAll('tr');
      //테이블 행렬 표시
      for (let j = 0; j < trDom.length; j++) {
        trDom[j].dataset.row = j;
        let tdDom = trDom[j].querySelectorAll('td');
        for (let k = 0; k < tdDom.length; k++) {
          //editInnerTable 너비에 맞게 td 너비 비율 맞춰 셋팅
          //tdDom[k].style.width = (tdDom[k].offsetWidth/trDom[j].offsetWidth)*380-10+"px";
          tdDom[k].dataset.col = k;
        }
      }
    }

    let tdDom = document.getElementById(domId).querySelectorAll('td');
    for (let i = 0; i < tdDom.length; i++) {
      if (tdDom[i].closest('.editInnerTable') === null) continue;
      tdDom[i].style = '';
      tdDom[i].classList = 'innerTbTd';
      tdDom[i].style.width = (tdDom[i].offsetWidth / tdDom[i].closest('tr').offsetWidth) * 380 - 12 + 'px';
      tdDom[i].addEventListener('mousedown', reg_tbCellMouseDown);
      tdDom[i].addEventListener('mousemove', reg_tbCellMouseMove);
      tdDom[i].id = 'innerTbTd' + tdDom[i].closest('tr').dataset.row + tdDom[i].dataset.col;
    }

    //테이블 행렬 dataset 지우기
    for (let i = 0; i < tableDom.length; i++) {
      let trDom = tableDom[i].querySelectorAll('tr');
      for (let j = 0; j < trDom.length; j++) {
        trDom[j].removeAttribute('data-row');
        let tdDom = trDom[j].querySelectorAll('td');
        for (let k = 0; k < tdDom.length; k++) {
          tdDom[k].removeAttribute('data-col');
        }
      }
    }

    //span태그 제거
    let allSpanDom = document.getElementById(domId).querySelectorAll('span');
    for (let i = 0; i < allSpanDom.length; i++) {
      allSpanDom[i].outerHTML = allSpanDom[i].innerHTML;
    }

    //P태그 to DIV태그 변경
    let allPDom = document.getElementById(domId).querySelectorAll('p');
    while (allPDom.length > 0) {
      let divTag = document.createElement('div');
      divTag.innerHTML = allPDom[0].innerHTML;
      allPDom[0].after(divTag);
      allPDom[0].remove();
      allPDom = document.getElementById(domId).querySelectorAll('p');
    }

    //불필요한 태그 제거(table, thead, th, tbody, tr, td, img, div, br, u)

    //텍스트 노드 $strt/와 $end/ 짝맞춤 [시작]
    let a_array = new Array();
    const GetText = async (tag) => {
      if (tag.hasChildNodes()) {
        var i;
        for (i = 0; i < tag.childNodes.length; i++) {
          if (tag.childNodes[i].nodeType == 3) {
            a_array.push(tag.childNodes[i]);
          } else {
            await GetText(tag.childNodes[i]);
          }
        }
      }
      if (tag.nodeType == 3) {
        a_array.push(tag);
      }
    };

    while (true) {
      a_array = new Array();
      await GetText(document.getElementById(domId));
      let isExecuted = await combineStrtEndTextNode(a_array);
      if (!isExecuted) break;
    }
    //텍스트 노드 $strt/와 $end/ 짝맞춤 [끝]

    // <,>꺽새를 html코드로 변경(꺽새를 html코드로 변경 안하면 innerHTML에서 꺽새를 인식해서 꺽새 다음 모두 사라지는 에러 해결)
    a_array = new Array();
    await GetText(document.getElementById(domId));
    for (let i = 0; i < a_array.length; i++) {
      if (a_array[i].nodeValue.indexOf('<') > -1) {
        a_array[i].nodeValue = a_array[i].nodeValue.replaceAll('<', '&lt;');
      } else if (a_array[i].nodeValue.indexOf('>') > -1) {
        a_array[i].nodeValue = a_array[i].nodeValue.replaceAll('>', '&gt;');
      }
    }

    //문법 변환 시작
    a_array = new Array();
    let tmpBoxFormulArr = new Array();
    await GetText(document.getElementById(domId));
    for (let i = 0; i < a_array.length; i++) {
      let uniqIdx = 0;
      while (a_array[i].nodeValue.indexOf('$strt/') > -1) {
        uniqIdx++;
        let strtIdx = a_array[i].nodeValue.indexOf('$strt/');
        let endIdx = a_array[i].nodeValue.indexOf('$end/');

        let texOrgStrtGrammer = a_array[i].nodeValue.substring(0, strtIdx);
        let texOrgEndGrammer = a_array[i].nodeValue.substr(endIdx + 5);
        let texGrammer = a_array[i].nodeValue.substring(strtIdx + 6, endIdx);
        for (let j = 0; j < replaceTexToNbFormul.length; j++) {
          texGrammer = texGrammer.replaceAll(replaceTexToNbFormul[j].texGrammer, replaceTexToNbFormul[j].nbFormula);
        }
        //띄어쓰기 및 한컴에서만 사용되는 효과 없애기
        texGrammer = texGrammer
          .replaceAll('& ', '')
          .replaceAll(' ', '')
          .replaceAll('rm', '')
          .replaceAll('it', '')
          .replaceAll('`', ' ')
          .replaceAll('~', ' ')
          .replaceAll('"', '')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('nbCustomWaveText', '~');
        for (let j = 0; j < replaceTexToNbBoxFormul.length; j++) {
          let tmpIdx = 0;
          while (texGrammer.indexOf(replaceTexToNbBoxFormul[j].texGrammer) > -1) {
            let nbFormulGrammer = shortCutKeyAll.filter((element) => {
              return element.id === replaceTexToNbBoxFormul[j].formulId;
            });
            //LEFT.으로 들어온 경우 분수용 괄호 문법 모두 넘겨주기
            if (replaceTexToNbBoxFormul[j].formulId === 999) {
              nbFormulGrammer = shortCutKeyAll.filter((element) => {
                return element.id === 82 || element.id === 83 || element.id === 84 || element.id === 85;
              });
            }

            //n명의 수학에는 존재하지 않고, 한글 파일에만 존재하는 수식 처리(bold)
            if (nbFormulGrammer[0] === undefined) {
              let tmpObj = new Object();
              tmpObj.nbGrammer = '';
              nbFormulGrammer[0] = tmpObj;
            }

            let convertHtml;
            if (replaceTexToNbBoxFormul[j].formulId === 999) {
              //LEFT.으로 들어온 경우 분수용 괄호 문법 모두 넘겨주기
              convertHtml = await cvt_convertTexToNbFormul(
                replaceTexToNbBoxFormul[j].formulId,
                texGrammer,
                texGrammer.indexOf(replaceTexToNbBoxFormul[j].texGrammer),
                nbFormulGrammer
              );
            } else {
              convertHtml = await cvt_convertTexToNbFormul(
                replaceTexToNbBoxFormul[j].formulId,
                texGrammer,
                texGrammer.indexOf(replaceTexToNbBoxFormul[j].texGrammer),
                nbFormulGrammer[0].nbGrammer
              );
            }

            //중괄호 없는 경우
            if (convertHtml === null) {
              let tmpId = '임시아이디' + i + '-' + j + '-' + tmpIdx + '-' + uniqIdx + '.';
              let tmpSpan = document.createElement('span');
              tmpSpan.innerHTML = replaceTexToNbBoxFormul[j].texGrammer;
              let tmpBoxFormul = { tmpId: tmpId, nbFormul: tmpSpan };
              texGrammer = texGrammer.replace(replaceTexToNbBoxFormul[j].texGrammer, tmpId);
              tmpBoxFormulArr.push(tmpBoxFormul);
            } else if (convertHtml === 'skip') {
              break;
            } else {
              //임시 아이디 발급 후 바꿔치기
              let tmpId = '임시아이디' + i + '-' + j + '-' + tmpIdx + '-' + uniqIdx + '.';
              texGrammer = texGrammer.substring(0, convertHtml.strtIdx) + tmpId + texGrammer.substring(convertHtml.endIdx, texGrammer.length);
              let tmpBoxFormul = {
                tmpId: tmpId,
                nbFormul: convertHtml.nbFormulBox,
              };
              tmpBoxFormulArr.push(tmpBoxFormul);
            }
            tmpIdx++;
            if (tmpIdx > 1000) {
              alert('[죄송합니다.]\n업로드하신 파일의 수식 변환 중 오류가 발생하였습니다.\n고객센터에서 해당 오류를 파악하여 빠르게 해결하도록 하겠습니다.');
              if (convertNo !== undefined) {
                registerError(convertNo);
                // let resourceMenu = await nb_dataFetch('/convert/changeErrStts?convertNo=' + convertNo, true);
                // setMyUpldFile(resourceMenu.myList);
                // document.getElementsByClassName('convertFileNameRoot')[0].click();
              }
              return;
            }
          }
        }
        for (let idx = 0; idx < tmpBoxFormulArr.length; idx++) {
          texGrammer = texGrammer.replaceAll(tmpBoxFormulArr[idx].tmpId, tmpBoxFormulArr[idx].nbFormul.innerHTML);
        }

        texGrammer = texGrammer.replaceAll('#', '<br/>');

        a_array[i].nodeValue = texOrgStrtGrammer + texGrammer + texOrgEndGrammer;
      }
    }

    //모든 텍스트 노드를 innerHTML로 변환
    a_array = new Array();
    await GetText(document.getElementById(domId));
    for (let i = a_array.length - 1; i >= 0; i--) {
      let tmpSpan = document.createElement('span');
      tmpSpan.innerHTML = a_array[i].nodeValue;
      a_array[i].after(tmpSpan);
      a_array[i].remove();
    }

    //borderBox 안에 있는 수식 문법 변환
    let forTexCheckNbBorderBox = document.getElementById(domId).querySelectorAll('.forTexCheck');
    let forTexCheckIdx = 0;
    let tmpBoxFormulArr2 = new Array();

    /*
        //진행률 계산
        let date1 = new Date();
        let secondConvertDomLen = forTexCheckNbBorderBox.length;
        let isShowTenPer =false; 
        let isShowThirtyPer =false; 
        let isShowHalfPer =false; 
        let isShowSeventyPer =false; 
        let isShowAlmostPer =false; 
        */
    //루프 돌아서 새로 생겨나는 것 체크되는지 확인
    while (forTexCheckNbBorderBox.length > 0) {
      /*
            if((secondConvertDomLen-forTexCheckNbBorderBox.length)/secondConvertDomLen > 0.1 && !isShowTenPer){
                let date2 = new Date();
                let elapsedMSec = date2.getTime() - date11.getTime();
                let elapsedSec = elapsedMSec / 1000;
                isShowTenPer = true;
            }else if((secondConvertDomLen-forTexCheckNbBorderBox.length)/secondConvertDomLen > 0.3 && !isShowThirtyPer){
                let date2 = new Date();
                let elapsedMSec = date2.getTime() - date11.getTime();
                let elapsedSec = elapsedMSec / 1000;
                isShowThirtyPer = true;
            }else if((secondConvertDomLen-forTexCheckNbBorderBox.length)/secondConvertDomLen > 0.5 && !isShowHalfPer){
                let date2 = new Date();
                let elapsedMSec = date2.getTime() - date11.getTime();
                let elapsedSec = elapsedMSec / 1000;
                isShowHalfPer = true;
            }else if((secondConvertDomLen-forTexCheckNbBorderBox.length)/secondConvertDomLen > 0.7 && !isShowSeventyPer){
                let date2 = new Date();
                let elapsedMSec = date2.getTime() - date11.getTime();
                let elapsedSec = elapsedMSec / 1000;
                isShowSeventyPer = true;
            }else if((secondConvertDomLen-forTexCheckNbBorderBox.length)/secondConvertDomLen > 0.95 && !isShowAlmostPer){
                let date2 = new Date();
                let elapsedMSec = date2.getTime() - date11.getTime();
                let elapsedSec = elapsedMSec / 1000;
                isShowAlmostPer = true;
            }
            */
      let texGrammer = forTexCheckNbBorderBox[0].innerText;
      if (texGrammer.indexOf('lpile') > -1) {
        let pileBrckIdx = await cvt_findRightBrck(texGrammer, texGrammer.indexOf('lpile'));
        //null나왔을 때 리턴 처리
        if (pileBrckIdx.strtBrckIdx !== null && pileBrckIdx.endBrckIdx !== null) {
          if (pileBrckIdx.endBrckIdx - pileBrckIdx.strtBrckIdx < 2) {
            texGrammer = texGrammer.substring(0, texGrammer.indexOf('lpile')) + texGrammer.substr(pileBrckIdx.endBrckIdx + 1);
          }
        }
      } else if (texGrammer.indexOf('rpile') > -1) {
        let pileBrckIdx = await cvt_findRightBrck(texGrammer, texGrammer.indexOf('rpile'));
        //null나왔을 때 리턴 처리
        if (pileBrckIdx.strtBrckIdx !== null && pileBrckIdx.endBrckIdx !== null) {
          if (pileBrckIdx.endBrckIdx - pileBrckIdx.strtBrckIdx < 2) {
            texGrammer = texGrammer.substring(0, texGrammer.indexOf('rpile')) + texGrammer.substr(pileBrckIdx.endBrckIdx + 1);
          }
        }
      } else if (texGrammer.indexOf('pile') > -1) {
        let pileBrckIdx = await cvt_findRightBrck(texGrammer, texGrammer.indexOf('pile'));
        //null나왔을 때 리턴 처리
        if (pileBrckIdx.strtBrckIdx !== null && pileBrckIdx.endBrckIdx !== null) {
          if (pileBrckIdx.endBrckIdx - pileBrckIdx.strtBrckIdx < 2) {
            texGrammer = texGrammer.substring(0, texGrammer.indexOf('pile')) + texGrammer.substr(pileBrckIdx.endBrckIdx + 1);
          }
        }
      }

      for (let j = 0; j < replaceTexToNbBoxFormul.length; j++) {
        let tmpIdx = 0;
        while (texGrammer.indexOf(replaceTexToNbBoxFormul[j].texGrammer) > -1) {
          let nbFormulGrammer = shortCutKeyAll.filter((element) => {
            return element.id === replaceTexToNbBoxFormul[j].formulId;
          });

          //LEFT.으로 들어온 경우 분수용 괄호 문법 모두 넘겨주기
          if (replaceTexToNbBoxFormul[j].formulId === 999) {
            nbFormulGrammer = shortCutKeyAll.filter((element) => {
              return element.id === 82 || element.id === 83 || element.id === 84 || element.id === 85;
            });
          }

          //n명의 수학에는 존재하지 않고, 한글 파일에만 존재하는 수식 처리(bold)
          if (nbFormulGrammer[0] === undefined) {
            let tmpObj = new Object();
            tmpObj.nbGrammer = '';
            nbFormulGrammer[0] = tmpObj;
          }

          let convertHtml;
          if (replaceTexToNbBoxFormul[j].formulId === 999) {
            //LEFT.으로 들어온 경우 분수용 괄호 문법 모두 넘겨주기
            convertHtml = await cvt_convertTexToNbFormul(
              replaceTexToNbBoxFormul[j].formulId,
              texGrammer,
              texGrammer.indexOf(replaceTexToNbBoxFormul[j].texGrammer),
              nbFormulGrammer
            );
          } else {
            convertHtml = await cvt_convertTexToNbFormul(
              replaceTexToNbBoxFormul[j].formulId,
              texGrammer,
              texGrammer.indexOf(replaceTexToNbBoxFormul[j].texGrammer),
              nbFormulGrammer[0].nbGrammer
            );
          }

          //중괄호 없는 경우
          if (convertHtml === null) {
            //예외처리
            let tmpId = '임시아이디' + forTexCheckIdx + '-' + j + '-' + tmpIdx + '.';
            let tmpSpan = document.createElement('span');
            tmpSpan.innerHTML = replaceTexToNbBoxFormul[j].texGrammer;
            let tmpBoxFormul = { tmpId: tmpId, nbFormul: tmpSpan };
            texGrammer = texGrammer.replace(replaceTexToNbBoxFormul[j].texGrammer, tmpId);
            tmpBoxFormulArr2.push(tmpBoxFormul);
          } else if (convertHtml === 'skip') {
            break;
          } else {
            //임시 아이디 발급 후 바꿔치기
            let tmpId = '임시아이디' + forTexCheckIdx + '-' + j + '-' + tmpIdx + '.';
            texGrammer = texGrammer.substring(0, convertHtml.strtIdx) + tmpId + texGrammer.substring(convertHtml.endIdx, texGrammer.length);
            let tmpBoxFormul = {
              tmpId: tmpId,
              nbFormul: convertHtml.nbFormulBox,
            };
            tmpBoxFormulArr2.push(tmpBoxFormul);
          }
          tmpIdx++;
          if (tmpIdx > 1000) {
            alert('[죄송합니다.]\n업로드하신 파일의 수식 변환 중 오류가 발생하였습니다.\n고객센터에서 해당 오류를 파악하여 빠르게 해결하도록 하겠습니다.');
            if (convertNo !== undefined) {
              registerError(convertNo);
              let resourceMenu = await nb_dataFetch('/convert/changeErrStts?convertNo=' + convertNo, true);
              setMyUpldFile(resourceMenu.myList);
              document.getElementsByClassName('convertFileNameRoot')[0].click();
            }
            return;
          }
        }
      }

      for (let idx = 0; idx < tmpBoxFormulArr2.length; idx++) {
        texGrammer = texGrammer.replaceAll(tmpBoxFormulArr2[idx].tmpId, tmpBoxFormulArr2[idx].nbFormul.innerHTML);
      }

      //바깥쪽 수식에의해 감싸져서 임시아이디로 남아있는 수식 여기서 재변환
      outerLoop: for (let idx = 0; idx < tmpBoxFormulArr.length; idx++) {
        //수식요소(forTexCheck)가 아직 html로 변환되지 않고 innerText로 남아있을 때 forTexCheck 안에 임시 아이디가 있는 경우
        //한번에 forTexCheck두개가 나오면 하나는 정상 변환 안됨
        let tmpBugCheckSpan = document.createElement('span');
        tmpBugCheckSpan.innerHTML = texGrammer;
        let tmpForTexCheck = tmpBugCheckSpan.querySelectorAll('.forTexCheck');
        for (let tmpBugIdx = 0; tmpBugIdx < tmpForTexCheck.length; tmpBugIdx++) {
          if (tmpForTexCheck[tmpBugIdx].innerText.indexOf(tmpBoxFormulArr[idx].tmpId) > -1) {
            continue outerLoop;
          }
        }

        texGrammer = texGrammer.replaceAll(tmpBoxFormulArr[idx].tmpId, tmpBoxFormulArr[idx].nbFormul.innerHTML);
      }

      //에러 테스트 필요
      //texGrammer = texGrammer.replaceAll("RIGHT}", "}").replaceAll("RIGHT)", ")").replaceAll("RIGHT]", "]").replaceAll("RIGHT|", "|")
      //.replaceAll("#", "<br/>");

      forTexCheckNbBorderBox[0].innerHTML = texGrammer;
      forTexCheckNbBorderBox[0].classList.remove('forTexCheck');
      forTexCheckNbBorderBox = document.getElementById(domId).querySelectorAll('.forTexCheck');

      forTexCheckIdx++;
    }

    //비어있는 borderBox에 br추가
    let nbBorderBox = document.getElementById(domId).querySelectorAll('.borderBox');
    for (let i = 0; i < nbBorderBox.length; i++) {
      if (nbBorderBox[i].innerText === '') {
        let brTag = document.createElement('br');
        nbBorderBox[i].append(brTag);
      }
    }

    //span태그 제거
    let allSpan = document.getElementById(domId).querySelectorAll('span');
    while (allSpan.length > 0) {
      allSpan[0].outerHTML = allSpan[0].innerHTML;
      allSpan = document.getElementById(domId).querySelectorAll('span');
    }

    //div재정렬(div태그 제거하고 oneLineOneDiv하고 맨 뒤에 줄바꿈 제거)
    let allDiv = document.getElementById(domId).querySelectorAll('div');
    while (allDiv.length > 0) {
      let brTag = document.createElement('br');
      allDiv[0].after(brTag);

      allDiv[0].outerHTML = allDiv[0].innerHTML;
      allDiv = document.getElementById(domId).querySelectorAll('div');
    }
    document.getElementById(domId).focus();
    await reg_oneLineOneDiv(false, false, 0);

    //텍스트 노드 버그 제거(공백 있지만 실제 사용자에게는 보여지지 않는 경우 있음)
    a_array = new Array();
    await GetText(document.getElementById('myHwpContents'));
    for (let i = a_array.length - 1; i >= 0; i--) {
      var range = document.createRange();
      range.selectNodeContents(a_array[i]);
      var rects = range.getClientRects();
      if (rects.length === 0) {
        a_array[i].remove();
      }
    }

    //수식 convert
    await reg_convertNotTransferdNbBox('myHwpContents');

    //지수 옆에 분수용 괄호 있는 경우 분수용 지수로 바꾸기
    let nbExpBox = document.getElementById(domId).querySelectorAll('.nbExpBox:not(:has(.nbFracExpTmp))');
    for (let i = nbExpBox.length - 1; i >= 0; i--) {
      if (nbExpBox[i].previousSibling !== null && nbExpBox[i].previousSibling !== undefined) {
        if (nbExpBox[i].previousSibling.classList !== undefined && nbExpBox[i].previousSibling.classList.contains('nbBrckInFrac')) {
          nbExpBox[i].querySelector('.nbExpTmp').classList.add('nbFracExpTmp');
          nbExpBox[i].querySelector('.nbExpTmp').classList.remove('nbExpTmp');
        }
      }
    }

    //마지막 줄바꿈 제거
    let whileIdx = 0;
    while (document.getElementById(domId).innerText.substr(-2) === '\n\n') {
      // 띄어쓰기는 제거안함
      //while(document.getElementById(targetId[i]).innerText.substr(-2) === "\n\n" || encodeURI(document.getElementById(targetId[i]).innerText.substr(-1)) === '%C2%A0'){
      whileIdx++;
      if (whileIdx > 500) {
        alert('[무한루프 에러] 공백문자 제거 도중 에러 발생');
        break;
      }
      if (document.getElementById(domId).innerText.substr(-2) === '\n\n') {
        let brTag = document.getElementById(domId).querySelectorAll('br');
        if (brTag.length !== 0) {
          if (brTag[brTag.length - 1].closest('.nbBox') === null) {
            brTag[brTag.length - 1].remove();
            document.getElementById(domId).innerHTML = document.getElementById(domId).innerHTML;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    //이미지 최대 크기는 400px 제한
    let allImgDom = document.getElementById(domId).querySelectorAll('img');
    for (let i = 0; i < allImgDom.length; i++) {
      if (allImgDom[i].tagName === 'IMG' && allImgDom[i].offsetWidth > 400) {
        let zoomRation = 400 / allImgDom[i].offsetWidth;
        allImgDom[i].style.width = 400 + 'px';
        allImgDom[i].style.height = allImgDom[i].offsetHeight * zoomRation + 'px';
      }
    }
  };

  const convertHwpToWeb = async (event) => {
    if (event.target.files[0] !== undefined) {
      const jsonObj = new Object();
      let formData = new FormData(document.getElementById('hwpForm'));
      document.getElementById('resDetailedTimeDesc').classList.remove('hide');
      document.getElementById('hourGlassDesc').innerHTML =
        "한글 파일을 변환 중 입니다.<br>수식이 많은 파일은 시간이 더 걸릴 수 있습니다.<br>잠시만 기다려 주세요...<br><span class='hourGlassSubDesc'>※ 수식이 많은 수능형 문제+해설 파일은 20 페이지 미만 파일을 사용 권장합니다.<br>(10페이지 40초 내외, 15페이지 1분 내외, 20페이지 2분 내외)</span>";
      let returnObj = await nb_postForm('/hwp/convert/hwp-to-html', formData, false);
      if (returnObj.status == 200) {
        setMyUpldFile(returnObj.data.contentsList);
        document.getElementById('myHwpContents').dataset.convertNo = returnObj.data.contentsList[0].id;
        document.getElementById('myHwpContents').innerHTML = returnObj.data.contentsList[0].contents;

        let convertFileNameRoot = document.getElementsByClassName('convertFileNameRoot');
        for (let i = 0; i < convertFileNameRoot.length; i++) {
          convertFileNameRoot[i].classList.remove('active');
        }

        convertFileNameRoot[0].classList.add('active');

        await hwpHtmlToNbHtml('myHwpContents', true, process.env.REACT_APP_S3_PATH + '/' + returnObj.data.s3FileUrl + '/', returnObj.data.contentsList[0].id);

        //undo, redo 초기화 및 변환된 상태 저장
        let fakeEv = new Object();
        fakeEv.isTrusted = true;
        fakeEv.id = returnObj.data.contentsList[0].id;
        await reg_undoRedoInitialize();
        await reg_undoRedoSetting();

        await saveMyHwpContents(fakeEv, true, true);
        reg_enableImageResizeInDiv('myHwpContents');
      }
      document.getElementById('resDetailedTimeDesc').classList.add('hide');

      //input file 초기화
      event.target.value = '';
    }
  };

  const showConvertContents = async (event, convertNo) => {
    let myConvertFile = myUpldFile.filter((element) => {
      return element.id === convertNo;
    });

    document.getElementById('myHwpContents').dataset.convertNo = convertNo;
    document.getElementById('myHwpContents').innerHTML = myConvertFile[0].contents;

    //변환이 안된채 저장되어있으면 다시 한번 변환
    if (!myConvertFile[0].isConverted) {
      //관리자 모드로 들어온 경우 변환 금지
      if (isAdminMode) {
        await reg_undoRedoInitialize();
        await reg_undoRedoSetting();
        return;
      }

      await nb_confirmBox('수식변환이 진행되지 않는 파일이 존재합니다.\n수식변환을 진행하시겠습니까?\n');
    }

    let convertFileNameRoot = document.getElementsByClassName('convertFileNameRoot');
    for (let i = 0; i < convertFileNameRoot.length; i++) {
      convertFileNameRoot[i].classList.remove('active');
    }

    event.target.closest('.convertFileNameRoot').classList.add('active');
  };

  const progressConvert = async () => {
    document.getElementById('confirmBoxScreen').classList.add('hide');

    document.getElementById('resDetailedTimeDesc').classList.remove('hide');
    document.getElementById('hourGlassDesc').innerHTML =
      "한글 파일을 변환 중 입니다.<br>수식이 많은 파일은 시간이 더 걸릴 수 있습니다.<br>잠시만 기다려 주세요...<br><span class='hourGlassSubDesc'>※ 수식이 많은 수능형 문제+해설 파일은 20 페이지 미만 파일을 사용 권장합니다.<br>(10페이지 40초 내외, 15페이지 1분 내외, 20페이지 2분 내외)</span>";
    await nb_dataFetch('/', false);
    let convertNo = document.getElementById('myHwpContents').dataset.convertNo;
    let myConvertFile = myUpldFile.filter((element) => {
      return element.convertNo === Number(convertNo);
    });
    await hwpHtmlToNbHtml('myHwpContents', false, process.env.REACT_APP_S3_PATH + '/' + myConvertFile[0].imgPath + '/');

    //undo, redo 초기화 및 변환된 상태 저장
    let fakeEv = new Object();
    fakeEv.isTrusted = true;
    await reg_undoRedoInitialize();
    await reg_undoRedoSetting();

    await saveMyHwpContents(fakeEv, true, true);

    reg_enableImageResizeInDiv('myHwpContents');
    document.getElementById('resDetailedTimeDesc').classList.add('hide');
  };

  const removeConvertContents = async (convertNo, askConfirm) => {
    //관리자 모드로 들어온 경우 삭제 금지
    if (isAdminMode) return;
    let isRemove = true;
    if (askConfirm) {
      isRemove = window.confirm('해당 업로드 내역을 삭제하시겠습니까?');
    }

    if (isRemove) {
      let jsonObj = await nb_deleteRequest('/hwp/convert/hwp-to-html/' + convertNo, true);
      if (jsonObj.status == 200) {
        setMyUpldFile(jsonObj.data.contentsList);
        if (jsonObj.data.contentsList.length !== 0) {
          document.getElementsByClassName('convertFileNameRoot')[0].click();
        }
      } else {
        alert('정상적으로 삭제되지 않았습니다. 다시 시도해주세요.');
      }
    }
  };

  const convertContents = myUpldFile.map((conents, idx) => {
    let isHide = '';
    if (isAdminMode) isHide = 'hide';
    return (
      <tr key={conents.id}>
        <td className='myHwpContentsTd'>
          <div
            className='convertFileNameRoot'
            onClick={async (event) => {
              await saveMyHwpContents(event, true, false);
              await showConvertContents(event, conents.id);
              reg_undoRedoInitialize();
              reg_undoRedoSetting();
            }}>
            <div className='convertFileName'>{conents.fileName}</div>
            <div className='convertUpdateDate'>등록일 : {conents.sysCreateDate}</div>
          </div>
        </td>
        <td>
          <span
            className={'circleDel ' + isHide}
            onClick={() => {
              removeConvertContents(conents.id, true);
            }}>
            -
          </span>
        </td>
      </tr>
    );
  });

  /*
    * 파일 변환 저장 함수 : 한글파일 업로드 버튼 클릭, 한글 파일 업로드 후 web으로 넘어와 변환 마친 후,
                            직접 save 버튼 클릭시,   다른 파일 목록 클릭시
                            변환 안된채 빠져 나왔을 때 재변환 후
    */
  const saveMyHwpContents = async (event, transitEffect, convertChanged) => {
    //관리자 모드로 들어온 경우 저장 금지
    if (isAdminMode) return;

    if (!event.isTrusted) return; //사용자 액션 아닌 자바스크립트로 실행된 경우 리턴
    if (document.getElementById('myHwpContents').dataset.convertNo === undefined) return;
    //변환 안된 이미지 파일 변환
    await nb_base64ImgRegisterToS3ByTargetId('myHwpContents');

    //파일 용량 validation
    let totalFileSize = nb_getByteLengthOfString(document.getElementById('myHwpContents').innerHTML);
    if (totalFileSize / 1000 > 5000) {
      alert('등록하신 문제의 용량이 너무 큽니다.\n문제 및 해설, 객관식, 정답 입력란의 텍스트는 최대 5MB까지 등록가능합니다.');
      return false;
    }

    let jsonObj = new Object();
    jsonObj.id = document.getElementById('myHwpContents').dataset.convertNo;
    if (!convertChanged) {
      //(한글파일 업로드 버튼 클릭, 직접 save 버튼 클릭시, 다른 파일 목록 클릭시)
      //변환 안된 파일은 save되면 안됨(사용자가 &strt/ $end/ 사이값 조작하면 에러 날 수 있음)
      let myConvertFile = myUpldFile.filter((element) => {
        return element.id === Number(document.getElementById('myHwpContents').dataset.convertNo);
      });
      if (!myConvertFile[0].isConverted) return;
    }
    jsonObj.contents = document.getElementById('myHwpContents').innerHTML;

    let returnObj = await nb_putRequest('/hwp/convert/hwp-to-html', jsonObj, transitEffect);
    setMyUpldFile(returnObj.data.contentsList);
  };

  const formularTabSelect = async function (event) {
    let targetId = event.target.id;
    let targetDom = document.getElementById(targetId);
    let selectedDom = document.getElementsByClassName('selectedTab');
    for (let i = 0; i < selectedDom.length; i++) {
      selectedDom[i].classList.remove('selectedTab');
    }
    if (targetId == 'mainFormulaTap') {
      document.getElementById('shortKeyBoard').classList.remove('hide');
      document.getElementById('shortKeyBoardHigh').classList.add('hide');
      document.getElementById('shortKeyBoardEtc').classList.add('hide');
      document.getElementById('shortKeyBoardEtc2').classList.add('hide');
      targetDom.classList.add('selectedTab');
    } else if (targetId == 'highFormulaTap') {
      document.getElementById('shortKeyBoard').classList.add('hide');
      document.getElementById('shortKeyBoardHigh').classList.remove('hide');
      document.getElementById('shortKeyBoardEtc').classList.add('hide');
      document.getElementById('shortKeyBoardEtc2').classList.add('hide');
      targetDom.classList.add('selectedTab');
    } else if (targetId == 'etcFormulaTap') {
      document.getElementById('shortKeyBoard').classList.add('hide');
      document.getElementById('shortKeyBoardHigh').classList.add('hide');
      document.getElementById('shortKeyBoardEtc').classList.remove('hide');
      document.getElementById('shortKeyBoardEtc2').classList.add('hide');
      targetDom.classList.add('selectedTab');
    } else if (targetId == 'etcFormulaTap2') {
      document.getElementById('shortKeyBoard').classList.add('hide');
      document.getElementById('shortKeyBoardHigh').classList.add('hide');
      document.getElementById('shortKeyBoardEtc').classList.add('hide');
      document.getElementById('shortKeyBoardEtc2').classList.remove('hide');
      targetDom.classList.add('selectedTab');
    }

    //첫 페이지 로드시 아무것도 클릭 안한상태(rangeCount=0)
    if (document.getSelection().rangeCount == 0) return;
    if (document.getSelection().isCollapsed) {
      const selection = document.getSelection();
      const newRange = selection.getRangeAt(0);
      selection.removeAllRanges();
      selection.addRange(newRange);
      window.getSelection().collapseToEnd();
    }
  };

  const beforeUnloadSaveContent = async (event) => {
    event.preventDefault();
    event.returnValue = '';
    let isQuit = window.confirm('사이트에서 나가시겠습니까?/n변경사항이 저장되지 않을 수 있습니다.');
    return isQuit;
  };

  const registerError = async (convertNo) => {
    let formData = new FormData();
    formData.append('errType', 'HwpConvert');
    formData.append('contentsId', convertNo);
    formData.append('reportContents', '한글 파일 변환이 정상적이지 않음.');
    reqBody.clientOs = await nb_getClientOS();
    reqBody.clientBrowser = await nb_getClientBrowser();

    await nb_postForm('/cs/error', formData, true);
  };

  return (
    <div className='selectNone'>
      <div className='hwpToWebDiv'>
        <div className='hwpToWebTitle'>hwp to web 파일 변환기</div>
        <div className='hwpToWebDesc'>
          한글파일을 업로드하면 웹사이트에서도 사용할 수 있게 변환이 가능합니다!
          <span
            className='circleUI2 marginTen'
            onClick={() => {
              document.getElementById('hwpToWebGuidBox').classList.remove('hide');
            }}>
            ?
          </span>{' '}
        </div>
        <div
          className={isAdminMode ? 'hwpToWebUpldBtn hide' : 'hwpToWebUpldBtn'}
          onClick={() => {
            hwpToWebBtn();
          }}>
          한글파일 업로드
        </div>
        <form method='post' id='hwpForm' encType='multipart/form-data'>
          <input
            id='hwpToWebUpld'
            name='hwpFile'
            className='hide'
            type='file'
            onChange={(event) => {
              nb_extensionCheck2(event, 'hwp');
              convertHwpToWeb(event);
            }}
          />
        </form>
      </div>
      {myUpldFile.length !== 0 ? (
        <div className='myHwpContentsRoot'>
          <div className='myHwpContentsMenuDiv'>
            <table className='myHwpContentsMenu'>
              <thead>
                <tr>
                  <td>{isAdminMode ? <div className='myHwpContentsMenuThead'>오류 파일</div> : <div className='myHwpContentsMenuThead'>나의 업로드 내역</div>}</td>
                </tr>
              </thead>
              <tbody>{convertContents}</tbody>
            </table>
          </div>
          <div className='myHwpContentsRootDiv right'>
            <div id='topShortkeyDiv'>
              <TabButton className='formulaTabButton' tabList={formulaTabList} clickEv={formularTabSelect}></TabButton>
              {isFetchShotCutKey && <FormulaShortCutKey compId='shortKeyBoard' keyName='Main' parentShortCutKey={shortCutKey} parentMethod={() => {}} />}
              {isFetchShotCutKey && <FormulaShortCutKey compId='shortKeyBoardHigh' keyName='High1' parentShortCutKey={shortCutKey} parentMethod={() => {}} />}
              {isFetchShotCutKey && <FormulaShortCutKey compId='shortKeyBoardEtc' keyName='Etc' parentShortCutKey={shortCutKey} parentMethod={() => {}} />}
              {isFetchShotCutKey && <FormulaShortCutKey compId='shortKeyBoardEtc2' keyName='Etc2' parentShortCutKey={shortCutKey} parentMethod={() => {}} />}
            </div>
            <div className='saveDiv'>
              {isAdminMode ? (
                <span
                  className='saveBtn lowerZidx'
                  onClick={(event) => {
                    hwpHtmlToNbHtml('myHwpContents', false);
                  }}>
                  수식 문법 변환
                </span>
              ) : (
                <span
                  className='saveBtn lowerZidx'
                  onClick={(event) => {
                    saveMyHwpContents(event, true, false);
                  }}>
                  save
                </span>
              )}
            </div>
            <NbWebEditor parentMethod={() => {}} showAsistDesc={false} showExceptBtn={false} isMultiMode={false}></NbWebEditor>
            <div
              id='myHwpContents'
              className='myHwpContents contentEditClass onlyEdit'
              contentEditable={true}
              spellCheck={false}
              onKeyDown={(event) => {
                reg_preventKeyEvent(event, true);
              }}
              onKeyUp={(event) => {
                reg_dressYellowBox();
                reg_dressSelectionBackColor();
                reg_tbCellKeyUp(event);
                reg_nbComplie(event);
                reg_vacantTextNodeRemove(event, 'myHwpContents');
                nb_base64ImgRegisterToS3(event);
                reg_convertFigureTagRemove('myHwpContents');
              }}
              onClick={() => {
                reg_dressYellowBox();
              }}
              onMouseDown={() => {
                reg_selectCheck();
              }}
              onPaste={(event) => {
                reg_tbPasteInPastePrevent(event);
              }}
              onCopy={(event) => {
                reg_imageCopy(event, true);
              }}
              onCut={(event) => {
                reg_imageCopy(event, false);
              }}></div>
            <div className='bugFixDiv'></div>
          </div>
        </div>
      ) : (
        <div className='myHwpContentsRoot empty'>
          <EmptyList msg={emptyListMsg} imgName='myRepoEmpty' addImgClass='miniSize' />
        </div>
      )}

      <div id='hwpToWebGuidBox' className='blindBox hide'>
        <div className='hwpToWebGuidDiv'>
          <div>
            <span
              className='closeBtn2'
              onClick={() => {
                document.getElementById('hwpToWebGuidBox').classList.add('hide');
              }}>
              X
            </span>
          </div>
          <div className='hwpToWebGuidTitle'>hwp to web 파일 변환기는</div>
          <div className='hwpToWebGuidContents'>
            한글파일에서 수식을 추출하여 N명의수학 웹사이트에서 사용할 수 있게 변환합니다.
            <br />
            수식기호가 많은 파일은 시간이 더 걸릴 수 있습니다.
            <br />
            <br />
            수식이 많은 고등수학 해설지 파일 같은 경우
            <br />
            10 페이지 40초 내외, 15 페이지 1분 내외, 20 페이지 2분 내외의 시간이 걸립니다.
            <br />
            <br />
            20 페이지 미만의 파일 사용을 권장드리며,
            <br />
            20 페이지 내외의 파일 변환 중 화면 멈춤현상이나 백화현상이 나타나더라도
            <br />
            변환이 진행 중이니 잠시 기다려주시면 변환이 완료됩니다.
            <br />
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
      <div id='confirmBoxScreen' className='confirmBoxScreen hide'>
        <div id='confirmBox' className='confirmBox'>
          <div className='confirmBoxTop'>
            <span id='confirmBoxClose' className='confirmBoxClose'>
              &nbsp;
            </span>
          </div>
          <div id='confirmMsg' className='confirmMsg'></div>
          <div className='alignCenter'>
            <span
              id='confirmBoxCnclBtn'
              className='confirmBoxCnclBtn'
              onClick={() => {
                document.getElementById('confirmBoxScreen').classList.add('hide');
                removeConvertContents(document.getElementById('myHwpContents').dataset.convertNo, false);
              }}>
              파일삭제
            </span>
            <span
              id='confirmBoxBtn'
              className='confirmBoxBtn'
              onClick={async () => {
                await progressConvert();
              }}>
              진행
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HwpToHtml;
