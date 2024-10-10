import React, { useState, useEffect } from 'react';
import FormulaShortCutKey from './FormulaShortCutKey';
import TabButton from 'web/common/TabButton';
import FormulaEditorUnitForMulti from './FormulaEditorUnitForMulti';
import { Link } from 'react-router-dom';
import {
  nb_isLogin,
  nb_topMenuFixed,
  nb_dataFetch,
  nb_formDataFetch,
  nb_base64ImgRegisterToS3ByTargetId,
  nb_moveToScroll,
  nb_getByteLengthOfString,
  nb_fadeInOutA,
  nb_detectScrollPosition,
} from 'js/common/common_nb.js';
import {
  reg_mDownTdWidthChange,
  reg_mUpTdWidthChange,
  reg_formulaTapMoveEv,
  reg_convertSpanToNoTag,
  reg_removeStyleAttribute,
  reg_mMoveTdWidthChange,
  reg_selStartTdWidthChange,
  reg_undoRedoSetting,
  reg_newSelectFormulaElement,
  reg_removeSelectionBackColor,
  reg_tbCellMouseUp,
  reg_tbCellCopy,
  reg_tbSelBackgroundRemove,
  reg_undoRedoInitialize,
  reg_enableImageResizeInDiv,
  reg_removeResizeFrame,
} from 'js/contents/register/contents_reg';
import { cvt_convertHtmlToTex } from 'js/convertGrammer/nbToTexConvert_cvt.js';

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
let shortCutKeyList;
const FormulaEditorMulti = ({ contentsClassify }) => {
  const [mathUnitInfo, setMathUnitInfo] = useState(new Array());
  const [shortCutKey, setShortCutKey] = useState('');
  const [isFetchShotCutKey, setIsFetchShotCutKey] = useState(false);
  const [formulaEditorArr, setFormulaEditorArr] = useState(new Array());
  const [multiChoiceAutoMode, setMultiChoiceAutoMode] = useState(true);

  const removeAddedEvent = () => {
    window.removeEventListener('mousedown', reg_mDownTdWidthChange);
    window.removeEventListener('mousemove', reg_mMoveTdWidthChange);
    window.removeEventListener('mouseup', reg_mUpTdWidthChange);
    window.removeEventListener('selectstart', reg_selStartTdWidthChange);
    window.removeEventListener('scroll', topMenuFixed);
    window.removeEventListener('resize', topMenuWidth);
    window.removeEventListener('mousedown', reg_removeSelectionBackColor);
    window.removeEventListener('mouseup', reg_tbCellMouseUp);
    document.removeEventListener('copy', reg_tbCellCopy);
    window.removeEventListener('mousedown', reg_tbSelBackgroundRemove);
    window.removeEventListener('mouseup', reg_newSelectFormulaElement);
    window.removeEventListener('scroll', reg_removeResizeFrame);
    window.removeEventListener('keydown', reg_formulaTapMoveEv);
    window.removeEventListener('scroll', nb_detectScrollPosition);
    /*
		document.getElementById("firNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("secNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("thrNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("fourNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		document.getElementById("fifNoFormulaEditor").removeEventListener('click', multiChoiceImgAdd);
		*/
    //이미지 및 파일 복붙
    //document.getElementById('answerFormulaEditor').removeEventListener('paste', pastePreventFile);

    window.shortCutKeyList = null;
    window.shortCutKeyHigh1 = null;
    window.shortCutKeyEtc = null;
    window.shortCutKeyEtc2 = null;
    //undo 초기화
    reg_undoRedoInitialize();
  };

  let targetDomWidth = 800;
  const topMenuWidth = () => {
    document.getElementById('topShortkeyDiv').style.width =
      targetDomWidth + 'px';
    document.getElementById('topShortkeyDiv').style.marginLeft = 'auto';
  };

  const topMenuFixed = () => {
    nb_topMenuFixed(
      'topShortkeyDiv',
      targetDomWidth,
      null,
      'formulEditMultiDiv',
      false
    );
  };

  //이미지 파일 및 각종 파일 붙여넣기 금지
  const pastePreventFile = (event) => {
    let pasteHtml = event.clipboardData.getData('text/html');
    let template = document.createElement('template');
    template.innerHTML = pasteHtml;
    if (template.content.querySelector('img') !== null) {
      alert('정답 입력창에는 이미지 첨부가 불가합니다.');
      event.preventDefault();
      return;
    }

    let isFileExist = false;
    for (let i = 0; i < event.clipboardData.items.length; i++) {
      let file = event.clipboardData.items[i].getAsFile();
      if (file !== null) {
        let fileName = file.name.split('.');
        let fileExtension = fileName[fileName.length - 1].toUpperCase();
        if (
          fileExtension === 'PNG' ||
          fileExtension === 'JPG' ||
          fileExtension === 'JPEG' ||
          fileExtension === 'GIF' ||
          fileExtension === 'BMP'
        ) {
          alert('정답 입력창에는 이미지 첨부가 불가합니다.');
          event.preventDefault();
          return;
        }
        isFileExist = true;
      }
    }

    if (isFileExist) {
      event.preventDefault();
      return;
    }
  };

  const errReportBy = () => {
    window.errType = 4; //수학 문제 만들기 errType;
    document.getElementById('serviceCenter').classList.remove('hide');
    document.getElementById('serviceCenterQnADesc').innerHTML =
      '기호 추가, 오류, 제안사항이 있으시면 적어주세요.<br/>빠르게 개선하여 더 좋은 서비스를 제공해 드리겠습니다.';
    document.getElementById('serviceQuestionTab').click();
    document.getElementById('serviceQuestion').scrollTo(0, 0);
  };

  const formulaEditor = [
    { id: 'contentsRootDiv1', ordinalNum: '1st', className: '' },
    { id: 'contentsRootDiv2', ordinalNum: '2nd', className: 'hide' },
    { id: 'contentsRootDiv3', ordinalNum: '3rd', className: 'hide' },
    { id: 'contentsRootDiv4', ordinalNum: '4th', className: 'hide' },
    { id: 'contentsRootDiv5', ordinalNum: '5th', className: 'hide' },
    { id: 'contentsRootDiv6', ordinalNum: '6th', className: 'hide' },
    { id: 'contentsRootDiv7', ordinalNum: '7th', className: 'hide' },
    { id: 'contentsRootDiv8', ordinalNum: '8th', className: 'hide' },
    { id: 'contentsRootDiv9', ordinalNum: '9th', className: 'hide' },
    { id: 'contentsRootDiv10', ordinalNum: '10th', className: 'hide' },
    { id: 'contentsRootDiv11', ordinalNum: '11th', className: 'hide' },
    { id: 'contentsRootDiv12', ordinalNum: '12th', className: 'hide' },
    { id: 'contentsRootDiv13', ordinalNum: '13th', className: 'hide' },
    { id: 'contentsRootDiv14', ordinalNum: '14th', className: 'hide' },
    { id: 'contentsRootDiv15', ordinalNum: '15th', className: 'hide' },
    { id: 'contentsRootDiv16', ordinalNum: '16th', className: 'hide' },
    { id: 'contentsRootDiv17', ordinalNum: '17th', className: 'hide' },
    { id: 'contentsRootDiv18', ordinalNum: '18th', className: 'hide' },
    { id: 'contentsRootDiv19', ordinalNum: '19th', className: 'hide' },
    { id: 'contentsRootDiv20', ordinalNum: '20th', className: 'hide' },
    { id: 'contentsRootDiv21', ordinalNum: '21th', className: 'hide' },
    { id: 'contentsRootDiv22', ordinalNum: '22th', className: 'hide' },
    { id: 'contentsRootDiv23', ordinalNum: '23th', className: 'hide' },
    { id: 'contentsRootDiv24', ordinalNum: '24th', className: 'hide' },
    { id: 'contentsRootDiv25', ordinalNum: '25th', className: 'hide' },
    { id: 'contentsRootDiv26', ordinalNum: '26th', className: 'hide' },
    { id: 'contentsRootDiv27', ordinalNum: '27th', className: 'hide' },
    { id: 'contentsRootDiv28', ordinalNum: '28th', className: 'hide' },
    { id: 'contentsRootDiv29', ordinalNum: '29th', className: 'hide' },
    { id: 'contentsRootDiv30', ordinalNum: '30th', className: 'hide' },
  ];

  const formulaEditorList = formulaEditorArr.map((contents, idx) => (
    <FormulaEditorUnitForMulti
      key={contents.ordinalNum}
      contentsClassify={contentsClassify}
      customId={contents.id}
      ordinalNum={contents.ordinalNum}
      classNames={contents.className}
      idx={idx}
      mathUnitInfo={mathUnitInfo}
    />
  ));

  useEffect(() => {
    const asyncUseEffect = async function () {
      //reg_enableImageResizeInDiv('contentsFormulaEditor');
      //reg_enableImageResizeInDiv('solutionFormulaEditor');
      if (contentsClassify !== 1) {
        document.getElementById('makeContentsLinkDiv').classList.add('hide');
      }
      let jsonObj = await nb_dataFetch('/mathInfo/takeShortCutKey', true);
      setShortCutKey(jsonObj);
      setIsFetchShotCutKey(true);
      shortCutKeyList = jsonObj['shortCutKey'];
      window.shortCutKeyList = shortCutKeyList;
      window.shortCutKeyHigh1 = jsonObj['shortCutKeyHigh1'];
      window.shortCutKeyEtc = jsonObj['shortCutKeyEtc'];
      window.shortCutKeyEtc2 = jsonObj['shortCutKeyEtc2'];

      window.addEventListener('scroll', topMenuFixed);
      window.addEventListener('resize', topMenuWidth);
      window.addEventListener('scroll', reg_removeResizeFrame);
      window.addEventListener('keydown', reg_formulaTapMoveEv);

      window.addEventListener('scroll', nb_detectScrollPosition);

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

      await reg_undoRedoInitialize();
      let returnObj = await nb_dataFetch('/math/menu/unit', true);
      setMathUnitInfo(returnObj);
      setFormulaEditorArr(formulaEditor);

      //이미지 수정 이벤트 등록
      let contentEditClass = document.querySelectorAll('[contenteditable]');
      for (let i = 0; i < contentEditClass.length; i++) {
        if (contentEditClass[i].id.indexOf('answerFormulaEditor') < 0) {
          reg_enableImageResizeInDiv(contentEditClass[i].id, true);
        }
      }
      //이미지 및 파일 복붙 금지
      let answerFormulaEditor = document.querySelectorAll(
        '.answerFormulaEditor'
      );
      for (let i = 0; i < answerFormulaEditor.length; i++) {
        answerFormulaEditor[i].addEventListener('paste', pastePreventFile);
      }
    };

    asyncUseEffect();
    return () => removeAddedEvent();
  }, []);

  const setRegisterContentsCnt = async (event) => {
    let inputVal = prompt('문항수를 설정해주세요.(최대 30문항)', '');
    let numCnt = Number(inputVal);
    if (isNaN(numCnt) || numCnt > 30 || numCnt < 1) {
      alert('30이하의 숫자만 입력해주세요.');
      return;
    }

    let contentsRootDiv = document.getElementsByClassName('contentsRootDiv');
    for (let i = 0; i < contentsRootDiv.length; i++) {
      if (i < numCnt) {
        contentsRootDiv[i].classList.remove('hide');
      } else {
        contentsRootDiv[i].classList.add('hide');
      }
    }

    let contentsRootPaddingDiv = document.getElementsByClassName(
      'contentsRootPaddingDiv'
    );
    for (let i = 0; i < contentsRootPaddingDiv.length; i++) {
      if (i < numCnt - 1) {
        contentsRootPaddingDiv[i].classList.remove('hide');
      } else {
        contentsRootPaddingDiv[i].classList.add('hide');
      }
    }
  };

  const addRegisterContents = async (event) => {
    if (event.target.id === 'initContentsCntBtn') return;
    let nextDivIdx = 0;
    let isLastDiv = true;
    let contentsRootDiv = document.getElementsByClassName('contentsRootDiv');
    for (let i = 0; i < contentsRootDiv.length; i++) {
      if (contentsRootDiv[i].classList.contains('hide')) {
        isLastDiv = false;
        nextDivIdx = i;
        break;
      }
    }

    if (isLastDiv) {
      alert('문제는 최대 30개까지 등록 가능합니다.');
      return;
    }
    let contentsRootPaddingDiv = document.getElementsByClassName(
      'contentsRootPaddingDiv'
    );
    contentsRootPaddingDiv[nextDivIdx - 1].classList.remove('hide');
    contentsRootDiv[nextDivIdx].classList.remove('hide');
  };

  const contentsValidation = async function () {
    if (!nb_isLogin()) {
      alert('로그인 이후 사용해주시기 바랍니다.');
      return;
    }

    let contentsRootDiv = document.getElementsByClassName('contentsRootDiv');
    for (let i = 0; i < contentsRootDiv.length; i++) {
      if (
        contentsRootDiv[i].classList.contains('disabled') ||
        contentsRootDiv[i].classList.contains('hide')
      ) {
        let formEle = contentsRootDiv[i].querySelectorAll(
          'input, textarea, select'
        );
        for (let i = 0; i < formEle.length; i++) {
          formEle[i].disabled = true;
        }
        continue;
      }

      let currentContentsDiv = contentsRootDiv[i];
      let contentEditClass =
        contentsRootDiv[i].querySelectorAll('.contentEditClass');
      let isFirNoExist = false,
        isSecNoExist = false,
        isThrNoExist = false,
        isFourNoExist = false,
        isFifNoExist = false;
      //객관식 br태그만 남아있는 경우 제거
      for (let j = 0; j < contentEditClass.length; j++) {
        if (contentEditClass[j].classList.contains('contentsFormulaEditor')) {
          let contentsDomLength = contentEditClass[j].innerText.length;

          //문제 validation [start]
          if (contentsDomLength < 5) {
            //이미지 등록한 경우는 글자 입력 가능하지만 이미지 등록 안 한 경우 최소 5글자 이상
            if (contentEditClass[j].querySelector('img') === null) {
              alert('문제를 최소 5글자 이상 입력해주시기 바랍니다.');
              contentEditClass[j].scrollIntoView({ block: 'center' });
              contentEditClass[j].focus();
              contentEditClass[j].classList.add('redBoxValid2');
              return false;
            }
          }
        } else if (
          contentEditClass[j].classList.contains('solutionFormulaEditor') ||
          contentEditClass[j].classList.contains('answerFormulaEditor')
        ) {
        } else {
          let childNodes = contentEditClass[j].childNodes;
          for (let k = 0; k < childNodes.length; k++) {
            if (
              childNodes[k].nodeName === '#text' &&
              childNodes[k].length === 0
            ) {
              childNodes[k].remove();
            }
          }
          if (
            contentEditClass[j].childNodes.length === 1 &&
            contentEditClass[j].childNodes[0].nodeName === 'BR'
          ) {
            contentEditClass[j].childNodes[0].remove();
            if (contentEditClass[j].id.indexOf('firNoFormulaEditor') > -1) {
              currentContentsDiv.querySelector('#firNo').innerHTML =
                contentEditClass[j].innerHTML;
            } else if (
              contentEditClass[j].id.indexOf('secNoFormulaEditor') > -1
            ) {
              currentContentsDiv.querySelector('#secNo').innerHTML =
                contentEditClass[j].innerHTML;
            } else if (
              contentEditClass[j].id.indexOf('thrNoFormulaEditor') > -1
            ) {
              currentContentsDiv.querySelector('#thrNo').innerHTML =
                contentEditClass[j].innerHTML;
            } else if (
              contentEditClass[j].id.indexOf('fourNoFormulaEditor') > -1
            ) {
              currentContentsDiv.querySelector('#fourNo').innerHTML =
                contentEditClass[j].innerHTML;
            } else if (
              contentEditClass[j].id.indexOf('fifNoFormulaEditor') > -1
            ) {
              currentContentsDiv.querySelector('#fifNo').innerHTML =
                contentEditClass[j].innerHTML;
            }
          }

          if (contentEditClass[j].id.indexOf('firNoFormulaEditor') > -1) {
            isFirNoExist =
              (!(
                contentEditClass[j].innerText.length === 1 &&
                contentEditClass[j].innerText === '\n'
              ) &&
                contentEditClass[j].innerText.length > 0) ||
              contentEditClass[j].querySelector('img') !== null;
          } else if (
            contentEditClass[j].id.indexOf('secNoFormulaEditor') > -1
          ) {
            isSecNoExist =
              (!(
                contentEditClass[j].innerText.length === 1 &&
                contentEditClass[j].innerText === '\n'
              ) &&
                contentEditClass[j].innerText.length > 0) ||
              contentEditClass[j].querySelector('img') !== null;
          } else if (
            contentEditClass[j].id.indexOf('thrNoFormulaEditor') > -1
          ) {
            isThrNoExist =
              (!(
                contentEditClass[j].innerText.length === 1 &&
                contentEditClass[j].innerText === '\n'
              ) &&
                contentEditClass[j].innerText.length > 0) ||
              contentEditClass[j].querySelector('img') !== null;
          } else if (
            contentEditClass[j].id.indexOf('fourNoFormulaEditor') > -1
          ) {
            isFourNoExist =
              (!(
                contentEditClass[j].innerText.length === 1 &&
                contentEditClass[j].innerText === '\n'
              ) &&
                contentEditClass[j].innerText.length > 0) ||
              contentEditClass[j].querySelector('img') !== null;
          } else if (
            contentEditClass[j].id.indexOf('fifNoFormulaEditor') > -1
          ) {
            isFifNoExist =
              (!(
                contentEditClass[j].innerText.length === 1 &&
                contentEditClass[j].innerText === '\n'
              ) &&
                contentEditClass[j].innerText.length > 0) ||
              contentEditClass[j].querySelector('img') !== null;
          }
        }
      }

      //객관식 하나라도 입력되어 있는지 체크
      let multiChoiceOrCheck =
        isFirNoExist ||
        isSecNoExist ||
        isThrNoExist ||
        isFourNoExist ||
        isFifNoExist;
      //객관식 전부 다 입력되어 있는지 체크
      let multiChoiceAllCheck =
        isFirNoExist &&
        isSecNoExist &&
        isThrNoExist &&
        isFourNoExist &&
        isFifNoExist;
      //객관식이 하나라도 입력되어있는데 전부 다 입력되지 않은 경우
      if (multiChoiceOrCheck && !multiChoiceAllCheck) {
        alert(
          '객관식 문제인 경우 객관식 보기를 모두 입력해주세요.\n객관식 문제가 아닌 경우 객관식 보기를 모두 지워주세요.'
        );
        let multiChoiceView =
          currentContentsDiv.querySelectorAll('.multiChoiceView');
        for (let k = 0; k < multiChoiceView.length; k++) {
          multiChoiceView[k].classList.add('redBoxValid2');
        }
        multiChoiceView[0].scrollIntoView({ block: 'center' });
        multiChoiceView[0].focus();

        return false;
      }
      //문제 validation [end]

      let multiChoiceView =
        currentContentsDiv.querySelectorAll('.multiChoiceView');
      for (let k = 0; k < multiChoiceView.length; k++) {
        if (
          !isFirNoExist &&
          multiChoiceView[k].id.indexOf('firNoFormulaEditor') > -1
        ) {
          multiChoiceView[k].innerHTML = '';
        }
        if (
          !isSecNoExist &&
          multiChoiceView[k].id.indexOf('secNoFormulaEditor') > -1
        ) {
          multiChoiceView[k].innerHTML = '';
        }
        if (
          !isThrNoExist &&
          multiChoiceView[k].id.indexOf('thrNoFormulaEditor') > -1
        ) {
          multiChoiceView[k].innerHTML = '';
        }
        if (
          !isFourNoExist &&
          multiChoiceView[k].id.indexOf('fourNoFormulaEditor') > -1
        ) {
          multiChoiceView[k].innerHTML = '';
        }
        if (
          !isFifNoExist &&
          multiChoiceView[k].id.indexOf('fifNoFormulaEditor') > -1
        ) {
          multiChoiceView[k].innerHTML = '';
        }
      }

      if (Number(currentContentsDiv.querySelector('#subject').value) === 0) {
        alert('과목 정보를 선택 해주세요.');
        currentContentsDiv
          .querySelector('#subject')
          .scrollIntoView({ block: 'center' });
        currentContentsDiv.querySelector('#subject').focus();
        currentContentsDiv
          .querySelector('#subject')
          .classList.add('redBoxValid2');
        return false;
      }

      if (Number(currentContentsDiv.querySelector('#secUnit').value) === 0) {
        alert('대단원 정보를 선택 해주세요.');
        currentContentsDiv
          .querySelector('#secUnit')
          .scrollIntoView({ block: 'center' });
        currentContentsDiv.querySelector('#secUnit').focus();
        currentContentsDiv
          .querySelector('#secUnit')
          .classList.add('redBoxValid2');
        return false;
      }

      if (Number(currentContentsDiv.querySelector('#thrUnit').value) === 0) {
        alert('중단원 정보를 선택 해주세요.');
        currentContentsDiv
          .querySelector('#thrUnit')
          .scrollIntoView({ block: 'center' });
        currentContentsDiv.querySelector('#thrUnit').focus();
        currentContentsDiv
          .querySelector('#thrUnit')
          .classList.add('redBoxValid2');
        return false;
      }

      if (Number(currentContentsDiv.querySelector('#quesType').value) === 0) {
        alert('유형 정보를 선택 해주세요.');
        currentContentsDiv
          .querySelector('#quesType')
          .scrollIntoView({ block: 'center' });
        currentContentsDiv.querySelector('#quesType').focus();
        currentContentsDiv
          .querySelector('#quesType')
          .classList.add('redBoxValid2');
        return false;
      }

      //수능 입시 문제 출처 validation
      if (contentsClassify === 4) {
        if (
          Number(currentContentsDiv.querySelector('#manageIns').value) === 0
        ) {
          alert('출제기관을 선택 해주세요.');
          currentContentsDiv
            .querySelector('#manageIns')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#manageIns').focus();
          currentContentsDiv
            .querySelector('#manageIns')
            .classList.add('redBoxValid2');
          return false;
        }

        if (
          Number(currentContentsDiv.querySelector('#paperType').value) === 0
        ) {
          alert('가/나형 구분을 선택 해주세요.');
          currentContentsDiv
            .querySelector('#paperType')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#paperType').focus();
          currentContentsDiv
            .querySelector('#paperType')
            .classList.add('redBoxValid2');
          return false;
        }

        if (currentContentsDiv.querySelector('#impYear').value.length !== 4) {
          alert('시행연도 4자리를 입력해주세요.');
          currentContentsDiv
            .querySelector('#impYear')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#impYear').focus();
          currentContentsDiv
            .querySelector('#impYear')
            .classList.add('redBoxValid2');
          return false;
        }

        if (
          currentContentsDiv.querySelector('#impMonth').value.length === 0 ||
          currentContentsDiv.querySelector('#impMonth').value < 1 ||
          currentContentsDiv.querySelector('#impMonth').value > 12
        ) {
          alert('시행월을 입력해주세요.');
          currentContentsDiv
            .querySelector('#impMonth')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#impMonth').focus();
          currentContentsDiv
            .querySelector('#impMonth')
            .classList.add('redBoxValid2');
          return false;
        }

        if (
          currentContentsDiv.querySelector('#oddQuesNum').value.length === 0 ||
          currentContentsDiv.querySelector('#oddQuesNum').value.length > 2
        ) {
          alert('홀수형 번호를 입력해주세요.');
          currentContentsDiv
            .querySelector('#oddQuesNum')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#oddQuesNum').focus();
          currentContentsDiv
            .querySelector('#oddQuesNum')
            .classList.add('redBoxValid2');
          return false;
        }

        /*
				if(currentContentsDiv.querySelector("#evenQuesNum").value.length === 0 || currentContentsDiv.querySelector("#evenQuesNum").value.length>2){
					alert("짝수형 번호를 입력해주세요.")
					currentContentsDiv.querySelector("#evenQuesNum").scrollIntoView({ block: "center"});
					currentContentsDiv.querySelector("#evenQuesNum").focus();
					currentContentsDiv.querySelector("#evenQuesNum").classList.add("redBoxValid2");
					return false;
				}
				*/

        if (
          Number(currentContentsDiv.querySelector('#quesLevel').value) === 0
        ) {
          alert('배점 정보를 선택 해주세요.');
          currentContentsDiv
            .querySelector('#quesLevel')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#quesLevel').focus();
          currentContentsDiv
            .querySelector('#quesLevel')
            .classList.add('redBoxValid2');
          return false;
        }

        if (
          currentContentsDiv.querySelector('#wrongRatio').value.length === 0 ||
          currentContentsDiv.querySelector('#wrongRatio').value.length > 2
        ) {
          alert('오답률을 입력해주세요.(정수로만 입력)');
          currentContentsDiv
            .querySelector('#wrongRatio')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#wrongRatio').focus();
          currentContentsDiv
            .querySelector('#wrongRatio')
            .classList.add('redBoxValid2');
          return false;
        }
      } else if (contentsClassify === 1) {
        if (
          Number(currentContentsDiv.querySelector('#quesLevel').value) === 0
        ) {
          alert('문제난이도를 선택 해주세요.');
          currentContentsDiv
            .querySelector('#quesLevel')
            .scrollIntoView({ block: 'center' });
          currentContentsDiv.querySelector('#quesLevel').focus();
          currentContentsDiv
            .querySelector('#quesLevel')
            .classList.add('redBoxValid2');
          return false;
        }
      }
    }
    await reg_undoRedoInitialize();

    await contentsFinalValidation();
  };

  // 문제 및 해설, 객관식, 주관식 정답 마지막 공백 제거(줄바꿈), 이미지 base64로 남아있는 것 한번 더 체크해서 변경
  const trimRegisterContents = async function (contentsRootDiv) {
    let contentEditClass =
      contentsRootDiv.querySelectorAll('.contentEditClass');
    for (let i = 0; i < contentEditClass.length; i++) {
      let whileIdx = 0;
      while (contentEditClass[i].innerText.substr(-2) === '\n\n') {
        // 띄어쓰기는 제거안함
        //while(document.getElementById(targetId[i]).innerText.substr(-2) === "\n\n" || encodeURI(document.getElementById(targetId[i]).innerText.substr(-1)) === '%C2%A0'){
        whileIdx++;
        if (whileIdx > 500) {
          alert('[무한루프 에러] 공백문자 제거 도중 에러 발생');
          break;
        }
        if (contentEditClass[i].innerText.substr(-2) === '\n\n') {
          let brTag = contentEditClass[i].querySelectorAll('br');
          if (brTag.length !== 0) {
            if (brTag[brTag.length - 1].closest('.nbBox') === null) {
              brTag[brTag.length - 1].remove();
              if (
                contentEditClass[i].id.indexOf('contentsFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#contents').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('solutionFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#solution').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('firNoFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#firNo').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('secNoFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#secNo').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('thrNoFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#thrNo').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('fourNoFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#fourNo').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('fifNoFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#fifNo').innerText =
                  contentEditClass[i].innerHTML;
              } else if (
                contentEditClass[i].id.indexOf('answerFormulaEditor') > -1
              ) {
                contentEditClass[i]
                  .closest('.contentsRootDiv')
                  .querySelector('#answer').innerText =
                  contentEditClass[i].innerHTML;
              }
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      //span 태그 없애기
      await reg_convertSpanToNoTag(contentEditClass[i].id);

      //수식요소 및 div 태그 스타일 직접 적용된 경우 제거
      await reg_removeStyleAttribute(contentEditClass[i].id);

      if (contentEditClass[i].id.indexOf('contentsFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#contents').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('solutionFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#solution').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('firNoFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#firNo').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('secNoFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#secNo').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('thrNoFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#thrNo').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('fourNoFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#fourNo').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('fifNoFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#fifNo').innerText = contentEditClass[i].innerHTML;
      } else if (contentEditClass[i].id.indexOf('answerFormulaEditor') > -1) {
        contentEditClass[i]
          .closest('.contentsRootDiv')
          .querySelector('#answer').innerText = contentEditClass[i].innerHTML;
      }
    }
  };

  const contentsFinalValidation = async function () {
    let contentsRootDiv = document.getElementsByClassName('contentsRootDiv');
    for (let i = 0; i < contentsRootDiv.length; i++) {
      if (
        contentsRootDiv[i].classList.contains('disabled') ||
        contentsRootDiv[i].classList.contains('hide')
      )
        continue;
      let contentEditClass =
        contentsRootDiv[i].querySelectorAll('.contentEditClass');
      let totalFileSize = 0;
      for (let j = 0; j < contentEditClass.length; j++) {
        //이미지 base64 to s3 sever upload
        await nb_base64ImgRegisterToS3ByTargetId(contentEditClass[j].id);
        totalFileSize += nb_getByteLengthOfString(
          contentEditClass[j].innerHTML
        );
      }
      if (totalFileSize / 1000 > 60) {
        contentsRootDiv[i].scrollIntoView({ block: 'center' });
        let contentsOrdinalNum =
          contentsRootDiv[i].querySelector('.contentsInfo-idx').innerText;
        alert(
          contentsOrdinalNum +
            ' 문제의 용량이 너무 큽니다.\n문제 및 해설, 객관식, 정답 입력란의 텍스트는 최대 60KB까지 등록가능합니다.'
        );
        return false;
      }

      // 문제 및 해설, 객관식, 주관식 정답 마지막 공백 제거(줄바꿈, 띄어쓰기)
      // style 속성 제거
      // span 태그 제거
      await trimRegisterContents(contentsRootDiv[i]);
    }

    //이미지 사이즈 변경 틀 제거
    await reg_removeResizeFrame();

    let formData = new FormData(document.getElementById('contentsForm'));
    for (let i = 0; i < contentsRootDiv.length; i++) {
      if (
        contentsRootDiv[i].classList.contains('disabled') ||
        contentsRootDiv[i].classList.contains('hide')
      )
        continue;

      formData.append(
        'mathContents[' + i + '].contentsClassify',
        contentsClassify
      );

      //문법 변환 로직 시작 및 S3 이미지 태그 등록
      let contentGrammer = document.createElement('div');
      let tmpDocument = document.createElement('div');
      let contentEditClass =
        contentsRootDiv[i].querySelectorAll('.contentEditClass');
      for (let j = 0; j < contentEditClass.length; j++) {
        //S3이미지 태그 등록
        let allImgDom = contentEditClass[j].querySelectorAll('img');
        for (let k = 0; k < allImgDom.length; k++) {
          formData.append(
            'mathContents[' + i + '].imgTagSrc',
            allImgDom[k].src
          );
        }
        //문법 변환 요소 등록
        tmpDocument.innerHTML += contentEditClass[j].innerHTML + '&nbsp;';
      }

      //문법 변환 시작
      contentGrammer.append(tmpDocument);
      let innerTbTd = contentGrammer.querySelectorAll('.innerTbTd');
      for (let i = 0; i < innerTbTd.length; i++) {
        innerTbTd[i].append(document.createTextNode('\n'));
      }
      let contentsDiv = await cvt_convertHtmlToTex(contentGrammer);

      let breakPara = contentsDiv.querySelectorAll('.breakParaSpan');
      while (breakPara.length !== 0) {
        breakPara[0].outerHTML = '\n';
        breakPara = contentsDiv.querySelectorAll('.breakParaSpan');
      }

      let imgDom = contentsDiv.querySelectorAll('img');
      while (imgDom.length !== 0) {
        imgDom[0].remove();
        imgDom = contentsDiv.querySelectorAll('img');
      }

      let allDom = contentsDiv.querySelectorAll('*');
      while (allDom.length !== 0) {
        allDom[0].outerHTML = allDom[0].innerText;
        allDom = contentsDiv.querySelectorAll('*');
      }
      formData.append(
        'mathContents[' + i + '].contentsGram',
        contentsDiv.innerText
      );
      //문법 변환 로직 종료
    }

    //undo 초기화
    await reg_undoRedoInitialize();

    let returnObj = await nb_formDataFetch(
      '/mathInfo/registerContentsMulti',
      formData,
      true
    );

    if (returnObj.error != undefined) {
      alert(
        '[' +
          returnObj.status +
          ' ' +
          returnObj.error +
          ']\n메시지 : ' +
          returnObj.message
      );
    }
    if (returnObj['saveSuccess']) {
      /*
		   //컨텐츠 문법 등록[strt]
		   let contentGrammer = document.createElement("div")
		   let contentsTitle = ["contents", "firNo", "secNo", "thrNo", "fourNo", "fifNo", "solution", "answer"]
		   for(let i=0; i<contentsTitle.length; i++){
			   let tmpData = formData.get(contentsTitle[i])
			   let tmpDocument = document.createElement("div");
			   tmpDocument.innerHTML = tmpData;
			   contentGrammer.append(tmpDocument);
		   }
		   let innerTbTd = contentGrammer.querySelectorAll(".innerTbTd");
		   for(let i=0;i<innerTbTd.length; i++){
			   innerTbTd[i].append(document.createTextNode("\n"));
		   }
		   let contentsDiv = await cvt_convertHtmlToTex(contentGrammer);

		   let breakPara = contentsDiv.querySelectorAll(".breakParaSpan");
		   while(breakPara.length !== 0){
			   breakPara[0].outerHTML = "\n"
			   breakPara = contentsDiv.querySelectorAll(".breakParaSpan");
		   }

		   let imgDom = contentsDiv.querySelectorAll("img");
		   while(imgDom.length !== 0){
			   imgDom[0].remove();
			   imgDom = contentsDiv.querySelectorAll("img");
		   }

		   let allDom = contentsDiv.querySelectorAll("*");
		   while(allDom.length !== 0){
			   allDom[0].outerHTML = allDom[0].innerText;
			   allDom = contentsDiv.querySelectorAll("*");
		   }
		   let newFormData = new FormData();
		   newFormData.append("contentsNo", returnObj["contentsNo"]);
		   newFormData.append("contentsGram", contentsDiv.innerText);
		   nb_formDataFetch("/mathInfo/registerContentsGrammer",newFormData, false);
		   //컨텐츠 문법 등록[end]
		  
		   let contentsRootDiv = document.getElementsByClassName("contentsRootDiv");
		   for(let i=0; i<contentsRootDiv.length; i++){
				contentsRootDiv[i].classList.remove("disabled");
				contentsRootDiv[i].classList.add("hide");
				let selBox = contentsRootDiv[i].querySelectorAll("select");
				for(let j=0; j<selBox.length; j++){
					selBox[j].selectedIndex = 0;
					selBox[j].classList.remove("nbCustomSelected2");
					selBox[j].disabled=false;
					selBox[j].classList.remove("disabledBox");
				}

				let inpBox = contentsRootDiv[i].querySelectorAll("input[type='number'], input[type='text'], textarea");
				for(let j=0; j<inpBox.length; j++){
					inpBox[j].value="";
					inpBox[j].classList.remove("customBlueBoxComplete");
					inpBox[j].disabled=false;
					inpBox[j].classList.remove("disabledBox");
				}

				let chkBox = contentsRootDiv[i].querySelectorAll("input[type='checkbox']");
				for(let j=0; j<chkBox.length; j++){
					chkBox[j].checked=false;
					chkBox[j].disabled=false;
				}

				let contentEditClass = contentsRootDiv[i].querySelectorAll(".contentEditClass");
				for(let j=0; j<contentEditClass.length; j++){
					contentEditClass[j].innerHTML = "";
					contentEditClass[j].setAttribute("contenteditable", true);
					contentEditClass[j].classList.remove("disabledBox");
				}

				let formEle = contentsRootDiv[i].querySelectorAll("button");
				for(let j=0; j<formEle.length; j++){
					formEle[j].classList.remove("disabledBox");
				}
		   }
		   contentsRootDiv[0].classList.remove("hide");
		   
		   let contentsRootPaddingDiv = document.getElementsByClassName("contentsRootPaddingDiv");
		   for(let i=0; i<contentsRootPaddingDiv.length; i++){
				contentsRootPaddingDiv[i].classList.add("hide");
		   }
			*/
      let conRegSucMsg = '정상적으로 등록되었습니다.';
      if (contentsClassify === 1) {
        conRegSucMsg += '\n나의 제작문제 페이지에서 확인할 수 있습니다.';
      } else if (contentsClassify === 4) {
        conRegSucMsg += '\n수능/모의고사 작업내역에서 확인할 수 있습니다.';
      }
      await nb_fadeInOutA(conRegSucMsg, 3000);

      await reg_undoRedoSetting();
      setFormulaEditorArr(new Array());
      setFormulaEditorArr(formulaEditor);

      //이미지 수정 이벤트 등록
      let contentEditClass = document.querySelectorAll('[contenteditable]');
      for (let i = 0; i < contentEditClass.length; i++) {
        if (contentEditClass[i].id.indexOf('answerFormulaEditor') < 0) {
          reg_enableImageResizeInDiv(contentEditClass[i].id, true);
        }
      }
      //이미지 및 파일 복붙 금지
      let answerFormulaEditor = document.querySelectorAll(
        '.answerFormulaEditor'
      );
      for (let i = 0; i < answerFormulaEditor.length; i++) {
        answerFormulaEditor[i].addEventListener('paste', pastePreventFile);
      }
    }
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

  return (
    <>
      <div className='rightAbsolBox marginTen'>
        <div
          id='saveBtn'
          className='nabyBox fixed'
          onClick={() => {
            contentsValidation();
          }}
        >
          저장하기
        </div>
      </div>

      <form method='post' id='contentsForm' encType='multipart/form-data'>
        <div className='twoFlexLayout'>
          <div id='makeContentsLinkDiv' className='makeContentsLinkDiv multi'>
            <Link className='linkNoneCss' to='/makeContents'>
              <div className='relative'>
                <div className='makeContentsBtn'></div>
                <div className='makeContentsForImgBtnDesc'>
                  문제 직접 만들기
                </div>
              </div>
            </Link>
            <Link className='linkNoneCss' to='/makeContentsForImg'>
              <div className='relative'>
                <div className='makeContentsForImgBtn active'></div>
                <div className='makeContentsForImgBtnDesc'>
                  이미지로 등록하기
                </div>
              </div>
            </Link>
          </div>
          <div className='formulEditMultiDiv'>
            <div
              onClick={() => {
                errReportBy('makeContents');
              }}
              className='errBtn makeContents'
            ></div>
            <div id='topShortkeyDiv' className='topShortkeyDiv'>
              <TabButton
                className='formulaTabButton'
                tabList={formulaTabList}
                clickEv={formularTabSelect}
              ></TabButton>
              {isFetchShotCutKey && (
                <FormulaShortCutKey
                  compId='shortKeyBoard'
                  keyName='shortCutKey'
                  parentShortCutKey={shortCutKey}
                  parentMethod={() => {}}
                />
              )}
              {isFetchShotCutKey && (
                <FormulaShortCutKey
                  compId='shortKeyBoardHigh'
                  keyName='shortCutKeyHigh1'
                  parentShortCutKey={shortCutKey}
                  parentMethod={() => {}}
                />
              )}
              {isFetchShotCutKey && (
                <FormulaShortCutKey
                  compId='shortKeyBoardEtc'
                  keyName='shortCutKeyEtc'
                  parentShortCutKey={shortCutKey}
                  parentMethod={() => {}}
                />
              )}
              {isFetchShotCutKey && (
                <FormulaShortCutKey
                  compId='shortKeyBoardEtc2'
                  keyName='shortCutKeyEtc2'
                  parentShortCutKey={shortCutKey}
                  parentMethod={() => {}}
                />
              )}
            </div>

            {formulaEditorList}
            <div
              className='addContentsBtn'
              onClick={(event) => {
                addRegisterContents(event);
              }}
            >
              항목추가
              <button
                id='initContentsCntBtn'
                className='initContentsCntBtn'
                type='button'
                onClick={(event) => {
                  setRegisterContentsCnt(event);
                }}
              >
                문항 수 설정
              </button>
            </div>
          </div>
        </div>
        <div className='scrollFixBugMargin'></div>
      </form>
      <div id='scrollMoveBtn' className='scrollMoveBtn hide'>
        <div
          id='conListScrollToTop'
          className='conListScrollToTop'
          tooltip='맨 위로'
          onClick={() => {
            nb_moveToScroll(true);
          }}
        ></div>
        <div id='conScrollCenterCircle' className='conScrollCenterCircle'></div>
        <div
          id='conListScrollToBottom'
          className='conListScrollToBottom'
          tooltip='맨 아래로'
          onClick={() => {
            nb_moveToScroll(false);
          }}
        ></div>
      </div>
    </>
  );
};

export default FormulaEditorMulti;
